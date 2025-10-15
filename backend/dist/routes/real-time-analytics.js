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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("@prisma/client");
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Get real-time metrics
router.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var now, lastHour, lastDay, activeUsers, liveClicks, liveConversions, liveRevenueResult, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                now = new Date();
                lastHour = new Date(now.getTime() - 60 * 60 * 1000);
                lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.groupBy({
                        by: ['ipAddress'],
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        },
                        _count: {
                            ipAddress: true
                        }
                    })];
            case 1:
                activeUsers = _a.sent();
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        }
                    })];
            case 2:
                liveClicks = _a.sent();
                return [4 /*yield*/, prisma.conversion.count({
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        }
                    })];
            case 3:
                liveConversions = _a.sent();
                return [4 /*yield*/, prisma.conversion.aggregate({
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        },
                        _sum: {
                            customerValue: true
                        }
                    })];
            case 4:
                liveRevenueResult = _a.sent();
                res.json({
                    activeUsers: activeUsers.length,
                    liveClicks: liveClicks,
                    liveConversions: liveConversions,
                    liveRevenue: liveRevenueResult._sum.customerValue || 0
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('Error fetching real-time metrics:', error_1);
                res.status(500).json({ error: 'Failed to fetch real-time metrics' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get live activity feed
router.get('/activity', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, limit, lastHour, recentClicks, recentConversions, activity, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query.limit, limit = _a === void 0 ? 20 : _a;
                lastHour = new Date(Date.now() - 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.findMany({
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        },
                        include: {
                            affiliate: {
                                select: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true
                                        }
                                    }
                                }
                            },
                            // affiliateLink relation not available in Click model
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: Number(limit) / 2
                    })];
            case 1:
                recentClicks = _b.sent();
                return [4 /*yield*/, prisma.conversion.findMany({
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        },
                        include: {
                            affiliate: {
                                select: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true
                                        }
                                    }
                                }
                            },
                            offer: {
                                select: {
                                    name: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: Number(limit) / 2
                    })];
            case 2:
                recentConversions = _b.sent();
                activity = __spreadArray(__spreadArray([], recentClicks.map(function (click) {
                    var _a;
                    return ({
                        id: "click-".concat(click.id),
                        type: 'click',
                        user: ((_a = click.affiliate) === null || _a === void 0 ? void 0 : _a.user) ? "".concat(click.affiliate.user.firstName, " ").concat(click.affiliate.user.lastName) : 'Anonymous',
                        action: "Clicked link",
                        timestamp: click.createdAt,
                        location: "".concat(click.city || 'Unknown', ", ").concat(click.country || 'Unknown'),
                        device: click.device || 'Unknown',
                        status: 'success'
                    });
                }), true), recentConversions.map(function (conversion) { return ({
                    id: "conversion-".concat(conversion.id),
                    type: 'conversion',
                    user: 'Anonymous', // affiliate relation not included
                    action: "Converted",
                    timestamp: conversion.createdAt,
                    location: 'Unknown', // Conversion doesn't have location data
                    device: 'Unknown', // Conversion doesn't have device data
                    status: 'success'
                }); }), true);
                // Sort by timestamp and limit
                activity.sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); });
                res.json(activity.slice(0, Number(limit)));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Error fetching live activity:', error_2);
                res.status(500).json({ error: 'Failed to fetch live activity' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get geographic data
router.get('/geography', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lastHour, countryStats, totalClicks_1, topCountries, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                lastHour = new Date(Date.now() - 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.groupBy({
                        by: ['country'],
                        where: {
                            createdAt: {
                                gte: lastHour
                            },
                            country: {
                                not: null
                            }
                        },
                        _count: {
                            country: true
                        },
                        orderBy: {
                            _count: {
                                country: 'desc'
                            }
                        },
                        take: 5
                    })];
            case 1:
                countryStats = _a.sent();
                totalClicks_1 = countryStats.reduce(function (sum, country) { return sum + country._count.country; }, 0);
                topCountries = countryStats.map(function (country) { return ({
                    country: country.country,
                    clicks: country._count.country,
                    percentage: totalClicks_1 > 0 ? Math.round((country._count.country / totalClicks_1) * 100) : 0
                }); });
                res.json({ topCountries: topCountries });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching geography data:', error_3);
                res.status(500).json({ error: 'Failed to fetch geography data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get device data
router.get('/devices', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lastHour, deviceStats, totalClicks_2, topDevices, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                lastHour = new Date(Date.now() - 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.groupBy({
                        by: ['device'],
                        where: {
                            createdAt: {
                                gte: lastHour
                            },
                            device: {
                                not: null
                            }
                        },
                        _count: {
                            device: true
                        },
                        orderBy: {
                            _count: {
                                device: 'desc'
                            }
                        }
                    })];
            case 1:
                deviceStats = _a.sent();
                totalClicks_2 = deviceStats.reduce(function (sum, device) { return sum + device._count.device; }, 0);
                topDevices = deviceStats.map(function (device) { return ({
                    device: device.device,
                    clicks: device._count.device,
                    percentage: totalClicks_2 > 0 ? Math.round((device._count.device / totalClicks_2) * 100) : 0
                }); });
                res.json({ topDevices: topDevices });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error fetching device data:', error_4);
                res.status(500).json({ error: 'Failed to fetch device data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get browser data
router.get('/browsers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lastHour, browserStats, totalClicks_3, topBrowsers, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                lastHour = new Date(Date.now() - 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.groupBy({
                        by: ['browser'],
                        where: {
                            createdAt: {
                                gte: lastHour
                            },
                            browser: {
                                not: null
                            }
                        },
                        _count: {
                            browser: true
                        },
                        orderBy: {
                            _count: {
                                browser: 'desc'
                            }
                        }
                    })];
            case 1:
                browserStats = _a.sent();
                totalClicks_3 = browserStats.reduce(function (sum, browser) { return sum + browser._count.browser; }, 0);
                topBrowsers = browserStats.map(function (browser) { return ({
                    browser: browser.browser,
                    clicks: browser._count.browser,
                    percentage: totalClicks_3 > 0 ? Math.round((browser._count.browser / totalClicks_3) * 100) : 0
                }); });
                res.json({ topBrowsers: topBrowsers });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error fetching browser data:', error_5);
                res.status(500).json({ error: 'Failed to fetch browser data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get fraud alerts
router.get('/fraud-alerts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var now, lastHour, suspiciousIPs, currentHourClicks, previousHour, previousHourClicks, alerts, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                now = new Date();
                lastHour = new Date(now.getTime() - 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.groupBy({
                        by: ['ipAddress'],
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        },
                        _count: {
                            ipAddress: true
                        },
                        having: {
                            ipAddress: {
                                _count: {
                                    gt: 50 // More than 50 clicks in an hour
                                }
                            }
                        }
                    })];
            case 1:
                suspiciousIPs = _a.sent();
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: {
                                gte: lastHour
                            }
                        }
                    })];
            case 2:
                currentHourClicks = _a.sent();
                previousHour = new Date(now.getTime() - 2 * 60 * 60 * 1000);
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: {
                                gte: previousHour,
                                lt: lastHour
                            }
                        }
                    })];
            case 3:
                previousHourClicks = _a.sent();
                alerts = [];
                if (suspiciousIPs.length > 0) {
                    alerts.push({
                        type: 'suspicious_pattern',
                        title: 'Suspicious Click Pattern',
                        message: "".concat(suspiciousIPs.length, " IP addresses with unusual click patterns detected"),
                        severity: 'high',
                        createdAt: new Date()
                    });
                }
                if (previousHourClicks > 0 && (currentHourClicks / previousHourClicks) > 3) {
                    alerts.push({
                        type: 'traffic_spike',
                        title: 'Unusual Traffic Spike',
                        message: "Traffic increased by ".concat(Math.round((currentHourClicks / previousHourClicks - 1) * 100), "% in the last hour"),
                        severity: 'medium',
                        createdAt: new Date()
                    });
                }
                res.json({ alerts: alerts });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error('Error fetching fraud alerts:', error_6);
                res.status(500).json({ error: 'Failed to fetch fraud alerts' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
