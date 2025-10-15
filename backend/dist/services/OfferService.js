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
exports.OfferService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var OfferService = /** @class */ (function () {
    function OfferService() {
    }
    OfferService.prototype.getAllOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, search, status, category, skip, where, _a, offers, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit, search = params.search, status = params.status, category = params.category;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where.OR = [
                                { name: { contains: search } },
                                { description: { contains: search } },
                                { category: { contains: search } },
                            ];
                        }
                        if (status) {
                            where.status = status;
                        }
                        if (category) {
                            where.category = category;
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.offer.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: "desc" },
                                }),
                                prisma.offer.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), offers = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                offers: offers,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit),
                                },
                            }];
                }
            });
        });
    };
    OfferService.prototype.getOfferById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.offer.findUnique({
                            where: { id: id },
                            include: {
                                creatives: true,
                                applications: {
                                    include: {
                                        affiliate: {
                                            include: {
                                                user: {
                                                    select: {
                                                        firstName: true,
                                                        lastName: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        offer = _a.sent();
                        if (!offer) {
                            throw new Error("Offer not found");
                        }
                        return [2 /*return*/, offer];
                }
            });
        });
    };
    OfferService.prototype.createOffer = function (data, accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.offer.create({
                            data: {
                                accountId: accountId,
                                name: data.name,
                                description: data.description,
                                category: data.category,
                                commissionRate: data.commissionRate,
                                startDate: new Date(data.startDate),
                                endDate: data.endDate ? new Date(data.endDate) : null,
                                terms: data.terms,
                                requirements: data.requirements,
                            },
                        })];
                    case 1:
                        offer = _a.sent();
                        return [2 /*return*/, offer];
                }
            });
        });
    };
    OfferService.prototype.updateOffer = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.offer.update({
                            where: { id: id },
                            data: {
                                name: data.name,
                                description: data.description,
                                category: data.category,
                                commissionRate: data.commissionRate,
                                startDate: data.startDate ? new Date(data.startDate) : undefined,
                                endDate: data.endDate ? new Date(data.endDate) : undefined,
                                terms: data.terms,
                                requirements: data.requirements,
                                status: data.status,
                            },
                        })];
                    case 1:
                        offer = _a.sent();
                        return [2 /*return*/, offer];
                }
            });
        });
    };
    OfferService.prototype.deleteOffer = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.offer.delete({
                            where: { id: id },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfferService.prototype.getOfferApplications = function (offerId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, status, skip, where, _a, applications, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit, status = params.status;
                        skip = (page - 1) * limit;
                        where = { offerId: offerId };
                        if (status) {
                            where.status = status;
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.offerApplication.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: "desc" },
                                    include: {
                                        affiliate: {
                                            include: {
                                                user: {
                                                    select: {
                                                        firstName: true,
                                                        lastName: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                }),
                                prisma.offerApplication.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), applications = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                applications: applications,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit),
                                },
                            }];
                }
            });
        });
    };
    OfferService.prototype.applyForOffer = function (offerId, userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, application;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.affiliateProfile.findUnique({
                            where: { userId: userId },
                        })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new Error("Affiliate profile not found");
                        }
                        return [4 /*yield*/, prisma.offerApplication.create({
                                data: {
                                    offerId: offerId,
                                    affiliateId: affiliate.id,
                                    message: data.message,
                                },
                            })];
                    case 2:
                        application = _a.sent();
                        return [2 /*return*/, application];
                }
            });
        });
    };
    OfferService.prototype.updateApplication = function (applicationId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var application;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.offerApplication.update({
                            where: { id: applicationId },
                            data: {
                                status: data.status,
                                message: data.message,
                            },
                        })];
                    case 1:
                        application = _a.sent();
                        return [2 /*return*/, application];
                }
            });
        });
    };
    OfferService.prototype.deleteApplication = function (applicationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.offerApplication.delete({
                            where: { id: applicationId },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfferService.prototype.getOfferCreatives = function (offerId, params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, type, skip, where, _a, creatives, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, limit = params.limit, type = params.type;
                        skip = (page - 1) * limit;
                        where = { offerId: offerId };
                        if (type) {
                            where.type = type;
                        }
                        return [4 /*yield*/, Promise.all([
                                prisma.creative.findMany({
                                    where: where,
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: "desc" },
                                }),
                                prisma.creative.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), creatives = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                creatives: creatives,
                                pagination: {
                                    page: page,
                                    limit: limit,
                                    total: total,
                                    pages: Math.ceil(total / limit),
                                },
                            }];
                }
            });
        });
    };
    OfferService.prototype.createCreative = function (offerId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var creative;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.creative.create({
                            data: {
                                offerId: offerId,
                                name: data.name,
                                type: data.type,
                                size: data.size,
                                format: data.format,
                                url: data.url,
                                downloadUrl: data.downloadUrl,
                            },
                        })];
                    case 1:
                        creative = _a.sent();
                        return [2 /*return*/, creative];
                }
            });
        });
    };
    OfferService.prototype.updateCreative = function (creativeId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var creative;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.creative.update({
                            where: { id: creativeId },
                            data: {
                                name: data.name,
                                type: data.type,
                                size: data.size,
                                format: data.format,
                                url: data.url,
                                downloadUrl: data.downloadUrl,
                            },
                        })];
                    case 1:
                        creative = _a.sent();
                        return [2 /*return*/, creative];
                }
            });
        });
    };
    OfferService.prototype.deleteCreative = function (creativeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.creative.delete({
                            where: { id: creativeId },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfferService.prototype.getOfferAnalytics = function (offerId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock analytics data
                return [2 /*return*/, {
                        totalClicks: 2500,
                        totalConversions: 85,
                        totalRevenue: 4250.0,
                        conversionRate: 3.4,
                        topAffiliates: [
                            { name: "John Doe", conversions: 25, earnings: 750.0 },
                            { name: "Jane Smith", conversions: 20, earnings: 600.0 },
                            { name: "Mike Johnson", conversions: 15, earnings: 450.0 },
                        ],
                    }];
            });
        });
    };
    OfferService.prototype.getOfferClicks = function (offerId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock clicks analytics
                return [2 /*return*/, {
                        totalClicks: 2500,
                        clicksByDay: [
                            { date: "2024-01-01", clicks: 120 },
                            { date: "2024-01-02", clicks: 135 },
                            { date: "2024-01-03", clicks: 110 },
                        ],
                        clicksByCountry: [
                            { country: "USA", clicks: 1000 },
                            { country: "Canada", clicks: 500 },
                            { country: "UK", clicks: 300 },
                        ],
                    }];
            });
        });
    };
    OfferService.prototype.getOfferConversions = function (offerId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock conversions analytics
                return [2 /*return*/, {
                        totalConversions: 85,
                        conversionsByDay: [
                            { date: "2024-01-01", conversions: 4 },
                            { date: "2024-01-02", conversions: 5 },
                            { date: "2024-01-03", conversions: 3 },
                        ],
                        conversionsByAffiliate: [
                            { affiliate: "John Doe", conversions: 25 },
                            { affiliate: "Jane Smith", conversions: 20 },
                            { affiliate: "Mike Johnson", conversions: 15 },
                        ],
                    }];
            });
        });
    };
    return OfferService;
}());
exports.OfferService = OfferService;
