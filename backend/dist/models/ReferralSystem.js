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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralSystemModel = void 0;
var prisma_1 = require("../lib/prisma");
var ReferralSystemModel = /** @class */ (function () {
    function ReferralSystemModel() {
    }
    /**
     * Generate a unique referral code for an affiliate
     */
    ReferralSystemModel.generateReferralCode = function (affiliateId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var code, attempts, existing, referralCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempts = 0;
                        _a.label = 1;
                    case 1:
                        if (data.productId) {
                            // Product-specific code: PRODUCT_ABC123
                            code = "PROD_".concat(Math.random().toString(36).substring(2, 8).toUpperCase());
                        }
                        else {
                            // General affiliate code: AFF_ABC123
                            code = "AFF_".concat(Math.random().toString(36).substring(2, 8).toUpperCase());
                        }
                        return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                                where: { code: code },
                            })];
                    case 2:
                        existing = _a.sent();
                        if (!existing)
                            return [3 /*break*/, 4];
                        attempts++;
                        _a.label = 3;
                    case 3:
                        if (attempts < 10) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        if (attempts >= 10) {
                            throw new Error("Unable to generate unique referral code");
                        }
                        return [4 /*yield*/, prisma_1.prisma.referralCode.create({
                                data: {
                                    affiliateId: affiliateId,
                                    code: code,
                                    type: data.type,
                                    commissionRate: data.commissionRate,
                                    productId: data.productId,
                                    maxUses: data.maxUses,
                                    expiresAt: data.expiresAt,
                                    isActive: true,
                                    currentUses: 0,
                                },
                            })];
                    case 5:
                        referralCode = _a.sent();
                        return [2 /*return*/, referralCode];
                }
            });
        });
    };
    /**
     * Process a referral usage (signup or purchase)
     */
    ReferralSystemModel.processReferral = function (code, userId, type, data) {
        return __awaiter(this, void 0, void 0, function () {
            var referralCode, commissionAmount, referralUsage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                            where: {
                                code: code,
                                isActive: true,
                                OR: [{ type: type }, { type: "BOTH" }],
                                AND: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
                            },
                            include: {
                                affiliate: true,
                            },
                        })];
                    case 1:
                        referralCode = _a.sent();
                        if (!referralCode) {
                            throw new Error("Invalid or expired referral code");
                        }
                        // Check if max uses reached
                        if (referralCode.maxUses &&
                            referralCode.currentUses >= referralCode.maxUses) {
                            throw new Error("Referral code usage limit reached");
                        }
                        // Check if product-specific code matches
                        if (referralCode.productId && (data === null || data === void 0 ? void 0 : data.productId) !== referralCode.productId) {
                            throw new Error("Referral code not valid for this product");
                        }
                        commissionAmount = 0;
                        if (type === "PRODUCT" && (data === null || data === void 0 ? void 0 : data.orderValue)) {
                            commissionAmount = (data.orderValue * referralCode.commissionRate) / 100;
                        }
                        else if (type === "SIGNUP") {
                            // Fixed signup bonus
                            commissionAmount = 5.0; // $5 signup bonus
                        }
                        return [4 /*yield*/, prisma_1.prisma.referralUsage.create({
                                data: {
                                    referralCodeId: referralCode.id,
                                    userId: userId,
                                    type: type,
                                    productId: data === null || data === void 0 ? void 0 : data.productId,
                                    orderValue: data === null || data === void 0 ? void 0 : data.orderValue,
                                    commissionAmount: commissionAmount,
                                    status: "PENDING",
                                },
                            })];
                    case 2:
                        referralUsage = _a.sent();
                        // Update referral code usage count
                        return [4 /*yield*/, prisma_1.prisma.referralCode.update({
                                where: { id: referralCode.id },
                                data: { currentUses: { increment: 1 } },
                            })];
                    case 3:
                        // Update referral code usage count
                        _a.sent();
                        if (!(commissionAmount > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, prisma_1.prisma.affiliateProfile.update({
                                where: { id: referralCode.affiliateId },
                                data: {
                                    totalEarnings: { increment: commissionAmount },
                                    totalConversions: { increment: 1 },
                                },
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: 
                    // Note: Commission creation requires a conversion record in the database
                    // For now, we track the commission amount in the referralUsage
                    // Admin can manually create commission records from the referral usages
                    return [2 /*return*/, referralUsage];
                }
            });
        });
    };
    /**
     * Get referral statistics for an affiliate
     */
    ReferralSystemModel.getReferralStats = function (affiliateId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, referralUsages, commissions, totalReferrals, totalCommissions, pendingCommissions, uniqueUsers, conversionRate, productStats, topProducts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            prisma_1.prisma.referralUsage.findMany({
                                where: {
                                    referralCode: { affiliateId: affiliateId },
                                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
                                },
                                include: {
                                    referralCode: true,
                                },
                            }),
                            prisma_1.prisma.commission.findMany({
                                where: { affiliateId: affiliateId },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), referralUsages = _a[0], commissions = _a[1];
                        totalReferrals = referralUsages.length;
                        totalCommissions = commissions
                            .filter(function (c) { return c.status === "PAID"; })
                            .reduce(function (sum, c) { return sum + c.amount; }, 0);
                        pendingCommissions = commissions
                            .filter(function (c) { return c.status === "PENDING"; })
                            .reduce(function (sum, c) { return sum + c.amount; }, 0);
                        uniqueUsers = new Set(referralUsages.map(function (r) { return r.userId; })).size;
                        conversionRate = totalReferrals > 0 ? (uniqueUsers / totalReferrals) * 100 : 0;
                        productStats = referralUsages
                            .filter(function (r) { return r.productId; })
                            .reduce(function (acc, r) {
                            if (!acc[r.productId]) {
                                acc[r.productId] = {
                                    productId: r.productId,
                                    referrals: 0,
                                    commissions: 0,
                                };
                            }
                            acc[r.productId].referrals++;
                            acc[r.productId].commissions += r.commissionAmount;
                            return acc;
                        }, {});
                        topProducts = Object.values(productStats)
                            .sort(function (a, b) { return b.commissions - a.commissions; })
                            .slice(0, 5);
                        return [2 /*return*/, {
                                totalReferrals: totalReferrals,
                                totalCommissions: totalCommissions,
                                pendingCommissions: pendingCommissions,
                                conversionRate: conversionRate,
                                topProducts: topProducts,
                            }];
                }
            });
        });
    };
    /**
     * Get all referral codes for an affiliate
     */
    ReferralSystemModel.getAffiliateReferralCodes = function (affiliateId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.referralCode.findMany({
                            where: { affiliateId: affiliateId },
                            orderBy: { createdAt: "desc" },
                            include: {
                                _count: {
                                    select: { usages: true },
                                },
                            },
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Generate shareable affiliate links with referral codes
     */
    ReferralSystemModel.generateShareableLinks = function (affiliateId_1) {
        return __awaiter(this, arguments, void 0, function (affiliateId, platforms) {
            var affiliate, baseUrl, links, generalCode;
            if (platforms === void 0) { platforms = [
                "facebook",
                "twitter",
                "instagram",
                "linkedin",
                "tiktok",
            ]; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findUnique({
                            where: { id: affiliateId },
                            include: { user: true },
                        })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new Error("Affiliate not found");
                        }
                        baseUrl = process.env.FRONTEND_URL || "https://trackdesk.com";
                        links = {};
                        return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                                where: {
                                    affiliateId: affiliateId,
                                    type: "BOTH",
                                    isActive: true,
                                },
                                orderBy: {
                                    createdAt: "desc", // Get the most recently created code
                                },
                            })];
                    case 2:
                        generalCode = (_a.sent());
                        if (!!generalCode) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.generateReferralCode(affiliateId, {
                                type: "BOTH",
                                commissionRate: affiliate.commissionRate,
                            })];
                    case 3:
                        generalCode = _a.sent();
                        _a.label = 4;
                    case 4:
                        // Generate platform-specific links
                        platforms.forEach(function (platform) {
                            var trackingParams = new URLSearchParams({
                                ref: (generalCode === null || generalCode === void 0 ? void 0 : generalCode.code) || "",
                                utm_source: platform,
                                utm_medium: "affiliate",
                                utm_campaign: "".concat(affiliate.user.firstName, "_").concat(affiliate.user.lastName).toLowerCase(),
                            });
                            links[platform] = "".concat(baseUrl, "/signup?").concat(trackingParams.toString());
                        });
                        return [2 /*return*/, {
                                referralCode: (generalCode === null || generalCode === void 0 ? void 0 : generalCode.code) || "",
                                links: links,
                                qrCode: "".concat(baseUrl, "/qr/").concat((generalCode === null || generalCode === void 0 ? void 0 : generalCode.code) || ""), // QR code for easy sharing
                            }];
                }
            });
        });
    };
    return ReferralSystemModel;
}());
exports.ReferralSystemModel = ReferralSystemModel;
