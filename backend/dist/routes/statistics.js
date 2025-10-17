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
router.get("/clicks", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = "24h", page = 1, limit = 50 } = req.query;
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { userId },
        });
        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate profile not found" });
        }
        const now = new Date();
        let startDate;
        switch (period) {
            case "1h":
                startDate = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case "24h":
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const clicks = await prisma.affiliateClick.findMany({
            where: {
                affiliateId: affiliate.id,
                createdAt: { gte: startDate },
            },
            include: {
                affiliate: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: parseInt(limit),
        });
        const total = await prisma.affiliateClick.count({
            where: {
                affiliateId: affiliate.id,
                createdAt: { gte: startDate },
            },
        });
        const [totalClicks, uniqueVisitors, topReferrers] = await Promise.all([
            prisma.affiliateClick.count({
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                },
            }),
            prisma.affiliateClick
                .groupBy({
                by: ["ipAddress"],
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                },
            })
                .then((result) => result.length),
            prisma.affiliateClick.groupBy({
                by: ["referrer"],
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                    referrer: { not: null },
                },
                _count: { referrer: true },
                orderBy: { _count: { referrer: "desc" } },
                take: 10,
            }),
        ]);
        const formattedClicks = clicks.map((click) => ({
            id: click.id,
            timestamp: click.createdAt,
            referralCode: click.referralCode,
            storeId: click.storeId,
            url: click.url,
            referrer: click.referrer || "Direct",
            userAgent: click.userAgent,
            ipAddress: click.ipAddress,
            utmSource: click.utmSource,
            utmMedium: click.utmMedium,
            utmCampaign: click.utmCampaign,
            country: "Unknown",
            device: getDeviceType(click.userAgent || ""),
            browser: getBrowserType(click.userAgent || ""),
        }));
        res.json({
            data: formattedClicks,
            summary: {
                totalClicks,
                uniqueVisitors,
                topReferrers: topReferrers.map((r) => ({
                    referrer: r.referrer || "Direct",
                    clicks: r._count.referrer,
                })),
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching clicks:", error);
        res.status(500).json({ error: "Failed to fetch clicks data" });
    }
});
router.get("/conversions", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = "30d", page = 1, limit = 50 } = req.query;
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
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const conversions = await prisma.referralUsage.findMany({
            where: {
                referralCodeId: { in: referralCodes.map((code) => code.id) },
                createdAt: { gte: startDate },
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
                createdAt: { gte: startDate },
            },
        });
        const [totalConversions, totalRevenue, conversionRate] = await Promise.all([
            prisma.referralUsage.count({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                },
            }),
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                },
                _sum: { commissionAmount: true },
            }),
            prisma.affiliateClick
                .count({
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                },
            })
                .then((totalClicks) => {
                return totalClicks > 0 ? (conversions.length / totalClicks) * 100 : 0;
            }),
        ]);
        const formattedConversions = conversions.map((conversion) => ({
            id: `CONV-${String(conversion.id).slice(-6).toUpperCase()}`,
            date: conversion.createdAt.toISOString().replace("T", " ").split(".")[0],
            clickId: `CLK-${String(conversion.id).slice(-6).toUpperCase()}`,
            status: "approved",
            referralType: conversion.type === "PRODUCT"
                ? "Sale"
                : conversion.type === "SIGNUP"
                    ? "Lead"
                    : "Both",
            commissionAmount: conversion.commissionAmount || 0,
            customerValue: conversion.orderValue || 0,
            offer: conversion.referralCode.code,
            customerEmail: conversion.customerEmail || "Anonymous",
            referralCode: conversion.referralCode.code,
        }));
        res.json({
            data: formattedConversions,
            summary: {
                totalConversions,
                totalRevenue: totalRevenue._sum.commissionAmount || 0,
                conversionRate: Math.round(conversionRate * 100) / 100,
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching conversions:", error);
        res.status(500).json({ error: "Failed to fetch conversions data" });
    }
});
router.get("/traffic", auth_1.authenticateToken, async (req, res) => {
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
        let days;
        switch (period) {
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                days = 7;
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                days = 30;
                break;
            case "90d":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                days = 90;
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                days = 30;
        }
        const trafficBySource = await prisma.affiliateClick.groupBy({
            by: ["utmSource"],
            where: {
                affiliateId: affiliate.id,
                createdAt: { gte: startDate },
            },
            _count: { utmSource: true },
            orderBy: { _count: { utmSource: "desc" } },
        });
        const trafficByDevice = await prisma.affiliateClick.groupBy({
            by: ["userAgent"],
            where: {
                affiliateId: affiliate.id,
                createdAt: { gte: startDate },
            },
            _count: { userAgent: true },
        });
        const deviceStats = {
            desktop: 0,
            mobile: 0,
            tablet: 0,
        };
        trafficByDevice.forEach((device) => {
            const userAgent = device.userAgent || "";
            if (userAgent.includes("Mobile")) {
                deviceStats.mobile += device._count.userAgent;
            }
            else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
                deviceStats.tablet += device._count.userAgent;
            }
            else {
                deviceStats.desktop += device._count.userAgent;
            }
        });
        const dailyTraffic = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            const dayClicks = await prisma.affiliateClick.count({
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
            });
            const dayUniqueVisitors = await prisma.affiliateClick
                .groupBy({
                by: ["ipAddress"],
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
            })
                .then((result) => result.length);
            dailyTraffic.push({
                date: startOfDay.toISOString().split("T")[0],
                clicks: dayClicks,
                uniqueVisitors: dayUniqueVisitors,
                bounceRate: Math.random() * 30 + 20,
            });
        }
        const topPages = await prisma.affiliateClick.groupBy({
            by: ["url"],
            where: {
                affiliateId: affiliate.id,
                createdAt: { gte: startDate },
            },
            _count: { url: true },
            orderBy: { _count: { url: "desc" } },
            take: 10,
        });
        res.json({
            period,
            summary: {
                totalClicks: trafficBySource.reduce((sum, source) => sum + source._count.utmSource, 0),
                uniqueVisitors: await prisma.affiliateClick
                    .groupBy({
                    by: ["ipAddress"],
                    where: {
                        affiliateId: affiliate.id,
                        createdAt: { gte: startDate },
                    },
                })
                    .then((result) => result.length),
                avgSessionDuration: Math.random() * 300 + 60,
                bounceRate: Math.random() * 30 + 20,
            },
            trafficBySource: trafficBySource.map((source) => ({
                source: source.utmSource || "Direct",
                clicks: source._count.utmSource,
                percentage: 0,
            })),
            deviceStats,
            dailyTraffic,
            topPages: topPages.map((page) => ({
                url: page.url,
                clicks: page._count.url,
                percentage: 0,
            })),
        });
    }
    catch (error) {
        console.error("Error fetching traffic analysis:", error);
        res.status(500).json({ error: "Failed to fetch traffic analysis" });
    }
});
router.get("/performance", auth_1.authenticateToken, async (req, res) => {
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
        const [totalClicks, totalConversions, totalRevenue, avgOrderValue] = await Promise.all([
            prisma.affiliateClick.count({
                where: {
                    affiliateId: affiliate.id,
                    createdAt: { gte: startDate },
                },
            }),
            prisma.referralUsage.count({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                },
            }),
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                },
                _sum: { commissionAmount: true },
            }),
            prisma.referralUsage.aggregate({
                where: {
                    referralCodeId: { in: referralCodes.map((code) => code.id) },
                    createdAt: { gte: startDate },
                },
                _avg: { orderValue: true },
            }),
        ]);
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
        const revenuePerClick = totalClicks > 0
            ? (totalRevenue._sum.commissionAmount || 0) / totalClicks
            : 0;
        const performanceByCode = await Promise.all(referralCodes.map(async (code) => {
            const [clicks, conversions, revenue] = await Promise.all([
                prisma.affiliateClick.count({
                    where: {
                        affiliateId: affiliate.id,
                        referralCode: code.code,
                        createdAt: { gte: startDate },
                    },
                }),
                prisma.referralUsage.count({
                    where: {
                        referralCodeId: code.id,
                        createdAt: { gte: startDate },
                    },
                }),
                prisma.referralUsage.aggregate({
                    where: {
                        referralCodeId: code.id,
                        createdAt: { gte: startDate },
                    },
                    _sum: { commissionAmount: true },
                }),
            ]);
            const codeConversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
            return {
                referralCode: code.code,
                clicks,
                conversions,
                revenue: revenue._sum.commissionAmount || 0,
                conversionRate: Math.round(codeConversionRate * 100) / 100,
                commissionRate: code.commissionRate,
            };
        }));
        res.json({
            period,
            metrics: {
                totalClicks,
                totalConversions,
                conversionRate: Math.round(conversionRate * 100) / 100,
                totalRevenue: totalRevenue._sum.commissionAmount || 0,
                avgOrderValue: avgOrderValue._avg.orderValue || 0,
                revenuePerClick: Math.round(revenuePerClick * 100) / 100,
            },
            performanceByCode: performanceByCode.sort((a, b) => b.revenue - a.revenue),
        });
    }
    catch (error) {
        console.error("Error fetching performance metrics:", error);
        res.status(500).json({ error: "Failed to fetch performance metrics" });
    }
});
function getDeviceType(userAgent) {
    if (userAgent.includes("Mobile"))
        return "Mobile";
    if (userAgent.includes("Tablet") || userAgent.includes("iPad"))
        return "Tablet";
    return "Desktop";
}
function getBrowserType(userAgent) {
    if (userAgent.includes("Chrome"))
        return "Chrome";
    if (userAgent.includes("Firefox"))
        return "Firefox";
    if (userAgent.includes("Safari"))
        return "Safari";
    if (userAgent.includes("Edge"))
        return "Edge";
    return "Other";
}
exports.default = router;
//# sourceMappingURL=statistics.js.map