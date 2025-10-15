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
exports.AlertsController = void 0;
var AlertsService_1 = require("../services/AlertsService");
var AlertsController = /** @class */ (function () {
    function AlertsController() {
    }
    // CRUD Operations
    AlertsController.createAlert = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, alertData, alert_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        alertData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.createAlert(accountId, alertData)];
                    case 1:
                        alert_1 = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: alert_1,
                            message: 'Alert created successfully'
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
    AlertsController.getAlert = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, alert_2, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, AlertsService_1.AlertsService.getAlert(id)];
                    case 1:
                        alert_2 = _a.sent();
                        if (!alert_2) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Alert not found'
                                })];
                        }
                        res.json({
                            success: true,
                            data: alert_2
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
    AlertsController.updateAlert = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateData, alert_3, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        updateData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.updateAlert(id, updateData)];
                    case 1:
                        alert_3 = _a.sent();
                        res.json({
                            success: true,
                            data: alert_3,
                            message: 'Alert updated successfully'
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
    AlertsController.deleteAlert = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, AlertsService_1.AlertsService.deleteAlert(id)];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Alert deleted successfully'
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
    AlertsController.listAlerts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, filters, alerts, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        filters = req.query;
                        return [4 /*yield*/, AlertsService_1.AlertsService.listAlerts(accountId, filters)];
                    case 1:
                        alerts = _a.sent();
                        res.json({
                            success: true,
                            data: alerts,
                            count: alerts.length
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
    // Alert Rules Management
    AlertsController.addRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var alertId, ruleData, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        alertId = req.params.alertId;
                        ruleData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.addRule(alertId, ruleData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rule added successfully'
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
    AlertsController.updateRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, alertId, ruleId, updateData, result, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, alertId = _a.alertId, ruleId = _a.ruleId;
                        updateData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.updateRule(alertId, ruleId, updateData)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rule updated successfully'
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
    AlertsController.removeRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, alertId, ruleId, result, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, alertId = _a.alertId, ruleId = _a.ruleId;
                        return [4 /*yield*/, AlertsService_1.AlertsService.removeRule(alertId, ruleId)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rule removed successfully'
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
    // Alert Actions Management
    AlertsController.addAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var alertId, actionData, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        alertId = req.params.alertId;
                        actionData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.addAction(alertId, actionData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Action added successfully'
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
    AlertsController.updateAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, alertId, actionId, updateData, result, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, alertId = _a.alertId, actionId = _a.actionId;
                        updateData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.updateAction(alertId, actionId, updateData)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Action updated successfully'
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
    AlertsController.removeAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, alertId, actionId, result, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, alertId = _a.alertId, actionId = _a.actionId;
                        return [4 /*yield*/, AlertsService_1.AlertsService.removeAction(alertId, actionId)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Action removed successfully'
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
    // Alert Triggers
    AlertsController.triggerAlert = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var alertId, triggerData, result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        alertId = req.params.alertId;
                        triggerData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.triggerAlert(alertId, triggerData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Alert triggered successfully'
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
    AlertsController.testAlert = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var alertId, testData, result, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        alertId = req.params.alertId;
                        testData = req.body;
                        return [4 /*yield*/, AlertsService_1.AlertsService.testAlert(alertId, testData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Alert test completed'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
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
    // Alert History
    AlertsController.getAlertHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var alertId, filters, history_1, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        alertId = req.params.alertId;
                        filters = req.query;
                        return [4 /*yield*/, AlertsService_1.AlertsService.getAlertHistory(alertId, filters)];
                    case 1:
                        history_1 = _a.sent();
                        res.json({
                            success: true,
                            data: history_1,
                            count: history_1.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
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
    // Statistics
    AlertsController.getAlertStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, startDate, endDate, stats, error_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, AlertsService_1.AlertsService.getAlertStats(accountId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)];
                    case 1:
                        stats = _b.sent();
                        res.json({
                            success: true,
                            data: stats
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _b.sent();
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
    // Dashboard
    AlertsController.getAlertsDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, dashboard, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, AlertsService_1.AlertsService.getAlertsDashboard(accountId)];
                    case 1:
                        dashboard = _a.sent();
                        res.json({
                            success: true,
                            data: dashboard
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
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
    // Default Alerts
    AlertsController.createDefaultAlerts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, alerts, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, AlertsService_1.AlertsService.createDefaultAlerts(accountId)];
                    case 1:
                        alerts = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: alerts,
                            message: 'Default alerts created successfully'
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
    return AlertsController;
}());
exports.AlertsController = AlertsController;
