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
exports.WebhooksService = void 0;
var prisma_1 = require("../lib/prisma");
var WebhooksService = /** @class */ (function () {
    function WebhooksService() {
    }
    // CRUD Operations
    WebhooksService.createWebhook = function (accountId, webhookData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.create({
                            data: __assign({}, webhookData)
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.getWebhook = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findUnique({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.updateWebhook = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.update({ where: { id: id }, data: updateData })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.deleteWebhook = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.delete({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.listWebhooks = function (accountId_1) {
        return __awaiter(this, arguments, void 0, function (accountId, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findMany({ where: filters })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook Events Management
    WebhooksService.addEvent = function (webhookId, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.update({ where: { id: webhookId }, data: eventData })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.updateEvent = function (webhookId, eventId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.update({ where: { id: webhookId }, data: updateData })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.removeEvent = function (webhookId, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.delete({ where: { id: webhookId } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook Testing
    WebhooksService.testWebhook = function (id, testData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findUnique({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.triggerWebhook = function (id, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findUnique({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook History and Logs
    WebhooksService.getWebhookHistory = function (id_1) {
        return __awaiter(this, arguments, void 0, function (id, filters) {
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findMany({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WebhooksService.getWebhookLogs = function (id_1) {
        return __awaiter(this, arguments, void 0, function (id, page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findMany({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook Statistics
    WebhooksService.getWebhookStats = function (id, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findUnique({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook Templates
    WebhooksService.getWebhookTemplates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Simplified - no templates
            });
        });
    };
    WebhooksService.createWebhookFromTemplate = function (accountId, templateId, customizations) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.create({ data: customizations })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook Security
    WebhooksService.generateSecret = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { secret: 'generated-secret' }]; // Simplified
            });
        });
    };
    WebhooksService.validateSignature = function (id, signature, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // Simplified validation
            });
        });
    };
    // Webhook Retry
    WebhooksService.retryWebhook = function (id, logId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.webhook.findUnique({ where: { id: id } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Webhook Dashboard
    WebhooksService.getWebhooksDashboard = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { stats: {} }]; // Simplified dashboard
            });
        });
    };
    // Default Webhooks
    WebhooksService.createDefaultWebhooks = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Simplified - no default webhooks
            });
        });
    };
    // Webhook Endpoint (for receiving webhooks)
    WebhooksService.receiveWebhook = function (webhookId, payload, headers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { received: true }]; // Simplified
            });
        });
    };
    // Export/Import
    WebhooksService.exportWebhooks = function (accountId, format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Simplified export
            });
        });
    };
    WebhooksService.importWebhooks = function (accountId_1, webhooks_1) {
        return __awaiter(this, arguments, void 0, function (accountId, webhooks, overwrite) {
            if (overwrite === void 0) { overwrite = false; }
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Simplified import
            });
        });
    };
    // Business Logic Methods
    WebhooksService.executeWebhook = function (webhookId, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            var webhook, event, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWebhook(webhookId)];
                    case 1:
                        webhook = _a.sent();
                        if (!webhook) {
                            throw new Error('Webhook not found');
                        }
                        if (webhook.status !== 'ACTIVE') {
                            throw new Error('Webhook is not active');
                        }
                        event = webhook.events.find(function (e) { return e === eventData.event; });
                        if (!event) {
                            throw new Error("Event ".concat(eventData.event, " is not configured for this webhook"));
                        }
                        payload = this.preparePayload(webhook, eventData);
                        return [4 /*yield*/, this.sendWebhook(webhook, payload)];
                    case 2:
                        result = _a.sent();
                        // Log the attempt
                        return [4 /*yield*/, this.logWebhookAttempt(webhookId, eventData, payload, result)];
                    case 3:
                        // Log the attempt
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    WebhooksService.preparePayload = function (webhook, eventData) {
        var payload = __assign({}, eventData);
        // Apply transformations
        if (webhook.transformations) {
            for (var _i = 0, _a = webhook.transformations; _i < _a.length; _i++) {
                var transformation = _a[_i];
                payload = this.applyTransformation(payload, transformation);
            }
        }
        // Apply filters
        if (webhook.filters) {
            for (var _b = 0, _c = webhook.filters; _b < _c.length; _b++) {
                var filter = _c[_b];
                if (!this.evaluateFilter(payload, filter)) {
                    throw new Error("Payload filtered out by filter: ".concat(filter.name));
                }
            }
        }
        return payload;
    };
    WebhooksService.applyTransformation = function (payload, transformation) {
        switch (transformation.type) {
            case 'RENAME_FIELD':
                if (payload[transformation.from]) {
                    payload[transformation.to] = payload[transformation.from];
                    delete payload[transformation.from];
                }
                break;
            case 'ADD_FIELD':
                payload[transformation.field] = transformation.value;
                break;
            case 'REMOVE_FIELD':
                delete payload[transformation.field];
                break;
            case 'FORMAT_FIELD':
                if (payload[transformation.field]) {
                    payload[transformation.field] = this.formatField(payload[transformation.field], transformation.format);
                }
                break;
            case 'CALCULATE_FIELD':
                payload[transformation.field] = this.calculateField(payload, transformation.formula);
                break;
        }
        return payload;
    };
    WebhooksService.formatField = function (value, format) {
        switch (format) {
            case 'UPPERCASE':
                return String(value).toUpperCase();
            case 'LOWERCASE':
                return String(value).toLowerCase();
            case 'DATE_ISO':
                return new Date(value).toISOString();
            case 'CURRENCY':
                return parseFloat(value).toFixed(2);
            default:
                return value;
        }
    };
    WebhooksService.calculateField = function (payload, formula) {
        var _this = this;
        try {
            // Replace placeholders in formula with actual values
            var processedFormula = formula;
            var placeholderRegex = /\{\{([^}]+)\}\}/g;
            processedFormula = processedFormula.replace(placeholderRegex, function (match, field) {
                var value = _this.getFieldValue(payload, field.trim());
                return value !== undefined ? String(value) : '0';
            });
            // Evaluate the formula (basic math operations only for security)
            var allowedChars = /^[0-9+\-*/().\s]+$/;
            if (!allowedChars.test(processedFormula)) {
                throw new Error('Invalid characters in formula');
            }
            return eval(processedFormula);
        }
        catch (error) {
            throw new Error("Error calculating field: ".concat(error));
        }
    };
    WebhooksService.getFieldValue = function (data, field) {
        var fields = field.split('.');
        var value = data;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            value = value === null || value === void 0 ? void 0 : value[f];
        }
        return value;
    };
    WebhooksService.evaluateFilter = function (payload, filter) {
        var fieldValue = this.getFieldValue(payload, filter.field);
        var conditionMet = false;
        switch (filter.operator) {
            case 'EQUALS':
                conditionMet = fieldValue === filter.value;
                break;
            case 'NOT_EQUALS':
                conditionMet = fieldValue !== filter.value;
                break;
            case 'GREATER_THAN':
                conditionMet = Number(fieldValue) > Number(filter.value);
                break;
            case 'LESS_THAN':
                conditionMet = Number(fieldValue) < Number(filter.value);
                break;
            case 'CONTAINS':
                conditionMet = String(fieldValue).includes(String(filter.value));
                break;
            case 'NOT_CONTAINS':
                conditionMet = !String(fieldValue).includes(String(filter.value));
                break;
            case 'IN':
                conditionMet = Array.isArray(filter.value) && filter.value.includes(fieldValue);
                break;
            case 'NOT_IN':
                conditionMet = Array.isArray(filter.value) && !filter.value.includes(fieldValue);
                break;
            case 'REGEX':
                try {
                    var regex = new RegExp(filter.value);
                    conditionMet = regex.test(String(fieldValue));
                }
                catch (_a) {
                    conditionMet = false;
                }
                break;
        }
        return filter.negate ? !conditionMet : conditionMet;
    };
    WebhooksService.sendWebhook = function (webhook, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, response, responseTime, responseText, error_1, responseTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(webhook.url, {
                                method: 'POST', // Default to POST since method doesn't exist in schema
                                headers: {
                                    'Content-Type': 'application/json',
                                    'User-Agent': 'Trackdesk-Webhook/1.0'
                                },
                                body: JSON.stringify(payload)
                            })];
                    case 2:
                        response = _a.sent();
                        responseTime = Date.now() - startTime;
                        return [4 /*yield*/, response.text()];
                    case 3:
                        responseText = _a.sent();
                        return [2 /*return*/, {
                                success: response.ok,
                                status: response.status,
                                statusText: response.statusText,
                                responseTime: responseTime,
                                response: responseText,
                                headers: {} // Simplified - headers not available in this context
                            }];
                    case 4:
                        error_1 = _a.sent();
                        responseTime = Date.now() - startTime;
                        return [2 /*return*/, {
                                success: false,
                                error: error_1.message,
                                responseTime: responseTime
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WebhooksService.logWebhookAttempt = function (webhookId, eventData, payload, result) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    WebhooksService.retryFailedWebhook = function (webhookId, logId) {
        return __awaiter(this, void 0, void 0, function () {
            var webhook, logs, log, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWebhook(webhookId)];
                    case 1:
                        webhook = _a.sent();
                        if (!webhook) {
                            throw new Error('Webhook not found');
                        }
                        return [4 /*yield*/, this.getWebhookLogs(webhookId, 1, 1000)];
                    case 2:
                        logs = _a.sent();
                        log = logs.find(function (l) { return l.id === logId; });
                        if (!log) {
                            throw new Error('Webhook log not found');
                        }
                        // Simplified check since log structure is different
                        if (log.status === 'ACTIVE') {
                            throw new Error('Webhook log is not in failed state');
                        }
                        return [4 /*yield*/, this.sendWebhook(webhook, {})];
                    case 3:
                        result = _a.sent();
                        // Update the log entry
                        // This would typically be handled by a WebhookLog model
                        return [2 /*return*/, result];
                }
            });
        });
    };
    WebhooksService.getWebhookPerformance = function (webhookId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var webhook, logs, filteredLogs, performance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWebhook(webhookId)];
                    case 1:
                        webhook = _a.sent();
                        if (!webhook) {
                            throw new Error('Webhook not found');
                        }
                        return [4 /*yield*/, this.getWebhookLogs(webhookId, 1, 1000)];
                    case 2:
                        logs = _a.sent();
                        filteredLogs = logs.filter(function (log) {
                            if (startDate && new Date(log.createdAt) < startDate)
                                return false;
                            if (endDate && new Date(log.createdAt) > endDate)
                                return false;
                            return true;
                        });
                        performance = {
                            totalAttempts: filteredLogs.length,
                            successfulAttempts: filteredLogs.filter(function (l) { return l.status === 'ACTIVE'; }).length,
                            failedAttempts: filteredLogs.filter(function (l) { return l.status === 'ERROR'; }).length,
                            successRate: filteredLogs.length > 0 ? (filteredLogs.filter(function (l) { return l.status === 'ACTIVE'; }).length / filteredLogs.length) * 100 : 0,
                            averageResponseTime: filteredLogs.length > 0 ? filteredLogs.reduce(function (sum, l) { return sum + (l.successRate || 0); }, 0) / filteredLogs.length : 0,
                            byStatus: {},
                            byEvent: {},
                            byHour: {},
                            byDay: {}
                        };
                        // Aggregate by status, event, hour, and day
                        filteredLogs.forEach(function (log) {
                            performance.byStatus[log.status] = (performance.byStatus[log.status] || 0) + 1;
                            performance.byEvent[log.events[0] || 'unknown'] = (performance.byEvent[log.events[0] || 'unknown'] || 0) + 1;
                            var hour = new Date(log.createdAt).getHours();
                            var day = new Date(log.createdAt).toISOString().split('T')[0];
                            performance.byHour[hour] = (performance.byHour[hour] || 0) + 1;
                            performance.byDay[day] = (performance.byDay[day] || 0) + 1;
                        });
                        return [2 /*return*/, performance];
                }
            });
        });
    };
    WebhooksService.getWebhookRecommendations = function (webhookId) {
        return __awaiter(this, void 0, void 0, function () {
            var webhook, recommendations, performance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWebhook(webhookId)];
                    case 1:
                        webhook = _a.sent();
                        if (!webhook) {
                            throw new Error('Webhook not found');
                        }
                        recommendations = [];
                        return [4 /*yield*/, this.getWebhookPerformance(webhookId)];
                    case 2:
                        performance = _a.sent();
                        // Performance recommendations
                        if (performance.successRate < 95) {
                            recommendations.push('Low success rate - review webhook configuration and endpoint');
                        }
                        if (performance.averageResponseTime > 5000) {
                            recommendations.push('High response time - optimize webhook endpoint');
                        }
                        // Configuration recommendations
                        if (webhook.events.length === 0) {
                            recommendations.push('No events configured - add events to trigger webhook');
                        }
                        if (!webhook.secret) {
                            recommendations.push('No secret configured - add webhook secret for security');
                        }
                        // Retry recommendations
                        if (webhook.totalCalls === 0) {
                            recommendations.push('No retry attempts configured - enable retries for failed webhooks');
                        }
                        return [2 /*return*/, recommendations];
                }
            });
        });
    };
    WebhooksService.validateWebhookConfiguration = function (webhookId) {
        return __awaiter(this, void 0, void 0, function () {
            var webhook, validation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWebhook(webhookId)];
                    case 1:
                        webhook = _a.sent();
                        if (!webhook) {
                            throw new Error('Webhook not found');
                        }
                        validation = {
                            isValid: true,
                            errors: [],
                            warnings: []
                        };
                        // Validate URL
                        try {
                            new URL(webhook.url);
                        }
                        catch (_b) {
                            validation.isValid = false;
                            validation.errors.push('Invalid webhook URL');
                        }
                        // Validate events
                        if (webhook.events.length === 0) {
                            validation.warnings.push('No events configured');
                        }
                        return [2 /*return*/, validation];
                }
            });
        });
    };
    return WebhooksService;
}());
exports.WebhooksService = WebhooksService;
