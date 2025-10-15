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
exports.OffersModel = void 0;
var OffersModel = /** @class */ (function () {
    function OffersModel() {
    }
    OffersModel.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation since the complex Offer interface doesn't match the Prisma schema
                return [2 /*return*/, {
                        id: 'mock-offer-id',
                        accountId: data.accountId,
                        name: data.name,
                        description: data.description || '',
                        category: data.category || 'General',
                        type: data.type || 'CPA',
                        status: data.status || 'DRAFT',
                        priority: data.priority || 0,
                        general: data.general || {
                            name: data.name,
                            description: data.description || '',
                            category: data.category || 'General',
                            tags: [],
                            targetAudience: '',
                            restrictions: [],
                            compliance: [],
                            notes: '',
                            isPublic: true,
                            requiresApproval: false,
                            autoApprove: false
                        },
                        revenue: data.revenue || {
                            type: data.type || 'CPA',
                            basePayout: 0,
                            currency: 'USD',
                            payoutType: 'FIXED',
                            payoutSchedule: 'MONTHLY',
                            minimumPayout: 0,
                            capType: 'NONE',
                            holdPeriod: 30,
                            chargebackPeriod: 90,
                            refundPolicy: ''
                        },
                        landingPages: data.landingPages || [],
                        creatives: data.creatives || [],
                        tracking: data.tracking || {
                            clickTracking: true,
                            conversionTracking: true,
                            postbackTracking: false,
                            pixelTracking: false,
                            serverToServer: false,
                            javascriptTracking: false,
                            cookieTracking: true,
                            sessionTracking: true,
                            crossDomainTracking: false,
                            trackingParameters: [],
                            customEvents: [],
                            attributionWindow: 24,
                            conversionWindow: 168,
                            duplicateWindow: 30,
                            allowDuplicates: false,
                            requireValidation: false,
                            validationRules: []
                        },
                        integrations: data.integrations || [],
                        settings: data.settings || {
                            allowMultipleConversions: false,
                            requireApproval: false,
                            autoApprove: false,
                            allowSubAffiliates: false,
                            allowCoupons: false,
                            allowDeepLinks: false,
                            allowDirectLinking: false,
                            requireLandingPage: true,
                            allowMobileTraffic: true,
                            allowDesktopTraffic: true,
                            allowTabletTraffic: true,
                            geoRestrictions: [],
                            deviceRestrictions: [],
                            browserRestrictions: [],
                            timeRestrictions: [],
                            trafficQuality: {
                                minBounceRate: 0,
                                maxBounceRate: 1,
                                minSessionDuration: 0,
                                minPagesPerSession: 1,
                                requireEngagement: false,
                                qualityScore: 0
                            },
                            fraudPrevention: {
                                enableFraudDetection: false,
                                fraudThreshold: 0.7,
                                blockSuspiciousTraffic: false,
                                requireVerification: false,
                                enableAnura: false,
                                customRules: []
                            },
                            compliance: {
                                gdprCompliant: false,
                                ccpaCompliant: false,
                                coppaCompliant: false,
                                requireConsent: false,
                                consentText: '',
                                privacyPolicy: '',
                                termsOfService: '',
                                disclaimer: ''
                            }
                        },
                        application: data.application || {
                            isOpen: true,
                            requiresApproval: false,
                            autoApprove: false,
                            applicationForm: {
                                fields: [],
                                isCustomizable: false,
                                requireDocuments: false,
                                documentTypes: []
                            },
                            requirements: [],
                            approvalProcess: {
                                steps: [],
                                autoApproval: false,
                                manualReview: true,
                                notificationSettings: {
                                    emailNotifications: true,
                                    smsNotifications: false,
                                    inAppNotifications: true,
                                    webhookNotifications: false,
                                    notificationTemplates: {}
                                }
                            },
                            rejectionReasons: [],
                            welcomeMessage: '',
                            approvalMessage: '',
                            rejectionMessage: ''
                        },
                        smartLink: data.smartLink || {
                            enabled: false,
                            baseUrl: '',
                            trackingParameters: [],
                            redirectRules: [],
                            sslEnabled: true,
                            analyticsEnabled: true,
                            aTestingEnabled: false,
                            geoRedirects: [],
                            deviceRedirects: [],
                            timeBasedRedirects: []
                        },
                        stats: {
                            totalClicks: 0,
                            uniqueClicks: 0,
                            totalConversions: 0,
                            uniqueConversions: 0,
                            conversionRate: 0,
                            totalRevenue: 0,
                            totalPayout: 0,
                            totalAffiliates: 0,
                            activeAffiliates: 0,
                            pendingAffiliates: 0,
                            rejectedAffiliates: 0,
                            byAffiliate: {},
                            byCountry: {},
                            byDevice: {},
                            bySource: {},
                            byHour: {},
                            byDay: {}
                        },
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }];
            });
        });
    };
    OffersModel.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, null];
            });
        });
    };
    OffersModel.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        id: id,
                        accountId: 'mock-account',
                        name: 'Mock Offer',
                        description: '',
                        category: 'General',
                        type: 'CPA',
                        status: 'DRAFT',
                        priority: 0,
                        general: {
                            name: 'Mock Offer',
                            description: '',
                            category: 'General',
                            tags: [],
                            targetAudience: '',
                            restrictions: [],
                            compliance: [],
                            notes: '',
                            isPublic: true,
                            requiresApproval: false,
                            autoApprove: false
                        },
                        revenue: {
                            type: 'CPA',
                            basePayout: 0,
                            currency: 'USD',
                            payoutType: 'FIXED',
                            payoutSchedule: 'MONTHLY',
                            minimumPayout: 0,
                            capType: 'NONE',
                            holdPeriod: 30,
                            chargebackPeriod: 90,
                            refundPolicy: ''
                        },
                        landingPages: [],
                        creatives: [],
                        tracking: {
                            clickTracking: true,
                            conversionTracking: true,
                            postbackTracking: false,
                            pixelTracking: false,
                            serverToServer: false,
                            javascriptTracking: false,
                            cookieTracking: true,
                            sessionTracking: true,
                            crossDomainTracking: false,
                            trackingParameters: [],
                            customEvents: [],
                            attributionWindow: 24,
                            conversionWindow: 168,
                            duplicateWindow: 30,
                            allowDuplicates: false,
                            requireValidation: false,
                            validationRules: []
                        },
                        integrations: [],
                        settings: {
                            allowMultipleConversions: false,
                            requireApproval: false,
                            autoApprove: false,
                            allowSubAffiliates: false,
                            allowCoupons: false,
                            allowDeepLinks: false,
                            allowDirectLinking: false,
                            requireLandingPage: true,
                            allowMobileTraffic: true,
                            allowDesktopTraffic: true,
                            allowTabletTraffic: true,
                            geoRestrictions: [],
                            deviceRestrictions: [],
                            browserRestrictions: [],
                            timeRestrictions: [],
                            trafficQuality: {
                                minBounceRate: 0,
                                maxBounceRate: 1,
                                minSessionDuration: 0,
                                minPagesPerSession: 1,
                                requireEngagement: false,
                                qualityScore: 0
                            },
                            fraudPrevention: {
                                enableFraudDetection: false,
                                fraudThreshold: 0.7,
                                blockSuspiciousTraffic: false,
                                requireVerification: false,
                                enableAnura: false,
                                customRules: []
                            },
                            compliance: {
                                gdprCompliant: false,
                                ccpaCompliant: false,
                                coppaCompliant: false,
                                requireConsent: false,
                                consentText: '',
                                privacyPolicy: '',
                                termsOfService: '',
                                disclaimer: ''
                            }
                        },
                        application: {
                            isOpen: true,
                            requiresApproval: false,
                            autoApprove: false,
                            applicationForm: {
                                fields: [],
                                isCustomizable: false,
                                requireDocuments: false,
                                documentTypes: []
                            },
                            requirements: [],
                            approvalProcess: {
                                steps: [],
                                autoApproval: false,
                                manualReview: true,
                                notificationSettings: {
                                    emailNotifications: true,
                                    smsNotifications: false,
                                    inAppNotifications: true,
                                    webhookNotifications: false,
                                    notificationTemplates: {}
                                }
                            },
                            rejectionReasons: [],
                            welcomeMessage: '',
                            approvalMessage: '',
                            rejectionMessage: ''
                        },
                        smartLink: {
                            enabled: false,
                            baseUrl: '',
                            trackingParameters: [],
                            redirectRules: [],
                            sslEnabled: true,
                            analyticsEnabled: true,
                            aTestingEnabled: false,
                            geoRedirects: [],
                            deviceRedirects: [],
                            timeBasedRedirects: []
                        },
                        stats: {
                            totalClicks: 0,
                            uniqueClicks: 0,
                            totalConversions: 0,
                            uniqueConversions: 0,
                            conversionRate: 0,
                            totalRevenue: 0,
                            totalPayout: 0,
                            totalAffiliates: 0,
                            activeAffiliates: 0,
                            pendingAffiliates: 0,
                            rejectedAffiliates: 0,
                            byAffiliate: {},
                            byCountry: {},
                            byDevice: {},
                            bySource: {},
                            byHour: {},
                            byDay: {}
                        },
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }];
            });
        });
    };
    OffersModel.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    OffersModel.list = function (accountId_1) {
        return __awaiter(this, arguments, void 0, function (accountId, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    // Mock implementations for all other methods
    OffersModel.addLandingPage = function (offerId, landingPage) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.updateLandingPage = function (offerId, landingPageId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.removeLandingPage = function (offerId, landingPageId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.addCreative = function (offerId, creative) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.updateCreative = function (offerId, creativeId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.removeCreative = function (offerId, creativeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.addIntegration = function (offerId, integration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.updateIntegration = function (offerId, integrationId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.removeIntegration = function (offerId, integrationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById(offerId)];
                    case 1: return [2 /*return*/, (_a.sent()) || this.create({ accountId: 'mock' })];
                }
            });
        });
    };
    OffersModel.generateTrackingCode = function (offerId, type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "<!-- Mock tracking code for ".concat(offerId, " -->")];
            });
        });
    };
    OffersModel.createApplication = function (offerId_1, affiliateId_1, applicationData_1) {
        return __awaiter(this, arguments, void 0, function (offerId, affiliateId, applicationData, documents) {
            if (documents === void 0) { documents = []; }
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        id: 'mock-app-id',
                        offerId: offerId,
                        affiliateId: affiliateId,
                        status: 'PENDING',
                        applicationData: applicationData,
                        documents: documents,
                        submittedAt: new Date()
                    }];
            });
        });
    };
    OffersModel.findApplicationById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    OffersModel.updateApplicationStatus = function (id, status, reviewedBy, rejectionReason, notes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        id: id,
                        offerId: 'mock-offer',
                        affiliateId: 'mock-affiliate',
                        status: status,
                        applicationData: {},
                        documents: [],
                        submittedAt: new Date(),
                        reviewedAt: new Date(),
                        reviewedBy: reviewedBy,
                        rejectionReason: rejectionReason,
                        notes: notes
                    }];
            });
        });
    };
    OffersModel.getApplications = function (offerId_1) {
        return __awaiter(this, arguments, void 0, function (offerId, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    OffersModel.updateStats = function (offerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    OffersModel.getOfferStats = function (accountId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        totalOffers: 0,
                        activeOffers: 0,
                        pausedOffers: 0,
                        draftOffers: 0,
                        totalClicks: 0,
                        totalConversions: 0,
                        totalRevenue: 0,
                        totalPayout: 0,
                        byType: {},
                        byStatus: {},
                        byCategory: {}
                    }];
            });
        });
    };
    OffersModel.createDefaultOffers = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    OffersModel.getOffersDashboard = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        offers: [],
                        stats: {
                            totalOffers: 0,
                            activeOffers: 0,
                            pausedOffers: 0,
                            draftOffers: 0,
                            totalClicks: 0,
                            totalConversions: 0,
                            totalRevenue: 0,
                            totalPayout: 0,
                            byType: {},
                            byStatus: {},
                            byCategory: {}
                        }
                    }];
            });
        });
    };
    return OffersModel;
}());
exports.OffersModel = OffersModel;
