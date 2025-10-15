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
var zod_1 = require("zod");
var router = express_1.default.Router();
var prisma = new client_1.PrismaClient();
// Get pending commissions
router.get("/pending", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, page, _c, limit, _d, status_1, affiliate, referralCodes, skip, commissions, total, formattedCommissions, error_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, , 6]);
                userId = req.user.id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, _d = _a.status, status_1 = _d === void 0 ? "PENDING" : _d;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _e.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _e.sent();
                skip = (parseInt(page) - 1) * parseInt(limit);
                return [4 /*yield*/, prisma.referralUsage.findMany({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            commissionAmount: { gt: 0 },
                        },
                        include: {
                            referralCode: true,
                        },
                        orderBy: { createdAt: "desc" },
                        skip: skip,
                        take: parseInt(limit),
                    })];
            case 3:
                commissions = _e.sent();
                return [4 /*yield*/, prisma.referralUsage.count({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            commissionAmount: { gt: 0 },
                        },
                    })];
            case 4:
                total = _e.sent();
                formattedCommissions = commissions.map(function (commission, index) { return ({
                    id: "COMM-".concat(String(commission.id).slice(-6).toUpperCase()),
                    date: commission.createdAt.toISOString().split("T")[0],
                    customer: commission.customerEmail || "Anonymous",
                    offer: commission.referralCode.code,
                    saleAmount: commission.orderValue || 0,
                    commissionRate: commission.referralCode.commissionRate,
                    commissionAmount: commission.commissionAmount || 0,
                    status: "pending",
                    expectedPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0], // 30 days from now
                    referralCode: commission.referralCode.code,
                    type: commission.type,
                }); });
                res.json({
                    data: formattedCommissions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: total,
                        pages: Math.ceil(total / parseInt(limit)),
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _e.sent();
                console.error("Error fetching pending commissions:", error_1);
                res.status(500).json({ error: "Failed to fetch pending commissions" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get payout history
router.get("/history", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, page, _c, limit, affiliate, skip, mockPayoutHistory, total, paginatedHistory, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                userId = req.user.id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _d.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                skip = (parseInt(page) - 1) * parseInt(limit);
                mockPayoutHistory = [
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
                total = mockPayoutHistory.length;
                paginatedHistory = mockPayoutHistory.slice(skip, skip + parseInt(limit));
                res.json({
                    data: paginatedHistory,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: total,
                        pages: Math.ceil(total / parseInt(limit)),
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _d.sent();
                console.error("Error fetching payout history:", error_2);
                res.status(500).json({ error: "Failed to fetch payout history" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get payout settings
router.get("/settings", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, affiliate, payoutSettings, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                payoutSettings = {
                    minimumPayout: 50.0,
                    payoutMethod: "PayPal",
                    payoutEmail: ((_a = affiliate.user) === null || _a === void 0 ? void 0 : _a.email) || "",
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
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Error fetching payout settings:", error_3);
                res.status(500).json({ error: "Failed to fetch payout settings" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update payout settings
router.put("/settings", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, settingsData, settingsSchema, validatedData, affiliate, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                userId = req.user.id;
                settingsData = req.body;
                settingsSchema = zod_1.z.object({
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
                validatedData = settingsSchema.parse(settingsData);
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                if (!(validatedData.payoutEmail !== ((_a = affiliate.user) === null || _a === void 0 ? void 0 : _a.email))) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.user.update({
                        where: { id: userId },
                        data: { email: validatedData.payoutEmail },
                    })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: 
            // Store payout settings in affiliate profile (you might want to create a separate table for this)
            return [4 /*yield*/, prisma.affiliateProfile.update({
                    where: { id: affiliate.id },
                    data: {
                        // Add payout settings fields to your schema if needed
                        updatedAt: new Date(),
                    },
                })];
            case 4:
                // Store payout settings in affiliate profile (you might want to create a separate table for this)
                _b.sent();
                res.json({ message: "Payout settings updated successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error("Error updating payout settings:", error_4);
                if (error_4 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Invalid input data", details: error_4.errors })];
                }
                res.status(500).json({ error: "Failed to update payout settings" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Request payout
router.post("/request-payout", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, reason, affiliate, referralCodes, totalPending, availableAmount, payoutRequest, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = req.user.id;
                _a = req.body, amount = _a.amount, reason = _a.reason;
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
                return [4 /*yield*/, prisma.referralUsage.aggregate({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            commissionAmount: { gt: 0 },
                        },
                        _sum: { commissionAmount: true },
                    })];
            case 3:
                totalPending = _b.sent();
                availableAmount = totalPending._sum.commissionAmount || 0;
                if (amount > availableAmount) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Requested amount exceeds available balance",
                            availableAmount: availableAmount,
                        })];
                }
                if (amount < 50) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Minimum payout amount is $50",
                            minimumAmount: 50,
                        })];
                }
                payoutRequest = {
                    id: "PAY-REQ-".concat(Date.now()),
                    affiliateId: affiliate.id,
                    amount: amount,
                    status: "pending",
                    requestedAt: new Date(),
                    reason: reason || "Payout request",
                };
                // In a real implementation, you would save this to a payout_requests table
                console.log("Payout request created:", payoutRequest);
                res.json({
                    message: "Payout request submitted successfully",
                    payoutRequest: payoutRequest,
                });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _b.sent();
                console.error("Error creating payout request:", error_5);
                res.status(500).json({ error: "Failed to create payout request" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Get commission analytics
router.get("/analytics", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, period, affiliate, referralCodes, now, startDate, _b, totalCommissions, totalAmount, statusBreakdown, dailyStats, days, i, date, startOfDay, endOfDay, dayCommissions, dayAmount, analytics, error_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                userId = req.user.id;
                _a = req.query.period, period = _a === void 0 ? "30d" : _a;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _c.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                    })];
            case 2:
                referralCodes = _c.sent();
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
                return [4 /*yield*/, Promise.all([
                        // Total commissions
                        prisma.referralUsage.count({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate },
                                commissionAmount: { gt: 0 },
                            },
                        }),
                        // Total amount
                        prisma.referralUsage.aggregate({
                            where: {
                                referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                                createdAt: { gte: startDate },
                                commissionAmount: { gt: 0 },
                            },
                            _sum: { commissionAmount: true },
                        }),
                        // Status breakdown (mock data for now)
                        Promise.resolve([
                            { status: "PENDING", _sum: { amount: 125.5 }, _count: { id: 8 } },
                            { status: "APPROVED", _sum: { amount: 450.75 }, _count: { id: 12 } },
                            { status: "PAID", _sum: { amount: 320.25 }, _count: { id: 15 } },
                        ]),
                    ])];
            case 3:
                _b = _c.sent(), totalCommissions = _b[0], totalAmount = _b[1], statusBreakdown = _b[2];
                dailyStats = [];
                days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
                i = days - 1;
                _c.label = 4;
            case 4:
                if (!(i >= 0)) return [3 /*break*/, 8];
                date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                startOfDay = new Date(date.setHours(0, 0, 0, 0));
                endOfDay = new Date(date.setHours(23, 59, 59, 999));
                return [4 /*yield*/, prisma.referralUsage.count({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            createdAt: { gte: startOfDay, lte: endOfDay },
                            commissionAmount: { gt: 0 },
                        },
                    })];
            case 5:
                dayCommissions = _c.sent();
                return [4 /*yield*/, prisma.referralUsage.aggregate({
                        where: {
                            referralCodeId: { in: referralCodes.map(function (code) { return code.id; }) },
                            createdAt: { gte: startOfDay, lte: endOfDay },
                            commissionAmount: { gt: 0 },
                        },
                        _sum: { commissionAmount: true },
                    })];
            case 6:
                dayAmount = _c.sent();
                dailyStats.push({
                    createdAt: startOfDay.toISOString(),
                    _sum: { amount: dayAmount._sum.commissionAmount || 0 },
                    _count: { id: dayCommissions },
                });
                _c.label = 7;
            case 7:
                i--;
                return [3 /*break*/, 4];
            case 8:
                analytics = {
                    period: period,
                    totalCommissions: totalCommissions,
                    totalAmount: totalAmount._sum.commissionAmount || 0,
                    statusBreakdown: statusBreakdown,
                    dailyStats: dailyStats,
                    topAffiliates: [], // This would be relevant for admin, not affiliate
                };
                res.json(analytics);
                return [3 /*break*/, 10];
            case 9:
                error_6 = _c.sent();
                console.error("Error fetching commission analytics:", error_6);
                res.status(500).json({ error: "Failed to fetch commission analytics" });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
