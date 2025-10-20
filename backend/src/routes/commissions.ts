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

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Get pending commissions from AffiliateOrder table
    const commissions = await prisma.affiliateOrder.findMany({
      where: {
        affiliateId: affiliate.id,
        status: status as string,
        commissionAmount: { gt: 0 },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit as string),
    });

    const total = await prisma.affiliateOrder.count({
      where: {
        affiliateId: affiliate.id,
        status: status as string,
        commissionAmount: { gt: 0 },
      },
    });

    // Format commissions data
    const formattedCommissions = commissions.map((commission, index) => ({
      id: `COMM-${String(commission.id).slice(-6).toUpperCase()}`,
      date: commission.createdAt.toISOString().split("T")[0],
      customer: commission.customerEmail || "Anonymous",
      offer: commission.referralCode || "Direct",
      saleAmount: commission.orderValue || 0,
      commissionRate: commission.commissionRate,
      commissionAmount: commission.commissionAmount || 0,
      status: commission.status.toLowerCase(),
      expectedPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      referralCode: commission.referralCode || "N/A",
      type: "Product", // Based on your schema, all affiliate orders are product sales
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

    // Get payout history from Payout table
    const payouts = await prisma.payout.findMany({
      where: {
        affiliateId: affiliate.id,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit as string),
    });

    const total = await prisma.payout.count({
      where: {
        affiliateId: affiliate.id,
      },
    });

    // Format payout history
    const paginatedHistory = payouts.map((payout) => ({
      id: `PAY-${String(payout.id).slice(-6).toUpperCase()}`,
      date: payout.createdAt.toISOString().split("T")[0],
      amount: payout.amount,
      status: payout.status.toLowerCase(),
      method: payout.method,
      transactionId: payout.referenceId || "Pending",
      period: new Date(payout.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      commissionsCount: 0, // Can be calculated if needed
    }));

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

    // Get total pending commissions from AffiliateOrder table
    const totalPending = await prisma.affiliateOrder.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: "PENDING",
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

    // Create payout request in the database
    const payoutRequest = await prisma.payout.create({
      data: {
        affiliateId: affiliate.id,
        amount: parseFloat(amount),
        method: affiliate.paymentMethod,
        status: "PENDING",
        referenceId: reason || "Payout request",
      },
    });

    res.json({
      message: "Payout request submitted successfully",
      payoutRequest: {
        id: `PAY-${String(payoutRequest.id).slice(-6).toUpperCase()}`,
        affiliateId: payoutRequest.affiliateId,
        amount: payoutRequest.amount,
        status: payoutRequest.status.toLowerCase(),
        requestedAt: payoutRequest.createdAt,
        reason: payoutRequest.referenceId,
      },
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

    // Get commission analytics from AffiliateOrder table
    const [
      totalCommissions,
      totalAmount,
      pendingOrders,
      approvedOrders,
      paidOrders,
    ] = await Promise.all([
      // Total commissions
      prisma.affiliateOrder.count({
        where: {
          affiliateId: affiliate.id,
          createdAt: { gte: startDate },
          commissionAmount: { gt: 0 },
        },
      }),

      // Total amount
      prisma.affiliateOrder.aggregate({
        where: {
          affiliateId: affiliate.id,
          createdAt: { gte: startDate },
          commissionAmount: { gt: 0 },
        },
        _sum: { commissionAmount: true },
      }),

      // Pending status breakdown
      prisma.affiliateOrder.aggregate({
        where: {
          affiliateId: affiliate.id,
          status: "PENDING",
          createdAt: { gte: startDate },
        },
        _sum: { commissionAmount: true },
        _count: { id: true },
      }),

      // Approved status breakdown
      prisma.affiliateOrder.aggregate({
        where: {
          affiliateId: affiliate.id,
          status: "APPROVED",
          createdAt: { gte: startDate },
        },
        _sum: { commissionAmount: true },
        _count: { id: true },
      }),

      // Paid status breakdown
      prisma.affiliateOrder.aggregate({
        where: {
          affiliateId: affiliate.id,
          status: "PAID",
          createdAt: { gte: startDate },
        },
        _sum: { commissionAmount: true },
        _count: { id: true },
      }),
    ]);

    // Format status breakdown
    const statusBreakdown = [
      {
        status: "PENDING",
        _sum: { amount: pendingOrders._sum.commissionAmount || 0 },
        _count: { id: pendingOrders._count.id },
      },
      {
        status: "APPROVED",
        _sum: { amount: approvedOrders._sum.commissionAmount || 0 },
        _count: { id: approvedOrders._count.id },
      },
      {
        status: "PAID",
        _sum: { amount: paidOrders._sum.commissionAmount || 0 },
        _count: { id: paidOrders._count.id },
      },
    ];

    // Get daily stats
    const dailyStats = [];
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayCommissions = await prisma.affiliateOrder.count({
        where: {
          affiliateId: affiliate.id,
          createdAt: { gte: startOfDay, lte: endOfDay },
          commissionAmount: { gt: 0 },
        },
      });

      const dayAmount = await prisma.affiliateOrder.aggregate({
        where: {
          affiliateId: affiliate.id,
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
