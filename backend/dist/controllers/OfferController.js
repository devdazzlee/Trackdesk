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
exports.OfferController = void 0;
var OfferService_1 = require("../services/OfferService");
var zod_1 = require("zod");
require("../types/express");
var offerService = new OfferService_1.OfferService();
var createOfferSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    commissionRate: zod_1.z.number().min(0).max(100),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional(),
    terms: zod_1.z.string().optional(),
    requirements: zod_1.z.string().optional(),
});
var updateOfferSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    category: zod_1.z.string().min(1).optional(),
    commissionRate: zod_1.z.number().min(0).max(100).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    terms: zod_1.z.string().optional(),
    requirements: zod_1.z.string().optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE", "PAUSED", "EXPIRED"]).optional(),
});
var applyForOfferSchema = zod_1.z.object({
    message: zod_1.z.string().optional(),
});
var updateApplicationSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED"]),
    message: zod_1.z.string().optional(),
});
var createCreativeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(["BANNER", "LOGO", "SOCIAL_MEDIA", "EMAIL_TEMPLATE", "VIDEO"]),
    size: zod_1.z.string().min(1),
    format: zod_1.z.string().min(1),
    url: zod_1.z.string().url(),
    downloadUrl: zod_1.z.string().url(),
});
var updateCreativeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    type: zod_1.z
        .enum(["BANNER", "LOGO", "SOCIAL_MEDIA", "EMAIL_TEMPLATE", "VIDEO"])
        .optional(),
    size: zod_1.z.string().min(1).optional(),
    format: zod_1.z.string().min(1).optional(),
    url: zod_1.z.string().url().optional(),
    downloadUrl: zod_1.z.string().url().optional(),
});
var OfferController = /** @class */ (function () {
    function OfferController() {
    }
    OfferController.prototype.getAllOffers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, search, status_1, category, offers, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, search = _a.search, status_1 = _a.status, category = _a.category;
                        return [4 /*yield*/, offerService.getAllOffers({
                                page: parseInt(page),
                                limit: parseInt(limit),
                                search: search,
                                status: status_1,
                                category: category,
                            })];
                    case 1:
                        offers = _d.sent();
                        res.json(offers);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _d.sent();
                        res.status(500).json({ error: error_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.getOfferById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, offer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, offerService.getOfferById(id)];
                    case 1:
                        offer = _a.sent();
                        res.json(offer);
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
    OfferController.prototype.createOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, accountId, offer, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        data = createOfferSchema.parse(req.body);
                        accountId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.accountId) || "default";
                        return [4 /*yield*/, offerService.createOffer(data, accountId)];
                    case 1:
                        offer = _b.sent();
                        res.status(201).json(offer);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        if (error_3.name === "ZodError") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Invalid input data", details: error_3.errors })];
                        }
                        res.status(400).json({ error: error_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.updateOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, offer, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = updateOfferSchema.parse(req.body);
                        return [4 /*yield*/, offerService.updateOffer(id, data)];
                    case 1:
                        offer = _a.sent();
                        res.json(offer);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4.name === "ZodError") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Invalid input data", details: error_4.errors })];
                        }
                        res.status(404).json({ error: error_4.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.deleteOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, offerService.deleteOffer(id)];
                    case 1:
                        _a.sent();
                        res.json({ message: "Offer deleted successfully" });
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
    OfferController.prototype.getOfferApplications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, page, _c, limit, status_2, applications, error_6;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, status_2 = _a.status;
                        return [4 /*yield*/, offerService.getOfferApplications(id, {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                status: status_2,
                            })];
                    case 1:
                        applications = _d.sent();
                        res.json(applications);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _d.sent();
                        res.status(500).json({ error: error_6.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.applyForOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, application, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = applyForOfferSchema.parse(req.body);
                        return [4 /*yield*/, offerService.applyForOffer(id, req.user.id, data)];
                    case 1:
                        application = _a.sent();
                        res.status(201).json(application);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        if (error_7.name === "ZodError") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Invalid input data", details: error_7.errors })];
                        }
                        res.status(400).json({ error: error_7.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.updateApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var applicationId, data, application, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        applicationId = req.params.applicationId;
                        data = updateApplicationSchema.parse(req.body);
                        return [4 /*yield*/, offerService.updateApplication(applicationId, data)];
                    case 1:
                        application = _a.sent();
                        res.json(application);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        if (error_8.name === "ZodError") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Invalid input data", details: error_8.errors })];
                        }
                        res.status(404).json({ error: error_8.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.deleteApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var applicationId, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        applicationId = req.params.applicationId;
                        return [4 /*yield*/, offerService.deleteApplication(applicationId)];
                    case 1:
                        _a.sent();
                        res.json({ message: "Application deleted successfully" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        res.status(404).json({ error: error_9.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.getOfferCreatives = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, page, _c, limit, type, creatives, error_10;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, type = _a.type;
                        return [4 /*yield*/, offerService.getOfferCreatives(id, {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                type: type,
                            })];
                    case 1:
                        creatives = _d.sent();
                        res.json(creatives);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _d.sent();
                        res.status(500).json({ error: error_10.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.createCreative = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, creative, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = createCreativeSchema.parse(req.body);
                        return [4 /*yield*/, offerService.createCreative(id, data)];
                    case 1:
                        creative = _a.sent();
                        res.status(201).json(creative);
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        if (error_11.name === "ZodError") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Invalid input data", details: error_11.errors })];
                        }
                        res.status(400).json({ error: error_11.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.updateCreative = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var creativeId, data, creative, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        creativeId = req.params.creativeId;
                        data = updateCreativeSchema.parse(req.body);
                        return [4 /*yield*/, offerService.updateCreative(creativeId, data)];
                    case 1:
                        creative = _a.sent();
                        res.json(creative);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        if (error_12.name === "ZodError") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Invalid input data", details: error_12.errors })];
                        }
                        res.status(404).json({ error: error_12.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.deleteCreative = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var creativeId, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        creativeId = req.params.creativeId;
                        return [4 /*yield*/, offerService.deleteCreative(creativeId)];
                    case 1:
                        _a.sent();
                        res.json({ message: "Creative deleted successfully" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        res.status(404).json({ error: error_13.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.getOfferAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, timeRange, startDate, endDate, analytics, error_14;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? "30d" : _b, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, offerService.getOfferAnalytics(id, {
                                timeRange: timeRange,
                                startDate: startDate,
                                endDate: endDate,
                            })];
                    case 1:
                        analytics = _c.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _c.sent();
                        res.status(500).json({ error: error_14.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.getOfferClicks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, timeRange, startDate, endDate, _c, groupBy, analytics, error_15;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? "30d" : _b, startDate = _a.startDate, endDate = _a.endDate, _c = _a.groupBy, groupBy = _c === void 0 ? "day" : _c;
                        return [4 /*yield*/, offerService.getOfferClicks(id, {
                                timeRange: timeRange,
                                startDate: startDate,
                                endDate: endDate,
                                groupBy: groupBy,
                            })];
                    case 1:
                        analytics = _d.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _d.sent();
                        res.status(500).json({ error: error_15.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OfferController.prototype.getOfferConversions = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, timeRange, startDate, endDate, _c, groupBy, analytics, error_16;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? "30d" : _b, startDate = _a.startDate, endDate = _a.endDate, _c = _a.groupBy, groupBy = _c === void 0 ? "day" : _c;
                        return [4 /*yield*/, offerService.getOfferConversions(id, {
                                timeRange: timeRange,
                                startDate: startDate,
                                endDate: endDate,
                                groupBy: groupBy,
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
    return OfferController;
}());
exports.OfferController = OfferController;
