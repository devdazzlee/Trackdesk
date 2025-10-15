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
exports.OffersController = void 0;
var Offers_1 = require("../models/Offers");
var OffersController = /** @class */ (function () {
    function OffersController() {
    }
    // CRUD Operations
    OffersController.createOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, offerData, offer, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        offerData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.create(__assign({ accountId: accountId }, offerData))];
                    case 1:
                        offer = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: offer,
                            message: 'Offer created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.getOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, offer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, Offers_1.OffersModel.findById(id)];
                    case 1:
                        offer = _a.sent();
                        if (!offer) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Offer not found'
                                })];
                        }
                        res.json({
                            success: true,
                            data: offer
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.updateOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateData, offer, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        updateData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.update(id, updateData)];
                    case 1:
                        offer = _a.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Offer updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.deleteOffer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, Offers_1.OffersModel.delete(id)];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Offer deleted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.listOffers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, filters, offers, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        filters = req.query;
                        return [4 /*yield*/, Offers_1.OffersModel.list(accountId, filters)];
                    case 1:
                        offers = _a.sent();
                        res.json({
                            success: true,
                            data: offers,
                            count: offers.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Landing Pages Management
    OffersController.addLandingPage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, landingPageData, offer, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        landingPageData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.addLandingPage(offerId, landingPageData)];
                    case 1:
                        offer = _a.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Landing page added successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.updateLandingPage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offerId, landingPageId, updateData, offer, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, offerId = _a.offerId, landingPageId = _a.landingPageId;
                        updateData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.updateLandingPage(offerId, landingPageId, updateData)];
                    case 1:
                        offer = _b.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Landing page updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.removeLandingPage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offerId, landingPageId, offer, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, offerId = _a.offerId, landingPageId = _a.landingPageId;
                        return [4 /*yield*/, Offers_1.OffersModel.removeLandingPage(offerId, landingPageId)];
                    case 1:
                        offer = _b.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Landing page removed successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_8.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Creatives Management
    OffersController.addCreative = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, creativeData, offer, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        creativeData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.addCreative(offerId, creativeData)];
                    case 1:
                        offer = _a.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Creative added successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_9.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.updateCreative = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offerId, creativeId, updateData, offer, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, offerId = _a.offerId, creativeId = _a.creativeId;
                        updateData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.updateCreative(offerId, creativeId, updateData)];
                    case 1:
                        offer = _b.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Creative updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_10.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.removeCreative = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offerId, creativeId, offer, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, offerId = _a.offerId, creativeId = _a.creativeId;
                        return [4 /*yield*/, Offers_1.OffersModel.removeCreative(offerId, creativeId)];
                    case 1:
                        offer = _b.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Creative removed successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_11.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Integrations Management
    OffersController.addIntegration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, integrationData, offer, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        integrationData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.addIntegration(offerId, integrationData)];
                    case 1:
                        offer = _a.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Integration added successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_12.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.updateIntegration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offerId, integrationId, updateData, offer, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, offerId = _a.offerId, integrationId = _a.integrationId;
                        updateData = req.body;
                        return [4 /*yield*/, Offers_1.OffersModel.updateIntegration(offerId, integrationId, updateData)];
                    case 1:
                        offer = _b.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Integration updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_13.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.removeIntegration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offerId, integrationId, offer, error_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, offerId = _a.offerId, integrationId = _a.integrationId;
                        return [4 /*yield*/, Offers_1.OffersModel.removeIntegration(offerId, integrationId)];
                    case 1:
                        offer = _b.sent();
                        res.json({
                            success: true,
                            data: offer,
                            message: 'Integration removed successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_14.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Tracking Code Generation
    OffersController.generateTrackingCode = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, type, trackingCode, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        type = req.body.type;
                        return [4 /*yield*/, Offers_1.OffersModel.generateTrackingCode(offerId, type)];
                    case 1:
                        trackingCode = _a.sent();
                        res.json({
                            success: true,
                            data: { trackingCode: trackingCode },
                            message: 'Tracking code generated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_15.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Offer Applications
    OffersController.createApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, affiliateId, _a, applicationData, documents, application, error_16;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        affiliateId = req.user.affiliateId;
                        _a = req.body, applicationData = _a.applicationData, documents = _a.documents;
                        return [4 /*yield*/, Offers_1.OffersModel.createApplication(offerId, affiliateId, applicationData, documents)];
                    case 1:
                        application = _b.sent();
                        res.status(201).json({
                            success: true,
                            data: application,
                            message: 'Application submitted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_16.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.getApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, application, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, Offers_1.OffersModel.findApplicationById(id)];
                    case 1:
                        application = _a.sent();
                        if (!application) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Application not found'
                                })];
                        }
                        res.json({
                            success: true,
                            data: application
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_17.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.updateApplicationStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, status_1, rejectionReason, notes, userId, application, error_18;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.body, status_1 = _a.status, rejectionReason = _a.rejectionReason, notes = _a.notes;
                        userId = req.user.userId;
                        return [4 /*yield*/, Offers_1.OffersModel.updateApplicationStatus(id, status_1, userId, rejectionReason, notes)];
                    case 1:
                        application = _b.sent();
                        res.json({
                            success: true,
                            data: application,
                            message: 'Application status updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_18.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.getApplications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, filters, applications, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        filters = req.query;
                        return [4 /*yield*/, Offers_1.OffersModel.getApplications(offerId, filters)];
                    case 1:
                        applications = _a.sent();
                        res.json({
                            success: true,
                            data: applications,
                            count: applications.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_19.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Statistics
    OffersController.updateStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var offerId, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offerId = req.params.offerId;
                        return [4 /*yield*/, Offers_1.OffersModel.updateStats(offerId)];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Stats updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_20.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OffersController.getOfferStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, startDate, endDate, stats, error_21;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, Offers_1.OffersModel.getOfferStats(accountId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)];
                    case 1:
                        stats = _b.sent();
                        res.json({
                            success: true,
                            data: stats
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_21.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Dashboard
    OffersController.getOffersDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, dashboard, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, Offers_1.OffersModel.getOffersDashboard(accountId)];
                    case 1:
                        dashboard = _a.sent();
                        res.json({
                            success: true,
                            data: dashboard
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_22.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Default Offers
    OffersController.createDefaultOffers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, offers, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, Offers_1.OffersModel.createDefaultOffers(accountId)];
                    case 1:
                        offers = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: offers,
                            message: 'Default offers created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_23.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OffersController;
}());
exports.OffersController = OffersController;
