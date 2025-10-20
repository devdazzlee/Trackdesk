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
router.get("/pending", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, status = "PENDING" } = req.query;
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const commissions = await prisma.affiliateOrder.findMany({
            where: {
                affiliateId: affiliate.id,
                status: status,
                commissionAmount: { gt: 0 },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: parseInt(limit),
        });
        const total = await prisma.affiliateOrder.count({
            where: {
                affiliateId: affiliate.id,
                status: status,
                commissionAmount: { gt: 0 },
            },
        });
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
                .split("T")[0],
            referralCode: commission.referralCode || "N/A",
            type: "Product",
        }));
        res.json({
            data: formattedCommissions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching pending commissions:", error);
        res.status(500).json({ error: "Failed to fetch pending commissions" });
    }
});
router.get("/history", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const payouts = await prisma.payout.findMany({
            where: {
                affiliateId: affiliate.id,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: parseInt(limit),
        });
        const total = await prisma.payout.count({
            where: {
                affiliateId: affiliate.id,
            },
        });
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
            commissionsCount: 0,
        }));
        res.json({
            data: paginatedHistory,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching payout history:", error);
        res.status(500).json({ error: "Failed to fetch payout history" });
    }
});
router.get("/settings", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const payoutSettings = {
            minimumPayout: 50.0,
            payoutMethod: "PayPal",
            payoutEmail: affiliate.user?.email || "",
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
    }
    catch (error) {
        console.error("Error fetching payout settings:", error);
        res.status(500).json({ error: "Failed to fetch payout settings" });
    }
});
router.put("/settings", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const settingsData = req.body;
        const settingsSchema = zod_1.z.object({
            payoutMethod: zod_1.z.enum(["PayPal", "Bank Transfer", "Check"]),
            payoutEmail: zod_1.z.string().email(),
            payoutFrequency: zod_1.z.enum(["Weekly", "Monthly", "Quarterly"]),
            taxInfo: zod_1.z
                .object({
                taxId: zod_1.z.string().optional(),
                businessName: zod_1.z.string().optional(),
                address: zod_1.z.string().optional(),
            })
                .optional(),
            notifications: zod_1.z
                .object({
                payoutProcessed: zod_1.z.boolean(),
                payoutPending: zod_1.z.boolean(),
                payoutFailed: zod_1.z.boolean(),
            })
                .optional(),
        });
        const validatedData = settingsSchema.parse(settingsData);
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        if (validatedData.payoutEmail !== affiliate.user?.email) {
            await prisma.user.update({
                where: { id: userId },
                data: { email: validatedData.payoutEmail },
            });
        }
        await prisma.affiliateProfile.update({
            where: { id: affiliate.id },
            data: {
                updatedAt: new Date(),
            },
        });
        res.json({ message: "Payout settings updated successfully" });
    }
    catch (error) {
        console.error("Error updating payout settings:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to update payout settings" });
    }
});
router.post("/request-payout", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, reason } = req.body;
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
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
    }
    catch (error) {
        console.error("Error creating payout request:", error);
        res.status(500).json({ error: "Failed to create payout request" });
    }
});
router.get("/analytics", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = "30d" } = req.query;
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
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
        const [totalCommissions, totalAmount, pendingOrders, approvedOrders, paidOrders,] = await Promise.all([
            prisma.affiliateOrder.count({
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                    commissionAmount: { gt: 0 },
                },
            }),
            prisma.affiliateOrder.aggregate({
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                    commissionAmount: { gt: 0 },
                },
                _sum: { commissionAmount: true },
            }),
            prisma.affiliateOrder.aggregate({
                where: {
                    affiliateId: affiliate.id,
                    status: "PENDING",
                    createdAt: { gte: startDate },
                },
                _sum: { commissionAmount: true },
                _count: { id: true },
            }),
            prisma.affiliateOrder.aggregate({
                where: {
                    affiliateId: affiliate.id,
                    status: "APPROVED",
                    createdAt: { gte: startDate },
                },
                _sum: { commissionAmount: true },
                _count: { id: true },
            }),
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
            topAffiliates: [],
        };
        res.json(analytics);
    }
    catch (error) {
        console.error("Error fetching commission analytics:", error);
        res.status(500).json({ error: "Failed to fetch commission analytics" });
    }
});
exports.default = router;
//# sourceMappingURL=commissions.js.map