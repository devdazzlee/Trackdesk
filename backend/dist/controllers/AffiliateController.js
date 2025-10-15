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
exports.AffiliateController = void 0;
var AffiliateService_1 = require("../services/AffiliateService");
var zod_1 = require("zod");
var affiliateService = new AffiliateService_1.AffiliateService();
var createAffiliateSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    companyName: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    paymentMethod: zod_1.z.enum(['PAYPAL', 'STRIPE', 'BANK_TRANSFER', 'CRYPTO', 'WISE']).optional(),
    paymentEmail: zod_1.z.string().email().optional(),
    tier: zod_1.z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).optional()
});
var updateAffiliateSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    companyName: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    paymentMethod: zod_1.z.enum(['PAYPAL', 'STRIPE', 'BANK_TRANSFER', 'CRYPTO', 'WISE']).optional(),
    paymentEmail: zod_1.z.string().email().optional(),
    tier: zod_1.z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).optional(),
    commissionRate: zod_1.z.number().min(0).max(100).optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional()
});
var createLinkSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().url(),
    offerId: zod_1.z.string().optional(),
    customSlug: zod_1.z.string().optional(),
    expiresAt: zod_1.z.string().datetime().optional()
});
var updateLinkSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().url().optional(),
    customSlug: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    expiresAt: zod_1.z.string().datetime().optional()
});
var requestPayoutSchema = zod_1.z.object({
    amount: zod_1.z.number().min(1),
    method: zod_1.z.enum(['PAYPAL', 'STRIPE', 'BANK_TRANSFER', 'CRYPTO', 'WISE']),
    notes: zod_1.z.string().optional()
});
var AffiliateController = /** @class */ (function () {
    function AffiliateController() {
    }
    AffiliateController.prototype.getAllAffiliates = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, search, status_1, tier, _d, sortBy, _e, sortOrder, affiliates, error_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, search = _a.search, status_1 = _a.status, tier = _a.tier, _d = _a.sortBy, sortBy = _d === void 0 ? 'createdAt' : _d, _e = _a.sortOrder, sortOrder = _e === void 0 ? 'desc' : _e;
                        return [4 /*yield*/, affiliateService.getAllAffiliates({
                                page: parseInt(page),
                                limit: parseInt(limit),
                                search: search,
                                status: status_1,
                                tier: tier,
                                sortBy: sortBy,
                                sortOrder: sortOrder
                            })];
                    case 1:
                        affiliates = _f.sent();
                        res.json(affiliates);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _f.sent();
                        res.status(500).json({ error: error_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getAffiliateById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, affiliate, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, affiliateService.getAffiliateById(id)];
                    case 1:
                        affiliate = _a.sent();
                        res.json(affiliate);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(404).json({ error: error_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.createAffiliate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, affiliate, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = createAffiliateSchema.parse(req.body);
                        return [4 /*yield*/, affiliateService.createAffiliate(data)];
                    case 1:
                        affiliate = _a.sent();
                        res.status(201).json(affiliate);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_3.errors })];
                        }
                        res.status(400).json({ error: error_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.updateAffiliate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, affiliate, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = updateAffiliateSchema.parse(req.body);
                        return [4 /*yield*/, affiliateService.updateAffiliate(id, data)];
                    case 1:
                        affiliate = _a.sent();
                        res.json(affiliate);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_4.errors })];
                        }
                        res.status(404).json({ error: error_4.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.deleteAffiliate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, affiliateService.deleteAffiliate(id)];
                    case 1:
                        _a.sent();
                        res.json({ message: 'Affiliate deleted successfully' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(404).json({ error: error_5.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getMyProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, affiliateService.getMyProfile(req.user.id)];
                    case 1:
                        profile = _a.sent();
                        res.json(profile);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(404).json({ error: error_6.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.updateMyProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, profile, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = updateAffiliateSchema.parse(req.body);
                        return [4 /*yield*/, affiliateService.updateMyProfile(req.user.id, data)];
                    case 1:
                        profile = _a.sent();
                        res.json(profile);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        if (error_7.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_7.errors })];
                        }
                        res.status(500).json({ error: error_7.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.uploadAvatar = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // Handle file upload logic here
                    res.json({ message: 'Avatar uploaded successfully' });
                }
                catch (error) {
                    res.status(500).json({ error: error.message });
                }
                return [2 /*return*/];
            });
        });
    };
    AffiliateController.prototype.getAffiliateLinks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, page, _c, limit, search, status_2, links, error_8;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, search = _a.search, status_2 = _a.status;
                        return [4 /*yield*/, affiliateService.getAffiliateLinks(id, {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                search: search,
                                status: status_2
                            })];
                    case 1:
                        links = _d.sent();
                        res.json(links);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _d.sent();
                        res.status(500).json({ error: error_8.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.createAffiliateLink = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, link, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = createLinkSchema.parse(req.body);
                        return [4 /*yield*/, affiliateService.createAffiliateLink(id, data)];
                    case 1:
                        link = _a.sent();
                        res.status(201).json(link);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        if (error_9.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_9.errors })];
                        }
                        res.status(400).json({ error: error_9.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.updateAffiliateLink = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var linkId, data, link, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        linkId = req.params.linkId;
                        data = updateLinkSchema.parse(req.body);
                        return [4 /*yield*/, affiliateService.updateAffiliateLink(linkId, data)];
                    case 1:
                        link = _a.sent();
                        res.json(link);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        if (error_10.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_10.errors })];
                        }
                        res.status(404).json({ error: error_10.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.deleteAffiliateLink = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var linkId, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        linkId = req.params.linkId;
                        return [4 /*yield*/, affiliateService.deleteAffiliateLink(linkId)];
                    case 1:
                        _a.sent();
                        res.json({ message: 'Link deleted successfully' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        res.status(404).json({ error: error_11.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getCommissions = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, page, _c, limit, status_3, startDate, endDate, commissions, error_12;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, status_3 = _a.status, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, affiliateService.getCommissions(id, {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                status: status_3,
                                startDate: startDate,
                                endDate: endDate
                            })];
                    case 1:
                        commissions = _d.sent();
                        res.json(commissions);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _d.sent();
                        res.status(500).json({ error: error_12.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getPayouts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, page, _c, limit, status_4, startDate, endDate, payouts, error_13;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, status_4 = _a.status, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, affiliateService.getPayouts(id, {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                status: status_4,
                                startDate: startDate,
                                endDate: endDate
                            })];
                    case 1:
                        payouts = _d.sent();
                        res.json(payouts);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _d.sent();
                        res.status(500).json({ error: error_13.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.requestPayout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, payout, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = requestPayoutSchema.parse(req.body);
                        return [4 /*yield*/, affiliateService.requestPayout(id, data)];
                    case 1:
                        payout = _a.sent();
                        res.status(201).json(payout);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        if (error_14.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_14.errors })];
                        }
                        res.status(400).json({ error: error_14.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, timeRange, startDate, endDate, analytics, error_15;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, affiliateService.getAnalytics(id, {
                                timeRange: timeRange,
                                startDate: startDate,
                                endDate: endDate
                            })];
                    case 1:
                        analytics = _c.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _c.sent();
                        res.status(500).json({ error: error_15.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getClicksAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, timeRange, startDate, endDate, _c, groupBy, analytics, error_16;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, startDate = _a.startDate, endDate = _a.endDate, _c = _a.groupBy, groupBy = _c === void 0 ? 'day' : _c;
                        return [4 /*yield*/, affiliateService.getClicksAnalytics(id, {
                                timeRange: timeRange,
                                startDate: startDate,
                                endDate: endDate,
                                groupBy: groupBy
                            })];
                    case 1:
                        analytics = _d.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _d.sent();
                        res.status(500).json({ error: error_16.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateController.prototype.getConversionsAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, timeRange, startDate, endDate, _c, groupBy, analytics, error_17;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, startDate = _a.startDate, endDate = _a.endDate, _c = _a.groupBy, groupBy = _c === void 0 ? 'day' : _c;
                        return [4 /*yield*/, affiliateService.getConversionsAnalytics(id, {
                                timeRange: timeRange,
                                startDate: startDate,
                                endDate: endDate,
                                groupBy: groupBy
                            })];
                    case 1:
                        analytics = _d.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _d.sent();
                        res.status(500).json({ error: error_17.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AffiliateController;
}());
exports.AffiliateController = AffiliateController;
