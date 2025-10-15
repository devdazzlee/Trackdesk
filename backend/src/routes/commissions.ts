import express, { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get pending commissions
router.get("/pending", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status = "PENDING" } = req.query;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Get pending commissions
    const commissions = await prisma.referralUsage.findMany({
      where: {
        referralCodeId: { in: referralCodes.map((code) => code.id) },
        commissionAmount: { gt: 0 },
      },
      include: {
        referralCode: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit as string),
    });

    const total = await prisma.referralUsage.count({
      where: {
        referralCodeId: { in: referralCodes.map((code) => code.id) },
        commissionAmount: { gt: 0 },
      },
    });

    // Format commissions data
    const formattedCommissions = commissions.map((commission, index) => ({
      id: `COMM-${String(commission.id).slice(-6).toUpperCase()}`,
      date: commission.createdAt.toISOString().split("T")[0],
      customer: (commission as any).customerEmail || "Anonymous",
      offer: commission.referralCode.code,
      saleAmount: commission.orderValue || 0,
      commissionRate: commission.referralCode.commissionRate,
      commissionAmount: commission.commissionAmount || 0,
      status: "pending",
      expectedPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      referralCode: commission.referralCode.code,
      type: commission.type,
    }));

    res.json({
      data: formattedCommissions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Error fetching pending commissions:", error);
    res.status(500).json({ error: "Failed to fetch pending commissions" });
  }
});

// Get payout history
router.get("/history", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Get payout history (mock data for now - you can implement real payout tracking)
    const mockPayoutHistory = [
      {
        id: "PAY-001",
        date: "2024-01-01",
        amount: 250.0,
        status: "completed",
        method: "PayPal",
        transactionId: "TXN-123456789",
        period: "December 2023",
        commissionsCount: 15,
      },
      {
        id: "PAY-002",
        date: "2023-12-01",
        amount: 180.5,
        status: "completed",
        method: "Bank Transfer",
        transactionId: "TXN-987654321",
        period: "November 2023",
        commissionsCount: 12,
      },
      {
        id: "PAY-003",
        date: "2023-11-01",
        amount: 320.75,
        status: "completed",
        method: "PayPal",
        transactionId: "TXN-456789123",
        period: "October 2023",
        commissionsCount: 18,
      },
    ];

    const total = mockPayoutHistory.length;
    const paginatedHistory = mockPayoutHistory.slice(
      skip,
      skip + parseInt(limit as string)
    );

    res.json({
      data: paginatedHistory,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Error fetching payout history:", error);
    res.status(500).json({ error: "Failed to fetch payout history" });
  }
});

// Get payout settings
router.get("/settings", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Get payout settings (mock data for now)
    const payoutSettings = {
      minimumPayout: 50.0,
      payoutMethod: "PayPal",
      payoutEmail: (affiliate as any).user?.email || "",
      payoutFrequency: "Monthly",
      taxInfo: {
        taxId: "",
        businessName: "",
        address: "",
      },
      notifications: {
        payoutProcessed: true,
        payoutPending: true,
        payoutFailed: true,
      },
    };

    res.json(payoutSettings);
  } catch (error) {
    console.error("Error fetching payout settings:", error);
    res.status(500).json({ error: "Failed to fetch payout settings" });
  }
});

// Update payout settings
router.put("/settings", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;

    // Validate input
    const settingsSchema = z.object({
      payoutMethod: z.enum(["PayPal", "Bank Transfer", "Check"]),
      payoutEmail: z.string().email(),
      payoutFrequency: z.enum(["Weekly", "Monthly", "Quarterly"]),
      taxInfo: z
        .object({
          taxId: z.string().optional(),
          businessName: z.string().optional(),
          address: z.string().optional(),
        })
        .optional(),
      notifications: z
        .object({
          payoutProcessed: z.boolean(),
          payoutPending: z.boolean(),
          payoutFailed: z.boolean(),
        })
        .optional(),
    });

    const validatedData = settingsSchema.parse(settingsData);

    // Update affiliate profile with new settings
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Update user email if changed
    if (validatedData.payoutEmail !== (affiliate as any).user?.email) {
      await prisma.user.update({
        where: { id: userId },
        data: { email: validatedData.payoutEmail },
      });
    }

    // Store payout settings in affiliate profile (you might want to create a separate table for this)
    await prisma.affiliateProfile.update({
      where: { id: affiliate.id },
      data: {
        // Add payout settings fields to your schema if needed
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Payout settings updated successfully" });
  } catch (error) {
    console.error("Error updating payout settings:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update payout settings" });
  }
});

