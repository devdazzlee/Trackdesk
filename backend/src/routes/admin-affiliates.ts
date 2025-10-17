import express, { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all affiliates
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { page = 1, limit = 20, status, tier, search } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Build where clause
      const where: any = {};
      if (status) where.status = status;
      if (tier) where.tier = tier;

      const affiliates = await prisma.affiliateProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit as string),
      });

      const total = await prisma.affiliateProfile.count({ where });

      // Get performance data for each affiliate using correct tables
      const affiliatesWithStats = await Promise.all(
        affiliates.map(async (affiliate) => {
          const [earnings, conversions, clicks] = await Promise.all([
            // Get earnings from AffiliateOrder table
            prisma.affiliateOrder.aggregate({
              where: {
                affiliateId: affiliate.id,
              },
              _sum: { commissionAmount: true },
            }),

            // Get conversions from AffiliateOrder table
            prisma.affiliateOrder.count({
              where: {
                affiliateId: affiliate.id,
              },
            }),

            // Get clicks from AffiliateClick table
            prisma.affiliateClick.count({
              where: { affiliateId: affiliate.id },
            }),
          ]);

          const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

          return {
            id: affiliate.id,
            name:
              `${affiliate.user?.firstName || ""} ${affiliate.user?.lastName || ""}`.trim() ||
              "Unknown",
            email: affiliate.user?.email || "No email",
            joinDate: affiliate.createdAt.toISOString().split("T")[0],
            status: affiliate.status,
            tier: affiliate.tier,
            totalEarnings: earnings._sum.commissionAmount || 0,
            totalClicks: clicks,
            totalConversions: conversions,
            conversionRate: Math.round(conversionRate * 10) / 10,
            lastActivity:
              affiliate.lastActivityAt?.toISOString().split("T")[0] || "N/A",
            paymentMethod: affiliate.paymentMethod,
            country: "Unknown", // Add to schema if needed
          };
        })
      );

      res.json({
        data: affiliatesWithStats,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      res.status(500).json({ error: "Failed to fetch affiliates" });
    }
  }
);

// Get affiliate details
router.get(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;

      const affiliate = await prisma.affiliateProfile.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              createdAt: true,
            },
          },
        },
      });

      if (!affiliate) {
        return res.status(404).json({ error: "Affiliate not found" });
      }

      const [earnings, conversions, clicks] = await Promise.all([
        // Get earnings from AffiliateOrder table
        prisma.affiliateOrder.aggregate({
          where: {
            affiliateId: affiliate.id,
          },
          _sum: { commissionAmount: true },
        }),

        // Get conversions from AffiliateOrder table
        prisma.affiliateOrder.count({
          where: {
            affiliateId: affiliate.id,
          },
        }),

        // Get clicks from AffiliateClick table
        prisma.affiliateClick.count({
          where: { affiliateId: affiliate.id },
        }),
      ]);

      res.json({
        affiliate: {
          ...affiliate,
          user: affiliate.user,
          stats: {
            totalEarnings: earnings._sum.commissionAmount || 0,
            totalConversions: conversions,
            totalClicks: clicks,
            conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
          },
          referralCodes: 0, // Will be updated when referral codes are properly tracked
        },
      });
    } catch (error) {
      console.error("Error fetching affiliate details:", error);
      res.status(500).json({ error: "Failed to fetch affiliate details" });
    }
  }
);

// Update affiliate status
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedAffiliate = await prisma.affiliateProfile.update({
        where: { id },
        data: { status },
      });

      res.json({
        success: true,
        message: `Affiliate status updated to ${status}`,
        affiliate: updatedAffiliate,
      });
    } catch (error) {
      console.error("Error updating affiliate status:", error);
      res.status(500).json({ error: "Failed to update affiliate status" });
    }
  }
);

// Update affiliate tier and commission rate
router.patch(
  "/:id/tier",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const { tier, commissionRate } = req.body;

      // Validate input
      const schema = z.object({
        tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"]).optional(),
        commissionRate: z.number().min(0).max(100).optional(),
      });

      const validatedData = schema.parse({ tier, commissionRate });

      const updatedAffiliate = await prisma.affiliateProfile.update({
        where: { id },
        data: {
          tier: validatedData.tier,
          ...(validatedData.commissionRate && {
            commissionRate: validatedData.commissionRate,
          }),
          // ...(validatedData.commissionRate !== undefined &&
          //   {
          //     // Update commission rate in referral codes
          //   }),
        },
      });

      // If commission rate is provided, update all affiliate's referral codes
      if (validatedData.commissionRate !== undefined) {
        await prisma.referralCode.updateMany({
          where: { affiliateId: id },
          data: { commissionRate: validatedData.commissionRate },
        });
      }

      res.json({
        success: true,
        message: "Affiliate tier and commission rate updated successfully",
        affiliate: updatedAffiliate,
      });
    } catch (error) {
      console.error("Error updating affiliate tier:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid input data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update affiliate tier" });
    }
  }
);

// Delete affiliate
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;

      const affiliate = await prisma.affiliateProfile.findUnique({
        where: { id },
      });

      if (!affiliate) {
        return res.status(404).json({ error: "Affiliate not found" });
      }

      // Delete affiliate (cascades to referral codes and usages)
      await prisma.affiliateProfile.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: "Affiliate deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting affiliate:", error);
      res.status(500).json({ error: "Failed to delete affiliate" });
    }
  }
);

// Get affiliate analytics
router.get(
  "/:id/analytics",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const { period = "30d" } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [clicks, conversions, revenue, commissions] = await Promise.all([
        // Get clicks from AffiliateClick table
        prisma.affiliateClick.count({
          where: {
            affiliateId: id,
            createdAt: { gte: startDate },
          },
        }),

        // Get conversions from AffiliateOrder table
        prisma.affiliateOrder.count({
          where: {
            affiliateId: id,
            createdAt: { gte: startDate },
          },
        }),

        // Get revenue from AffiliateOrder table
        prisma.affiliateOrder.aggregate({
          where: {
            affiliateId: id,
            createdAt: { gte: startDate },
          },
          _sum: { orderValue: true },
        }),

        // Get commissions from AffiliateOrder table
        prisma.affiliateOrder.aggregate({
          where: {
            affiliateId: id,
            createdAt: { gte: startDate },
          },
          _sum: { commissionAmount: true },
        }),
      ]);

      res.json({
        period,
        analytics: {
          totalClicks: clicks,
          totalConversions: conversions,
          totalRevenue: revenue._sum.orderValue || 0,
          totalCommissions: commissions._sum.commissionAmount || 0,
          conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
          averageOrderValue:
            conversions > 0 ? (revenue._sum.orderValue || 0) / conversions : 0,
        },
      });
    } catch (error) {
      console.error("Error fetching affiliate analytics:", error);
      res.status(500).json({ error: "Failed to fetch affiliate analytics" });
    }
  }
);

export default router;
