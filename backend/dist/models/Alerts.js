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
exports.AlertsModel = void 0;
var AlertsModel = /** @class */ (function () {
    function AlertsModel() {
    }
    AlertsModel.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation since alert table doesn't exist in schema
                return [2 /*return*/, {
                        id: 'mock-alert-id',
                        accountId: data.accountId,
                        name: data.name,
                        description: data.description || '',
                        type: data.type,
                        severity: data.severity || 'MEDIUM',
                        status: data.status || 'ACTIVE',
                        conditions: data.conditions || [],
                        actions: data.actions || [],
                        recipients: data.recipients || [],
                        cooldownPeriod: data.cooldownPeriod || 60,
                        triggerCount: 0,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }];
            });
        });
    };
    AlertsModel.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, null];
            });
        });
    };
    AlertsModel.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        id: id,
                        accountId: 'mock-account',
                        name: 'Mock Alert',
                        description: '',
                        type: 'SYSTEM',
                        severity: 'MEDIUM',
                        status: 'ACTIVE',
                        conditions: [],
                        actions: [],
                        recipients: [],
                        cooldownPeriod: 60,
                        triggerCount: 0,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }];
            });
        });
    };
    AlertsModel.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    AlertsModel.list = function (accountId_1) {
        return __awaiter(this, arguments, void 0, function (accountId, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    AlertsModel.triggerAlert = function (alertId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        id: 'mock-event-id',
                        alertId: alertId,
                        type: 'SYSTEM',
                        severity: 'MEDIUM',
                        title: 'Mock Alert',
                        message: 'This is a mock alert event',
                        data: data,
                        status: 'TRIGGERED',
                        triggeredAt: new Date()
                    }];
            });
        });
    };
    AlertsModel.testAlert = function (alertId) {
        return __awaiter(this, void 0, void 0, function () {
            var testData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testData = {
                            test: true,
                            timestamp: new Date().toISOString(),
                            message: 'This is a test alert'
                        };
                        return [4 /*yield*/, this.triggerAlert(alertId, testData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlertsModel.getAlertStats = function (accountId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        totalAlerts: 0,
                        activeAlerts: 0,
                        triggeredAlerts: 0,
                        resolvedAlerts: 0,
                        totalEvents: 0,
                        eventsByType: {},
                        eventsBySeverity: {},
                        eventsByStatus: {},
                        topAlerts: []
                    }];
            });
        });
    };
    AlertsModel.createDefaultAlerts = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, []];
            });
        });
    };
    AlertsModel.getAlertDashboard = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock implementation
                return [2 /*return*/, {
                        alerts: [],
                        recentEvents: [],
                        stats: {
                            totalAlerts: 0,
                            activeAlerts: 0,
                            triggeredAlerts: 0,
                            resolvedAlerts: 0,
                            totalEvents: 0,
                            eventsByType: {},
                            eventsBySeverity: {},
                            eventsByStatus: {},
                            topAlerts: []
                        }
                    }];
            });
        });
    };
    return AlertsModel;
}());
exports.AlertsModel = AlertsModel;
