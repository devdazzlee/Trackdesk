"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/overview", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const affiliates = await prisma.affiliateProfile.findMany({
            include: {
                user: true,
            },
        });
        const allReferralCodes = await prisma.referralCode.findMany();
        const allReferralUsages = await prisma.referralUsage.findMany({
            where: {
                createdAt: { gte: thirtyDaysAgo },
            },
        });
        const [totalAffiliates, activeAffiliates, pendingAffiliates, totalRevenue, totalCommissions,] = await Promise.all([
            prisma.affiliateProfile.count(),
            prisma.affiliateProfile.count({
                where: { status: "ACTIVE" },
            }),
            prisma.affiliateProfile.count({
                where: { status: "PENDING" },
            }),
            prisma.referralUsage.aggregate({
                where: { createdAt: { gte: thirtyDaysAgo } },
                _sum: { orderValue: true },
            }),
            prisma.referralUsage.aggregate({
                where: { createdAt: { gte: thirtyDaysAgo } },
                _sum: { commissionAmount: true },
            }),
        ]);
        const dailyPerformance = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            const [clicks, conversions, revenue] = await Promise.all([
                prisma.affiliateClick.count({
                    where: {
                        createdAt: { gte: startOfDay, lte: endOfDay },
                    },
                }),
                prisma.referralUsage.count({
                    where: {
                        createdAt: { gte: startOfDay, lte: endOfDay },
                    },
                }),
                prisma.referralUsage.aggregate({
                    where: {
                        createdAt: { gte: startOfDay, lte: endOfDay },
                    },
                    _sum: { orderValue: true },
                }),
            ]);
            dailyPerformance.push({
                date: startOfDay.toISOString().split("T")[0],
                totalClicks: clicks,
                conversions,
                revenue: revenue._sum.orderValue || 0,
            });
        }
        const topAffiliates = await Promise.all(affiliates.slice(0, 10).map(async (affiliate) => {
            const codes = await prisma.referralCode.findMany({
                where: { affiliateId: affiliate.id },
            });
            const earnings = await prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: codes.map((c) => c.id) },
                    createdAt: { gte: thirtyDaysAgo },
                },
                _sum: { commissionAmount: true },
            });
            const conversions = await prisma.referralUsage.count({
                where: {
                    referralCodeId: { in: codes.map((c) => c.id) },
                    createdAt: { gte: thirtyDaysAgo },
                },
            });
            return {
                id: affiliate.id,
                name: `${affiliate.user?.firstName || ""} ${affiliate.user?.lastName || ""}`.trim() ||
                    "Unknown",
                email: affiliate.user?.email || "No email",
                status: affiliate.status,
                tier: affiliate.tier,
                totalEarnings: earnings._sum.commissionAmount || 0,
                totalConversions: conversions,
                lastActivity: affiliate.lastActivityAt,
            };
        }));
        const sortedTopAffiliates = topAffiliates
            .sort((a, b) => b.totalEarnings - a.totalEarnings)
            .slice(0, 5);
        const pendingPayouts = [
            {
                id: "PAY-001",
                affiliate: sortedTopAffiliates[0]?.name || "Affiliate 1",
                amount: 250.0,
                method: "PayPal",
                status: "pending",
                requestDate: new Date().toISOString().split("T")[0],
                email: sortedTopAffiliates[0]?.email || "affiliate@example.com",
            },
        ];
        res.json({
            statistics: {
                totalAffiliates,
                activeAffiliates,
                pendingAffiliates,
                totalRevenue: totalRevenue._sum.orderValue || 0,
                totalCommissions: totalCommissions._sum.commissionAmount || 0,
                averageCommissionRate: 15,
                totalClicks: allReferralCodes.reduce((sum, code) => sum + (code.currentUses || 0), 0),
                totalConversions: allReferralUsages.length,
                conversionRate: allReferralCodes.reduce((sum, code) => sum + (code.currentUses || 0), 0) > 0
                    ? (allReferralUsages.length /
                        allReferralCodes.reduce((sum, code) => sum + (code.currentUses || 0), 0)) *
                        100
                    : 0,
            },
            dailyPerformance,
            topAffiliates: sortedTopAffiliates,
            pendingPayouts,
            systemAlerts: [
                {
                    type: "warning",
                    title: `${pendingAffiliates} Pending Affiliate Applications`,
                    description: "Review and approve new affiliate applications to grow your program.",
                    time: "2 hours ago",
                },
                {
                    type: "info",
                    title: "Monthly Payout Processing",
                    description: `Process monthly payouts for ${activeAffiliates} affiliates.`,
                    time: "1 day ago",
                },
            ],
        });
    }
    catch (error) {
        console.error("Error fetching admin dashboard overview:", error);
        res
            .status(500)
            .json({ error: "Failed to fetch admin dashboard overview" });
    }
});
exports.default = router;
//# sourceMappingURL=admin-dashboard.js.map