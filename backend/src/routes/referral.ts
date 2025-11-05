import express, { Router } from "express";
import { z } from "zod";
import { authenticateToken } from "../middleware/auth";
import { ReferralSystemModel } from "../models/ReferralSystem";
import { prisma } from "../lib/prisma";

const router: Router = express.Router();

// Get affiliate's referral codes
router.get("/codes", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can access referral codes" });
    }

    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const referralCodes = await ReferralSystemModel.getAffiliateReferralCodes(
      affiliate.id
    );
    res.json(referralCodes);
  } catch (error) {
    console.error("Error fetching referral codes:", error);
    res.status(500).json({ error: "Failed to fetch referral codes" });
  }
});

// Generate new referral code
router.post("/codes", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can create referral codes" });
    }

    const schema = z.object({
      commissionRate: z.number().min(0).max(100),
      productId: z.string().optional(),
      maxUses: z.number().positive().optional(),
      expiresAt: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Validate commission rate against affiliate's tier limits
    if (data.commissionRate > affiliate.commissionRate) {
      return res.status(400).json({
        error: `Commission rate cannot exceed your tier limit of ${affiliate.commissionRate}%`,
      });
    }

    // Parse expiresAt date if provided
    let expiresAtDate: Date | undefined;
    if (data.expiresAt && data.expiresAt.trim() !== "") {
      try {
        expiresAtDate = new Date(data.expiresAt);
        // Validate that the date is valid
        if (isNaN(expiresAtDate.getTime())) {
          return res.status(400).json({
            error: "Invalid expiration date format. Please use a valid date.",
          });
        }
      } catch (error) {
        return res.status(400).json({
          error: "Invalid expiration date format. Please use a valid date.",
        });
      }
    }

    const referralCode = await ReferralSystemModel.generateReferralCode(
      affiliate.id,
      {
        type: "BOTH", // Default to BOTH, type field is no longer exposed in UI
        commissionRate: data.commissionRate || affiliate.commissionRate || 10,
        productId: data.productId,
        maxUses: data.maxUses,
        expiresAt: expiresAtDate,
      }
    );

    res.status(201).json(referralCode);
  } catch (error) {
    console.error("Error creating referral code:", error);

    // Handle specific Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return res.status(400).json({
        error: "Validation error",
        details: errorMessages,
      });
    }

    res.status(400).json({ error: "Failed to create referral code" });
  }
});

// Get referral statistics
router.get("/stats", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can access referral stats" });
    }

    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const stats = await ReferralSystemModel.getReferralStats(affiliate.id);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    res.status(500).json({ error: "Failed to fetch referral stats" });
  }
});

// Generate shareable links
router.post("/shareable-links", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can generate shareable links" });
    }

    const schema = z.object({
      platforms: z.array(z.string()).optional(),
    });

    const { platforms } = schema.parse(req.body);

    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const shareableData = await ReferralSystemModel.generateShareableLinks(
      affiliate.id,
      platforms
    );

    res.json(shareableData);
  } catch (error) {
    console.error("Error generating shareable links:", error);
    res.status(500).json({ error: "Failed to generate shareable links" });
  }
});

// Process referral (public endpoint - called when someone uses a referral code)
router.post("/process", async (req, res) => {
  try {
    const schema = z.object({
      code: z.string(),
      userId: z.string(),
      type: z.enum(["SIGNUP", "PURCHASE"]),
      productId: z.string().optional(),
      orderValue: z.number().positive().optional(),
    });

    const data = schema.parse(req.body);

    const referralUsage = await ReferralSystemModel.processReferral(
      data.code,
      data.userId,
      data.type === "PURCHASE" ? "PRODUCT" : data.type,
      {
        productId: data.productId,
        orderValue: data.orderValue,
      }
    );

    res.status(201).json(referralUsage);
  } catch (error) {
    console.error("Error processing referral:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to process referral" });
  }
});

