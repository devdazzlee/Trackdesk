"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var AnalyticsService = /** @class */ (function () {
    function AnalyticsService() {
    }
    AnalyticsService.prototype.getRealTimeAnalytics = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, timeRange, now, startTime, _b, activeUsers, liveClicks, liveConversions, liveRevenue;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = params.timeRange, timeRange = _a === void 0 ? '1h' : _a;
                        now = new Date();
                        startTime = new Date(now.getTime() - (timeRange === '1h' ? 3600000 : timeRange === '24h' ? 86400000 : 604800000));
                        return [4 /*yield*/, Promise.all([
                                prisma.click.groupBy({
                                    by: ['ipAddress'],
                                    where: {
                                        createdAt: { gte: startTime }
                                    }
                                }).then(function (result) { return result.length; }),
                                prisma.click.count({
                                    where: {
                                        createdAt: { gte: startTime }
                                    }
                                }),
                                prisma.conversion.count({
                                    where: {
                                        createdAt: { gte: startTime }
                                    }
                                }),
                                prisma.conversion.aggregate({
                                    where: {
                                        createdAt: { gte: startTime }
                                    },
                                    _sum: { customerValue: true }
                                })
                            ])];
                    case 1:
                        _b = _c.sent(), activeUsers = _b[0], liveClicks = _b[1], liveConversions = _b[2], liveRevenue = _b[3];
                        return [2 /*return*/, {
                                activeUsers: activeUsers,
                                liveClicks: liveClicks,
                                liveConversions: liveConversions,
                                liveRevenue: liveRevenue._sum.customerValue || 0,
                                timestamp: now
                            }];
                }
            });
        });
    };
    AnalyticsService.prototype.getRealTimeActivity = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var activities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.activity.findMany({
                            take: limit,
                            orderBy: { createdAt: 'desc' },
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        activities = _a.sent();
                        return [2 /*return*/, activities];
                }
            });
        });
    };
    AnalyticsService.prototype.getRealTimeMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, oneHourAgo, _a, clicks, conversions, revenue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        now = new Date();
                        oneHourAgo = new Date(now.getTime() - 3600000);
                        return [4 /*yield*/, Promise.all([
                                prisma.click.count({
                                    where: { createdAt: { gte: oneHourAgo } }
                                }),
                                prisma.conversion.count({
                                    where: { createdAt: { gte: oneHourAgo } }
                                }),
                                prisma.conversion.aggregate({
                                    where: { createdAt: { gte: oneHourAgo } },
                                    _sum: { customerValue: true }
                                })
                            ])];
                    case 1:
                        _a = _b.sent(), clicks = _a[0], conversions = _a[1], revenue = _a[2];
                        return [2 /*return*/, {
                                clicks: clicks,
                                conversions: conversions,
                                revenue: revenue._sum.customerValue || 0,
                                conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0
                            }];
                }
            });
        });
    };
    AnalyticsService.prototype.getFunnelAnalysis = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, startDate, endDate, where, clicks, conversions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offerId = params.offerId, startDate = params.startDate, endDate = params.endDate;
                        where = {};
                        if (offerId) {
                            where.offerId = offerId;
                        }
                        if (startDate && endDate) {
                            where.createdAt = {
                                gte: new Date(startDate),
                                lte: new Date(endDate)
                            };
                        }
                        return [4 /*yield*/, prisma.click.count({ where: where })];
                    case 1:
                        clicks = _a.sent();
                        return [4 /*yield*/, prisma.conversion.count({ where: where })];
                    case 2:
                        conversions = _a.sent();
                        return [2 /*return*/, {
                                totalClicks: clicks,
                                totalConversions: conversions,
                                conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0
                            }];
                }
            });
        });
    };
    AnalyticsService.prototype.getCohortAnalysis = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, cohortUsers, cohorts, week, weekStart, weekEnd, activeUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = params.startDate, endDate = params.endDate;
                        return [4 /*yield*/, prisma.user.findMany({
                                where: {
                                    createdAt: {
                                        gte: new Date(startDate),
                                        lte: new Date(endDate)
                                    },
                                    role: 'AFFILIATE'
                                },
                                include: {
                                    affiliateProfile: true
                                }
                            })];
                    case 1:
                        cohortUsers = _a.sent();
                        cohorts = [];
                        week = 0;
                        _a.label = 2;
                    case 2:
                        if (!(week < 8)) return [3 /*break*/, 5];
                        weekStart = new Date(startDate);
                        weekStart.setDate(weekStart.getDate() + (week * 7));
                        weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekEnd.getDate() + 7);
                        return [4 /*yield*/, prisma.click.groupBy({
                                by: ['affiliateId'],
                                where: {
                                    affiliateId: { in: cohortUsers.map(function (u) { var _a; return (_a = u.affiliateProfile) === null || _a === void 0 ? void 0 : _a.id; }).filter(Boolean) },
                                    createdAt: {
                                        gte: weekStart,
                                        lt: weekEnd
                                    }
                                }
                            }).then(function (result) { return result.length; })];
                    case 3:
                        activeUsers = _a.sent();
                        cohorts.push({
                            week: week,
                            activeUsers: activeUsers,
                            retentionRate: cohortUsers.length > 0 ? (activeUsers / cohortUsers.length) * 100 : 0
                        });
                        _a.label = 4;
                    case 4:
                        week++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, cohorts];
                }
            });
        });
    };
    AnalyticsService.prototype.getAttributionData = function (conversionId) {
        return __awaiter(this, void 0, void 0, function () {
            var conversion, attributionWindow, attributionClicks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.conversion.findUnique({
                            where: { id: conversionId },
                            include: {
                                click: {
                                    include: {
                                        link: {
                                            include: {
                                                offer: true
                                            }
                                        }
                                    }
                                }
                            }
                        })];
                    case 1:
                        conversion = _a.sent();
                        if (!conversion) {
                            throw new Error('Conversion not found');
                        }
                        attributionWindow = new Date(conversion.createdAt);
                        attributionWindow.setDate(attributionWindow.getDate() - 30);
                        return [4 /*yield*/, prisma.click.findMany({
                                where: {
                                    affiliateId: conversion.affiliateId,
                                    createdAt: {
                                        gte: attributionWindow,
                                        lte: conversion.createdAt
                                    }
                                },
                                include: {
                                    link: {
                                        include: {
                                            offer: true
                                        }
                                    }
                                },
                                orderBy: { createdAt: 'asc' }
                            })];
                    case 2:
                        attributionClicks = _a.sent();
                        return [2 /*return*/, {
                                conversion: conversion,
                                attributionClicks: attributionClicks,
                                firstClick: attributionClicks[0],
                                lastClick: attributionClicks[attributionClicks.length - 1]
                            }];
                }
            });
        });
    };
    AnalyticsService.prototype.getAttributionModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        { name: 'First Click', description: 'Attributes conversion to the first click' },
                        { name: 'Last Click', description: 'Attributes conversion to the last click' },
                        { name: 'Linear', description: 'Distributes attribution evenly across all clicks' },
                        { name: 'Time Decay', description: 'Gives more weight to recent clicks' }
                    ]];
            });
        });
    };
    AnalyticsService.prototype.getPerformanceAnalytics = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock performance analytics
                return [2 /*return*/, {
                        totalClicks: 50000,
                        totalConversions: 1500,
                        totalRevenue: 75000.00,
                        conversionRate: 3.0,
                        averageOrderValue: 50.00,
                        topPerformingOffers: [
                            { name: 'Premium Software', clicks: 10000, conversions: 400, revenue: 20000.00 },
                            { name: 'E-commerce Products', clicks: 15000, conversions: 450, revenue: 22500.00 },
                            { name: 'Digital Services', clicks: 8000, conversions: 240, revenue: 12000.00 }
                        ]
                    }];
            });
        });
    };
    AnalyticsService.prototype.getPerformanceTrends = function (timeRange, metric) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock performance trends
                return [2 /*return*/, {
                        timeRange: timeRange,
                        metric: metric,
                        trends: [
                            { date: '2024-01-01', value: 100 },
                            { date: '2024-01-02', value: 120 },
                            { date: '2024-01-03', value: 110 },
                            { date: '2024-01-04', value: 130 },
                            { date: '2024-01-05', value: 125 }
                        ]
                    }];
            });
        });
    };
    AnalyticsService.prototype.getPerformanceComparison = function (period1, period2, metric) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock performance comparison
                return [2 /*return*/, {
                        period1: period1,
                        period2: period2,
                        metric: metric,
                        comparison: {
                            period1Value: 1000,
                            period2Value: 1200,
                            change: 20,
                            changePercentage: 20
                        }
                    }];
            });
        });
    };
    AnalyticsService.prototype.getGeographicAnalytics = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock geographic analytics
                return [2 /*return*/, {
                        totalCountries: 25,
                        topCountries: [
                            { country: 'USA', clicks: 20000, conversions: 600, revenue: 30000.00 },
                            { country: 'Canada', clicks: 8000, conversions: 240, revenue: 12000.00 },
                            { country: 'UK', clicks: 6000, conversions: 180, revenue: 9000.00 }
                        ]
                    }];
            });
        });
    };
    AnalyticsService.prototype.getCountryAnalytics = function (timeRange, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock country analytics
                return [2 /*return*/, [
                        { country: 'USA', clicks: 20000, conversions: 600, revenue: 30000.00 },
                        { country: 'Canada', clicks: 8000, conversions: 240, revenue: 12000.00 },
                        { country: 'UK', clicks: 6000, conversions: 180, revenue: 9000.00 },
                        { country: 'Germany', clicks: 4000, conversions: 120, revenue: 6000.00 },
                        { country: 'Australia', clicks: 3000, conversions: 90, revenue: 4500.00 }
                    ].slice(0, limit)];
            });
        });
    };
    AnalyticsService.prototype.getCityAnalytics = function (timeRange, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock city analytics
                return [2 /*return*/, [
                        { city: 'New York', country: 'USA', clicks: 5000, conversions: 150, revenue: 7500.00 },
                        { city: 'Los Angeles', country: 'USA', clicks: 4000, conversions: 120, revenue: 6000.00 },
                        { city: 'Toronto', country: 'Canada', clicks: 3000, conversions: 90, revenue: 4500.00 },
                        { city: 'London', country: 'UK', clicks: 2500, conversions: 75, revenue: 3750.00 },
                        { city: 'Berlin', country: 'Germany', clicks: 2000, conversions: 60, revenue: 3000.00 }
                    ].slice(0, limit)];
            });
        });
    };
    AnalyticsService.prototype.getDeviceAnalytics = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock device analytics
                return [2 /*return*/, {
                        totalDevices: 3,
                        deviceBreakdown: [
                            { device: 'Desktop', clicks: 30000, conversions: 900, revenue: 45000.00 },
                            { device: 'Mobile', clicks: 15000, conversions: 450, revenue: 22500.00 },
                            { device: 'Tablet', clicks: 5000, conversions: 150, revenue: 7500.00 }
                        ]
                    }];
            });
        });
    };
    AnalyticsService.prototype.getDeviceTypeAnalytics = function (timeRange) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock device type analytics
                return [2 /*return*/, [
                        { device: 'Desktop', percentage: 60, clicks: 30000 },
                        { device: 'Mobile', percentage: 30, clicks: 15000 },
                        { device: 'Tablet', percentage: 10, clicks: 5000 }
                    ]];
            });
        });
    };
    AnalyticsService.prototype.getBrowserAnalytics = function (timeRange, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock browser analytics
                return [2 /*return*/, [
                        { browser: 'Chrome', clicks: 25000, conversions: 750, revenue: 37500.00 },
                        { browser: 'Safari', clicks: 15000, conversions: 450, revenue: 22500.00 },
                        { browser: 'Firefox', clicks: 8000, conversions: 240, revenue: 12000.00 },
                        { browser: 'Edge', clicks: 5000, conversions: 150, revenue: 7500.00 },
                        { browser: 'Other', clicks: 2000, conversions: 60, revenue: 3000.00 }
                    ].slice(0, limit)];
            });
        });
    };
    AnalyticsService.prototype.getCustomReports = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var reports;
            return __generator(this, function (_a) {
                reports = [
                    {
                        id: 'report_1',
                        name: 'Monthly Performance Report',
                        description: 'Comprehensive monthly performance analysis',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: 'report_2',
                        name: 'Affiliate Performance Report',
                        description: 'Detailed affiliate performance metrics',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];
                return [2 /*return*/, {
                        reports: reports,
                        pagination: {
                            page: page,
                            limit: limit,
                            total: reports.length,
                            pages: Math.ceil(reports.length / limit)
                        }
                    }];
            });
        });
    };
    AnalyticsService.prototype.createCustomReport = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock custom report creation
                return [2 /*return*/, __assign(__assign({ id: 'report_' + Date.now(), userId: userId }, data), { createdAt: new Date(), updatedAt: new Date() })];
            });
        });
    };
    AnalyticsService.prototype.updateCustomReport = function (reportId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock custom report update
                return [2 /*return*/, __assign(__assign({ id: reportId }, data), { updatedAt: new Date() })];
            });
        });
    };
    AnalyticsService.prototype.deleteCustomReport = function (reportId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock custom report deletion
                return [2 /*return*/, { success: true }];
            });
        });
    };
    AnalyticsService.prototype.exportReport = function (reportId, format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock report export
                return [2 /*return*/, {
                        reportId: reportId,
                        format: format,
                        downloadUrl: "/exports/report_".concat(reportId, ".").concat(format),
                        expiresAt: new Date(Date.now() + 3600000) // 1 hour
                    }];
            });
        });
    };
    return AnalyticsService;
}());
exports.AnalyticsService = AnalyticsService;
