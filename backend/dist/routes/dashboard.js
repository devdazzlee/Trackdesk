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
// Dashboard Overview API
router.get("/overview", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, now, thirtyDaysAgo, sevenDaysAgo, affiliate, referralCodes, _a, totalReferrals, totalCommissions, recentActivity_1, pendingCommissions, totalClicks, conversionRate, topLinks, dailyStats, i, date, startOfDay, endOfDay, dayReferrals, dayCommissions, overview, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                userId = req.user.id;
                now = new Date();
                thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                        include: {
                            user: true,
                        },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _b.sent();
                return [4 /*yield*/, Promise.all([
                        // Total referrals in last 30 days
                        prisma.referralUsage.count({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: thirtyDaysAgo },
                            },
                        }),
                        // Total commissions in last 30 days
                        prisma.referralUsage.aggregate({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: thirtyDaysAgo },
                            },
                            _sum: { commissionAmount: true },
                        }),
                        // Recent activity (last 10 activities)
                        prisma.referralUsage.findMany({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            },
                            include: {
                                referralCode: true,
                            },
                            orderBy: { createdAt: "desc" },
                            take: 10,
                        }),
                    ])];
            case 3:
                _a = _b.sent(), totalReferrals = _a[0], totalCommissions = _a[1], recentActivity_1 = _a[2];
                return [4 /*yield*/, prisma.referralUsage.aggregate({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            commissionAmount: { gt: 0 },
                        },
                        _sum: { commissionAmount: true },
                    })];
            case 4:
                pendingCommissions = _b.sent();
                totalClicks = referralCodes.reduce(function (sum, code) { return sum + (code.currentUses || 0); }, 0);
                conversionRate = totalClicks > 0 ? (totalReferrals / totalClicks) * 100 : 0;
                topLinks = referralCodes
                    .map(function (code) { return ({
                    id: code.id,
                    name: code.code,
                    clicks: code.currentUses || 0,
                    conversions: recentActivity_1.filter(function (activity) { return activity.referralCodeId === code.id; }).length,
                    earnings: recentActivity_1
                        .filter(function (activity) { return activity.referralCodeId === code.id; })
                        .reduce(function (sum, activity) { return sum + (activity.commissionAmount || 0); }, 0),
                    status: code.isActive ? "Active" : "Inactive",
                }); })
                    .sort(function (a, b) { return b.earnings - a.earnings; })
                    .slice(0, 5);
                dailyStats = [];
                i = 6;
                _b.label = 5;
            case 5:
                if (!(i >= 0)) return [3 /*break*/, 9];
                date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                startOfDay = new Date(date.setHours(0, 0, 0, 0));
                endOfDay = new Date(date.setHours(23, 59, 59, 999));
                return [4 /*yield*/, prisma.referralUsage.count({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            createdAt: { gte: startOfDay, lte: endOfDay },
                        },
                    })];
            case 6:
                dayReferrals = _b.sent();
                return [4 /*yield*/, prisma.referralUsage.aggregate({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            createdAt: { gte: startOfDay, lte: endOfDay },
                        },
                        _sum: { commissionAmount: true },
                    })];
            case 7:
                dayCommissions = _b.sent();
                dailyStats.push({
                    date: startOfDay.toISOString().split("T")[0],
                    referrals: dayReferrals,
                    commissions: dayCommissions._sum.commissionAmount || 0,
                });
                _b.label = 8;
            case 8:
                i--;
                return [3 /*break*/, 5];
            case 9:
                overview = {
                    totalReferrals: totalReferrals,
                    totalCommissions: totalCommissions._sum.commissionAmount || 0,
                    pendingCommissions: pendingCommissions._sum.commissionAmount || 0,
                    conversionRate: Math.round(conversionRate * 10) / 10,
                    activeCodes: referralCodes.filter(function (code) { return code.isActive; }).length,
                    totalCodes: referralCodes.length,
                    topLinks: topLinks,
                    recentActivity: recentActivity_1.map(function (activity) {
                        var _a;
                        return ({
                            id: activity.id,
                            type: "conversion",
                            description: "New ".concat(activity.type.toLowerCase(), " conversion"),
                            amount: "+$".concat(((_a = activity.commissionAmount) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || "0.00"),
                            time: formatTimeAgo(activity.createdAt),
                            status: "success",
                        });
                    }),
                    dailyStats: dailyStats,
                };
                res.json(overview);
                return [3 /*break*/, 11];
            case 10:
                error_1 = _b.sent();
                console.error("Error fetching dashboard overview:", error_1);
                res.status(500).json({ error: "Failed to fetch dashboard overview" });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// Real-time stats API
router.get("/real-time-stats", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, now, oneHourAgo, affiliate, referralCodes, _a, activeUsers, liveClicks, liveConversions, liveRevenue, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = req.user.id;
                now = new Date();
                oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _b.sent();
                return [4 /*yield*/, Promise.all([
                        // Active users (unique IPs in last hour)
                        prisma.affiliateClick
                            .groupBy({
                            by: ["ipAddress"],
                            where: {
                                affiliateId: affiliate.id,
                                createdAt: { gte: oneHourAgo },
                            },
                        })
                            .then(function (result) { return result.length; }),
                        // Live clicks in last hour
                        prisma.affiliateClick.count({
                            where: {
                                affiliateId: affiliate.id,
                                createdAt: { gte: oneHourAgo },
                            },
                        }),
                        // Live conversions in last hour
                        prisma.referralUsage.count({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: oneHourAgo },
                            },
                        }),
                        // Live revenue in last hour
                        prisma.referralUsage.aggregate({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: oneHourAgo },
                            },
                            _sum: { commissionAmount: true },
                        }),
                    ])];
            case 3:
                _a = _b.sent(), activeUsers = _a[0], liveClicks = _a[1], liveConversions = _a[2], liveRevenue = _a[3];
                res.json({
                    activeUsers: activeUsers,
                    liveClicks: liveClicks,
                    liveConversions: liveConversions,
                    liveRevenue: liveRevenue._sum.commissionAmount || 0,
                    timestamp: now,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Error fetching real-time stats:", error_2);
                res.status(500).json({ error: "Failed to fetch real-time stats" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Recent activity API
router.get("/recent-activity", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, limit, affiliate, referralCodes, recentActivity, formattedActivity, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = req.user.id;
                limit = parseInt(req.query.limit) || 10;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _a.sent();
                return [4 /*yield*/, prisma.referralUsage.findMany({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                        },
                        include: {
                            referralCode: true,
                        },
                        orderBy: { createdAt: "desc" },
                        take: limit,
                    })];
            case 3:
                recentActivity = _a.sent();
                formattedActivity = recentActivity.map(function (activity) {
                    var _a;
                    return ({
                        id: activity.id,
                        type: "conversion",
                        description: "New ".concat(activity.type.toLowerCase(), " conversion"),
                        amount: "+$".concat(((_a = activity.commissionAmount) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || "0.00"),
                        time: formatTimeAgo(activity.createdAt),
                        status: "success",
                        details: {
                            referralCode: activity.referralCode.code,
                            type: activity.type,
                            commissionAmount: activity.commissionAmount,
                        },
                    });
                });
                res.json(formattedActivity);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error("Error fetching recent activity:", error_3);
                res.status(500).json({ error: "Failed to fetch recent activity" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Top links API
router.get("/top-links", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, limit, affiliate, referralCodes, topLinks, sortedTopLinks, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = req.user.id;
                limit = parseInt(req.query.limit) || 5;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _a.sent();
                return [4 /*yield*/, Promise.all(referralCodes.map(function (code) { return __awaiter(void 0, void 0, void 0, function () {
                        var conversions, earnings;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.referralUsage.count({
                                        where: { referralCodeId: code.id },
                                    })];
                                case 1:
                                    conversions = _a.sent();
                                    return [4 /*yield*/, prisma.referralUsage.aggregate({
                                            where: { referralCodeId: code.id },
                                            _sum: { commissionAmount: true },
                                        })];
                                case 2:
                                    earnings = _a.sent();
                                    return [2 /*return*/, {
                                            id: code.id,
                                            name: code.code,
                                            clicks: code.currentUses || 0,
                                            conversions: conversions,
                                            earnings: earnings._sum.commissionAmount || 0,
                                            status: code.isActive ? "Active" : "Inactive",
                                            commissionRate: code.commissionRate,
                                            type: code.type,
                                        }];
                            }
                        });
                    }); }))];
            case 3:
                topLinks = _a.sent();
                sortedTopLinks = topLinks
                    .sort(function (a, b) { return b.earnings - a.earnings; })
                    .slice(0, limit);
                res.json(sortedTopLinks);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error fetching top links:", error_4);
                res.status(500).json({ error: "Failed to fetch top links" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Helper function to format time ago
function formatTimeAgo(date) {
    var now = new Date();
    var diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return "".concat(diffInSeconds, " seconds ago");
    }
    else if (diffInSeconds < 3600) {
        var minutes = Math.floor(diffInSeconds / 60);
        return "".concat(minutes, " minute").concat(minutes > 1 ? "s" : "", " ago");
    }
    else if (diffInSeconds < 86400) {
        var hours = Math.floor(diffInSeconds / 3600);
        return "".concat(hours, " hour").concat(hours > 1 ? "s" : "", " ago");
    }
    else {
        var days = Math.floor(diffInSeconds / 86400);
        return "".concat(days, " day").concat(days > 1 ? "s" : "", " ago");
    }
}
exports.default = router;
