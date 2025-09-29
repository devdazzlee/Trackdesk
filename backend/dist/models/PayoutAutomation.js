"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutAutomationModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PayoutAutomationModel {
    static async createAutomation(data) {
        return await prisma.payoutAutomation.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                description: data.description || '',
                rules: data.rules || [],
                settings: data.settings || {
                    maxPayoutsPerRun: 100,
                    maxPayoutAmount: 10000,
                    minPayoutAmount: 10,
                    allowedPaymentMethods: [],
                    requireApproval: false,
                    autoApprove: true,
                    notificationSettings: {
                        onSuccess: true,
                        onFailure: true,
                        onPayoutCreated: true,
                        recipients: []
                    },
                    retrySettings: {
                        maxRetries: 3,
                        retryDelay: 5,
                        backoffMultiplier: 2
                    }
                },
                status: data.status || 'ACTIVE'
            }
        });
    }
    static async findById(id) {
        return await prisma.payoutAutomation.findUnique({
            where: { id }
        });
    }
    static async update(id, data) {
        return await prisma.payoutAutomation.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async delete(id) {
        await prisma.payoutAutomation.delete({
            where: { id }
        });
    }
    static async list(accountId, filters = {}) {
        const where = { accountId };
        if (filters.status)
            where.status = filters.status;
        return await prisma.payoutAutomation.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async executeAutomation(automationId) {
        const automation = await this.findById(automationId);
        if (!automation) {
            throw new Error('Automation not found');
        }
        if (automation.status !== 'ACTIVE') {
            throw new Error('Automation is not active');
        }
        const startTime = Date.now();
        let payoutsCreated = 0;
        let errors = [];
        try {
            const eligibleAffiliates = await this.getEligibleAffiliates(automation);
            for (const affiliate of eligibleAffiliates) {
                try {
                    for (const rule of automation.rules) {
                        if (await this.evaluateRule(rule, affiliate)) {
                            await this.executeRuleActions(rule, affiliate, automation);
                            payoutsCreated++;
                            break;
                        }
                    }
                }
                catch (error) {
                    errors.push(`Failed to process affiliate ${affiliate.id}: ${error.message}`);
                }
            }
            await this.update(automationId, {
                lastRun: new Date(),
                nextRun: this.calculateNextRun(automation)
            });
            await this.logExecution(automationId, 'EXECUTE_AUTOMATION', 'SUCCESS', `Automation executed successfully. Created ${payoutsCreated} payouts.`, { payoutsCreated, errors }, Date.now() - startTime);
            return {
                success: true,
                message: `Automation executed successfully. Created ${payoutsCreated} payouts.`,
                payoutsCreated
            };
        }
        catch (error) {
            await this.logExecution(automationId, 'EXECUTE_AUTOMATION', 'FAILED', error.message, { errors }, Date.now() - startTime);
            return {
                success: false,
                message: error.message,
                payoutsCreated
            };
        }
    }
    static async getEligibleAffiliates(automation) {
        const settings = automation.settings;
        const affiliates = await prisma.affiliateProfile.findMany({
            where: {
                status: 'ACTIVE',
                totalEarnings: {
                    gte: settings.minPayoutAmount
                }
            },
            include: {
                user: true,
                balance: true
            }
        });
        if (settings.allowedPaymentMethods.length > 0) {
            return affiliates.filter(affiliate => settings.allowedPaymentMethods.includes(affiliate.preferredPaymentMethod || ''));
        }
        return affiliates;
    }
    static async evaluateRule(rule, affiliate) {
        if (rule.conditions.length === 0) {
            return true;
        }
        let result = true;
        let logic = 'AND';
        for (const condition of rule.conditions) {
            const conditionResult = await this.evaluateCondition(condition, affiliate);
            if (logic === 'AND') {
                result = result && conditionResult;
            }
            else {
                result = result || conditionResult;
            }
            logic = condition.logic;
        }
        return result;
    }
    static async evaluateCondition(condition, affiliate) {
        const value = this.getFieldValue(affiliate, condition.field);
        switch (condition.operator) {
            case 'EQUALS':
                return value === condition.value;
            case 'NOT_EQUALS':
                return value !== condition.value;
            case 'GREATER_THAN':
                return Number(value) > Number(condition.value);
            case 'LESS_THAN':
                return Number(value) < Number(condition.value);
            case 'BETWEEN':
                const [min, max] = Array.isArray(condition.value) ? condition.value : [0, 0];
                return Number(value) >= min && Number(value) <= max;
            case 'IN':
                return Array.isArray(condition.value) && condition.value.includes(value);
            case 'NOT_IN':
                return Array.isArray(condition.value) && !condition.value.includes(value);
            default:
                return false;
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
    static async executeRuleActions(rule, affiliate, automation) {
        for (const action of rule.actions) {
            if (!action.enabled)
                continue;
            try {
                switch (action.type) {
                    case 'CREATE_PAYOUT':
                        await this.createPayout(affiliate, action.parameters, automation);
                        break;
                    case 'SEND_NOTIFICATION':
                        await this.sendNotification(affiliate, action.parameters);
                        break;
                    case 'UPDATE_STATUS':
                        await this.updateStatus(affiliate, action.parameters);
                        break;
                    case 'WEBHOOK':
                        await this.callWebhook(affiliate, action.parameters);
                        break;
                    case 'EMAIL':
                        await this.sendEmail(affiliate, action.parameters);
                        break;
                    case 'SMS':
                        await this.sendSMS(affiliate, action.parameters);
                        break;
                }
            }
            catch (error) {
                console.error(`Failed to execute action ${action.type}:`, error);
            }
        }
    }
    static async createPayout(affiliate, parameters, automation) {
        const amount = Math.min(affiliate.totalEarnings, automation.settings.maxPayoutAmount);
        if (amount < automation.settings.minPayoutAmount) {
            return;
        }
        const payout = await prisma.payout.create({
            data: {
                affiliateId: affiliate.id,
                amount,
                currency: 'USD',
                method: parameters.paymentMethod || 'PAYPAL',
                status: automation.settings.autoApprove ? 'APPROVED' : 'PENDING',
                paymentDetails: parameters.paymentDetails || {},
                requestedAt: new Date(),
                approvedAt: automation.settings.autoApprove ? new Date() : undefined,
                approvedBy: automation.settings.autoApprove ? 'system' : undefined
            }
        });
        await prisma.balance.update({
            where: { affiliateId: affiliate.id },
            data: {
                openBalance: { decrement: amount },
                pendingBalance: { increment: amount }
            }
        });
    }
    static async sendNotification(affiliate, parameters) {
        console.log('Sending notification to affiliate:', affiliate.id);
    }
    static async updateStatus(affiliate, parameters) {
        await prisma.affiliateProfile.update({
            where: { id: affiliate.id },
            data: { status: parameters.status }
        });
    }
    static async callWebhook(affiliate, parameters) {
        console.log('Calling webhook for affiliate:', affiliate.id);
    }
    static async sendEmail(affiliate, parameters) {
        console.log('Sending email to affiliate:', affiliate.id);
    }
    static async sendSMS(affiliate, parameters) {
        console.log('Sending SMS to affiliate:', affiliate.id);
    }
    static calculateNextRun(automation) {
        const now = new Date();
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    static async logExecution(automationId, action, status, message, data, executionTime) {
        return await prisma.payoutAutomationLog.create({
            data: {
                automationId,
                ruleId: 'system',
                action,
                status: status,
                message,
                data,
                executionTime,
                timestamp: new Date()
            }
        });
    }
    static async getExecutionLogs(automationId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return await prisma.payoutAutomationLog.findMany({
            where: { automationId },
            skip,
            take: limit,
            orderBy: { timestamp: 'desc' }
        });
    }
    static async getAutomationStats(accountId, startDate, endDate) {
        const where = { accountId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }
        const automations = await prisma.payoutAutomation.findMany({
            where
        });
        const logs = await prisma.payoutAutomationLog.findMany({
            where: {
                automation: { accountId }
            }
        });
        const stats = {
            totalAutomations: automations.length,
            activeAutomations: automations.filter(a => a.status === 'ACTIVE').length,
            totalExecutions: logs.length,
            successfulExecutions: logs.filter(l => l.status === 'SUCCESS').length,
            failedExecutions: logs.filter(l => l.status === 'FAILED').length,
            averageExecutionTime: 0,
            byStatus: {},
            byAction: {}
        };
        if (logs.length > 0) {
            stats.averageExecutionTime = logs.reduce((sum, log) => sum + log.executionTime, 0) / logs.length;
        }
        logs.forEach(log => {
            stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
            stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
        });
        return stats;
    }
    static async createDefaultAutomation(accountId) {
        const defaultRules = [
            {
                name: 'Weekly Payout Rule',
                description: 'Automatically create payouts for affiliates with minimum balance',
                conditions: [
                    {
                        field: 'totalEarnings',
                        operator: 'GREATER_THAN',
                        value: 50,
                        logic: 'AND'
                    }
                ],
                actions: [
                    {
                        type: 'CREATE_PAYOUT',
                        parameters: {
                            paymentMethod: 'PAYPAL'
                        },
                        enabled: true
                    },
                    {
                        type: 'SEND_NOTIFICATION',
                        parameters: {
                            template: 'payout_created'
                        },
                        enabled: true
                    }
                ],
                schedule: {
                    type: 'WEEKLY',
                    time: '09:00',
                    timezone: 'UTC',
                    daysOfWeek: [1]
                },
                status: 'ACTIVE',
                priority: 1
            }
        ];
        return await this.createAutomation({
            accountId,
            name: 'Default Payout Automation',
            description: 'Automatically process payouts for eligible affiliates',
            rules: defaultRules,
            settings: {
                maxPayoutsPerRun: 100,
                maxPayoutAmount: 5000,
                minPayoutAmount: 50,
                allowedPaymentMethods: ['PAYPAL', 'BANK_TRANSFER'],
                requireApproval: false,
                autoApprove: true,
                notificationSettings: {
                    onSuccess: true,
                    onFailure: true,
                    onPayoutCreated: true,
                    recipients: ['admin@trackdesk.com']
                },
                retrySettings: {
                    maxRetries: 3,
                    retryDelay: 5,
                    backoffMultiplier: 2
                }
            }
        });
    }
    static async pauseAutomation(id) {
        return await this.update(id, { status: 'PAUSED' });
    }
    static async resumeAutomation(id) {
        return await this.update(id, { status: 'ACTIVE' });
    }
    static async testAutomation(id) {
        const automation = await this.findById(id);
        if (!automation) {
            return { success: false, message: 'Automation not found', testResults: {} };
        }
        try {
            const eligibleAffiliates = await this.getEligibleAffiliates(automation);
            const sampleSize = Math.min(5, eligibleAffiliates.length);
            const sampleAffiliates = eligibleAffiliates.slice(0, sampleSize);
            const testResults = {
                totalEligibleAffiliates: eligibleAffiliates.length,
                sampleSize,
                sampleResults: []
            };
            for (const affiliate of sampleAffiliates) {
                const result = {
                    affiliateId: affiliate.id,
                    affiliateName: `${affiliate.user.firstName} ${affiliate.user.lastName}`,
                    totalEarnings: affiliate.totalEarnings,
                    rulesMatched: []
                };
                for (const rule of automation.rules) {
                    const matches = await this.evaluateRule(rule, affiliate);
                    result.rulesMatched.push({
                        ruleName: rule.name,
                        matches
                    });
                }
                testResults.sampleResults.push(result);
            }
            return {
                success: true,
                message: 'Automation test completed successfully',
                testResults
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                testResults: {}
            };
        }
    }
    static async getAutomationDashboard(accountId) {
        const automations = await this.list(accountId);
        const stats = await this.getAutomationStats(accountId);
        const recentLogs = await prisma.payoutAutomationLog.findMany({
            where: {
                automation: { accountId }
            },
            orderBy: { timestamp: 'desc' },
            take: 10
        });
        return {
            automations,
            stats,
            recentLogs
        };
    }
}
exports.PayoutAutomationModel = PayoutAutomationModel;
//# sourceMappingURL=PayoutAutomation.js.map