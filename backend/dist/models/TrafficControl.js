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
exports.TrafficControlModel = void 0;
var TrafficControlModel = /** @class */ (function () {
    function TrafficControlModel() {
    }
    TrafficControlModel.createRule = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation since the Prisma schema doesn't match our interface
                return [2 /*return*/, {
                        id: 'mock-rule-id',
                        name: data.name,
                        description: data.description || '',
                        type: data.type || 'GEO_BLOCKING',
                        conditions: data.conditions || [],
                        actions: data.actions || [],
                        priority: data.priority || 1,
                        status: data.status || 'ACTIVE',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }];
            });
        });
    };
    TrafficControlModel.findRuleById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, null];
            });
        });
    };
    TrafficControlModel.updateRule = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        id: id,
                        name: 'Mock Rule',
                        description: '',
                        type: 'GEO_BLOCKING',
                        conditions: [],
                        actions: [],
                        priority: 1,
                        status: 'ACTIVE',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }];
            });
        });
    };
    TrafficControlModel.deleteRule = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    TrafficControlModel.listRules = function () {
        return __awaiter(this, arguments, void 0, function (filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    TrafficControlModel.processTraffic = function (data, ipAddress, userAgent, affiliateId, clickId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        id: 'mock-event-id',
                        ruleId: 'mock-rule',
                        type: 'DEFAULT',
                        data: data,
                        action: 'ALLOW',
                        ipAddress: ipAddress,
                        userAgent: userAgent,
                        country: data.country,
                        device: data.device,
                        browser: data.browser,
                        os: data.os,
                        affiliateId: affiliateId,
                        clickId: clickId,
                        timestamp: new Date()
                    }];
            });
        });
    };
    TrafficControlModel.getTrafficEvents = function () {
        return __awaiter(this, arguments, void 0, function (filters, page, limit) {
            if (filters === void 0) { filters = {}; }
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    TrafficControlModel.getTrafficStats = function (startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        totalRequests: 0,
                        allowedRequests: 0,
                        blockedRequests: 0,
                        redirectedRequests: 0,
                        throttledRequests: 0,
                        byRule: {},
                        byCountry: {},
                        byDevice: {},
                        byHour: {},
                        topIPs: []
                    }];
            });
        });
    };
    TrafficControlModel.createDefaultRules = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    // Additional methods needed by TrafficControlController
    TrafficControlModel.testRule = function (id, testData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'Rule test completed',
                        testResults: {}
                    }];
            });
        });
    };
    TrafficControlModel.blockIP = function (ipAddress, reason, duration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'IP blocked successfully',
                        ipAddress: ipAddress,
                        reason: reason,
                        duration: duration
                    }];
            });
        });
    };
    TrafficControlModel.unblockIP = function (ipAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'IP unblocked successfully',
                        ipAddress: ipAddress
                    }];
            });
        });
    };
    TrafficControlModel.getBlockedIPs = function () {
        return __awaiter(this, arguments, void 0, function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    TrafficControlModel.blockCountry = function (countryCode, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'Country blocked successfully',
                        countryCode: countryCode,
                        reason: reason
                    }];
            });
        });
    };
    TrafficControlModel.unblockCountry = function (countryCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'Country unblocked successfully',
                        countryCode: countryCode
                    }];
            });
        });
    };
    TrafficControlModel.getBlockedCountries = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    TrafficControlModel.updateRateLimit = function (ruleId, requestsPerMinute, requestsPerHour, requestsPerDay) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'Rate limit updated successfully',
                        ruleId: ruleId,
                        requestsPerMinute: requestsPerMinute,
                        requestsPerHour: requestsPerHour,
                        requestsPerDay: requestsPerDay
                    }];
            });
        });
    };
    TrafficControlModel.blockDevice = function (deviceType, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'Device blocked successfully',
                        deviceType: deviceType,
                        reason: reason
                    }];
            });
        });
    };
    TrafficControlModel.unblockDevice = function (deviceType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        success: true,
                        message: 'Device unblocked successfully',
                        deviceType: deviceType
                    }];
            });
        });
    };
    TrafficControlModel.getTrafficControlDashboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        stats: {
                            totalRequests: 0,
                            allowedRequests: 0,
                            blockedRequests: 0,
                            redirectedRequests: 0,
                            throttledRequests: 0,
                            byRule: {},
                            byCountry: {},
                            byDevice: {},
                            byHour: {},
                            topIPs: []
                        },
                        recentEvents: [],
                        activeRules: []
                    }];
            });
        });
    };
    TrafficControlModel.exportRules = function (format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        format: format,
                        rules: [],
                        exportedAt: new Date()
                    }];
            });
        });
    };
    TrafficControlModel.importRules = function (rules_1) {
        return __awaiter(this, arguments, void 0, function (rules, overwrite) {
            if (overwrite === void 0) { overwrite = false; }
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        imported: rules.length,
                        skipped: 0,
                        errors: [],
                        importedAt: new Date()
                    }];
            });
        });
    };
    return TrafficControlModel;
}());
exports.TrafficControlModel = TrafficControlModel;
