"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const ReferralSystem_1 = require("../models/ReferralSystem");
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
router.get("/codes", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "AFFILIATE") {
            return res
                .status(403)
                .json({ error: "Only affiliates can access referral codes" });
        }
        const affiliate = await prisma_1.prisma.affiliateProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const referralCodes = await ReferralSystem_1.ReferralSystemModel.getAffiliateReferralCodes(affiliate.id);
        res.json(referralCodes);
    }
    catch (error) {
        console.error("Error fetching referral codes:", error);
        res.status(500).json({ error: "Failed to fetch referral codes" });
    }
});
router.post("/codes", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "AFFILIATE") {
            return res
                .status(403)
                .json({ error: "Only affiliates can create referral codes" });
        }
        const schema = zod_1.z.object({
            type: zod_1.z.enum(["SIGNUP", "PRODUCT", "BOTH"]),
            commissionRate: zod_1.z.number().min(0).max(100),
            productId: zod_1.z.string().optional(),
            maxUses: zod_1.z.number().positive().optional(),
            expiresAt: zod_1.z.string().optional(),
        });
        const data = schema.parse(req.body);
        const affiliate = await prisma_1.prisma.affiliateProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        if (data.commissionRate > affiliate.commissionRate) {
            return res.status(400).json({
                error: `Commission rate cannot exceed your tier limit of ${affiliate.commissionRate}%`,
            });
        }
        let expiresAtDate;
        if (data.expiresAt && data.expiresAt.trim() !== "") {
            try {
                expiresAtDate = new Date(data.expiresAt);
                if (isNaN(expiresAtDate.getTime())) {
                    return res.status(400).json({
                        error: "Invalid expiration date format. Please use a valid date.",
                    });
                }
            }
            catch (error) {
                return res.status(400).json({
                    error: "Invalid expiration date format. Please use a valid date.",
                });
            }
        }
        const referralCode = await ReferralSystem_1.ReferralSystemModel.generateReferralCode(affiliate.id, {
            type: data.type || "BOTH",
            commissionRate: data.commissionRate || 10,
            productId: data.productId,
            maxUses: data.maxUses,
            expiresAt: expiresAtDate,
        });
        res.status(201).json(referralCode);
    }
    catch (error) {
        console.error("Error creating referral code:", error);
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
            return res.status(400).json({
                error: "Validation error",
                details: errorMessages,
            });
        }
        res.status(400).json({ error: "Failed to create referral code" });
    }
});
router.get("/stats", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "AFFILIATE") {
            return res
                .status(403)
                .json({ error: "Only affiliates can access referral stats" });
        }
        const affiliate = await prisma_1.prisma.affiliateProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const stats = await ReferralSystem_1.ReferralSystemModel.getReferralStats(affiliate.id);
        res.json(stats);
    }
    catch (error) {
        console.error("Error fetching referral stats:", error);
        res.status(500).json({ error: "Failed to fetch referral stats" });
    }
});
router.post("/shareable-links", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "AFFILIATE") {
            return res
                .status(403)
                .json({ error: "Only affiliates can generate shareable links" });
        }
        const schema = zod_1.z.object({
            platforms: zod_1.z.array(zod_1.z.string()).optional(),
        });
        const { platforms } = schema.parse(req.body);
        const affiliate = await prisma_1.prisma.affiliateProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const shareableData = await ReferralSystem_1.ReferralSystemModel.generateShareableLinks(affiliate.id, platforms);
        res.json(shareableData);
    }
    catch (error) {
        console.error("Error generating shareable links:", error);
        res.status(500).json({ error: "Failed to generate shareable links" });
    }
});
router.post("/process", async (req, res) => {
    try {
        const schema = zod_1.z.object({
            code: zod_1.z.string(),
            userId: zod_1.z.string(),
            type: zod_1.z.enum(["SIGNUP", "PURCHASE"]),
            productId: zod_1.z.string().optional(),
            orderValue: zod_1.z.number().positive().optional(),
        });
        const data = schema.parse(req.body);
        const referralUsage = await ReferralSystem_1.ReferralSystemModel.processReferral(data.code, data.userId, data.type === "PURCHASE" ? "PRODUCT" : data.type, {
            productId: data.productId,
            orderValue: data.orderValue,
        });
        res.status(201).json(referralUsage);
    }
    catch (error) {
        console.error("Error processing referral:", error);
        res
            .status(400)
            .json({ error: error.message || "Failed to process referral" });
    }
});
router.get("/validate/:code", async (req, res) => {
    try {
        const { code } = req.params;
        const referralCode = await prisma_1.prisma.referralCode.findFirst({
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
        if (referralCode.maxUses &&
            referralCode.currentUses >= referralCode.maxUses) {
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
    }
    catch (error) {
        console.error("Error validating referral code:", error);
        res.status(500).json({ error: "Failed to validate referral code" });
    }
});
router.get("/admin/stats", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can access global referral stats" });
        }
        const [totalReferralCodes, totalReferrals, totalCommissions, topAffiliates,] = await Promise.all([
            prisma_1.prisma.referralCode.count(),
            prisma_1.prisma.referralUsage.count(),
            prisma_1.prisma.referralUsage.aggregate({
                _sum: { commissionAmount: true },
            }),
            prisma_1.prisma.referralUsage.findMany({
                select: {
                    referralCodeId: true,
                    commissionAmount: true,
                    referralCode: {
                        select: {
                            code: true,
                            affiliate: {
                                select: {
                                    companyName: true
                                }
                            }
                        }
                    }
                },
                orderBy: { commissionAmount: 'desc' },
                take: 10
            }),
        ]);
        res.json({
            totalReferralCodes,
            totalReferrals,
            totalCommissions: totalCommissions._sum.commissionAmount || 0,
            topAffiliates,
        });
    }
    catch (error) {
        console.error("Error fetching admin referral stats:", error);
        res.status(500).json({ error: "Failed to fetch admin referral stats" });
    }
});
router.get("/analytics", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "AFFILIATE") {
            return res
                .status(403)
                .json({ error: "Only affiliates can access referral analytics" });
        }
        const { period = "30d" } = req.query;
        const affiliate = await prisma_1.prisma.affiliateProfile.findUnique({
            where: { userId: req.user.id },
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
        const referralCodes = await ReferralSystem_1.ReferralSystemModel.getAffiliateReferralCodes(affiliate.id);
        const usageData = await prisma_1.prisma.referralUsage.findMany({
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
        const analytics = {
            totalReferrals: usageData.length,
            totalCommissions: usageData.reduce((sum, usage) => sum + (usage.commissionAmount || 0), 0),
            conversionRate: referralCodes.length > 0
                ? (usageData.length /
                    referralCodes.reduce((sum, code) => sum + (code.currentUses || 0), 0)) *
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
    }
    catch (error) {
        console.error("Error fetching referral analytics:", error);
        res.status(500).json({ error: "Failed to fetch referral analytics" });
    }
});
exports.default = router;
//# sourceMappingURL=referral.js.map