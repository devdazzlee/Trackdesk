import express, { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Dashboard Overview API
router.get("/overview", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get affiliate profile
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Get referral codes
    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

    // Get referral usages (conversions)
    const [totalReferrals, totalCommissions, recentActivity] =
      await Promise.all([
        // Total referrals in last 30 days
        prisma.referralUsage.count({
          where: {
            referralCodeId: { in: referralCodes.map((code) => code.id) },
            createdAt: { gte: thirtyDaysAgo },
          },
        }),

        // Total commissions in last 30 days
        prisma.referralUsage.aggregate({
          where: {
            referralCodeId: { in: referralCodes.map((code) => code.id) },
            createdAt: { gte: thirtyDaysAgo },
          },
          _sum: { commissionAmount: true },
        }),

        // Recent activity (last 10 activities)
        prisma.referralUsage.findMany({
          where: {
            referralCodeId: { in: referralCodes.map((code) => code.id) },
          },
          include: {
            referralCode: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    // Get pending commissions
    const pendingCommissions = await prisma.referralUsage.aggregate({
      where: {
        referralCodeId: { in: referralCodes.map((code) => code.id) },
        commissionAmount: { gt: 0 },
      },
      _sum: { commissionAmount: true },
    });

    // Get conversion rate
    const totalClicks = referralCodes.reduce(
      (sum, code) => sum + (code.currentUses || 0),
      0
    );
    const conversionRate =
      totalClicks > 0 ? (totalReferrals / totalClicks) * 100 : 0;

    // Get top performing links
    const topLinks = referralCodes
      .map((code) => ({
        id: code.id,
        name: code.code,
        clicks: code.currentUses || 0,
        conversions: recentActivity.filter(
          (activity) => activity.referralCodeId === code.id
        ).length,
        earnings: recentActivity
          .filter((activity) => activity.referralCodeId === code.id)
          .reduce((sum, activity) => sum + (activity.commissionAmount || 0), 0),
        status: code.isActive ? "Active" : "Inactive",
      }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);

    // Get daily stats for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayReferrals = await prisma.referralUsage.count({
        where: {
          referralCodeId: { in: referralCodes.map((code) => code.id) },
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      const dayCommissions = await prisma.referralUsage.aggregate({
        where: {
          referralCodeId: { in: referralCodes.map((code) => code.id) },
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { commissionAmount: true },
      });

      dailyStats.push({
        date: startOfDay.toISOString().split("T")[0],
        referrals: dayReferrals,
        commissions: dayCommissions._sum.commissionAmount || 0,
      });
    }

    const overview = {
      totalReferrals,
      totalCommissions: totalCommissions._sum.commissionAmount || 0,
      pendingCommissions: pendingCommissions._sum.commissionAmount || 0,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeCodes: referralCodes.filter((code) => code.isActive).length,
      totalCodes: referralCodes.length,
      topLinks,
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        type: "conversion",
        description: `New ${activity.type.toLowerCase()} conversion`,
        amount: `+$${activity.commissionAmount?.toFixed(2) || "0.00"}`,
        time: formatTimeAgo(activity.createdAt),
        status: "success",
      })),
      dailyStats,
    };

    res.json(overview);
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({ error: "Failed to fetch dashboard overview" });
  }
});

// Real-time stats API
router.get("/real-time-stats", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

    // Get real-time metrics
    const [activeUsers, liveClicks, liveConversions, liveRevenue] =
      await Promise.all([
        // Active users (unique IPs in last hour)
        prisma.affiliateClick
          .groupBy({
            by: ["ipAddress"],
            where: {
              affiliateId: affiliate.id,
              createdAt: { gte: oneHourAgo },
            },
          })
          .then((result) => result.length),

        // Live clicks in last hour
        prisma.affiliateClick.count({
          where: {
            affiliateId: affiliate.id,
            createdAt: { gte: oneHourAgo },
          },
        }),

        // Live conversions in last hour
        prisma.referralUsage.count({
          where: {
            referralCodeId: { in: referralCodes.map((code) => code.id) },
            createdAt: { gte: oneHourAgo },
          },
        }),

        // Live revenue in last hour
        prisma.referralUsage.aggregate({
          where: {
            referralCodeId: { in: referralCodes.map((code) => code.id) },
            createdAt: { gte: oneHourAgo },
          },
          _sum: { commissionAmount: true },
        }),
      ]);

    res.json({
      activeUsers,
      liveClicks,
      liveConversions,
      liveRevenue: liveRevenue._sum.commissionAmount || 0,
      timestamp: now,
    });
  } catch (error) {
    console.error("Error fetching real-time stats:", error);
    res.status(500).json({ error: "Failed to fetch real-time stats" });
  }
});

// Recent activity API
router.get("/recent-activity", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

    // Get recent activity
    const recentActivity = await prisma.referralUsage.findMany({
      where: {
        referralCodeId: { in: referralCodes.map((code) => code.id) },
      },
      include: {
        referralCode: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const formattedActivity = recentActivity.map((activity) => ({
      id: activity.id,
      type: "conversion",
      description: `New ${activity.type.toLowerCase()} conversion`,
      amount: `+$${activity.commissionAmount?.toFixed(2) || "0.00"}`,
      time: formatTimeAgo(activity.createdAt),
      status: "success",
      details: {
        referralCode: activity.referralCode.code,
        type: activity.type,
        commissionAmount: activity.commissionAmount,
      },
    }));

    res.json(formattedActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
});

// Top links API
router.get("/top-links", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 5;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
    });

    // Get performance data for each referral code
    const topLinks = await Promise.all(
      referralCodes.map(async (code) => {
        const conversions = await prisma.referralUsage.count({
          where: { referralCodeId: code.id },
        });

        const earnings = await prisma.referralUsage.aggregate({
          where: { referralCodeId: code.id },
          _sum: { commissionAmount: true },
        });

        return {
          id: code.id,
          name: code.code,
          clicks: code.currentUses || 0,
          conversions,
          earnings: earnings._sum.commissionAmount || 0,
          status: code.isActive ? "Active" : "Inactive",
          commissionRate: code.commissionRate,
          type: code.type,
        };
      })
    );

    // Sort by earnings and take top N
    const sortedTopLinks = topLinks
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, limit);

    res.json(sortedTopLinks);
  } catch (error) {
    console.error("Error fetching top links:", error);
    res.status(500).json({ error: "Failed to fetch top links" });
  }
});

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

export default router;
