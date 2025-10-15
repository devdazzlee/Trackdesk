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
exports.AffiliateService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var AffiliateService = /** @class */ (function () {
    function AffiliateService() {
    }
    AffiliateService.prototype.getAllAffiliates = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, search, status, tier, _a, sortBy, _b, sortOrder, skip, where, _c, affiliates, total;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        page = params.page, limit = params.limit, search = params.search, status = params.status, tier = params.tier, _a = params.sortBy, sortBy = _a === void 0 ? 'createdAt' : _a, _b = params.sortOrder, sortOrder = _b === void 0 ? 'desc' : _b;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where.OR = [
                                { user: { firstName: { contains: search } } },
                                { user: { lastName: { contains: search } } },
                                { user: { email: { contains: search } } }
                            ];
                        }
                        if (status) {
                            where.user = __assign(__assign({}, where.user), { status: status });
                        }
                        if (tier) {
                            where.tier = tier;
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.affiliateProfile.findMany({
                                    where: where,
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                email: true,
                                                firstName: true,
                                                lastName: true,
                                                status: true,
                                                createdAt: true
                                            }
                                        }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: (_d = {}, _d[sortBy] = sortOrder, _d)
                                }),
                                prisma.affiliateProfile.count({ where: where })
                            ])];
                    case 1:
                        _c = _e.sent(), affiliates = _c[0], total = _c[1];
                        return [2 /*return*/, {
                                affiliates: affiliates,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit)
                                }
                            }];
                }
            });
        });
    };
    AffiliateService.prototype.getAffiliateById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateProfile.findUnique({
                            where: { id: id },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        firstName: true,
                                        lastName: true,
                                        status: true,
                                        createdAt: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new Error('Affiliate not found');
                        }
                        return [2 /*return*/, affiliate];
                }
            });
        });
    };
    AffiliateService.prototype.createAffiliate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This would typically create both user and affiliate profile
                // For now, return a mock response
                return [2 /*return*/, __assign(__assign({ id: 'affiliate_' + Date.now() }, data), { createdAt: new Date() })];
            });
        });
    };
    AffiliateService.prototype.updateAffiliate = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateProfile.update({
                            where: { id: id },
                            data: {
                                companyName: data.companyName,
                                website: data.website,
                                paymentMethod: data.paymentMethod,
                                paymentEmail: data.paymentEmail,
                                tier: data.tier,
                                commissionRate: data.commissionRate
                            },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        firstName: true,
                                        lastName: true,
                                        status: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        affiliate = _a.sent();
                        return [2 /*return*/, affiliate];
                }
            });
        });
    };
    AffiliateService.prototype.deleteAffiliate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateProfile.delete({
                            where: { id: id }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AffiliateService.prototype.getMyProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateProfile.findUnique({
                            where: { userId: userId },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        firstName: true,
                                        lastName: true,
                                        status: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new Error('Affiliate profile not found');
                        }
                        return [2 /*return*/, affiliate];
                }
            });
        });
    };
    AffiliateService.prototype.updateMyProfile = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateProfile.update({
                            where: { userId: userId },
                            data: {
                                companyName: data.companyName,
                                website: data.website,
                                paymentMethod: data.paymentMethod,
                                paymentEmail: data.paymentEmail,
                                tier: data.tier,
                                commissionRate: data.commissionRate
                            },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        firstName: true,
                                        lastName: true,
                                        status: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        affiliate = _a.sent();
                        return [2 /*return*/, affiliate];
                }
            });
        });
    };
    AffiliateService.prototype.getAffiliateLinks = function (affiliateId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, search, status, skip, where, _a, links, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit, search = params.search, status = params.status;
                        skip = (page - 1) * limit;
                        where = { affiliateId: affiliateId };
                        if (search) {
                            where.OR = [
                                { originalUrl: { contains: search } },
                                { shortUrl: { contains: search } }
                            ];
                        }
                        if (status) {
                            where.isActive = status === 'active';
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.affiliateLink.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' }
                                }),
                                prisma.affiliateLink.count({ where: where })
                            ])];
                    case 1:
                        _a = _b.sent(), links = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                links: links,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit)
                                }
                            }];
                }
            });
        });
    };
    AffiliateService.prototype.createAffiliateLink = function (affiliateId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var shortUrl, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shortUrl = "".concat(process.env.CDN_BASE_URL, "/").concat(Date.now());
                        return [4 /*yield*/, prisma.affiliateLink.create({
                                data: {
                                    affiliateId: affiliateId,
                                    offerId: data.offerId,
                                    originalUrl: data.originalUrl,
                                    shortUrl: shortUrl,
                                    customSlug: data.customSlug,
                                    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
                                }
                            })];
                    case 1:
                        link = _a.sent();
                        return [2 /*return*/, link];
                }
            });
        });
    };
    AffiliateService.prototype.updateAffiliateLink = function (linkId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateLink.update({
                            where: { id: linkId },
                            data: {
                                originalUrl: data.originalUrl,
                                customSlug: data.customSlug,
                                isActive: data.isActive,
                                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
                            }
                        })];
                    case 1:
                        link = _a.sent();
                        return [2 /*return*/, link];
                }
            });
        });
    };
    AffiliateService.prototype.deleteAffiliateLink = function (linkId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateLink.delete({
                            where: { id: linkId }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AffiliateService.prototype.getCommissions = function (affiliateId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, status, startDate, endDate, skip, where, _a, commissions, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit, status = params.status, startDate = params.startDate, endDate = params.endDate;
                        skip = (page - 1) * limit;
                        where = { affiliateId: affiliateId };
                        if (status) {
                            where.status = status;
                        }
                        if (startDate && endDate) {
                            where.createdAt = {
                                gte: new Date(startDate),
                                lte: new Date(endDate)
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.commission.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                    include: {
                                        conversion: {
                                            include: {
                                                offer: true
                                            }
                                        }
                                    }
                                }),
                                prisma.commission.count({ where: where })
                            ])];
                    case 1:
                        _a = _b.sent(), commissions = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                commissions: commissions,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit)
                                }
                            }];
                }
            });
        });
    };
    AffiliateService.prototype.getPayouts = function (affiliateId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, status, startDate, endDate, skip, where, _a, payouts, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit, status = params.status, startDate = params.startDate, endDate = params.endDate;
                        skip = (page - 1) * limit;
                        where = { affiliateId: affiliateId };
                        if (status) {
                            where.status = status;
                        }
                        if (startDate && endDate) {
                            where.createdAt = {
                                gte: new Date(startDate),
                                lte: new Date(endDate)
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.payout.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                    include: {
                                        commissions: true
                                    }
                                }),
                                prisma.payout.count({ where: where })
                            ])];
                    case 1:
                        _a = _b.sent(), payouts = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                payouts: payouts,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit)
                                }
                            }];
                }
            });
        });
    };
    AffiliateService.prototype.requestPayout = function (affiliateId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var payout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.payout.create({
                            data: {
                                affiliateId: affiliateId,
                                amount: data.amount,
                                method: data.method,
                                status: 'PENDING'
                            }
                        })];
                    case 1:
                        payout = _a.sent();
                        return [2 /*return*/, payout];
                }
            });
        });
    };
    AffiliateService.prototype.getAnalytics = function (affiliateId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock analytics data
                return [2 /*return*/, {
                        totalClicks: 1250,
                        totalConversions: 45,
                        totalEarnings: 1250.50,
                        conversionRate: 3.6,
                        topOffers: [
                            { name: 'Premium Software', conversions: 20, earnings: 600.00 },
                            { name: 'E-commerce Products', conversions: 15, earnings: 450.00 },
                            { name: 'Digital Services', conversions: 10, earnings: 200.50 }
                        ]
                    }];
            });
        });
    };
    AffiliateService.prototype.getClicksAnalytics = function (affiliateId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock clicks analytics
                return [2 /*return*/, {
                        totalClicks: 1250,
                        clicksByDay: [
                            { date: '2024-01-01', clicks: 45 },
                            { date: '2024-01-02', clicks: 52 },
                            { date: '2024-01-03', clicks: 38 }
                        ],
                        clicksByCountry: [
                            { country: 'USA', clicks: 450 },
                            { country: 'Canada', clicks: 200 },
                            { country: 'UK', clicks: 150 }
                        ]
                    }];
            });
        });
    };
    AffiliateService.prototype.getConversionsAnalytics = function (affiliateId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock conversions analytics
                return [2 /*return*/, {
                        totalConversions: 45,
                        conversionsByDay: [
                            { date: '2024-01-01', conversions: 2 },
                            { date: '2024-01-02', conversions: 3 },
                            { date: '2024-01-03', conversions: 1 }
                        ],
                        conversionsByOffer: [
                            { offer: 'Premium Software', conversions: 20 },
                            { offer: 'E-commerce Products', conversions: 15 },
                            { offer: 'Digital Services', conversions: 10 }
                        ]
                    }];
            });
        });
    };
    return AffiliateService;
}());
exports.AffiliateService = AffiliateService;
