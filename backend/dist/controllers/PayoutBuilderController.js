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
exports.PayoutBuilderController = void 0;
var PayoutAutomation_1 = require("../models/PayoutAutomation");
var PayoutBuilderController = /** @class */ (function () {
    function PayoutBuilderController() {
    }
    // CRUD Operations
    PayoutBuilderController.createPayoutRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, ruleData, rule, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        ruleData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.createRule(__assign({ accountId: accountId }, ruleData))];
                    case 1:
                        rule = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: rule,
                            message: 'Payout rule created successfully'
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
    PayoutBuilderController.getPayoutRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, rule, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.findById(id)];
                    case 1:
                        rule = _a.sent();
                        if (!rule) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Payout rule not found'
                                })];
                        }
                        res.json({
                            success: true,
                            data: rule
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
    PayoutBuilderController.updatePayoutRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateData, rule, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        updateData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.update(id, updateData)];
                    case 1:
                        rule = _a.sent();
                        res.json({
                            success: true,
                            data: rule,
                            message: 'Payout rule updated successfully'
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
    PayoutBuilderController.deletePayoutRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.delete(id)];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Payout rule deleted successfully'
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
    PayoutBuilderController.listPayoutRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, filters, rules, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        filters = req.query;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.list(accountId, filters)];
                    case 1:
                        rules = _a.sent();
                        res.json({
                            success: true,
                            data: rules,
                            count: rules.length
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
    // Payout Conditions Management
    PayoutBuilderController.addCondition = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, conditionData, rule, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        conditionData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.addCondition(ruleId, conditionData)];
                    case 1:
                        rule = _a.sent();
                        res.json({
                            success: true,
                            data: rule,
                            message: 'Condition added successfully'
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
    PayoutBuilderController.updateCondition = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ruleId, conditionId, updateData, rule, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, ruleId = _a.ruleId, conditionId = _a.conditionId;
                        updateData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.updateCondition(ruleId, conditionId, updateData)];
                    case 1:
                        rule = _b.sent();
                        res.json({
                            success: true,
                            data: rule,
                            message: 'Condition updated successfully'
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
    PayoutBuilderController.removeCondition = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ruleId, conditionId, rule, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, ruleId = _a.ruleId, conditionId = _a.conditionId;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.removeCondition(ruleId, conditionId)];
                    case 1:
                        rule = _b.sent();
                        res.json({
                            success: true,
                            data: rule,
                            message: 'Condition removed successfully'
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
    // Payout Actions Management
    PayoutBuilderController.addAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, actionData, rule, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        actionData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.addAction(ruleId, actionData)];
                    case 1:
                        rule = _a.sent();
                        res.json({
                            success: true,
                            data: rule,
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
    PayoutBuilderController.updateAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ruleId, actionId, updateData, rule, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, ruleId = _a.ruleId, actionId = _a.actionId;
                        updateData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.updateAction(ruleId, actionId, updateData)];
                    case 1:
                        rule = _b.sent();
                        res.json({
                            success: true,
                            data: rule,
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
    PayoutBuilderController.removeAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ruleId, actionId, rule, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, ruleId = _a.ruleId, actionId = _a.actionId;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.removeAction(ruleId, actionId)];
                    case 1:
                        rule = _b.sent();
                        res.json({
                            success: true,
                            data: rule,
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
    // Payout Processing
    PayoutBuilderController.processPayouts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, _a, dryRun, result, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        _a = req.body.dryRun, dryRun = _a === void 0 ? false : _a;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.processPayouts(ruleId, dryRun)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: dryRun ? 'Payout preview generated' : 'Payouts processed successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _b.sent();
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
    PayoutBuilderController.previewPayouts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, filters, preview, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        filters = req.query;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.previewPayouts(ruleId, filters)];
                    case 1:
                        preview = _a.sent();
                        res.json({
                            success: true,
                            data: preview,
                            message: 'Payout preview generated'
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
    // Payout History
    PayoutBuilderController.getPayoutHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, filters, history_1, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        filters = req.query;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.getPayoutHistory(ruleId, filters)];
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
    // Payout Reports
    PayoutBuilderController.generatePayoutReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, _a, _b, format, startDate, endDate, report, error_15;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        _a = req.body, _b = _a.format, format = _b === void 0 ? 'json' : _b, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.generatePayoutReport(ruleId, format, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)];
                    case 1:
                        report = _c.sent();
                        res.json({
                            success: true,
                            data: report,
                            message: 'Payout report generated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _c.sent();
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
    // Statistics
    PayoutBuilderController.getPayoutStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, startDate, endDate, stats, error_16;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.getPayoutStats(accountId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)];
                    case 1:
                        stats = _b.sent();
                        res.json({
                            success: true,
                            data: stats
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
    // Dashboard
    PayoutBuilderController.getPayoutBuilderDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, dashboard, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.getPayoutAutomationDashboard(accountId)];
                    case 1:
                        dashboard = _a.sent();
                        res.json({
                            success: true,
                            data: dashboard
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
    // Default Rules
    PayoutBuilderController.createDefaultRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, rules, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.createDefaultRules(accountId)];
                    case 1:
                        rules = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: rules,
                            message: 'Default payout rules created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
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
    // Rule Testing
    PayoutBuilderController.testRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, testData, result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        testData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.testRule(ruleId, testData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rule test completed'
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
    // Schedule Management
    PayoutBuilderController.updateSchedule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, scheduleData, rule, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        scheduleData = req.body;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.updateSchedule(ruleId, scheduleData)];
                    case 1:
                        rule = _a.sent();
                        res.json({
                            success: true,
                            data: rule,
                            message: 'Schedule updated successfully'
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
    // Export/Import
    PayoutBuilderController.exportRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, format, exportData, error_21;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.query.format, format = _a === void 0 ? 'json' : _a;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.exportRules(accountId, format)];
                    case 1:
                        exportData = _b.sent();
                        res.json({
                            success: true,
                            data: exportData,
                            message: 'Rules exported successfully'
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
    PayoutBuilderController.importRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, rules, _b, overwrite, result, error_22;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.body, rules = _a.rules, _b = _a.overwrite, overwrite = _b === void 0 ? false : _b;
                        return [4 /*yield*/, PayoutAutomation_1.PayoutAutomationModel.importRules(accountId, rules, overwrite)];
                    case 1:
                        result = _c.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rules imported successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _c.sent();
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
    return PayoutBuilderController;
}());
exports.PayoutBuilderController = PayoutBuilderController;
