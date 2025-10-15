"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../middleware/auth");
var client_1 = require("@prisma/client");
var router = express_1.default.Router();
var prisma = new client_1.PrismaClient();
// Get real-time clicks
router.get("/clicks", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, period, _c, page, _d, limit, affiliate, now, startDate, skip, clicks, total, _e, totalClicks, uniqueVisitors, topReferrers, formattedClicks, error_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                userId = req.user.id;
                _a = req.query, _b = _a.period, period = _b === void 0 ? "24h" : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.limit, limit = _d === void 0 ? 50 : _d;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _f.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                now = new Date();
                startDate = void 0;
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
                skip = (parseInt(page) - 1) * parseInt(limit);
                return [4 /*yield*/, prisma.affiliateClick.findMany({
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
                        skip: skip,
                        take: parseInt(limit),
                    })];
            case 2:
                clicks = _f.sent();
                return [4 /*yield*/, prisma.affiliateClick.count({
                        where: {
                            affiliateId: affiliate.id,
                            createdAt: { gte: startDate },
                        },
                    })];
            case 3:
                total = _f.sent();
                return [4 /*yield*/, Promise.all([
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
                            .then(function (result) { return result.length; }),
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
                    ])];
            case 4:
                _e = _f.sent(), totalClicks = _e[0], uniqueVisitors = _e[1], topReferrers = _e[2];
                formattedClicks = clicks.map(function (click) { return ({
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
                    country: "Unknown", // You can implement geolocation
                    device: getDeviceType(click.userAgent || ""),
                    browser: getBrowserType(click.userAgent || ""),
                }); });
                res.json({
                    data: formattedClicks,
                    summary: {
                        totalClicks: totalClicks,
                        uniqueVisitors: uniqueVisitors,
                        topReferrers: topReferrers.map(function (r) { return ({
                            referrer: r.referrer || "Direct",
                            clicks: r._count.referrer,
                        }); }),
                    },
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: total,
                        pages: Math.ceil(total / parseInt(limit)),
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _f.sent();
                console.error("Error fetching clicks:", error_1);
                res.status(500).json({ error: "Failed to fetch clicks data" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get conversions log
router.get("/conversions", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, period, _c, page, _d, limit, affiliate, referralCodes, now, startDate, skip, conversions_1, total, _e, totalConversions, totalRevenue, conversionRate, formattedConversions, error_2;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 6, , 7]);
                userId = req.user.id;
                _a = req.query, _b = _a.period, period = _b === void 0 ? "30d" : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.limit, limit = _d === void 0 ? 50 : _d;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _f.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _f.sent();
                now = new Date();
                startDate = void 0;
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
                skip = (parseInt(page) - 1) * parseInt(limit);
                return [4 /*yield*/, prisma.referralUsage.findMany({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            createdAt: { gte: startDate },
                        },
                        include: {
                            referralCode: true,
                        },
                        orderBy: { createdAt: "desc" },
                        skip: skip,
                        take: parseInt(limit),
                    })];
            case 3:
                conversions_1 = _f.sent();
                return [4 /*yield*/, prisma.referralUsage.count({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            createdAt: { gte: startDate },
                        },
                    })];
            case 4:
                total = _f.sent();
                return [4 /*yield*/, Promise.all([
                        prisma.referralUsage.count({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate },
                            },
                        }),
                        prisma.referralUsage.aggregate({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate },
                            },
                            _sum: { commissionAmount: true },
                        }),
                        // Calculate conversion rate
                        prisma.affiliateClick
                            .count({
                            where: {
                                affiliateId: affiliate.id,
                                createdAt: { gte: startDate },
                            },
                        })
                            .then(function (totalClicks) {
                            return totalClicks > 0 ? (conversions_1.length / totalClicks) * 100 : 0;
                        }),
                    ])];
            case 5:
                _e = _f.sent(), totalConversions = _e[0], totalRevenue = _e[1], conversionRate = _e[2];
                formattedConversions = conversions_1.map(function (conversion) { return ({
                    id: "CONV-".concat(String(conversion.id).slice(-6).toUpperCase()),
                    date: conversion.createdAt.toISOString().replace("T", " ").split(".")[0],
                    clickId: "CLK-".concat(String(conversion.id).slice(-6).toUpperCase()),
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
                }); });
                res.json({
                    data: formattedConversions,
                    summary: {
                        totalConversions: totalConversions,
                        totalRevenue: totalRevenue._sum.commissionAmount || 0,
                        conversionRate: Math.round(conversionRate * 100) / 100,
                    },
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: total,
                        pages: Math.ceil(total / parseInt(limit)),
                    },
                });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _f.sent();
                console.error("Error fetching conversions:", error_2);
                res.status(500).json({ error: "Failed to fetch conversions data" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Get traffic analysis
router.get("/traffic", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, period, affiliate, now, startDate, days, trafficBySource, trafficByDevice, deviceStats_1, dailyTraffic, i, date, startOfDay, endOfDay, dayClicks, dayUniqueVisitors, topPages, _b, _c, error_3;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 11, , 12]);
                userId = req.user.id;
                _a = req.query.period, period = _a === void 0 ? "30d" : _a;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _f.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                now = new Date();
                startDate = void 0;
                days = void 0;
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
                return [4 /*yield*/, prisma.affiliateClick.groupBy({
                        by: ["utmSource"],
                        where: {
                            affiliateId: affiliate.id,
                            createdAt: { gte: startDate },
                        },
                        _count: { utmSource: true },
                        orderBy: { _count: { utmSource: "desc" } },
                    })];
            case 2:
                trafficBySource = _f.sent();
                return [4 /*yield*/, prisma.affiliateClick.groupBy({
                        by: ["userAgent"],
                        where: {
                            affiliateId: affiliate.id,
                            createdAt: { gte: startDate },
                        },
                        _count: { userAgent: true },
                    })];
            case 3:
                trafficByDevice = _f.sent();
                deviceStats_1 = {
                    desktop: 0,
                    mobile: 0,
                    tablet: 0,
                };
                trafficByDevice.forEach(function (device) {
                    var userAgent = device.userAgent || "";
                    if (userAgent.includes("Mobile")) {
                        deviceStats_1.mobile += device._count.userAgent;
                    }
                    else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
                        deviceStats_1.tablet += device._count.userAgent;
                    }
                    else {
                        deviceStats_1.desktop += device._count.userAgent;
                    }
                });
                dailyTraffic = [];
                i = days - 1;
                _f.label = 4;
            case 4:
                if (!(i >= 0)) return [3 /*break*/, 8];
                date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                startOfDay = new Date(date.setHours(0, 0, 0, 0));
                endOfDay = new Date(date.setHours(23, 59, 59, 999));
                return [4 /*yield*/, prisma.affiliateClick.count({
                        where: {
                            affiliateId: affiliate.id,
                            createdAt: { gte: startOfDay, lte: endOfDay },
                        },
                    })];
            case 5:
                dayClicks = _f.sent();
                return [4 /*yield*/, prisma.affiliateClick
                        .groupBy({
                        by: ["ipAddress"],
                        where: {
                            affiliateId: affiliate.id,
                            createdAt: { gte: startOfDay, lte: endOfDay },
                        },
                    })
                        .then(function (result) { return result.length; })];
            case 6:
                dayUniqueVisitors = _f.sent();
                dailyTraffic.push({
                    date: startOfDay.toISOString().split("T")[0],
                    clicks: dayClicks,
                    uniqueVisitors: dayUniqueVisitors,
                    bounceRate: Math.random() * 30 + 20, // Mock bounce rate
                });
                _f.label = 7;
            case 7:
                i--;
                return [3 /*break*/, 4];
            case 8: return [4 /*yield*/, prisma.affiliateClick.groupBy({
                    by: ["url"],
                    where: {
                        affiliateId: affiliate.id,
                        createdAt: { gte: startDate },
                    },
                    _count: { url: true },
                    orderBy: { _count: { url: "desc" } },
                    take: 10,
                })];
            case 9:
                topPages = _f.sent();
                _c = (_b = res).json;
                _d = {
                    period: period
                };
                _e = {
                    totalClicks: trafficBySource.reduce(function (sum, source) { return sum + source._count.utmSource; }, 0)
                };
                return [4 /*yield*/, prisma.affiliateClick
                        .groupBy({
                        by: ["ipAddress"],
                        where: {
                            affiliateId: affiliate.id,
                            createdAt: { gte: startDate },
                        },
                    })
                        .then(function (result) { return result.length; })];
            case 10:
                _c.apply(_b, [(_d.summary = (_e.uniqueVisitors = _f.sent(),
                        _e.avgSessionDuration = Math.random() * 300 + 60,
                        _e.bounceRate = Math.random() * 30 + 20,
                        _e),
                        _d.trafficBySource = trafficBySource.map(function (source) { return ({
                            source: source.utmSource || "Direct",
                            clicks: source._count.utmSource,
                            percentage: 0, // Will be calculated on frontend
                        }); }),
                        _d.deviceStats = deviceStats_1,
                        _d.dailyTraffic = dailyTraffic,
                        _d.topPages = topPages.map(function (page) { return ({
                            url: page.url,
                            clicks: page._count.url,
                            percentage: 0, // Will be calculated on frontend
                        }); }),
                        _d)]);
                return [3 /*break*/, 12];
            case 11:
                error_3 = _f.sent();
                console.error("Error fetching traffic analysis:", error_3);
                res.status(500).json({ error: "Failed to fetch traffic analysis" });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
