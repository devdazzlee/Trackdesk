"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { page = 1, limit = 20, status, tier, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = {};
        if (status)
            where.status = status;
        if (tier)
            where.tier = tier;
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
            take: parseInt(limit),
        });
        const total = await prisma.affiliateProfile.count({ where });
        const affiliatesWithStats = await Promise.all(affiliates.map(async (affiliate) => {
            const referralCodes = await prisma.referralCode.findMany({
                where: { affiliateId: affiliate.id },
            });
            const [earnings, conversions, clicks] = await Promise.all([
                prisma.referralUsage.aggregate({
                    where: {
                        referralCodeId: { in: referralCodes.map((c) => c.id) },
                    },
                    _sum: { commissionAmount: true },
                }),
                prisma.referralUsage.count({
                    where: {
                        referralCodeId: { in: referralCodes.map((c) => c.id) },
                    },
                }),
                prisma.affiliateClick.count({
                    where: { affiliateId: affiliate.id },
                }),
            ]);
            const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
            return {
                id: affiliate.id,
                name: `${affiliate.user?.firstName || ""} ${affiliate.user?.lastName || ""}`.trim() ||
                    "Unknown",
                email: affiliate.user?.email || "No email",
                joinDate: affiliate.createdAt.toISOString().split("T")[0],
                status: affiliate.status,
                tier: affiliate.tier,
                totalEarnings: earnings._sum.commissionAmount || 0,
                totalClicks: clicks,
                totalConversions: conversions,
                conversionRate: Math.round(conversionRate * 10) / 10,
                lastActivity: affiliate.lastActivityAt?.toISOString().split("T")[0] || "N/A",
                paymentMethod: affiliate.paymentMethod,
                country: "Unknown",
            };
        }));
        res.json({
            data: affiliatesWithStats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching affiliates:", error);
        res.status(500).json({ error: "Failed to fetch affiliates" });
    }
});
router.get("/:id", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
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
        const referralCodes = await prisma.referralCode.findMany({
            where: { affiliateId: affiliate.id },
        });
        const [earnings, conversions, clicks] = await Promise.all([
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((c) => c.id) },
                },
                _sum: { commissionAmount: true },
            }),
            prisma.referralUsage.count({
                where: {
                    referralCodeId: { in: referralCodes.map((c) => c.id) },
                },
            }),
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
                referralCodes: referralCodes.length,
            },
        });
    }
    catch (error) {
        console.error("Error fetching affiliate details:", error);
        res.status(500).json({ error: "Failed to fetch affiliate details" });
    }
});
router.patch("/:id/status", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
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
    }
    catch (error) {
        console.error("Error updating affiliate status:", error);
        res.status(500).json({ error: "Failed to update affiliate status" });
    }
});
router.patch("/:id/tier", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { tier, commissionRate } = req.body;
        const schema = zod_1.z.object({
            tier: zod_1.z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"]).optional(),
            commissionRate: zod_1.z.number().min(0).max(100).optional(),
        });
        const validatedData = schema.parse({ tier, commissionRate });
        const updatedAffiliate = await prisma.affiliateProfile.update({
            where: { id },
            data: {
                tier: validatedData.tier,
                ...(validatedData.commissionRate && {
                    commissionRate: validatedData.commissionRate,
                }),
            },
        });
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
    }
    catch (error) {
        console.error("Error updating affiliate tier:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to update affiliate tier" });
    }
});
router.delete("/:id", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const affiliate = await prisma.affiliateProfile.findUnique({
            where: { id },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate not found" });
        }
        await prisma.affiliateProfile.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: "Affiliate deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting affiliate:", error);
        res.status(500).json({ error: "Failed to delete affiliate" });
    }
});
router.get("/:id/analytics", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { period = "30d" } = req.query;
        const now = new Date();
        let startDate;
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
        const referralCodes = await prisma.referralCode.findMany({
            where: { affiliateId: id },
        });
        const [clicks, conversions, revenue, commissions] = await Promise.all([
            prisma.affiliateClick.count({
                where: {
                    affiliateId: id,
                    createdAt: { gte: startDate },
                },
            }),
            prisma.referralUsage.count({
                where: {
                    referralCodeId: { in: referralCodes.map((c) => c.id) },
                    createdAt: { gte: startDate },
                },
            }),
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((c) => c.id) },
                    createdAt: { gte: startDate },
                },
                _sum: { orderValue: true },
            }),
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((c) => c.id) },
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
                averageOrderValue: conversions > 0 ? (revenue._sum.orderValue || 0) / conversions : 0,
            },
        });
    }
    catch (error) {
        console.error("Error fetching affiliate analytics:", error);
        res.status(500).json({ error: "Failed to fetch affiliate analytics" });
    }
});
exports.default = router;
//# sourceMappingURL=admin-affiliates.js.map