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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var zod_1 = require("zod");
var auth_1 = require("../middleware/auth");
var ReferralSystem_1 = require("../models/ReferralSystem");
var prisma_1 = require("../lib/prisma");
var router = express_1.default.Router();
// Get affiliate's referral codes
router.get("/codes", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var affiliate, referralCodes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (req.user.role !== "AFFILIATE") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only affiliates can access referral codes" })];
                }
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findUnique({
                        where: { userId: req.user.id },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, ReferralSystem_1.ReferralSystemModel.getAffiliateReferralCodes(affiliate.id)];
            case 2:
                referralCodes = _a.sent();
                res.json(referralCodes);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching referral codes:", error_1);
                res.status(500).json({ error: "Failed to fetch referral codes" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Generate new referral code
router.post("/codes", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, data, affiliate, expiresAtDate, referralCode, error_2, errorMessages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (req.user.role !== "AFFILIATE") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only affiliates can create referral codes" })];
                }
                schema = zod_1.z.object({
                    type: zod_1.z.enum(["SIGNUP", "PRODUCT", "BOTH"]),
                    commissionRate: zod_1.z.number().min(0).max(100),
                    productId: zod_1.z.string().optional(),
                    maxUses: zod_1.z.number().positive().optional(),
                    expiresAt: zod_1.z.string().optional(),
                });
                data = schema.parse(req.body);
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findUnique({
                        where: { userId: req.user.id },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                // Validate commission rate against affiliate's tier limits
                if (data.commissionRate > affiliate.commissionRate) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Commission rate cannot exceed your tier limit of ".concat(affiliate.commissionRate, "%"),
                        })];
                }
                expiresAtDate = void 0;
                if (data.expiresAt && data.expiresAt.trim() !== "") {
                    try {
                        expiresAtDate = new Date(data.expiresAt);
                        // Validate that the date is valid
                        if (isNaN(expiresAtDate.getTime())) {
                            return [2 /*return*/, res.status(400).json({
                                    error: "Invalid expiration date format. Please use a valid date.",
                                })];
                        }
                    }
                    catch (error) {
                        return [2 /*return*/, res.status(400).json({
                                error: "Invalid expiration date format. Please use a valid date.",
                            })];
                    }
                }
                return [4 /*yield*/, ReferralSystem_1.ReferralSystemModel.generateReferralCode(affiliate.id, __assign(__assign({}, data), { expiresAt: expiresAtDate }))];
            case 2:
                referralCode = _a.sent();
                res.status(201).json(referralCode);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error creating referral code:", error_2);
                // Handle specific Zod validation errors
                if (error_2 instanceof zod_1.z.ZodError) {
                    errorMessages = error_2.errors.map(function (err) { return "".concat(err.path.join("."), ": ").concat(err.message); });
                    return [2 /*return*/, res.status(400).json({
                            error: "Validation error",
                            details: errorMessages,
                        })];
                }
                res.status(400).json({ error: "Failed to create referral code" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get referral statistics
router.get("/stats", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var affiliate, stats, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (req.user.role !== "AFFILIATE") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only affiliates can access referral stats" })];
                }
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findUnique({
                        where: { userId: req.user.id },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, ReferralSystem_1.ReferralSystemModel.getReferralStats(affiliate.id)];
            case 2:
                stats = _a.sent();
                res.json(stats);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching referral stats:", error_3);
                res.status(500).json({ error: "Failed to fetch referral stats" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Generate shareable links
router.post("/shareable-links", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, platforms, affiliate, shareableData, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (req.user.role !== "AFFILIATE") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only affiliates can generate shareable links" })];
                }
                schema = zod_1.z.object({
                    platforms: zod_1.z.array(zod_1.z.string()).optional(),
                });
                platforms = schema.parse(req.body).platforms;
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findUnique({
                        where: { userId: req.user.id },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, ReferralSystem_1.ReferralSystemModel.generateShareableLinks(affiliate.id, platforms)];
            case 2:
                shareableData = _a.sent();
                res.json(shareableData);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error generating shareable links:", error_4);
                res.status(500).json({ error: "Failed to generate shareable links" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Process referral (public endpoint - called when someone uses a referral code)
router.post("/process", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, data, referralUsage, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                schema = zod_1.z.object({
                    code: zod_1.z.string(),
                    userId: zod_1.z.string(),
                    type: zod_1.z.enum(["SIGNUP", "PURCHASE"]),
                    productId: zod_1.z.string().optional(),
                    orderValue: zod_1.z.number().positive().optional(),
                });
                data = schema.parse(req.body);
                return [4 /*yield*/, ReferralSystem_1.ReferralSystemModel.processReferral(data.code, data.userId, data.type, {
                        productId: data.productId,
                        orderValue: data.orderValue,
                    })];
            case 1:
                referralUsage = _a.sent();
                res.status(201).json(referralUsage);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error processing referral:", error_5);
                res
                    .status(400)
                    .json({ error: error_5.message || "Failed to process referral" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Validate referral code (public endpoint)
router.get("/validate/:code", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, referralCode, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                code = req.params.code;
                return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                        where: {
                            code: code,
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
                    })];
            case 1:
                referralCode = _a.sent();
                if (!referralCode) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "Invalid or expired referral code" })];
                }
                // Check if max uses reached
                if (referralCode.maxUses &&
                    referralCode.currentUses >= referralCode.maxUses) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Referral code usage limit reached" })];
                }
                res.json({
                    valid: true,
                    code: referralCode.code,
                    type: referralCode.type,
                    commissionRate: referralCode.commissionRate,
                    affiliateName: "".concat(referralCode.affiliate.user.firstName, " ").concat(referralCode.affiliate.user.lastName),
                    remainingUses: referralCode.maxUses
                        ? referralCode.maxUses - referralCode.currentUses
                        : null,
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error validating referral code:", error_6);
                res.status(500).json({ error: "Failed to validate referral code" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Admin endpoints
router.get("/admin/stats", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, totalReferralCodes, totalReferrals, totalCommissions, topAffiliates, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (req.user.role !== "ADMIN") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only admins can access global referral stats" })];
                }
                return [4 /*yield*/, Promise.all([
                        prisma_1.prisma.referralCode.count(),
                        prisma_1.prisma.referralUsage.count(),
                        prisma_1.prisma.referralUsage.aggregate({
                            _sum: { commissionAmount: true },
                        }),
                        prisma_1.prisma.referralUsage.groupBy({
                            by: ["referralCodeId"],
                            _sum: { commissionAmount: true },
                            _count: { id: true },
                            orderBy: { _sum: { commissionAmount: true } },
                            take: 10,
                        }),
                    ])];
            case 1:
                _a = _b.sent(), totalReferralCodes = _a[0], totalReferrals = _a[1], totalCommissions = _a[2], topAffiliates = _a[3];
                res.json({
                    totalReferralCodes: totalReferralCodes,
                    totalReferrals: totalReferrals,
                    totalCommissions: totalCommissions._sum.commissionAmount || 0,
                    topAffiliates: topAffiliates,
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                console.error("Error fetching admin referral stats:", error_7);
                res.status(500).json({ error: "Failed to fetch admin referral stats" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get referral analytics
router.get("/analytics", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, period, affiliate, now, startDate, referralCodes, usageData_1, analytics, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (req.user.role !== "AFFILIATE") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only affiliates can access referral analytics" })];
                }
                _a = req.query.period, period = _a === void 0 ? "30d" : _a;
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findUnique({
                        where: { userId: req.user.id },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
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
                return [4 /*yield*/, ReferralSystem_1.ReferralSystemModel.getAffiliateReferralCodes(affiliate.id)];
            case 2:
                referralCodes = _b.sent();
                return [4 /*yield*/, prisma_1.prisma.referralUsage.findMany({
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
                    })];
            case 3:
                usageData_1 = _b.sent();
                analytics = {
                    totalReferrals: usageData_1.length,
                    totalCommissions: usageData_1.reduce(function (sum, usage) { return sum + (usage.commissionAmount || 0); }, 0),
                    conversionRate: referralCodes.length > 0
                        ? (usageData_1.length /
                            referralCodes.reduce(function (sum, code) { return sum + (code.currentUses || 0); }, 0)) *
                            100
                        : 0,
                    topProducts: referralCodes
                        .map(function (code) { return ({
                        productId: code.id,
                        productName: code.code,
                        referrals: code.currentUses || 0,
                        commissions: usageData_1
                            .filter(function (usage) { return usage.referralCodeId === code.id; })
                            .reduce(function (sum, usage) { return sum + (usage.commissionAmount || 0); }, 0),
                    }); })
                        .sort(function (a, b) { return b.commissions - a.commissions; })
                        .slice(0, 5),
                    dailyStats: [
                        // Generate sample daily stats for the last 7 days
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
                return [3 /*break*/, 5];
            case 4:
                error_8 = _b.sent();
                console.error("Error fetching referral analytics:", error_8);
                res.status(500).json({ error: "Failed to fetch referral analytics" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
