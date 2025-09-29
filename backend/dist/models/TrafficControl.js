"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficControlModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TrafficControlModel {
    static async createRule(data) {
        return await prisma.trafficRule.create({
            data: {
                name: data.name,
                description: data.description || '',
                type: data.type,
                conditions: data.conditions || [],
                actions: data.actions || [],
                priority: data.priority || 1,
                status: data.status || 'ACTIVE',
            }
        });
    }
    static async findRuleById(id) {
        return await prisma.trafficRule.findUnique({
            where: { id }
        });
    }
    static async updateRule(id, data) {
        return await prisma.trafficRule.update({
            where: { id },
            data
        });
    }
    static async deleteRule(id) {
        await prisma.trafficRule.delete({
            where: { id }
        });
    }
    static async listRules(filters = {}) {
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.type)
            where.type = filters.type;
        return await prisma.trafficRule.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });
    }
    static async processTraffic(data, ipAddress, userAgent, affiliateId, clickId) {
        const activeRules = await this.listRules({ status: 'ACTIVE' });
        activeRules.sort((a, b) => b.priority - a.priority);
        for (const rule of activeRules) {
            const matches = this.evaluateRule(rule, data);
            if (matches) {
                const action = this.executeTrafficAction(rule.actions[0], data);
                const trafficEvent = await prisma.trafficEvent.create({
                    data: {
                        ruleId: rule.id,
                        type: rule.type,
                        data,
                        action: action.type,
                        ipAddress,
                        userAgent,
                        country: data.country,
                        device: data.device,
                        browser: data.browser,
                        os: data.os,
                        affiliateId,
                        clickId,
                        timestamp: new Date()
                    }
                });
                return trafficEvent;
            }
        }
        const defaultEvent = await prisma.trafficEvent.create({
            data: {
                ruleId: 'default',
                type: 'DEFAULT',
                data,
                action: 'ALLOW',
                ipAddress,
                userAgent,
                country: data.country,
                device: data.device,
                browser: data.browser,
                os: data.os,
                affiliateId,
                clickId,
                timestamp: new Date()
            }
        });
        return defaultEvent;
    }
    static evaluateRule(rule, data) {
        for (const condition of rule.conditions) {
            const fieldValue = this.getFieldValue(data, condition.field);
            const matches = this.evaluateCondition(condition, fieldValue);
            if (!matches) {
                return false;
            }
        }
        return true;
    }
    static evaluateCondition(condition, fieldValue) {
        switch (condition.operator) {
            case 'EQUALS':
                return fieldValue === condition.value;
            case 'NOT_EQUALS':
                return fieldValue !== condition.value;
            case 'CONTAINS':
                return String(fieldValue).includes(String(condition.value));
            case 'NOT_CONTAINS':
                return !String(fieldValue).includes(String(condition.value));
            case 'GREATER_THAN':
                return Number(fieldValue) > Number(condition.value);
            case 'LESS_THAN':
                return Number(fieldValue) < Number(condition.value);
            case 'IN':
                return Array.isArray(condition.value) && condition.value.includes(fieldValue);
            case 'NOT_IN':
                return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
            case 'BETWEEN':
                const [min, max] = Array.isArray(condition.value) ? condition.value : [0, 0];
                return Number(fieldValue) >= min && Number(fieldValue) <= max;
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
    static executeTrafficAction(action, data) {
        return action;
    }
    static async getTrafficEvents(filters = {}, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.type)
            where.type = filters.type;
        if (filters.action)
            where.action = filters.action;
        if (filters.affiliateId)
            where.affiliateId = filters.affiliateId;
        if (filters.country)
            where.country = filters.country;
        if (filters.startDate && filters.endDate) {
            where.timestamp = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        return await prisma.trafficEvent.findMany({
            where,
            skip,
            take: limit,
            orderBy: { timestamp: 'desc' }
        });
    }
    static async getTrafficStats(startDate, endDate) {
        const where = {};
        if (startDate && endDate) {
            where.timestamp = {
                gte: startDate,
                lte: endDate
            };
        }
        const events = await prisma.trafficEvent.findMany({
            where
        });
        const stats = {
            totalRequests: events.length,
            allowedRequests: 0,
            blockedRequests: 0,
            redirectedRequests: 0,
            throttledRequests: 0,
            byRule: {},
            byCountry: {},
            byDevice: {},
            byHour: {},
            topIPs: []
        };
        events.forEach(event => {
            switch (event.action) {
                case 'ALLOW':
                    stats.allowedRequests++;
                    break;
                case 'BLOCK':
                    stats.blockedRequests++;
                    break;
                case 'REDIRECT':
                    stats.redirectedRequests++;
                    break;
                case 'THROTTLE':
                    stats.throttledRequests++;
                    break;
            }
            if (!stats.byRule[event.ruleId]) {
                stats.byRule[event.ruleId] = { total: 0, allowed: 0, blocked: 0, redirected: 0, throttled: 0 };
            }
            stats.byRule[event.ruleId].total++;
            if (event.action === 'ALLOW')
                stats.byRule[event.ruleId].allowed++;
            else if (event.action === 'BLOCK')
                stats.byRule[event.ruleId].blocked++;
            else if (event.action === 'REDIRECT')
                stats.byRule[event.ruleId].redirected++;
            else if (event.action === 'THROTTLE')
                stats.byRule[event.ruleId].throttled++;
            if (event.country) {
                if (!stats.byCountry[event.country]) {
                    stats.byCountry[event.country] = { total: 0, allowed: 0, blocked: 0 };
                }
                stats.byCountry[event.country].total++;
                if (event.action === 'ALLOW')
                    stats.byCountry[event.country].allowed++;
                else if (event.action === 'BLOCK')
                    stats.byCountry[event.country].blocked++;
            }
            if (event.device) {
                if (!stats.byDevice[event.device]) {
                    stats.byDevice[event.device] = { total: 0, allowed: 0, blocked: 0 };
                }
                stats.byDevice[event.device].total++;
                if (event.action === 'ALLOW')
                    stats.byDevice[event.device].allowed++;
                else if (event.action === 'BLOCK')
                    stats.byDevice[event.device].blocked++;
            }
            const hour = event.timestamp.getHours();
            if (!stats.byHour[hour]) {
                stats.byHour[hour] = { total: 0, allowed: 0, blocked: 0 };
            }
            stats.byHour[hour].total++;
            if (event.action === 'ALLOW')
                stats.byHour[hour].allowed++;
            else if (event.action === 'BLOCK')
                stats.byHour[hour].blocked++;
        });
        const ipCounts = {};
        events.forEach(event => {
            if (!ipCounts[event.ipAddress]) {
                ipCounts[event.ipAddress] = { count: 0, action: event.action };
            }
            ipCounts[event.ipAddress].count++;
        });
        stats.topIPs = Object.entries(ipCounts)
            .map(([ip, data]) => ({ ip, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return stats;
    }
    static async createDefaultRules() {
        const defaultRules = [
            {
                name: 'Block Suspicious Countries',
                description: 'Blocks traffic from high-risk countries',
                type: 'GEO_BLOCKING',
                conditions: [
                    { field: 'country', operator: 'IN', value: ['CN', 'RU', 'KP', 'IR'], weight: 1 }
                ],
                actions: [{ type: 'BLOCK', parameters: { reason: 'Country blocked' } }],
                priority: 10
            },
            {
                name: 'Rate Limiting',
                description: 'Limits requests per IP per hour',
                type: 'RATE_LIMITING',
                conditions: [
                    { field: 'requests_per_hour', operator: 'GREATER_THAN', value: 1000, weight: 1 }
                ],
                actions: [{ type: 'THROTTLE', parameters: { delay: 5000 } }],
                priority: 5
            },
            {
                name: 'Block Bot Traffic',
                description: 'Blocks known bot user agents',
                type: 'DEVICE_BLOCKING',
                conditions: [
                    { field: 'user_agent', operator: 'CONTAINS', value: 'bot', weight: 1 },
                    { field: 'user_agent', operator: 'CONTAINS', value: 'crawler', weight: 1 },
                    { field: 'user_agent', operator: 'CONTAINS', value: 'spider', weight: 1 }
                ],
                actions: [{ type: 'BLOCK', parameters: { reason: 'Bot detected' } }],
                priority: 8
            },
            {
                name: 'Time-based Blocking',
                description: 'Blocks traffic during maintenance hours',
                type: 'TIME_BASED',
                conditions: [
                    { field: 'hour', operator: 'BETWEEN', value: [2, 4], weight: 1 }
                ],
                actions: [{ type: 'BLOCK', parameters: { reason: 'Maintenance hours' } }],
                priority: 3
            }
        ];
        const createdRules = [];
        for (const ruleData of defaultRules) {
            const rule = await this.createRule(ruleData);
            createdRules.push(rule);
        }
        return createdRules;
    }
}
exports.TrafficControlModel = TrafficControlModel;
//# sourceMappingURL=TrafficControl.js.map