"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
router.post("/click", async (req, res) => {
    try {
        const schema = zod_1.z.object({
            referralCode: zod_1.z.string(),
            storeId: zod_1.z.string(),
            url: zod_1.z.string(),
            referrer: zod_1.z.string().optional(),
            userAgent: zod_1.z.string().optional(),
            timestamp: zod_1.z.string(),
            utm: zod_1.z
                .object({
                utm_source: zod_1.z.string().nullable().optional(),
                utm_medium: zod_1.z.string().nullable().optional(),
                utm_campaign: zod_1.z.string().nullable().optional(),
                utm_term: zod_1.z.string().nullable().optional(),
                utm_content: zod_1.z.string().nullable().optional(),
            })
                .optional(),
        });
        const data = schema.parse(req.body);
        const referralCode = await prisma_1.prisma.referralCode.findFirst({
            where: {
                code: data.referralCode,
                isActive: true,
            },
        });
        if (!referralCode) {
            return res.status(404).json({ error: "Referral code not found" });
        }
        await prisma_1.prisma.affiliateClick.create({
            data: {
                affiliateId: referralCode.affiliateId,
                referralCode: data.referralCode,
                storeId: data.storeId,
                url: data.url,
                referrer: data.referrer,
                userAgent: data.userAgent,
                utmSource: data.utm?.utm_source,
                utmMedium: data.utm?.utm_medium,
                utmCampaign: data.utm?.utm_campaign,
            },
        });
        await prisma_1.prisma.affiliateProfile.update({
            where: { id: referralCode.affiliateId },
            data: { totalClicks: { increment: 1 } },
        });
        res.json({ success: true, message: "Click tracked" });
    }
    catch (error) {
        console.error("Error tracking click:", error);
        res.status(500).json({ error: "Failed to track click" });
    }
});
router.post("/pageview", async (req, res) => {
    try {
        const schema = zod_1.z.object({
            referralCode: zod_1.z.string(),
            storeId: zod_1.z.string(),
            url: zod_1.z.string(),
            timestamp: zod_1.z.string(),
        });
        const data = schema.parse(req.body);
        const referralCode = await prisma_1.prisma.referralCode.findFirst({
            where: {
                code: data.referralCode,
                isActive: true,
            },
        });
        if (!referralCode) {
            return res.status(404).json({ error: "Referral code not found" });
        }
        res.json({ success: true, message: "Page view tracked" });
    }
    catch (error) {
        console.error("Error tracking page view:", error);
        res.status(500).json({ error: "Failed to track page view" });
    }
});
router.post("/order", async (req, res) => {
    try {
        const schema = zod_1.z.object({
            referralCode: zod_1.z.string(),
            storeId: zod_1.z.string(),
            orderId: zod_1.z.string(),
            orderValue: zod_1.z.number(),
            currency: zod_1.z.string().default("USD"),
            customerEmail: zod_1.z.string().optional(),
            items: zod_1.z
                .array(zod_1.z.object({
                id: zod_1.z.string(),
                name: zod_1.z.string(),
                price: zod_1.z.number(),
                quantity: zod_1.z.number(),
            }))
                .optional(),
            timestamp: zod_1.z.string(),
            utm: zod_1.z
                .object({
                utm_source: zod_1.z.string().nullable().optional(),
                utm_medium: zod_1.z.string().nullable().optional(),
                utm_campaign: zod_1.z.string().nullable().optional(),
                utm_term: zod_1.z.string().nullable().optional(),
                utm_content: zod_1.z.string().nullable().optional(),
            })
                .optional(),
        });
        const data = schema.parse(req.body);
        const referralCode = await prisma_1.prisma.referralCode.findFirst({
            where: {
                code: data.referralCode,
                isActive: true,
            },
            include: {
                affiliate: true,
            },
        });
        if (!referralCode) {
            return res.status(404).json({ error: "Referral code not found" });
        }
        const existingOrder = await prisma_1.prisma.affiliateOrder.findFirst({
            where: {
                orderId: data.orderId,
                storeId: data.storeId,
            },
        });
        if (existingOrder) {
            return res.json({
                success: true,
                message: "Order already tracked",
                duplicate: true,
            });
        }
        const commissionRate = referralCode.commissionRate;
        const commissionAmount = (data.orderValue * commissionRate) / 100;
        const order = await prisma_1.prisma.affiliateOrder.create({
            data: {
                affiliateId: referralCode.affiliateId,
                referralCode: data.referralCode,
                storeId: data.storeId,
                orderId: data.orderId,
                orderValue: data.orderValue,
                currency: data.currency,
                customerEmail: data.customerEmail,
                commissionAmount,
                commissionRate,
                status: "PENDING",
                items: data.items || [],
                utmSource: data.utm?.utm_source,
                utmMedium: data.utm?.utm_medium,
                utmCampaign: data.utm?.utm_campaign,
            },
        });
        await prisma_1.prisma.referralCode.update({
            where: { id: referralCode.id },
            data: { currentUses: { increment: 1 } },
        });
        await prisma_1.prisma.affiliateProfile.update({
            where: { id: referralCode.affiliateId },
            data: {
                totalConversions: { increment: 1 },
                totalEarnings: { increment: commissionAmount },
            },
        });
        res.json({
            success: true,
            message: "Order tracked successfully",
            orderId: order.id,
            commissionAmount,
        });
    }
    catch (error) {
        console.error("Error tracking order:", error);
        res.status(500).json({ error: "Failed to track order" });
    }
});
router.post("/webhook/:storeId", async (req, res) => {
    try {
        const { storeId } = req.params;
        const schema = zod_1.z.object({
            orderId: zod_1.z.string(),
            orderValue: zod_1.z.number(),
            currency: zod_1.z.string().default("USD"),
            customerEmail: zod_1.z.string().optional(),
            referralCode: zod_1.z.string().optional(),
            items: zod_1.z.array(zod_1.z.any()).optional(),
        });
        const data = schema.parse(req.body);
        let referralCode = data.referralCode;
        if (!referralCode) {
            return res.json({
                success: true,
                message: "Order received but no referral code found",
            });
        }
        const trackingData = {
            referralCode,
            storeId,
            orderId: data.orderId,
            orderValue: data.orderValue,
            currency: data.currency,
            customerEmail: data.customerEmail,
            items: data.items,
            timestamp: new Date().toISOString(),
            url: req.headers.referer || '',
            referrer: req.headers.referer || '',
            userAgent: req.headers['user-agent'] || '',
            utmSource: req.query.utm_source || '',
            utmMedium: req.query.utm_medium || '',
            utmCampaign: req.query.utm_campaign || '',
            ipAddress: req.ip || req.connection.remoteAddress || ''
        };
        const affiliate = await prisma_1.prisma.affiliateProfile.findFirst({
            where: {
                referralCodes: {
                    some: {
                        code: trackingData.referralCode
                    }
                }
            }
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate not found" });
        }
        const clickData = {
            affiliateId: affiliate.id,
            referralCode: trackingData.referralCode,
            storeId: trackingData.storeId,
            url: trackingData.url || '',
            referrer: trackingData.referrer || '',
            userAgent: trackingData.userAgent || '',
            utmSource: trackingData.utmSource || '',
            utmMedium: trackingData.utmMedium || '',
            utmCampaign: trackingData.utmCampaign || '',
            ipAddress: trackingData.ipAddress || ''
        };
        const affiliateClick = await prisma_1.prisma.affiliateClick.create({
            data: clickData,
        });
        res.json({ success: true, clickId: affiliateClick.id });
    }
    catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Failed to process webhook" });
    }
});
exports.default = router;
//# sourceMappingURL=tracking.js.map