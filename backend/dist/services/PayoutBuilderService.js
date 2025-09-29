"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBuilderService = void 0;
const PayoutAutomation_1 = require("../models/PayoutAutomation");
class PayoutBuilderService {
    static async createPayoutRule(accountId, ruleData) {
        return await PayoutAutomation_1.PayoutAutomationModel.createRule({
            accountId,
            ...ruleData
        });
    }
    static async getPayoutRule(id) {
        return await PayoutAutomation_1.PayoutAutomationModel.findById(id);
    }
    static async updatePayoutRule(id, updateData) {
        return await PayoutAutomation_1.PayoutAutomationModel.update(id, updateData);
    }
    static async deletePayoutRule(id) {
        return await PayoutAutomation_1.PayoutAutomationModel.delete(id);
    }
    static async listPayoutRules(accountId, filters = {}) {
        return await PayoutAutomation_1.PayoutAutomationModel.list(accountId, filters);
    }
    static async addCondition(ruleId, conditionData) {
        return await PayoutAutomation_1.PayoutAutomationModel.addCondition(ruleId, conditionData);
    }
    static async updateCondition(ruleId, conditionId, updateData) {
        return await PayoutAutomation_1.PayoutAutomationModel.updateCondition(ruleId, conditionId, updateData);
    }
    static async removeCondition(ruleId, conditionId) {
        return await PayoutAutomation_1.PayoutAutomationModel.removeCondition(ruleId, conditionId);
    }
    static async addAction(ruleId, actionData) {
        return await PayoutAutomation_1.PayoutAutomationModel.addAction(ruleId, actionData);
    }
    static async updateAction(ruleId, actionId, updateData) {
        return await PayoutAutomation_1.PayoutAutomationModel.updateAction(ruleId, actionId, updateData);
    }
    static async removeAction(ruleId, actionId) {
        return await PayoutAutomation_1.PayoutAutomationModel.removeAction(ruleId, actionId);
    }
    static async processPayouts(ruleId, dryRun = false) {
        return await PayoutAutomation_1.PayoutAutomationModel.processPayouts(ruleId, dryRun);
    }
    static async previewPayouts(ruleId, filters = {}) {
        return await PayoutAutomation_1.PayoutAutomationModel.previewPayouts(ruleId, filters);
    }
    static async getPayoutHistory(ruleId, filters = {}) {
        return await PayoutAutomation_1.PayoutAutomationModel.getPayoutHistory(ruleId, filters);
    }
    static async generatePayoutReport(ruleId, format, startDate, endDate) {
        return await PayoutAutomation_1.PayoutAutomationModel.generatePayoutReport(ruleId, format, startDate, endDate);
    }
    static async getPayoutStats(accountId, startDate, endDate) {
        return await PayoutAutomation_1.PayoutAutomationModel.getPayoutStats(accountId, startDate, endDate);
    }
    static async getPayoutBuilderDashboard(accountId) {
        return await PayoutAutomation_1.PayoutAutomationModel.getPayoutAutomationDashboard(accountId);
    }
    static async createDefaultRules(accountId) {
        return await PayoutAutomation_1.PayoutAutomationModel.createDefaultRules(accountId);
    }
    static async testRule(ruleId, testData) {
        return await PayoutAutomation_1.PayoutAutomationModel.testRule(ruleId, testData);
    }
    static async updateSchedule(ruleId, scheduleData) {
        return await PayoutAutomation_1.PayoutAutomationModel.updateSchedule(ruleId, scheduleData);
    }
    static async exportRules(accountId, format) {
        return await PayoutAutomation_1.PayoutAutomationModel.exportRules(accountId, format);
    }
    static async importRules(accountId, rules, overwrite = false) {
        return await PayoutAutomation_1.PayoutAutomationModel.importRules(accountId, rules, overwrite);
    }
    static async evaluatePayoutConditions(ruleId, data) {
        const rule = await this.getPayoutRule(ruleId);
        if (!rule) {
            throw new Error('Payout rule not found');
        }
        const results = [];
        for (const condition of rule.conditions) {
            if (!condition.isActive)
                continue;
            const result = this.evaluateCondition(condition, data);
            results.push({
                conditionId: condition.id,
                conditionName: condition.name,
                result,
                met: result.met
            });
        }
        return results;
    }
    static evaluateCondition(condition, data) {
        const fieldValue = this.getFieldValue(data, condition.field);
        let met = false;
        switch (condition.operator) {
            case 'EQUALS':
                met = fieldValue === condition.value;
                break;
            case 'NOT_EQUALS':
                met = fieldValue !== condition.value;
                break;
            case 'GREATER_THAN':
                met = Number(fieldValue) > Number(condition.value);
                break;
            case 'LESS_THAN':
                met = Number(fieldValue) < Number(condition.value);
                break;
            case 'GREATER_THAN_OR_EQUAL':
                met = Number(fieldValue) >= Number(condition.value);
                break;
            case 'LESS_THAN_OR_EQUAL':
                met = Number(fieldValue) <= Number(condition.value);
                break;
            case 'CONTAINS':
                met = String(fieldValue).includes(String(condition.value));
                break;
            case 'NOT_CONTAINS':
                met = !String(fieldValue).includes(String(condition.value));
                break;
            case 'IN':
                met = Array.isArray(condition.value) && condition.value.includes(fieldValue);
                break;
            case 'NOT_IN':
                met = Array.isArray(condition.value) && !condition.value.includes(fieldValue);
                break;
            case 'REGEX':
                try {
                    const regex = new RegExp(condition.value);
                    met = regex.test(String(fieldValue));
                }
                catch {
                    met = false;
                }
                break;
            case 'IS_EMPTY':
                met = !fieldValue || fieldValue === '';
                break;
            case 'IS_NOT_EMPTY':
                met = fieldValue && fieldValue !== '';
                break;
        }
        return {
            met,
            field: condition.field,
            operator: condition.operator,
            value: condition.value,
            actualValue: fieldValue
        };
    }
    static getFieldValue(data, field) {
        const fields = field.split('.');
        let value = data;
        for (const f of fields) {
            value = value?.[f];
        }
        return value;
    }
    static async executePayoutActions(ruleId, payoutData) {
        const rule = await this.getPayoutRule(ruleId);
        if (!rule) {
            throw new Error('Payout rule not found');
        }
        const results = [];
        for (const action of rule.actions) {
            if (!action.isActive)
                continue;
            try {
                const result = await this.executeAction(action, payoutData);
                results.push({
                    actionId: action.id,
                    actionName: action.name,
                    success: true,
                    result
                });
            }
            catch (error) {
                results.push({
                    actionId: action.id,
                    actionName: action.name,
                    success: false,
                    error: error.message
                });
            }
        }
        return results;
    }
    static async executeAction(action, payoutData) {
        switch (action.type) {
            case 'PAYOUT':
                return await this.processPayout(action, payoutData);
            case 'EMAIL':
                return await this.sendEmail(action, payoutData);
            case 'SMS':
                return await this.sendSMS(action, payoutData);
            case 'WEBHOOK':
                return await this.sendWebhook(action, payoutData);
            case 'NOTIFICATION':
                return await this.sendNotification(action, payoutData);
            case 'HOLD':
                return await this.holdPayout(action, payoutData);
            case 'REJECT':
                return await this.rejectPayout(action, payoutData);
            case 'APPROVE':
                return await this.approvePayout(action, payoutData);
            default:
                throw new Error(`Unknown action type: ${action.type}`);
        }
    }
    static async processPayout(action, payoutData) {
        const payoutInfo = {
            affiliateId: payoutData.affiliateId,
            amount: payoutData.amount,
            currency: payoutData.currency,
            method: action.parameters.method,
            account: action.parameters.account,
            reference: action.parameters.reference
        };
        return { type: 'PAYOUT', processed: true, data: payoutInfo };
    }
    static async sendEmail(action, payoutData) {
        const emailData = {
            to: action.parameters.recipients,
            subject: this.replacePlaceholders(action.parameters.subject, payoutData),
            body: this.replacePlaceholders(action.parameters.body, payoutData),
            from: action.parameters.from
        };
        return { type: 'EMAIL', sent: true, data: emailData };
    }
    static async sendSMS(action, payoutData) {
        const smsData = {
            to: action.parameters.recipients,
            message: this.replacePlaceholders(action.parameters.message, payoutData)
        };
        return { type: 'SMS', sent: true, data: smsData };
    }
    static async sendWebhook(action, payoutData) {
        const webhookData = {
            url: action.parameters.url,
            method: action.parameters.method || 'POST',
            headers: action.parameters.headers || {},
            body: this.replacePlaceholders(action.parameters.body, payoutData)
        };
        return { type: 'WEBHOOK', sent: true, data: webhookData };
    }
    static async sendNotification(action, payoutData) {
        const notificationData = {
            title: this.replacePlaceholders(action.parameters.title, payoutData),
            message: this.replacePlaceholders(action.parameters.message, payoutData),
            type: action.parameters.type || 'info',
            recipients: action.parameters.recipients
        };
        return { type: 'NOTIFICATION', sent: true, data: notificationData };
    }
    static async holdPayout(action, payoutData) {
        const holdData = {
            affiliateId: payoutData.affiliateId,
            amount: payoutData.amount,
            reason: action.parameters.reason,
            holdUntil: action.parameters.holdUntil
        };
        return { type: 'HOLD', held: true, data: holdData };
    }
    static async rejectPayout(action, payoutData) {
        const rejectionData = {
            affiliateId: payoutData.affiliateId,
            amount: payoutData.amount,
            reason: action.parameters.reason
        };
        return { type: 'REJECT', rejected: true, data: rejectionData };
    }
    static async approvePayout(action, payoutData) {
        const approvalData = {
            affiliateId: payoutData.affiliateId,
            amount: payoutData.amount,
            approvedBy: action.parameters.approvedBy
        };
        return { type: 'APPROVE', approved: true, data: approvalData };
    }
    static replacePlaceholders(template, data) {
        let result = template;
        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        result = result.replace(placeholderRegex, (match, field) => {
            const value = this.getFieldValue(data, field.trim());
            return value !== undefined ? String(value) : match;
        });
        return result;
    }
    static async calculatePayoutAmount(ruleId, data) {
        const rule = await this.getPayoutRule(ruleId);
        if (!rule) {
            throw new Error('Payout rule not found');
        }
        let amount = 0;
        switch (rule.payoutType) {
            case 'FIXED':
                amount = rule.payoutAmount;
                break;
            case 'PERCENTAGE':
                amount = (data.orderValue * rule.payoutPercentage) / 100;
                break;
            case 'TIERED':
                if (rule.tieredRates) {
                    for (const tier of rule.tieredRates) {
                        if (data.orderValue >= tier.min && (!tier.max || data.orderValue <= tier.max)) {
                            if (tier.type === 'FIXED') {
                                amount = tier.rate;
                            }
                            else {
                                amount = (data.orderValue * tier.rate) / 100;
                            }
                            break;
                        }
                    }
                }
                break;
            case 'CUSTOM':
                amount = this.calculateCustomAmount(rule.customFormula, data);
                break;
        }
        if (rule.minimumPayout && amount < rule.minimumPayout) {
            amount = rule.minimumPayout;
        }
        if (rule.maximumPayout && amount > rule.maximumPayout) {
            amount = rule.maximumPayout;
        }
        return amount;
    }
    static calculateCustomAmount(formula, data) {
        try {
            let processedFormula = formula;
            const placeholderRegex = /\{\{([^}]+)\}\}/g;
            processedFormula = processedFormula.replace(placeholderRegex, (match, field) => {
                const value = this.getFieldValue(data, field.trim());
                return value !== undefined ? String(value) : '0';
            });
            const allowedChars = /^[0-9+\-*/().\s]+$/;
            if (!allowedChars.test(processedFormula)) {
                throw new Error('Invalid characters in formula');
            }
            return eval(processedFormula);
        }
        catch (error) {
            throw new Error(`Error calculating custom amount: ${error}`);
        }
    }
    static async getPayoutRulePerformance(ruleId, startDate, endDate) {
        const rule = await this.getPayoutRule(ruleId);
        if (!rule) {
            throw new Error('Payout rule not found');
        }
        const history = await this.getPayoutHistory(ruleId, { startDate, endDate });
        const performance = {
            totalPayouts: history.length,
            totalAmount: history.reduce((sum, h) => sum + h.amount, 0),
            successfulPayouts: history.filter(h => h.status === 'SUCCESS').length,
            failedPayouts: history.filter(h => h.status === 'FAILED').length,
            successRate: history.length > 0 ? (history.filter(h => h.status === 'SUCCESS').length / history.length) * 100 : 0,
            averageAmount: history.length > 0 ? history.reduce((sum, h) => sum + h.amount, 0) / history.length : 0,
            byStatus: {},
            byMethod: {},
            byDate: {}
        };
        history.forEach(record => {
            performance.byStatus[record.status] = (performance.byStatus[record.status] || 0) + 1;
            performance.byMethod[record.method] = (performance.byMethod[record.method] || 0) + 1;
            const date = new Date(record.processedAt).toISOString().split('T')[0];
            performance.byDate[date] = (performance.byDate[date] || 0) + 1;
        });
        return performance;
    }
    static async getPayoutRuleRecommendations(ruleId) {
        const rule = await this.getPayoutRule(ruleId);
        if (!rule) {
            throw new Error('Payout rule not found');
        }
        const recommendations = [];
        const performance = await this.getPayoutRulePerformance(ruleId);
        if (performance.successRate < 95) {
            recommendations.push('Review failed payouts and improve error handling');
        }
        if (performance.averageAmount < rule.minimumPayout) {
            recommendations.push('Consider adjusting minimum payout threshold');
        }
        if (rule.conditions.length === 0) {
            recommendations.push('Add conditions to define when payouts should be processed');
        }
        if (rule.actions.length === 0) {
            recommendations.push('Add actions to define what should happen when conditions are met');
        }
        if (rule.schedule.type === 'MANUAL' && performance.totalPayouts > 50) {
            recommendations.push('Consider automating payouts with a schedule');
        }
        return recommendations;
    }
}
exports.PayoutBuilderService = PayoutBuilderService;
//# sourceMappingURL=PayoutBuilderService.js.map