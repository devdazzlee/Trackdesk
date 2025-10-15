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
exports.AlertsService = void 0;
var Alerts_1 = require("../models/Alerts");
var AlertsService = /** @class */ (function () {
    function AlertsService() {
    }
    // CRUD Operations
    AlertsService.createAlert = function (accountId, alertData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.create(__assign({ accountId: accountId }, alertData))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlertsService.getAlert = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.findById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlertsService.updateAlert = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.update(id, updateData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlertsService.deleteAlert = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.delete(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlertsService.listAlerts = function (accountId_1) {
        return __awaiter(this, arguments, void 0, function (accountId, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.list(accountId, filters)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Alert Rules Management
    AlertsService.addRule = function (alertId, ruleData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    AlertsService.updateRule = function (alertId, ruleId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    AlertsService.removeRule = function (alertId, ruleId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    // Alert Actions Management
    AlertsService.addAction = function (alertId, actionData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    AlertsService.updateAction = function (alertId, actionId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    AlertsService.removeAction = function (alertId, actionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    // Alert Triggers
    AlertsService.triggerAlert = function (alertId, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.triggerAlert(alertId, triggerData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AlertsService.testAlert = function (alertId, testData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true }]; // Simplified
            });
        });
    };
    // Alert History
    AlertsService.getAlertHistory = function (alertId_1) {
        return __awaiter(this, arguments, void 0, function (alertId, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Simplified
            });
        });
    };
    // Statistics
    AlertsService.getAlertStats = function (accountId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.getAlertStats(accountId, startDate, endDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Dashboard
    AlertsService.getAlertsDashboard = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.getAlertDashboard(accountId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Default Alerts
    AlertsService.createDefaultAlerts = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Alerts_1.AlertsModel.createDefaultAlerts(accountId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Business Logic Methods
    AlertsService.evaluateAlertConditions = function (alertId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var alert, results, _i, _a, rule, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getAlert(alertId)];
                    case 1:
                        alert = _b.sent();
                        if (!alert) {
                            throw new Error('Alert not found');
                        }
                        results = [];
                        for (_i = 0, _a = []; _i < _a.length; _i++) { // Simplified - no rules
                            rule = _a[_i];
                            if (!rule.isActive)
                                continue;
                            result = this.evaluateRule(rule, data);
                            results.push({
                                ruleId: rule.id,
                                ruleName: rule.name,
                                result: result,
                                triggered: result.triggered
                            });
                        }
                        return [2 /*return*/, results];
                }
            });
        });
    };
    AlertsService.evaluateRule = function (rule, data) {
        var conditions = rule.conditions;
        var allConditionsMet = true;
        var conditionResults = [];
        for (var _i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
            var condition = conditions_1[_i];
            if (!condition.isActive)
                continue;
            var fieldValue = this.getFieldValue(data, condition.field);
            var conditionMet = false;
            switch (condition.operator) {
                case 'EQUALS':
                    conditionMet = fieldValue === condition.value;
                    break;
                case 'NOT_EQUALS':
                    conditionMet = fieldValue !== condition.value;
                    break;
                case 'GREATER_THAN':
                    conditionMet = Number(fieldValue) > Number(condition.value);
                    break;
                case 'LESS_THAN':
                    conditionMet = Number(fieldValue) < Number(condition.value);
                    break;
                case 'CONTAINS':
                    conditionMet = String(fieldValue).includes(String(condition.value));
                    break;
                case 'IN':
                    conditionMet = Array.isArray(condition.value) && condition.value.includes(fieldValue);
                    break;
                case 'NOT_IN':
                    conditionMet = Array.isArray(condition.value) && !condition.value.includes(fieldValue);
                    break;
                case 'REGEX':
                    try {
                        var regex = new RegExp(condition.value);
                        conditionMet = regex.test(String(fieldValue));
                    }
                    catch (_a) {
                        conditionMet = false;
                    }
                    break;
            }
            conditionResults.push({
                field: condition.field,
                operator: condition.operator,
                value: condition.value,
                actualValue: fieldValue,
                met: conditionMet
            });
            if (!conditionMet) {
                allConditionsMet = false;
            }
        }
        return {
            triggered: allConditionsMet,
            conditionResults: conditionResults
        };
    };
    AlertsService.getFieldValue = function (data, field) {
        var fields = field.split('.');
        var value = data;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            value = value === null || value === void 0 ? void 0 : value[f];
        }
        return value;
    };
    AlertsService.executeAlertActions = function (alertId, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var alert, results, _i, _a, action, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getAlert(alertId)];
                    case 1:
                        alert = _b.sent();
                        if (!alert) {
                            throw new Error('Alert not found');
                        }
                        results = [];
                        _i = 0, _a = alert.actions;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        action = _a[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.executeAction(action, triggerData)];
                    case 4:
                        result = _b.sent();
                        results.push({
                            actionId: 'action-id',
                            actionName: 'action-name',
                            success: true,
                            result: result
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        results.push({
                            actionId: 'action-id',
                            actionName: 'action-name',
                            success: false,
                            error: error_1.message
                        });
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, results];
                }
            });
        });
    };
    AlertsService.executeAction = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = action.type;
                        switch (_a) {
                            case 'EMAIL': return [3 /*break*/, 1];
                            case 'SMS': return [3 /*break*/, 3];
                            case 'WEBHOOK': return [3 /*break*/, 5];
                            case 'NOTIFICATION': return [3 /*break*/, 7];
                            case 'SLACK': return [3 /*break*/, 9];
                            case 'DISCORD': return [3 /*break*/, 11];
                            case 'TEAMS': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 15];
                    case 1: return [4 /*yield*/, this.sendEmail(action, triggerData)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.sendSMS(action, triggerData)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.sendWebhook(action, triggerData)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [4 /*yield*/, this.sendNotification(action, triggerData)];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9: return [4 /*yield*/, this.sendSlackMessage(action, triggerData)];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11: return [4 /*yield*/, this.sendDiscordMessage(action, triggerData)];
                    case 12: return [2 /*return*/, _b.sent()];
                    case 13: return [4 /*yield*/, this.sendTeamsMessage(action, triggerData)];
                    case 14: return [2 /*return*/, _b.sent()];
                    case 15: throw new Error("Unknown action type: ".concat(action.type));
                }
            });
        });
    };
    AlertsService.sendEmail = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var emailData;
            return __generator(this, function (_a) {
                emailData = {
                    to: action.parameters.recipients,
                    subject: this.replacePlaceholders(action.parameters.subject, triggerData),
                    body: this.replacePlaceholders(action.parameters.body, triggerData),
                    from: action.parameters.from
                };
                // Call email service
                return [2 /*return*/, { type: 'EMAIL', sent: true, data: emailData }];
            });
        });
    };
    AlertsService.sendSMS = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var smsData;
            return __generator(this, function (_a) {
                smsData = {
                    to: action.parameters.recipients,
                    message: this.replacePlaceholders(action.parameters.message, triggerData)
                };
                // Call SMS service
                return [2 /*return*/, { type: 'SMS', sent: true, data: smsData }];
            });
        });
    };
    AlertsService.sendWebhook = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var webhookData;
            return __generator(this, function (_a) {
                webhookData = {
                    url: action.parameters.url,
                    method: action.parameters.method || 'POST',
                    headers: action.parameters.headers || {},
                    body: this.replacePlaceholders(action.parameters.body, triggerData)
                };
                // Call webhook service
                return [2 /*return*/, { type: 'WEBHOOK', sent: true, data: webhookData }];
            });
        });
    };
    AlertsService.sendNotification = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var notificationData;
            return __generator(this, function (_a) {
                notificationData = {
                    title: this.replacePlaceholders(action.parameters.title, triggerData),
                    message: this.replacePlaceholders(action.parameters.message, triggerData),
                    type: action.parameters.type || 'info',
                    recipients: action.parameters.recipients
                };
                // Call notification service
                return [2 /*return*/, { type: 'NOTIFICATION', sent: true, data: notificationData }];
            });
        });
    };
    AlertsService.sendSlackMessage = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var slackData;
            return __generator(this, function (_a) {
                slackData = {
                    channel: action.parameters.channel,
                    message: this.replacePlaceholders(action.parameters.message, triggerData),
                    webhookUrl: action.parameters.webhookUrl
                };
                // Call Slack service
                return [2 /*return*/, { type: 'SLACK', sent: true, data: slackData }];
            });
        });
    };
    AlertsService.sendDiscordMessage = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var discordData;
            return __generator(this, function (_a) {
                discordData = {
                    channel: action.parameters.channel,
                    message: this.replacePlaceholders(action.parameters.message, triggerData),
                    webhookUrl: action.parameters.webhookUrl
                };
                // Call Discord service
                return [2 /*return*/, { type: 'DISCORD', sent: true, data: discordData }];
            });
        });
    };
    AlertsService.sendTeamsMessage = function (action, triggerData) {
        return __awaiter(this, void 0, void 0, function () {
            var teamsData;
            return __generator(this, function (_a) {
                teamsData = {
                    channel: action.parameters.channel,
                    message: this.replacePlaceholders(action.parameters.message, triggerData),
                    webhookUrl: action.parameters.webhookUrl
                };
                // Call Teams service
                return [2 /*return*/, { type: 'TEAMS', sent: true, data: teamsData }];
            });
        });
    };
    AlertsService.replacePlaceholders = function (template, data) {
        var _this = this;
        var result = template;
        // Replace placeholders like {{field}} with actual values
        var placeholderRegex = /\{\{([^}]+)\}\}/g;
        result = result.replace(placeholderRegex, function (match, field) {
            var value = _this.getFieldValue(data, field.trim());
            return value !== undefined ? String(value) : match;
        });
        return result;
    };
    AlertsService.getAlertPerformance = function (alertId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var alert, history, performance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAlert(alertId)];
                    case 1:
                        alert = _a.sent();
                        if (!alert) {
                            throw new Error('Alert not found');
                        }
                        return [4 /*yield*/, this.getAlertHistory(alertId, { startDate: startDate, endDate: endDate })];
                    case 2:
                        history = _a.sent();
                        performance = {
                            totalTriggers: history.length,
                            successfulActions: history.filter(function (h) { return h.status === 'SUCCESS'; }).length,
                            failedActions: history.filter(function (h) { return h.status === 'FAILED'; }).length,
                            successRate: history.length > 0 ? (history.filter(function (h) { return h.status === 'SUCCESS'; }).length / history.length) * 100 : 0,
                            averageResponseTime: history.length > 0 ? history.reduce(function (sum, h) { return sum + (h.responseTime || 0); }, 0) / history.length : 0,
                            byActionType: {},
                            byStatus: {},
                            byDate: {}
                        };
                        // Aggregate by action type, status, and date
                        history.forEach(function (record) {
                            performance.byActionType[record.actionType] = (performance.byActionType[record.actionType] || 0) + 1;
                            performance.byStatus[record.status] = (performance.byStatus[record.status] || 0) + 1;
                            var date = new Date(record.triggeredAt).toISOString().split('T')[0];
                            performance.byDate[date] = (performance.byDate[date] || 0) + 1;
                        });
                        return [2 /*return*/, performance];
                }
            });
        });
    };
    AlertsService.getAlertRecommendations = function (alertId) {
        return __awaiter(this, void 0, void 0, function () {
            var alert, recommendations, performance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAlert(alertId)];
                    case 1:
                        alert = _a.sent();
                        if (!alert) {
                            throw new Error('Alert not found');
                        }
                        recommendations = [];
                        return [4 /*yield*/, this.getAlertPerformance(alertId)];
                    case 2:
                        performance = _a.sent();
                        // Performance recommendations
                        if (performance.successRate < 90) {
                            recommendations.push('Consider reviewing failed actions and improving error handling');
                        }
                        if (performance.averageResponseTime > 5000) {
                            recommendations.push('Optimize action execution to reduce response time');
                        }
                        // Rule recommendations
                        if (true) { // Simplified - always true
                            recommendations.push('Add alert rules to define when the alert should trigger');
                        }
                        // Action recommendations
                        if (alert.actions.length === 0) {
                            recommendations.push('Add alert actions to define what should happen when the alert triggers');
                        }
                        // Frequency recommendations
                        if (false) { // Simplified - always false
                            recommendations.push('Consider using a different frequency to reduce noise');
                        }
                        return [2 /*return*/, recommendations];
                }
            });
        });
    };
    return AlertsService;
}());
exports.AlertsService = AlertsService;
