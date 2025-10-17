"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
router.get("/", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can access commission management" });
        }
        const { page = 1, limit = 20, status, affiliateId, dateFrom, dateTo, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (affiliateId) {
            where.affiliateId = affiliateId;
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [commissions, total] = await Promise.all([
            prisma_1.prisma.commission.findMany({
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
            prisma_1.prisma.commission.count({ where }),
        ]);
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
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
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
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: mockCommissions.length,
                    pages: Math.ceil(mockCommissions.length / parseInt(limit)),
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
    }
    catch (error) {
        console.error("Error fetching commissions:", error);
        res.status(500).json({ error: "Failed to fetch commissions" });
    }
});
router.patch("/:id/status", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can update commission status" });
        }
        const schema = zod_1.z.object({
            status: zod_1.z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]),
            notes: zod_1.z.string().optional(),
        });
        const { status, notes } = schema.parse(req.body);
        const { id } = req.params;
        const commission = await prisma_1.prisma.commission.update({
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
        if (status === "APPROVED") {
            await prisma_1.prisma.affiliateProfile.update({
                where: { id: commission.affiliateId },
                data: {
                    totalEarnings: { increment: commission.amount },
                },
            });
        }
        res.json(commission);
    }
    catch (error) {
        console.error("Error updating commission status:", error);
        res.status(500).json({ error: "Failed to update commission status" });
    }
});
router.patch("/bulk-status", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can bulk update commission statuses" });
        }
        const schema = zod_1.z.object({
            commissionIds: zod_1.z.array(zod_1.z.string()),
            status: zod_1.z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]),
            notes: zod_1.z.string().optional(),
        });
        const { commissionIds, status, notes } = schema.parse(req.body);
        const updateData = {
            status,
            ...(notes && { metadata: { notes } }),
        };
        if (status === "PAID") {
            updateData.payoutDate = new Date();
        }
        const result = await prisma_1.prisma.commission.updateMany({
            where: {
                id: { in: commissionIds },
            },
            data: updateData,
        });
        if (status === "APPROVED") {
            const commissions = await prisma_1.prisma.commission.findMany({
                where: { id: { in: commissionIds } },
                select: { affiliateId: true, amount: true },
            });
            const affiliateUpdates = commissions.reduce((acc, commission) => {
                if (!acc[commission.affiliateId]) {
                    acc[commission.affiliateId] = 0;
                }
                acc[commission.affiliateId] += commission.amount;
                return acc;
            }, {});
            await Promise.all(Object.entries(affiliateUpdates).map(([affiliateId, amount]) => prisma_1.prisma.affiliateProfile.update({
                where: { id: affiliateId },
                data: { totalEarnings: { increment: amount } },
            })));
        }
        res.json({ updated: result.count });
    }
    catch (error) {
        console.error("Error bulk updating commission statuses:", error);
        res
            .status(500)
            .json({ error: "Failed to bulk update commission statuses" });
    }
});
router.get("/analytics", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can access commission analytics" });
        }
        const { period = "30d" } = req.query;
        let dateFrom;
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
        const [totalCommissions, totalAmount, statusBreakdown, topAffiliates, dailyStats,] = await Promise.all([
            prisma_1.prisma.commission.count({
                where: { createdAt: { gte: dateFrom } },
            }),
            prisma_1.prisma.commission.aggregate({
                where: { createdAt: { gte: dateFrom } },
                _sum: { amount: true },
            }),
            prisma_1.prisma.commission.groupBy({
                by: ["status"],
                where: { createdAt: { gte: dateFrom } },
                _sum: { amount: true },
                _count: { id: true },
            }),
            prisma_1.prisma.commission.groupBy({
                by: ["affiliateId"],
                where: { createdAt: { gte: dateFrom } },
                _sum: { amount: true },
                _count: { id: true },
                orderBy: { _sum: { amount: "desc" } },
                take: 10,
            }),
            prisma_1.prisma.commission.groupBy({
                by: ["createdAt"],
                where: { createdAt: { gte: dateFrom } },
                _sum: { amount: true },
                _count: { id: true },
                orderBy: { createdAt: "asc" },
            }),
        ]);
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
        const topAffiliateIds = topAffiliates.map((a) => a.affiliateId);
        const affiliateDetails = await prisma_1.prisma.affiliateProfile.findMany({
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
            const details = affiliateDetails.find((d) => d.id === affiliate.affiliateId);
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
    }
    catch (error) {
        console.error("Error fetching commission analytics:", error);
        res.status(500).json({ error: "Failed to fetch commission analytics" });
    }
});
router.patch("/affiliate/:affiliateId/rate", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can update commission rates" });
        }
        const schema = zod_1.z.object({
            commissionRate: zod_1.z.number().min(0).max(100),
            reason: zod_1.z.string().optional(),
        });
        const { commissionRate, reason } = schema.parse(req.body);
        const { affiliateId } = req.params;
        const affiliate = await prisma_1.prisma.affiliateProfile.update({
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
        await prisma_1.prisma.activity.create({
            data: {
                action: "COMMISSION_RATE_CHANGE",
                resource: "AFFILIATE_PROFILE",
                details: {
                    description: `Commission rate changed to ${commissionRate}%${reason ? ` - ${reason}` : ""}`,
                    oldRate: affiliate.commissionRate,
                    newRate: commissionRate,
                    reason,
                },
                userId: req.user.id,
            },
        });
        res.json(affiliate);
    }
    catch (error) {
        console.error("Error updating commission rate:", error);
        res.status(500).json({ error: "Failed to update commission rate" });
    }
});
exports.default = router;
//# sourceMappingURL=commission-management.js.map