// Get performance metrics
router.get("/performance", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, period, affiliate_1, referralCodes, now, startDate_1, _b, totalClicks, totalConversions, totalRevenue, avgOrderValue, conversionRate, revenuePerClick, performanceByCode, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                userId = req.user.id;
                _a = req.query.period, period = _a === void 0 ? "30d" : _a;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate_1 = _c.sent();
                if (!affiliate_1) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate_1.id },
                    })];
            case 2:
                referralCodes = _c.sent();
                now = new Date();
                switch (period) {
                    case "7d":
                        startDate_1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case "30d":
                        startDate_1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case "90d":
                        startDate_1 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        startDate_1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                }
                return [4 /*yield*/, Promise.all([
                        prisma.affiliateClick.count({
                            where: {
                                affiliateId: affiliate_1.id,
                                createdAt: { gte: startDate_1 },
                            },
                        }),
                        prisma.referralUsage.count({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate_1 },
                            },
                        }),
                        prisma.referralUsage.aggregate({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate_1 },
                            },
                            _sum: { commissionAmount: true },
                        }),
                        prisma.referralUsage.aggregate({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate_1 },
                            },
                            _avg: { orderValue: true },
                        }),
                    ])];
            case 3:
                _b = _c.sent(), totalClicks = _b[0], totalConversions = _b[1], totalRevenue = _b[2], avgOrderValue = _b[3];
                conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
                revenuePerClick = totalClicks > 0
                    ? (totalRevenue._sum.commissionAmount || 0) / totalClicks
                    : 0;
                return [4 /*yield*/, Promise.all(referralCodes.map(function (code) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, clicks, conversions, revenue, codeConversionRate;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, Promise.all([
                                        prisma.affiliateClick.count({
                                            where: {
                                                affiliateId: affiliate_1.id,
                                                referralCode: code.code,
                                                createdAt: { gte: startDate_1 },
                                            },
                                        }),
                                        prisma.referralUsage.count({
                                            where: {
                                                referralCodeId: code.id,
                                                createdAt: { gte: startDate_1 },
                                            },
                                        }),
                                        prisma.referralUsage.aggregate({
                                            where: {
                                                referralCodeId: code.id,
                                                createdAt: { gte: startDate_1 },
                                            },
                                            _sum: { commissionAmount: true },
                                        }),
                                    ])];
                                case 1:
                                    _a = _b.sent(), clicks = _a[0], conversions = _a[1], revenue = _a[2];
                                    codeConversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
                                    return [2 /*return*/, {
                                            referralCode: code.code,
                                            clicks: clicks,
                                            conversions: conversions,
                                            revenue: revenue._sum.commissionAmount || 0,
                                            conversionRate: Math.round(codeConversionRate * 100) / 100,
                                            commissionRate: code.commissionRate,
                                        }];
                            }
                        });
                    }); }))];
            case 4:
                performanceByCode = _c.sent();
                res.json({
                    period: period,
                    metrics: {
                        totalClicks: totalClicks,
                        totalConversions: totalConversions,
                        conversionRate: Math.round(conversionRate * 100) / 100,
                        totalRevenue: totalRevenue._sum.commissionAmount || 0,
                        avgOrderValue: avgOrderValue._avg.orderValue || 0,
                        revenuePerClick: Math.round(revenuePerClick * 100) / 100,
                    },
                    performanceByCode: performanceByCode.sort(function (a, b) { return b.revenue - a.revenue; }),
                });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _c.sent();
                console.error("Error fetching performance metrics:", error_4);
                res.status(500).json({ error: "Failed to fetch performance metrics" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Helper functions
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