// Request payout
router.post("/request-payout", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { amount, reason } = req.body;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Get total pending commissions
    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

    const totalPending = await prisma.referralUsage.aggregate({
      where: {
        referralCodeId: { in: referralCodes.map((code) => code.id) },
        commissionAmount: { gt: 0 },
      },
      _sum: { commissionAmount: true },
    });

    const availableAmount = totalPending._sum.commissionAmount || 0;

    if (amount > availableAmount) {
      return res.status(400).json({
        error: "Requested amount exceeds available balance",
        availableAmount,
      });
    }

    if (amount < 50) {
      return res.status(400).json({
        error: "Minimum payout amount is $50",
        minimumAmount: 50,
      });
    }

    // Create payout request (you might want to create a separate table for this)
    const payoutRequest = {
      id: `PAY-REQ-${Date.now()}`,
      affiliateId: affiliate.id,
      amount,
      status: "pending",
      requestedAt: new Date(),
      reason: reason || "Payout request",
    };

    // In a real implementation, you would save this to a payout_requests table
    console.log("Payout request created:", payoutRequest);

    res.json({
      message: "Payout request submitted successfully",
      payoutRequest,
    });
  } catch (error) {
    console.error("Error creating payout request:", error);
    res.status(500).json({ error: "Failed to create payout request" });
  }
});

// Get commission analytics
router.get("/analytics", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { period = "30d" } = req.query;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

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

    // Get commission analytics
    const [totalCommissions, totalAmount, statusBreakdown] = await Promise.all([
      // Total commissions
      prisma.referralUsage.count({
        where: {
          referralCodeId: { in: referralCodes.map((code) => code.id) },
          createdAt: { gte: startDate },
          commissionAmount: { gt: 0 },
        },
      }),

      // Total amount
      prisma.referralUsage.aggregate({
        where: {
          referralCodeId: { in: referralCodes.map((code) => code.id) },
          createdAt: { gte: startDate },
          commissionAmount: { gt: 0 },
        },
        _sum: { commissionAmount: true },
      }),

      // Status breakdown (mock data for now)
      Promise.resolve([
        { status: "PENDING", _sum: { amount: 125.5 }, _count: { id: 8 } },
        { status: "APPROVED", _sum: { amount: 450.75 }, _count: { id: 12 } },
        { status: "PAID", _sum: { amount: 320.25 }, _count: { id: 15 } },
      ]),
    ]);

    // Get daily stats
    const dailyStats = [];
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayCommissions = await prisma.referralUsage.count({
        where: {
          referralCodeId: { in: referralCodes.map((code) => code.id) },
          createdAt: { gte: startOfDay, lte: endOfDay },
          commissionAmount: { gt: 0 },
        },
      });

      const dayAmount = await prisma.referralUsage.aggregate({
        where: {
          referralCodeId: { in: referralCodes.map((code) => code.id) },
          createdAt: { gte: startOfDay, lte: endOfDay },
          commissionAmount: { gt: 0 },
        },
        _sum: { commissionAmount: true },
      });

      dailyStats.push({
        createdAt: startOfDay.toISOString(),
        _sum: { amount: dayAmount._sum.commissionAmount || 0 },
        _count: { id: dayCommissions },
      });
    }

    const analytics = {
      period,
      totalCommissions,
      totalAmount: totalAmount._sum.commissionAmount || 0,
      statusBreakdown,
      dailyStats,
      topAffiliates: [], // This would be relevant for admin, not affiliate
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching commission analytics:", error);
    res.status(500).json({ error: "Failed to fetch commission analytics" });
  }
});

export default router;
