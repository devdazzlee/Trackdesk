"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficControlService = void 0;
const TrafficControl_1 = require("../models/TrafficControl");
class TrafficControlService {
    static async createRule(ruleData) {
        return await TrafficControl_1.TrafficControlModel.createRule(ruleData);
    }
    static async getRule(id) {
        return await TrafficControl_1.TrafficControlModel.findRuleById(id);
    }
    static async updateRule(id, updateData) {
        return await TrafficControl_1.TrafficControlModel.updateRule(id, updateData);
    }
    static async deleteRule(id) {
        return await TrafficControl_1.TrafficControlModel.deleteRule(id);
    }
    static async listRules(filters = {}) {
        return await TrafficControl_1.TrafficControlModel.listRules(filters);
    }
    static async processTraffic(data, ipAddress, userAgent, affiliateId, clickId) {
        return await TrafficControl_1.TrafficControlModel.processTraffic(data, ipAddress, userAgent, affiliateId, clickId);
    }
    static async getTrafficEvents(filters = {}, page = 1, limit = 50) {
        return await TrafficControl_1.TrafficControlModel.getTrafficEvents(filters, page, limit);
    }
    static async getTrafficStats(startDate, endDate) {
        return await TrafficControl_1.TrafficControlModel.getTrafficStats(startDate, endDate);
    }
    static async testRule(id, testData) {
        return await TrafficControl_1.TrafficControlModel.testRule(id, testData);
    }
    static async createDefaultRules() {
        return await TrafficControl_1.TrafficControlModel.createDefaultRules();
    }
    static async blockIP(ipAddress, reason, duration) {
        return await TrafficControl_1.TrafficControlModel.blockIP(ipAddress, reason, duration);
    }
    static async unblockIP(ipAddress) {
        return await TrafficControl_1.TrafficControlModel.unblockIP(ipAddress);
    }
    static async getBlockedIPs(page = 1, limit = 50) {
        return await TrafficControl_1.TrafficControlModel.getBlockedIPs(page, limit);
    }
    static async blockCountry(countryCode, reason) {
        return await TrafficControl_1.TrafficControlModel.blockCountry(countryCode, reason);
    }
    static async unblockCountry(countryCode) {
        return await TrafficControl_1.TrafficControlModel.unblockCountry(countryCode);
    }
    static async getBlockedCountries() {
        return await TrafficControl_1.TrafficControlModel.getBlockedCountries();
    }
    static async updateRateLimit(ruleId, requestsPerMinute, requestsPerHour, requestsPerDay) {
        return await TrafficControl_1.TrafficControlModel.updateRateLimit(ruleId, requestsPerMinute, requestsPerHour, requestsPerDay);
    }
    static async blockDevice(deviceType, reason) {
        return await TrafficControl_1.TrafficControlModel.blockDevice(deviceType, reason);
    }
    static async unblockDevice(deviceType) {
        return await TrafficControl_1.TrafficControlModel.unblockDevice(deviceType);
    }
    static async getTrafficControlDashboard() {
        return await TrafficControl_1.TrafficControlModel.getTrafficControlDashboard();
    }
    static async exportRules(format) {
        return await TrafficControl_1.TrafficControlModel.exportRules(format);
    }
    static async importRules(rules, overwrite = false) {
        return await TrafficControl_1.TrafficControlModel.importRules(rules, overwrite);
    }
    static async evaluateTrafficRules(data, ipAddress, userAgent, affiliateId) {
        const rules = await this.listRules({ isActive: true });
        const results = [];
        for (const rule of rules) {
            const result = this.evaluateRule(rule, data, ipAddress, userAgent, affiliateId);
            results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                result,
                action: result.action
            });
        }
        return results;
    }
    static evaluateRule(rule, data, ipAddress, userAgent, affiliateId) {
        const conditions = rule.conditions;
        let allConditionsMet = true;
        const conditionResults = [];
        for (const condition of conditions) {
            if (!condition.isActive)
                continue;
            const fieldValue = this.getFieldValue(data, condition.field, ipAddress, userAgent, affiliateId);
            let conditionMet = false;
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
                case 'NOT_CONTAINS':
                    conditionMet = !String(fieldValue).includes(String(condition.value));
                    break;
                case 'IN':
                    conditionMet = Array.isArray(condition.value) && condition.value.includes(fieldValue);
                    break;
                case 'NOT_IN':
                    conditionMet = Array.isArray(condition.value) && !condition.value.includes(fieldValue);
                    break;
                case 'REGEX':
                    try {
                        const regex = new RegExp(condition.value);
                        conditionMet = regex.test(String(fieldValue));
                    }
                    catch {
                        conditionMet = false;
                    }
                    break;
                case 'IS_EMPTY':
                    conditionMet = !fieldValue || fieldValue === '';
                    break;
                case 'IS_NOT_EMPTY':
                    conditionMet = fieldValue && fieldValue !== '';
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
            action: allConditionsMet ? rule.action : 'ALLOW',
            conditionResults,
            rule: rule
        };
    }
    static getFieldValue(data, field, ipAddress, userAgent, affiliateId) {
        switch (field) {
            case 'ip_address':
                return ipAddress;
            case 'user_agent':
                return userAgent;
            case 'affiliate_id':
                return affiliateId;
            case 'country':
                return this.getCountryFromIP(ipAddress);
            case 'device_type':
                return this.getDeviceTypeFromUserAgent(userAgent);
            case 'browser':
                return this.getBrowserFromUserAgent(userAgent);
            case 'os':
                return this.getOSFromUserAgent(userAgent);
            case 'referrer':
                return data.referrer;
            case 'timestamp':
                return new Date().toISOString();
            default:
                const fields = field.split('.');
                let value = data;
                for (const f of fields) {
                    value = value?.[f];
                }
                return value;
        }
    }
    static getCountryFromIP(ipAddress) {
        return 'US';
    }
    static getDeviceTypeFromUserAgent(userAgent) {
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            return 'MOBILE';
        }
        else if (/Tablet|iPad/.test(userAgent)) {
            return 'TABLET';
        }
        else {
            return 'DESKTOP';
        }
    }
    static getBrowserFromUserAgent(userAgent) {
        if (/Chrome/.test(userAgent))
            return 'Chrome';
        if (/Firefox/.test(userAgent))
            return 'Firefox';
        if (/Safari/.test(userAgent))
            return 'Safari';
        if (/Edge/.test(userAgent))
            return 'Edge';
        if (/Opera/.test(userAgent))
            return 'Opera';
        return 'Unknown';
    }
    static getOSFromUserAgent(userAgent) {
        if (/Windows/.test(userAgent))
            return 'Windows';
        if (/Mac/.test(userAgent))
            return 'macOS';
        if (/Linux/.test(userAgent))
            return 'Linux';
        if (/Android/.test(userAgent))
            return 'Android';
        if (/iOS/.test(userAgent))
            return 'iOS';
        return 'Unknown';
    }
    static async executeTrafficAction(action, data, ipAddress, userAgent, affiliateId) {
        switch (action) {
            case 'ALLOW':
                return { action: 'ALLOW', message: 'Traffic allowed' };
            case 'BLOCK':
                return { action: 'BLOCK', message: 'Traffic blocked' };
            case 'REDIRECT':
                return { action: 'REDIRECT', message: 'Traffic redirected', url: data.redirectUrl };
            case 'RATE_LIMIT':
                return { action: 'RATE_LIMIT', message: 'Rate limit exceeded' };
            case 'GEO_BLOCK':
                return { action: 'GEO_BLOCK', message: 'Geographic location blocked' };
            case 'DEVICE_BLOCK':
                return { action: 'DEVICE_BLOCK', message: 'Device type blocked' };
            case 'BROWSER_BLOCK':
                return { action: 'BROWSER_BLOCK', message: 'Browser blocked' };
            case 'OS_BLOCK':
                return { action: 'OS_BLOCK', message: 'Operating system blocked' };
            case 'AFFILIATE_BLOCK':
                return { action: 'AFFILIATE_BLOCK', message: 'Affiliate blocked' };
            case 'IP_BLOCK':
                return { action: 'IP_BLOCK', message: 'IP address blocked' };
            default:
                return { action: 'ALLOW', message: 'Unknown action, defaulting to allow' };
        }
    }
    static async checkRateLimit(ipAddress, affiliateId, ruleId) {
        const key = affiliateId ? `affiliate:${affiliateId}` : `ip:${ipAddress}`;
        const limits = {
            perMinute: 60,
            perHour: 1000,
            perDay: 10000
        };
        return {
            allowed: true,
            remaining: limits.perMinute,
            resetTime: new Date(Date.now() + 60000)
        };
    }
    static async getTrafficControlPerformance(startDate, endDate) {
        const stats = await this.getTrafficStats(startDate, endDate);
        const performance = {
            totalRequests: stats.totalRequests,
            allowedRequests: stats.allowedRequests,
            blockedRequests: stats.blockedRequests,
            redirectedRequests: stats.redirectedRequests,
            rateLimitedRequests: stats.rateLimitedRequests,
            allowRate: stats.totalRequests > 0 ? (stats.allowedRequests / stats.totalRequests) * 100 : 0,
            blockRate: stats.totalRequests > 0 ? (stats.blockedRequests / stats.totalRequests) * 100 : 0,
            byAction: stats.byAction,
            byCountry: stats.byCountry,
            byDevice: stats.byDevice,
            byBrowser: stats.byBrowser,
            byOS: stats.byOS,
            byHour: stats.byHour,
            byDay: stats.byDay
        };
        return performance;
    }
    static async getTrafficControlRecommendations() {
        const recommendations = [];
        const performance = await this.getTrafficControlPerformance();
        if (performance.blockRate > 50) {
            recommendations.push('High block rate detected - review blocking rules');
        }
        if (performance.rateLimitedRequests > 1000) {
            recommendations.push('High rate limiting - consider adjusting limits');
        }
        if (performance.byCountry['CN'] > performance.totalRequests * 0.3) {
            recommendations.push('High traffic from China - consider geo-blocking');
        }
        if (performance.byDevice['MOBILE'] > performance.totalRequests * 0.8) {
            recommendations.push('High mobile traffic - optimize for mobile');
        }
        const rules = await this.listRules();
        if (rules.length === 0) {
            recommendations.push('No traffic control rules configured - add basic rules');
        }
        return recommendations;
    }
    static async analyzeTrafficPatterns(startDate, endDate) {
        const events = await this.getTrafficEvents({}, 1, 1000);
        const patterns = {
            peakHours: {},
            peakDays: {},
            topCountries: {},
            topDevices: {},
            topBrowsers: {},
            topOS: {},
            suspiciousPatterns: []
        };
        events.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            const day = new Date(event.timestamp).toISOString().split('T')[0];
            patterns.peakHours[hour] = (patterns.peakHours[hour] || 0) + 1;
            patterns.peakDays[day] = (patterns.peakDays[day] || 0) + 1;
            patterns.topCountries[event.country] = (patterns.topCountries[event.country] || 0) + 1;
            patterns.topDevices[event.deviceType] = (patterns.topDevices[event.deviceType] || 0) + 1;
            patterns.topBrowsers[event.browser] = (patterns.topBrowsers[event.browser] || 0) + 1;
            patterns.topOS[event.os] = (patterns.topOS[event.os] || 0) + 1;
        });
        if (patterns.topCountries['CN'] > events.length * 0.5) {
            patterns.suspiciousPatterns.push('High traffic from China');
        }
        if (patterns.topDevices['MOBILE'] > events.length * 0.9) {
            patterns.suspiciousPatterns.push('Unusually high mobile traffic');
        }
        return patterns;
    }
}
exports.TrafficControlService = TrafficControlService;
//# sourceMappingURL=TrafficControlService.js.map