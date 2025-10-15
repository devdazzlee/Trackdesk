import express from "express";
import { z } from "zod";
import { authenticateToken } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = express.Router();

// Get all commissions with filtering
router.get("/", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Only admins can access commission management" });
    }

    const {
      page = 1,
      limit = 20,
      status,
      affiliateId,
      dateFrom,
      dateTo,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (affiliateId) {
      where.affiliateId = affiliateId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: {
          affiliate: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          conversion: {
            include: {
              offer: {
                select: {
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.commission.count({ where }),
    ]);

    // If no commissions exist, return mock data for demo purposes
    if (total === 0) {
      const mockCommissions = [
        {
          id: "demo-1",
          amount: 25.0,
          rate: 5.0,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          affiliate: {
            id: "affiliate-1",
            user: {
              firstName: "Demo",
              lastName: "Affiliate",
              email: "demo.affiliate@trackdesk.com",
            },
          },
          conversion: {
            orderValue: 500.0,
            offer: {
              name: "Demo Product",
              description: "Demo product for testing",
            },
          },
        },
        {
          id: "demo-2",
          amount: 50.0,
          rate: 5.0,
          status: "APPROVED",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          affiliate: {
            id: "affiliate-1",
            user: {
              firstName: "Demo",
              lastName: "Affiliate",
              email: "demo.affiliate@trackdesk.com",
            },
          },
          conversion: {
            orderValue: 1000.0,
            offer: {
              name: "Demo Product",
              description: "Demo product for testing",
            },
          },
        },
        {
          id: "demo-3",
          amount: 75.0,
          rate: 5.0,
          status: "PAID",
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          payoutDate: new Date().toISOString(),
          affiliate: {
            id: "affiliate-1",
            user: {
              firstName: "Demo",
              lastName: "Affiliate",
              email: "demo.affiliate@trackdesk.com",
            },
          },
          conversion: {
            orderValue: 1500.0,
            offer: {
              name: "Demo Product",
              description: "Demo product for testing",
            },
          },
        },
        {
          id: "demo-4",
          amount: 30.0,
          rate: 5.0,
          status: "PENDING",
          createdAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          affiliate: {
            id: "affiliate-1",
            user: {
              firstName: "Demo",
              lastName: "Affiliate",
              email: "demo.affiliate@trackdesk.com",
            },
          },
          conversion: {
            orderValue: 600.0,
            offer: {
              name: "Demo Product",
              description: "Demo product for testing",
            },
          },
        },
        {
          id: "demo-5",
          amount: 100.0,
          rate: 5.0,
          status: "APPROVED",
          createdAt: new Date(
            Date.now() - 4 * 24 * 60 * 60 * 1000
          ).toISOString(),
          affiliate: {
            id: "affiliate-1",
            user: {
              firstName: "Demo",
              lastName: "Affiliate",
              email: "demo.affiliate@trackdesk.com",
            },
          },
          conversion: {
            orderValue: 2000.0,
            offer: {
              name: "Demo Product",
              description: "Demo product for testing",
            },
          },
        },
      ];

      return res.json({
        data: mockCommissions,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: mockCommissions.length,
          pages: Math.ceil(mockCommissions.length / parseInt(limit as string)),
        },
      });
    }

    res.json({
      commissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ error: "Failed to fetch commissions" });
  }
});

// Update commission status
router.patch("/:id/status", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Only admins can update commission status" });
    }

    const schema = z.object({
      status: z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]),
      notes: z.string().optional(),
    });

    const { status, notes } = schema.parse(req.body);
    const { id } = req.params;

    const commission = await prisma.commission.update({
      where: { id },
      data: {
        status,
        ...(status === "PAID" && { payoutDate: new Date() }),
        ...(notes && { metadata: { notes } }),
      },
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // If approved, update affiliate's pending earnings
    if (status === "APPROVED") {
      await prisma.affiliateProfile.update({
        where: { id: commission.affiliateId },
        data: {
          totalEarnings: { increment: commission.amount },
        },
      });
    }

    res.json(commission);
  } catch (error) {
    console.error("Error updating commission status:", error);
    res.status(500).json({ error: "Failed to update commission status" });
  }
});