// Validate referral code (public endpoint)
router.get("/validate/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!referralCode) {
      return res
        .status(404)
        .json({ error: "Invalid or expired referral code" });
    }

    // Check if max uses reached
    if (
      referralCode.maxUses &&
      referralCode.currentUses >= referralCode.maxUses
    ) {
      return res
        .status(400)
        .json({ error: "Referral code usage limit reached" });
    }

    res.json({
      valid: true,
      code: referralCode.code,
      type: referralCode.type,
      commissionRate: referralCode.commissionRate,
      affiliateName: `${referralCode.affiliate.user.firstName} ${referralCode.affiliate.user.lastName}`,
      remainingUses: referralCode.maxUses
        ? referralCode.maxUses - referralCode.currentUses
        : null,
    });
  } catch (error) {
    console.error("Error validating referral code:", error);
    res.status(500).json({ error: "Failed to validate referral code" });
  }
});

// Admin endpoints
router.get("/admin/stats", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Only admins can access global referral stats" });
    }

    const [
      totalReferralCodes,
      totalReferrals,
      totalCommissions,
      topAffiliates,
    ] = await Promise.all([
      prisma.referralCode.count(),
      prisma.referralUsage.count(),
      prisma.referralUsage.aggregate({
        _sum: { commissionAmount: true },
      }),
      // Get top affiliates by commission
      prisma.referralUsage.findMany({
        select: {
          referralCodeId: true,
          commissionAmount: true,
          referralCode: {
            select: {
              code: true,
              affiliate: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
        orderBy: { commissionAmount: "desc" },
        take: 10,
      }),
    ]);

    res.json({
      totalReferralCodes,
      totalReferrals,
      totalCommissions: totalCommissions._sum.commissionAmount || 0,
      topAffiliates,
    });
  } catch (error) {
    console.error("Error fetching admin referral stats:", error);
    res.status(500).json({ error: "Failed to fetch admin referral stats" });
  }
});

// Update referral code
router.put("/codes/:id", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can update referral codes" });
    }

    const { id } = req.params;

    const schema = z.object({
      // commissionRate removed - only admins can change this via affiliate profile
      productId: z.string().optional().nullable(),
      maxUses: z.number().positive().optional().nullable(),
      expiresAt: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
    });

    const data = schema.parse(req.body);

    // Find the referral code and verify ownership
    const referralCode = await prisma.referralCode.findUnique({
      where: { id },
      include: {
        affiliate: {
          select: {
            userId: true,
            commissionRate: true,
          },
        },
      },
    });

    if (!referralCode) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    // Verify the affiliate owns this referral code
    if (referralCode.affiliate.userId !== req.user.id) {
      return res.status(403).json({
        error: "You don't have permission to update this referral code",
      });
    }

    // Parse expiresAt date if provided
    // Note: commissionRate is not updated here - only admins can change it via affiliate profile
    let expiresAtDate: Date | null | undefined = undefined;
    if (data.expiresAt !== undefined) {
      if (data.expiresAt === null || data.expiresAt === "") {
        expiresAtDate = null;
      } else {
        try {
          expiresAtDate = new Date(data.expiresAt);
          if (isNaN(expiresAtDate.getTime())) {
            return res.status(400).json({
              error: "Invalid expiration date format. Please use a valid date.",
            });
          }
        } catch (error) {
          return res.status(400).json({
            error: "Invalid expiration date format. Please use a valid date.",
          });
        }
      }
    }

    // Build update data
    const updateData: any = {};
    // Commission rate is not updated - only admins can change it via affiliate profile
    if (data.productId !== undefined) updateData.productId = data.productId;
    if (data.maxUses !== undefined) updateData.maxUses = data.maxUses;
    if (data.expiresAt !== undefined) updateData.expiresAt = expiresAtDate;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Update the referral code
    const updatedCode = await prisma.referralCode.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedCode);
  } catch (error) {
    console.error("Error updating referral code:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return res.status(400).json({
        error: "Validation error",
        details: errorMessages,
      });
    }

    res.status(400).json({ error: "Failed to update referral code" });
  }
});

