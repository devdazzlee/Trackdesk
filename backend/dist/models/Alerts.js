"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AlertsModel {
    static async create(data) {
        return await prisma.alert.create({
            data: {
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
                triggerCount: 0
            }
        });
    }
    static async findById(id) {
        return await prisma.alert.findUnique({
            where: { id }
        });
    }
    static async update(id, data) {
        return await prisma.alert.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async delete(id) {
        await prisma.alert.delete({
            where: { id }
        });
    }
    static async list(accountId, filters = {}) {
        const where = { accountId };
        if (filters.type)
            where.type = filters.type;
        if (filters.severity)
            where.severity = filters.severity;
        if (filters.status)
            where.status = filters.status;
        return await prisma.alert.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async triggerAlert(alertId, data) {
        const alert = await this.findById(alertId);
        if (!alert) {
            throw new Error('Alert not found');
        }
        if (alert.status !== 'ACTIVE') {
            throw new Error('Alert is not active');
        }
        if (alert.lastTriggered) {
            const timeSinceLastTrigger = Date.now() - alert.lastTriggered.getTime();
            const cooldownMs = alert.cooldownPeriod * 60 * 1000;
            if (timeSinceLastTrigger < cooldownMs) {
                throw new Error('Alert is in cooldown period');
            }
        }
        const alertEvent = await prisma.alertEvent.create({
            data: {
                alertId,
                type: alert.type,
                severity: alert.severity,
                title: alert.name,
                message: alert.description,
                data,
                status: 'TRIGGERED',
                triggeredAt: new Date()
            }
        });
        await this.update(alertId, {
            status: 'TRIGGERED',
            lastTriggered: new Date(),
            triggerCount: { increment: 1 }
        });
        await this.executeActions(alert, alertEvent);
        return alertEvent;
    }
    static async executeActions(alert, event) {
        for (const action of alert.actions) {
            if (!action.enabled)
                continue;
            try {
                switch (action.type) {
                    case 'EMAIL':
                        await this.sendEmailAlert(alert, event, action.parameters);
                        break;
                    case 'SMS':
                        await this.sendSMSAlert(alert, event, action.parameters);
                        break;
                    case 'PUSH':
                        await this.sendPushAlert(alert, event, action.parameters);
                        break;
                    case 'WEBHOOK':
                        await this.sendWebhookAlert(alert, event, action.parameters);
                        break;
                    case 'SLACK':
                        await this.sendSlackAlert(alert, event, action.parameters);
                        break;
                    case 'DISCORD':
                        await this.sendDiscordAlert(alert, event, action.parameters);
                        break;
                    case 'CUSTOM':
                        await this.executeCustomAction(alert, event, action.parameters);
                        break;
                }
            }
            catch (error) {
                console.error(`Failed to execute alert action ${action.type}:`, error);
            }
        }
    }
    static async sendEmailAlert(alert, event, parameters) {
        console.log('Sending email alert:', { alert: alert.name, event: event.title });
    }
    static async sendSMSAlert(alert, event, parameters) {
        console.log('Sending SMS alert:', { alert: alert.name, event: event.title });
    }
    static async sendPushAlert(alert, event, parameters) {
        console.log('Sending push alert:', { alert: alert.name, event: event.title });
    }
    static async sendWebhookAlert(alert, event, parameters) {
        console.log('Sending webhook alert:', { alert: alert.name, event: event.title });
    }
    static async sendSlackAlert(alert, event, parameters) {
        console.log('Sending Slack alert:', { alert: alert.name, event: event.title });
    }
    static async sendDiscordAlert(alert, event, parameters) {
        console.log('Sending Discord alert:', { alert: alert.name, event: event.title });
    }
    static async executeCustomAction(alert, event, parameters) {
        console.log('Executing custom action:', { alert: alert.name, event: event.title });
    }
    static async acknowledgeEvent(eventId, userId, notes) {
        return await prisma.alertEvent.update({
            where: { id: eventId },
            data: {
                status: 'ACKNOWLEDGED',
                acknowledgedAt: new Date(),
                acknowledgedBy: userId,
                notes
            }
        });
    }
    static async resolveEvent(eventId, userId, notes) {
        const event = await prisma.alertEvent.findUnique({
            where: { id: eventId }
        });
        if (!event) {
            throw new Error('Alert event not found');
        }
        const updatedEvent = await prisma.alertEvent.update({
            where: { id: eventId },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date(),
                resolvedBy: userId,
                notes
            }
        });
        const activeEvents = await prisma.alertEvent.count({
            where: {
                alertId: event.alertId,
                status: { in: ['TRIGGERED', 'ACKNOWLEDGED'] }
            }
        });
        if (activeEvents === 0) {
            await this.update(event.alertId, { status: 'RESOLVED' });
        }
        return updatedEvent;
    }
    static async getEvents(alertId, filters = {}, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = { alertId };
        if (filters.status)
            where.status = filters.status;
        if (filters.severity)
            where.severity = filters.severity;
        if (filters.startDate && filters.endDate) {
            where.triggeredAt = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        return await prisma.alertEvent.findMany({
            where,
            skip,
            take: limit,
            orderBy: { triggeredAt: 'desc' }
        });
    }
    static async subscribeToAlert(userId, alertId, notificationMethods) {
        return await prisma.alertSubscription.create({
            data: {
                userId,
                alertId,
                notificationMethods,
                isActive: true
            }
        });
    }
    static async unsubscribeFromAlert(userId, alertId) {
        await prisma.alertSubscription.updateMany({
            where: { userId, alertId },
            data: { isActive: false }
        });
    }
    static async getUserSubscriptions(userId) {
        return await prisma.alertSubscription.findMany({
            where: { userId, isActive: true },
            include: {
                alert: true
            }
        });
    }
    static async getAlertStats(accountId, startDate, endDate) {
        const where = { accountId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }
        const alerts = await prisma.alert.findMany({
            where
        });
        const events = await prisma.alertEvent.findMany({
            where: {
                alert: { accountId }
            }
        });
        const stats = {
            totalAlerts: alerts.length,
            activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length,
            triggeredAlerts: alerts.filter(a => a.status === 'TRIGGERED').length,
            resolvedAlerts: alerts.filter(a => a.status === 'RESOLVED').length,
            totalEvents: events.length,
            eventsByType: {},
            eventsBySeverity: {},
            eventsByStatus: {},
            topAlerts: []
        };
        events.forEach(event => {
            stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
            stats.eventsBySeverity[event.severity] = (stats.eventsBySeverity[event.severity] || 0) + 1;
            stats.eventsByStatus[event.status] = (stats.eventsByStatus[event.status] || 0) + 1;
        });
        const alertEventCounts = {};
        events.forEach(event => {
            alertEventCounts[event.alertId] = (alertEventCounts[event.alertId] || 0) + 1;
        });
        stats.topAlerts = Object.entries(alertEventCounts)
            .map(([alertId, count]) => {
            const alert = alerts.find(a => a.id === alertId);
            return {
                alertId,
                name: alert?.name || 'Unknown',
                count
            };
        })
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return stats;
    }
    static async createDefaultAlerts(accountId) {
        const defaultAlerts = [
            {
                name: 'High Conversion Rate',
                description: 'Alert when conversion rate exceeds 10%',
                type: 'PERFORMANCE',
                severity: 'MEDIUM',
                conditions: [
                    {
                        field: 'conversion_rate',
                        operator: 'GREATER_THAN',
                        value: 10,
                        timeWindow: 60
                    }
                ],
                actions: [
                    {
                        type: 'EMAIL',
                        parameters: { template: 'high_conversion_rate' },
                        enabled: true
                    }
                ],
                recipients: ['admin@trackdesk.com'],
                cooldownPeriod: 120
            },
            {
                name: 'Low Traffic',
                description: 'Alert when traffic drops below 100 clicks per hour',
                type: 'PERFORMANCE',
                severity: 'HIGH',
                conditions: [
                    {
                        field: 'clicks_per_hour',
                        operator: 'LESS_THAN',
                        value: 100,
                        timeWindow: 60
                    }
                ],
                actions: [
                    {
                        type: 'EMAIL',
                        parameters: { template: 'low_traffic' },
                        enabled: true
                    },
                    {
                        type: 'SLACK',
                        parameters: { channel: '#alerts' },
                        enabled: true
                    }
                ],
                recipients: ['admin@trackdesk.com'],
                cooldownPeriod: 60
            },
            {
                name: 'Security Breach',
                description: 'Alert when suspicious activity is detected',
                type: 'SECURITY',
                severity: 'CRITICAL',
                conditions: [
                    {
                        field: 'failed_login_attempts',
                        operator: 'GREATER_THAN',
                        value: 10,
                        timeWindow: 15
                    }
                ],
                actions: [
                    {
                        type: 'EMAIL',
                        parameters: { template: 'security_breach' },
                        enabled: true
                    },
                    {
                        type: 'SMS',
                        parameters: { phone: '+1234567890' },
                        enabled: true
                    },
                    {
                        type: 'WEBHOOK',
                        parameters: { url: 'https://security.trackdesk.com/webhook' },
                        enabled: true
                    }
                ],
                recipients: ['security@trackdesk.com'],
                cooldownPeriod: 0
            }
        ];
        const createdAlerts = [];
        for (const alertData of defaultAlerts) {
            const alert = await this.create({
                accountId,
                ...alertData
            });
            createdAlerts.push(alert);
        }
        return createdAlerts;
    }
    static async testAlert(alertId) {
        const alert = await this.findById(alertId);
        if (!alert) {
            throw new Error('Alert not found');
        }
        const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'This is a test alert'
        };
        return await this.triggerAlert(alertId, testData);
    }
    static async getAlertDashboard(accountId) {
        const alerts = await this.list(accountId);
        const recentEvents = await prisma.alertEvent.findMany({
            where: {
                alert: { accountId }
            },
            orderBy: { triggeredAt: 'desc' },
            take: 10
        });
        const stats = await this.getAlertStats(accountId);
        return {
            alerts,
            recentEvents,
            stats
        };
    }
}
exports.AlertsModel = AlertsModel;
//# sourceMappingURL=Alerts.js.map