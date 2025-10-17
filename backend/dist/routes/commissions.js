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
        const referralCodes = await prisma.referralCode.findMany({
            where: { affiliateId: affiliate.id },
        });
        const skip = (parseInt(page) - 1) * parseInt(limit);
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
            take: parseInt(limit),
        });
        const total = await prisma.referralUsage.count({
            where: {
                referralCodeId: { in: referralCodes.map((code) => code.id) },
                commissionAmount: { gt: 0 },
            },
        });
        const formattedCommissions = commissions.map((commission, index) => ({
            id: `COMM-${String(commission.id).slice(-6).toUpperCase()}`,
            date: commission.createdAt.toISOString().split("T")[0],
            customer: commission.customerEmail || "Anonymous",
            offer: commission.referralCode.code,
            saleAmount: commission.orderValue || 0,
            commissionRate: commission.referralCode.commissionRate,
            commissionAmount: commission.commissionAmount || 0,
            status: "pending",
            expectedPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            referralCode: commission.referralCode.code,
            type: commission.type,
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
        const paginatedHistory = mockPayoutHistory.slice(skip, skip + parseInt(limit));
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
        const payoutRequest = {
            id: `PAY-REQ-${Date.now()}`,
            affiliateId: affiliate.id,
            amount,
            status: "pending",
            requestedAt: new Date(),
            reason: reason || "Payout request",
        };
        console.log("Payout request created:", payoutRequest);
        res.json({
            message: "Payout request submitted successfully",
            payoutRequest,
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
        const referralCodes = await prisma.referralCode.findMany({
            where: { affiliateId: affiliate.id },
        });
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
        const [totalCommissions, totalAmount, statusBreakdown] = await Promise.all([
            prisma.referralUsage.count({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                    commissionAmount: { gt: 0 },
                },
            }),
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                    commissionAmount: { gt: 0 },
                },
                _sum: { commissionAmount: true },
            }),
            Promise.resolve([
                { status: "PENDING", _sum: { amount: 125.5 }, _count: { id: 8 } },
                { status: "APPROVED", _sum: { amount: 450.75 }, _count: { id: 12 } },
                { status: "PAID", _sum: { amount: 320.25 }, _count: { id: 15 } },
            ]),
        ]);
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