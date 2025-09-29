"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const prisma_1 = require("../lib/prisma");
class WebhooksService {
    static async createWebhook(accountId, webhookData) {
        return await prisma_1.prisma.webhook.create({
            data: {
                ...webhookData
            }
        });
    }
    static async getWebhook(id) {
        return await prisma_1.prisma.webhook.findUnique({ where: { id } });
    }
    static async updateWebhook(id, updateData) {
        return await prisma_1.prisma.webhook.update({ where: { id }, data: updateData });
    }
    static async deleteWebhook(id) {
        return await prisma_1.prisma.webhook.delete({ where: { id } });
    }
    static async listWebhooks(accountId, filters = {}) {
        return await WebhookModel.list(accountId, filters);
    }
    static async addEvent(webhookId, eventData) {
        return await WebhookModel.addEvent(webhookId, eventData);
    }
    static async updateEvent(webhookId, eventId, updateData) {
        return await WebhookModel.updateEvent(webhookId, eventId, updateData);
    }
    static async removeEvent(webhookId, eventId) {
        return await WebhookModel.removeEvent(webhookId, eventId);
    }
    static async testWebhook(id, testData) {
        return await WebhookModel.testWebhook(id, testData);
    }
    static async triggerWebhook(id, eventData) {
        return await WebhookModel.triggerWebhook(id, eventData);
    }
    static async getWebhookHistory(id, filters = {}) {
        return await WebhookModel.getWebhookHistory(id, filters);
    }
    static async getWebhookLogs(id, page = 1, limit = 50) {
        return await WebhookModel.getWebhookLogs(id, page, limit);
    }
    static async getWebhookStats(id, startDate, endDate) {
        return await WebhookModel.getWebhookStats(id, startDate, endDate);
    }
    static async getWebhookTemplates() {
        return await WebhookModel.getWebhookTemplates();
    }
    static async createWebhookFromTemplate(accountId, templateId, customizations) {
        return await WebhookModel.createFromTemplate(accountId, templateId, customizations);
    }
    static async generateSecret(id) {
        return await WebhookModel.generateSecret(id);
    }
    static async validateSignature(id, signature, payload) {
        return await WebhookModel.validateSignature(id, signature, payload);
    }
    static async retryWebhook(id, logId) {
        return await WebhookModel.retryWebhook(id, logId);
    }
    static async getWebhooksDashboard(accountId) {
        return await WebhookModel.getWebhooksDashboard(accountId);
    }
    static async createDefaultWebhooks(accountId) {
        return await WebhookModel.createDefaultWebhooks(accountId);
    }
    static async receiveWebhook(webhookId, payload, headers) {
        return await WebhookModel.receiveWebhook(webhookId, payload, headers);
    }
    static async exportWebhooks(accountId, format) {
        return await WebhookModel.exportWebhooks(accountId, format);
    }
    static async importWebhooks(accountId, webhooks, overwrite = false) {
        return await WebhookModel.importWebhooks(accountId, webhooks, overwrite);
    }
    static async executeWebhook(webhookId, eventData) {
        const webhook = await this.getWebhook(webhookId);
        if (!webhook) {
            throw new Error('Webhook not found');
        }
        if (!webhook.isActive) {
            throw new Error('Webhook is not active');
        }
        const event = webhook.events.find(e => e.event === eventData.event);
        if (!event) {
            throw new Error(`Event ${eventData.event} is not configured for this webhook`);
        }
        const payload = this.preparePayload(webhook, eventData);
        const result = await this.sendWebhook(webhook, payload);
        await this.logWebhookAttempt(webhookId, eventData, payload, result);
        return result;
    }
    static preparePayload(webhook, eventData) {
        let payload = { ...eventData };
        if (webhook.transformations) {
            for (const transformation of webhook.transformations) {
                payload = this.applyTransformation(payload, transformation);
            }
        }
        if (webhook.filters) {
            for (const filter of webhook.filters) {
                if (!this.evaluateFilter(payload, filter)) {
                    throw new Error(`Payload filtered out by filter: ${filter.name}`);
                }
            }
        }
        return payload;
    }
    static applyTransformation(payload, transformation) {
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
    }
    static formatField(value, format) {
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
    }
    static calculateField(payload, formula) {
        try {
            let processedFormula = formula;
            const placeholderRegex = /\{\{([^}]+)\}\}/g;
            processedFormula = processedFormula.replace(placeholderRegex, (match, field) => {
                const value = this.getFieldValue(payload, field.trim());
                return value !== undefined ? String(value) : '0';
            });
            const allowedChars = /^[0-9+\-*/().\s]+$/;
            if (!allowedChars.test(processedFormula)) {
                throw new Error('Invalid characters in formula');
            }
            return eval(processedFormula);
        }
        catch (error) {
            throw new Error(`Error calculating field: ${error}`);
        }
    }
    static getFieldValue(data, field) {
        const fields = field.split('.');
        let value = data;
        for (const f of fields) {
            value = value?.[f];
        }
        return value;
    }
    static evaluateFilter(payload, filter) {
        const fieldValue = this.getFieldValue(payload, filter.field);
        let conditionMet = false;
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
                    const regex = new RegExp(filter.value);
                    conditionMet = regex.test(String(fieldValue));
                }
                catch {
                    conditionMet = false;
                }
                break;
        }
        return filter.negate ? !conditionMet : conditionMet;
    }
    static async sendWebhook(webhook, payload) {
        const startTime = Date.now();
        try {
            const response = await fetch(webhook.url, {
                method: webhook.method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Trackdesk-Webhook/1.0',
                    ...webhook.headers
                },
                body: JSON.stringify(payload)
            });
            const responseTime = Date.now() - startTime;
            const responseText = await response.text();
            return {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                responseTime,
                response: responseText,
                headers: Object.fromEntries(response.headers.entries())
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                success: false,
                error: error.message,
                responseTime
            };
        }
    }
    static async logWebhookAttempt(webhookId, eventData, payload, result) {
    }
    static async retryFailedWebhook(webhookId, logId) {
        const webhook = await this.getWebhook(webhookId);
        if (!webhook) {
            throw new Error('Webhook not found');
        }
        const logs = await this.getWebhookLogs(webhookId, 1, 1000);
        const log = logs.find(l => l.id === logId);
        if (!log) {
            throw new Error('Webhook log not found');
        }
        if (log.status === 'SUCCESS') {
            throw new Error('Webhook log is not in failed state');
        }
        const result = await this.sendWebhook(webhook, log.payload);
        return result;
    }
    static async getWebhookPerformance(webhookId, startDate, endDate) {
        const webhook = await this.getWebhook(webhookId);
        if (!webhook) {
            throw new Error('Webhook not found');
        }
        const logs = await this.getWebhookLogs(webhookId, 1, 1000);
        const filteredLogs = logs.filter(log => {
            if (startDate && new Date(log.timestamp) < startDate)
                return false;
            if (endDate && new Date(log.timestamp) > endDate)
                return false;
            return true;
        });
        const performance = {
            totalAttempts: filteredLogs.length,
            successfulAttempts: filteredLogs.filter(l => l.status === 'SUCCESS').length,
            failedAttempts: filteredLogs.filter(l => l.status === 'FAILED').length,
            successRate: filteredLogs.length > 0 ? (filteredLogs.filter(l => l.status === 'SUCCESS').length / filteredLogs.length) * 100 : 0,
            averageResponseTime: filteredLogs.length > 0 ? filteredLogs.reduce((sum, l) => sum + (l.responseTime || 0), 0) / filteredLogs.length : 0,
            byStatus: {},
            byEvent: {},
            byHour: {},
            byDay: {}
        };
        filteredLogs.forEach(log => {
            performance.byStatus[log.status] = (performance.byStatus[log.status] || 0) + 1;
            performance.byEvent[log.event] = (performance.byEvent[log.event] || 0) + 1;
            const hour = new Date(log.timestamp).getHours();
            const day = new Date(log.timestamp).toISOString().split('T')[0];
            performance.byHour[hour] = (performance.byHour[hour] || 0) + 1;
            performance.byDay[day] = (performance.byDay[day] || 0) + 1;
        });
        return performance;
    }
    static async getWebhookRecommendations(webhookId) {
        const webhook = await this.getWebhook(webhookId);
        if (!webhook) {
            throw new Error('Webhook not found');
        }
        const recommendations = [];
        const performance = await this.getWebhookPerformance(webhookId);
        if (performance.successRate < 95) {
            recommendations.push('Low success rate - review webhook configuration and endpoint');
        }
        if (performance.averageResponseTime > 5000) {
            recommendations.push('High response time - optimize webhook endpoint');
        }
        if (webhook.events.length === 0) {
            recommendations.push('No events configured - add events to trigger webhook');
        }
        if (!webhook.secret) {
            recommendations.push('No secret configured - add webhook secret for security');
        }
        if (webhook.retryAttempts === 0) {
            recommendations.push('No retry attempts configured - enable retries for failed webhooks');
        }
        return recommendations;
    }
    static async validateWebhookConfiguration(webhookId) {
        const webhook = await this.getWebhook(webhookId);
        if (!webhook) {
            throw new Error('Webhook not found');
        }
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        };
        try {
            new URL(webhook.url);
        }
        catch {
            validation.isValid = false;
            validation.errors.push('Invalid webhook URL');
        }
        const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        if (!validMethods.includes(webhook.method)) {
            validation.isValid = false;
            validation.errors.push('Invalid HTTP method');
        }
        if (webhook.events.length === 0) {
            validation.warnings.push('No events configured');
        }
        if (webhook.headers) {
            for (const [key, value] of Object.entries(webhook.headers)) {
                if (typeof key !== 'string' || typeof value !== 'string') {
                    validation.isValid = false;
                    validation.errors.push('Invalid header format');
                }
            }
        }
        if (webhook.retryAttempts < 0 || webhook.retryAttempts > 10) {
            validation.warnings.push('Retry attempts should be between 0 and 10');
        }
        if (webhook.retryDelay < 0 || webhook.retryDelay > 3600) {
            validation.warnings.push('Retry delay should be between 0 and 3600 seconds');
        }
        return validation;
    }
}
exports.WebhooksService = WebhooksService;
//# sourceMappingURL=WebhooksService.js.map