// Delete referral code
router.delete("/codes/:id", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can delete referral codes" });
    }

    const { id } = req.params;

    // Find the referral code and verify ownership
    const referralCode = await prisma.referralCode.findUnique({
      where: { id },
      include: {
        affiliate: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!referralCode) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    // Verify the affiliate owns this referral code
    if (referralCode.affiliate.userId !== req.user.id) {
      return res.status(403).json({
        error: "You don't have permission to delete this referral code",
      });
    }

    // Check if referral code has been used
    const usageCount = await prisma.referralUsage.count({
      where: { referralCodeId: id },
    });

    if (usageCount > 0) {
      return res.status(400).json({
        error:
          "Cannot delete referral code that has been used. You can deactivate it instead.",
      });
    }

    // Delete the referral code
    await prisma.referralCode.delete({
      where: { id },
    });

    res.json({ success: true, message: "Referral code deleted successfully" });
  } catch (error) {
    console.error("Error deleting referral code:", error);
    res.status(500).json({ error: "Failed to delete referral code" });
  }
});

// Get referral analytics
router.get("/analytics", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "AFFILIATE") {
      return res
        .status(403)
        .json({ error: "Only affiliates can access referral analytics" });
    }

    const { period = "30d" } = req.query;

    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Calculate date range based on period
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

    // Get analytics data
    const referralCodes = await ReferralSystemModel.getAffiliateReferralCodes(
      affiliate.id
    );

    // Get usage data
    const usageData = await prisma.referralUsage.findMany({
      where: {
        referralCode: {
          affiliateId: affiliate.id,
        },
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        referralCode: true,
      },
    });

    // Calculate analytics
    const analytics = {
      totalReferrals: usageData.length,
      totalCommissions: usageData.reduce(
        (sum, usage) => sum + (usage.commissionAmount || 0),
        0
      ),
      conversionRate:
        referralCodes.length > 0
          ? (usageData.length /
              referralCodes.reduce(
                (sum, code) => sum + (code.currentUses || 0),
                0
              )) *
            100
          : 0,
      topProducts: referralCodes
        .map((code) => ({
          productId: code.id,
          productName: code.code,
          referrals: code.currentUses || 0,
          commissions: usageData
            .filter((usage) => usage.referralCodeId === code.id)
            .reduce((sum, usage) => sum + (usage.commissionAmount || 0), 0),
        }))
        .sort((a, b) => b.commissions - a.commissions)
        .slice(0, 5),
      dailyStats: [
        // Generate sample daily stats for the last 7 days
        { date: "2024-10-09", referrals: 2, commissions: 25.5 },
        { date: "2024-10-10", referrals: 1, commissions: 12.75 },
        { date: "2024-10-11", referrals: 3, commissions: 38.25 },
        { date: "2024-10-12", referrals: 0, commissions: 0 },
        { date: "2024-10-13", referrals: 2, commissions: 25.5 },
        { date: "2024-10-14", referrals: 1, commissions: 12.75 },
        { date: "2024-10-15", referrals: 4, commissions: 51.0 },
      ],
      platformStats: [
        { platform: "facebook", clicks: 45, conversions: 3, revenue: 38.25 },
        { platform: "twitter", clicks: 32, conversions: 2, revenue: 25.5 },
        { platform: "instagram", clicks: 28, conversions: 1, revenue: 12.75 },
        { platform: "linkedin", clicks: 18, conversions: 1, revenue: 12.75 },
        { platform: "tiktok", clicks: 15, conversions: 0, revenue: 0 },
      ],
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching referral analytics:", error);
    res.status(500).json({ error: "Failed to fetch referral analytics" });
  }
});

export default router;