// Bulk update commission statuses
router.patch("/bulk-status", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Only admins can bulk update commission statuses" });
    }

    const schema = z.object({
      commissionIds: z.array(z.string()),
      status: z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]),
      notes: z.string().optional(),
    });

    const { commissionIds, status, notes } = schema.parse(req.body);

    const updateData: any = {
      status,
      ...(notes && { metadata: { notes } }),
    };

    if (status === "PAID") {
      updateData.payoutDate = new Date();
    }

    const result = await prisma.commission.updateMany({
      where: {
        id: { in: commissionIds },
      },
      data: updateData,
    });

    // If approved, update affiliate earnings
    if (status === "APPROVED") {
      const commissions = await prisma.commission.findMany({
        where: { id: { in: commissionIds } },
        select: { affiliateId: true, amount: true },
      });

      const affiliateUpdates = commissions.reduce(
        (acc, commission) => {
          if (!acc[commission.affiliateId]) {
            acc[commission.affiliateId] = 0;
          }
          acc[commission.affiliateId] += commission.amount;
          return acc;
        },
        {} as Record<string, number>
      );

      await Promise.all(
        Object.entries(affiliateUpdates).map(([affiliateId, amount]) =>
          prisma.affiliateProfile.update({
            where: { id: affiliateId },
            data: { totalEarnings: { increment: amount } },
          })
        )
      );
    }

    res.json({ updated: result.count });
  } catch (error) {
    console.error("Error bulk updating commission statuses:", error);
    res
      .status(500)
      .json({ error: "Failed to bulk update commission statuses" });
  }
});

// Get commission analytics
router.get("/analytics", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Only admins can access commission analytics" });
    }

    const { period = "30d" } = req.query;

    let dateFrom: Date;
    switch (period) {
      case "7d":
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const [
      totalCommissions,
      totalAmount,
      statusBreakdown,
      topAffiliates,
      dailyStats,
    ] = await Promise.all([
      prisma.commission.count({
        where: { createdAt: { gte: dateFrom } },
      }),
      prisma.commission.aggregate({
        where: { createdAt: { gte: dateFrom } },
        _sum: { amount: true },
      }),
      prisma.commission.groupBy({
        by: ["status"],
        where: { createdAt: { gte: dateFrom } },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.commission.groupBy({
        by: ["affiliateId"],
        where: { createdAt: { gte: dateFrom } },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 10,
      }),
      prisma.commission.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: dateFrom } },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // If no commissions exist, return mock analytics data
    if (totalCommissions === 0) {
      return res.json({
        period,
        totalCommissions: 5,
        totalAmount: 280.0,
        statusBreakdown: [
          { status: "PENDING", _sum: { amount: 55.0 }, _count: { id: 2 } },
          { status: "APPROVED", _sum: { amount: 150.0 }, _count: { id: 2 } },
          { status: "PAID", _sum: { amount: 75.0 }, _count: { id: 1 } },
        ],
        topAffiliates: [
          {
            affiliateId: "affiliate-1",
            affiliateName: "Demo Affiliate",
            affiliateEmail: "demo.affiliate@trackdesk.com",
            _sum: { amount: 280.0 },
            _count: { id: 5 },
          },
        ],
        dailyStats: [],
      });
    }

    // Get affiliate details for top affiliates
    const topAffiliateIds = topAffiliates.map((a) => a.affiliateId);
    const affiliateDetails = await prisma.affiliateProfile.findMany({
      where: { id: { in: topAffiliateIds } },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const topAffiliatesWithDetails = topAffiliates.map((affiliate) => {
      const details = affiliateDetails.find(
        (d) => d.id === affiliate.affiliateId
      );
      return {
        ...affiliate,
        affiliateName: details
          ? `${details.user.firstName} ${details.user.lastName}`
          : "Unknown",
        affiliateEmail: details?.user.email,
      };
    });

    res.json({
      period,
      totalCommissions,
      totalAmount: totalAmount._sum.amount || 0,
      statusBreakdown,
      topAffiliates: topAffiliatesWithDetails,
      dailyStats,
    });
  } catch (error) {
    console.error("Error fetching commission analytics:", error);
    res.status(500).json({ error: "Failed to fetch commission analytics" });
  }
});

// Update affiliate commission rates
router.patch(
  "/affiliate/:affiliateId/rate",
  authenticateToken,
  async (req: any, res) => {
    try {
      if (req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Only admins can update commission rates" });
      }

      const schema = z.object({
        commissionRate: z.number().min(0).max(100),
        reason: z.string().optional(),
      });

      const { commissionRate, reason } = schema.parse(req.body);
      const { affiliateId } = req.params;

      const affiliate = await prisma.affiliateProfile.update({
        where: { id: affiliateId },
        data: { commissionRate },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Log the rate change
      await prisma.activity.create({
        data: {
          type: "COMMISSION_RATE_CHANGE",
          description: `Commission rate changed to ${commissionRate}%${reason ? ` - ${reason}` : ""}`,
          metadata: {
            oldRate: affiliate.commissionRate,
            newRate: commissionRate,
            reason,
          },
          userId: req.user.id,
          affiliateId,
        },
      });

      res.json(affiliate);
    } catch (error) {
      console.error("Error updating commission rate:", error);
      res.status(500).json({ error: "Failed to update commission rate" });
    }
  }
);

export default router;
