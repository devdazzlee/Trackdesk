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
exports.WebhooksController = void 0;
var WebhooksService_1 = require("../services/WebhooksService");
var WebhooksController = /** @class */ (function () {
    function WebhooksController() {
    }
    // CRUD Operations
    WebhooksController.createWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, webhookData, webhook, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        webhookData = req.body;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.createWebhook(accountId, webhookData)];
                    case 1:
                        webhook = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: webhook,
                            message: 'Webhook created successfully'
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
    WebhooksController.getWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, webhook, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.getWebhook(id)];
                    case 1:
                        webhook = _a.sent();
                        if (!webhook) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Webhook not found'
                                })];
                        }
                        res.json({
                            success: true,
                            data: webhook
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
    WebhooksController.updateWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateData, webhook, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        updateData = req.body;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.updateWebhook(id, updateData)];
                    case 1:
                        webhook = _a.sent();
                        res.json({
                            success: true,
                            data: webhook,
                            message: 'Webhook updated successfully'
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
    WebhooksController.deleteWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.deleteWebhook(id)];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Webhook deleted successfully'
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
    WebhooksController.listWebhooks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, filters, webhooks, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        filters = req.query;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.listWebhooks(accountId, filters)];
                    case 1:
                        webhooks = _a.sent();
                        res.json({
                            success: true,
                            data: webhooks,
                            count: webhooks.length
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
    // Webhook Events Management
    WebhooksController.addEvent = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var webhookId, eventData, webhook, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        webhookId = req.params.webhookId;
                        eventData = req.body;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.addEvent(webhookId, eventData)];
                    case 1:
                        webhook = _a.sent();
                        res.json({
                            success: true,
                            data: webhook,
                            message: 'Event added successfully'
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
    WebhooksController.updateEvent = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, webhookId, eventId, updateData, webhook, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, webhookId = _a.webhookId, eventId = _a.eventId;
                        updateData = req.body;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.updateEvent(webhookId, eventId, updateData)];
                    case 1:
                        webhook = _b.sent();
                        res.json({
                            success: true,
                            data: webhook,
                            message: 'Event updated successfully'
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
    WebhooksController.removeEvent = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, webhookId, eventId, webhook, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, webhookId = _a.webhookId, eventId = _a.eventId;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.removeEvent(webhookId, eventId)];
                    case 1:
                        webhook = _b.sent();
                        res.json({
                            success: true,
                            data: webhook,
                            message: 'Event removed successfully'
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
    // Webhook Testing
    WebhooksController.testWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, testData, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        testData = req.body;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.testWebhook(id, testData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Webhook test completed'
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
    WebhooksController.triggerWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, eventData, result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        eventData = req.body;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.triggerWebhook(id, eventData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Webhook triggered successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
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
    // Webhook History
    WebhooksController.getWebhookHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, filters, history_1, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        filters = req.query;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.getWebhookHistory(id, filters)];
                    case 1:
                        history_1 = _a.sent();
                        res.json({
                            success: true,
                            data: history_1,
                            count: history_1.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
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
    // Webhook Logs
    WebhooksController.getWebhookLogs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b, page, _c, limit, logs, error_12;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 50 : _c;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.getWebhookLogs(id, Number(page), Number(limit))];
                    case 1:
                        logs = _d.sent();
                        res.json({
                            success: true,
                            data: logs,
                            count: logs.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _d.sent();
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
    // Webhook Statistics
    WebhooksController.getWebhookStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, startDate, endDate, stats, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.getWebhookStats(id, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)];
                    case 1:
                        stats = _b.sent();
                        res.json({
                            success: true,
                            data: stats
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
    // Webhook Templates
    WebhooksController.getWebhookTemplates = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var templates, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.getWebhookTemplates()];
                    case 1:
                        templates = _a.sent();
                        res.json({
                            success: true,
                            data: templates,
                            count: templates.length
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
    WebhooksController.createWebhookFromTemplate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, templateId, customizations, webhook, error_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.body, templateId = _a.templateId, customizations = _a.customizations;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.createWebhookFromTemplate(accountId, templateId, customizations)];
                    case 1:
                        webhook = _b.sent();
                        res.status(201).json({
                            success: true,
                            data: webhook,
                            message: 'Webhook created from template successfully'
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
    // Webhook Security
    WebhooksController.generateSecret = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, secret, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.generateSecret(id)];
                    case 1:
                        secret = _a.sent();
                        res.json({
                            success: true,
                            data: { secret: secret },
                            message: 'Webhook secret generated successfully'
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
    WebhooksController.validateSignature = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, signature, payload, isValid, error_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.body, signature = _a.signature, payload = _a.payload;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.validateSignature(id, signature, payload)];
                    case 1:
                        isValid = _b.sent();
                        res.json({
                            success: true,
                            data: { isValid: isValid },
                            message: 'Signature validation completed'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _b.sent();
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
    // Webhook Retry
    WebhooksController.retryWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, logId, result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        logId = req.body.logId;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.retryWebhook(id, logId)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Webhook retry initiated'
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
    // Webhook Dashboard
    WebhooksController.getWebhooksDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, dashboard, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.getWebhooksDashboard(accountId)];
                    case 1:
                        dashboard = _a.sent();
                        res.json({
                            success: true,
                            data: dashboard
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
    // Default Webhooks
    WebhooksController.createDefaultWebhooks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, webhooks, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.createDefaultWebhooks(accountId)];
                    case 1:
                        webhooks = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: webhooks,
                            message: 'Default webhooks created successfully'
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
    // Webhook Endpoint (for receiving webhooks)
    WebhooksController.receiveWebhook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var webhookId, payload, headers, result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        webhookId = req.params.webhookId;
                        payload = req.body;
                        headers = req.headers;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.receiveWebhook(webhookId, payload, headers)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Webhook received successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
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
    // Export/Import
    WebhooksController.exportWebhooks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, format, exportData, error_22;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.query.format, format = _a === void 0 ? 'json' : _a;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.exportWebhooks(accountId, format)];
                    case 1:
                        exportData = _b.sent();
                        res.json({
                            success: true,
                            data: exportData,
                            message: 'Webhooks exported successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _b.sent();
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
    WebhooksController.importWebhooks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, _a, webhooks, _b, overwrite, result, error_23;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        accountId = req.user.accountId;
                        _a = req.body, webhooks = _a.webhooks, _b = _a.overwrite, overwrite = _b === void 0 ? false : _b;
                        return [4 /*yield*/, WebhooksService_1.WebhooksService.importWebhooks(accountId, webhooks, overwrite)];
                    case 1:
                        result = _c.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Webhooks imported successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _c.sent();
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
    return WebhooksController;
}());
exports.WebhooksController = WebhooksController;
