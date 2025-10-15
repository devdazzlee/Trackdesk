"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TrackingService {
    async processEvents(data) {
        const { events, websiteId, sessionId } = data;
        let processed = 0;
        let failed = 0;
        for (const event of events) {
            try {
                await this.processEvent(event);
                processed++;
            }
            catch (error) {
                console.error('Failed to process event:', error);
                failed++;
            }
        }
        return { processed, failed };
    }
    async processEvent(event) {
        const { id, event: eventType, data, timestamp, sessionId, userId, websiteId, page, device, browser } = event;
        await this.upsertSession({
            id: sessionId,
            websiteId,
            userId,
            startTime: timestamp,
            lastActivity: timestamp,
            userAgent: device.userAgent,
            ipAddress: '',
            country: 'Unknown',
            city: 'Unknown'
        });
        await this.storeEvent({
            id,
            eventType,
            data,
            timestamp,
            sessionId,
            userId,
            websiteId,
            page,
            device,
            browser
        });
        await this.updateWebsiteStats(websiteId, eventType, timestamp);
    }
    async upsertSession(sessionData) {
        await prisma.trackingSession.upsert({
            where: { id: sessionData.id },
            update: {
                lastActivity: new Date(sessionData.lastActivity),
                userAgent: sessionData.userAgent,
                ipAddress: sessionData.ipAddress,
                country: sessionData.country,
                city: sessionData.city
            },
            create: {
                id: sessionData.id,
                websiteId: sessionData.websiteId,
                userId: sessionData.userId,
                startTime: new Date(sessionData.startTime),
                lastActivity: new Date(sessionData.lastActivity),
                userAgent: sessionData.userAgent,
                ipAddress: sessionData.ipAddress,
                country: sessionData.country,
                city: sessionData.city
            }
        });
    }
    async storeEvent(eventData) {
        await prisma.trackingEvent.create({
            data: {
                id: eventData.id,
                eventType: eventData.eventType,
                data: eventData.data,
                timestamp: new Date(eventData.timestamp),
                sessionId: eventData.sessionId,
                userId: eventData.userId,
                websiteId: eventData.websiteId,
                page: eventData.page,
                device: eventData.device,
                browser: eventData.browser
            }
        });
    }
    async updateWebsiteStats(websiteId, eventType, timestamp) {
        const date = new Date(timestamp);
        const dateStr = date.toISOString().split('T')[0];
        await prisma.trackingStats.upsert({
            where: {
                websiteId_date: {
                    websiteId,
                    date: dateStr
                }
            },
            update: {
                [eventType === 'page_view' ? 'pageViews' :
                    eventType === 'click' ? 'clicks' :
                        eventType === 'conversion' ? 'conversions' : 'otherEvents']: {
                    increment: 1
                }
            },
            create: {
                websiteId,
                date: dateStr,
                pageViews: eventType === 'page_view' ? 1 : 0,
                clicks: eventType === 'click' ? 1 : 0,
                conversions: eventType === 'conversion' ? 1 : 0,
                otherEvents: eventType !== 'page_view' && eventType !== 'click' && eventType !== 'conversion' ? 1 : 0
            }
        });
    }
    async getTrackingStats(websiteId, options) {
        const { startDate, endDate, groupBy = 'day' } = options;
        let whereClause = { websiteId };
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate)
                whereClause.date.gte = startDate;
            if (endDate)
                whereClause.date.lte = endDate;
        }
        const stats = await prisma.trackingStats.findMany({
            where: whereClause,
            orderBy: { date: 'asc' }
        });
        const groupedStats = this.groupStatsByPeriod(stats, groupBy);
        return {
            websiteId,
            period: { startDate, endDate, groupBy },
            stats: groupedStats,
            summary: this.calculateSummary(stats)
        };
    }
    async getRealtimeAnalytics(websiteId) {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const [activeSessions, recentEvents, topPages] = await Promise.all([
            prisma.trackingSession.count({
                where: {
                    websiteId,
                    lastActivity: { gte: oneHourAgo }
                }
            }),
            prisma.trackingEvent.findMany({
                where: {
                    websiteId,
                    timestamp: { gte: oneHourAgo }
                },
                orderBy: { timestamp: 'desc' },
                take: 50
            }),
            prisma.trackingEvent.groupBy({
                by: ['page'],
                where: {
                    websiteId,
                    eventType: 'page_view',
                    timestamp: { gte: oneHourAgo }
                },
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10
            })
        ]);
        return {
            websiteId,
            timestamp: now.toISOString(),
            activeSessions,
            recentEvents: recentEvents.map(event => ({
                id: event.id,
                eventType: event.eventType,
                timestamp: event.timestamp,
                page: event.page,
                data: event.data
            })),
            topPages: topPages.map(page => ({
                page: page.page,
                views: page._count.id
            }))
        };
    }
    async getPageAnalytics(websiteId, options) {
        const { startDate, endDate, limit = 50, sortBy = 'views', sortOrder = 'desc' } = options;
        let whereClause = {
            websiteId,
            eventType: 'page_view'
        };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const pageStats = await prisma.trackingEvent.groupBy({
            by: ['page'],
            where: whereClause,
            _count: { id: true },
            _avg: { timestamp: true },
            orderBy: { _count: { id: sortOrder } },
            take: limit
        });
        return pageStats.map(stat => ({
            page: stat.page,
            views: stat._count.id,
            avgTimestamp: stat._avg.timestamp
        }));
    }
    async getDeviceAnalytics(websiteId, options) {
        const { startDate, endDate, groupBy = 'browser' } = options;
        let whereClause = { websiteId };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const deviceStats = await prisma.trackingEvent.groupBy({
            by: [groupBy],
            where: whereClause,
            _count: { id: true }
        });
        return deviceStats.map(stat => ({
            [groupBy]: stat[groupBy],
            count: stat._count.id
        }));
    }
    async getGeographicAnalytics(websiteId, options) {
        const { startDate, endDate, groupBy = 'country' } = options;
        let whereClause = { websiteId };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const geoStats = await prisma.trackingSession.groupBy({
            by: [groupBy],
            where: whereClause,
            _count: { id: true }
        });
        return geoStats.map(stat => ({
            [groupBy]: stat[groupBy],
            count: stat._count.id
        }));
    }
    async getConversionAnalytics(websiteId, options) {
        const { startDate, endDate, conversionType } = options;
        let whereClause = {
            websiteId,
            eventType: 'conversion'
        };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const conversions = await prisma.trackingEvent.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' }
        });
        return conversions.map(conversion => ({
            id: conversion.id,
            timestamp: conversion.timestamp,
            data: conversion.data,
            page: conversion.page
        }));
    }
    async getUserJourney(websiteId, options) {
        const { sessionId, userId, startDate, endDate } = options;
        let whereClause = { websiteId };
        if (sessionId)
            whereClause.sessionId = sessionId;
        if (userId)
            whereClause.userId = userId;
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const events = await prisma.trackingEvent.findMany({
            where: whereClause,
            orderBy: { timestamp: 'asc' }
        });
        return events.map(event => ({
            id: event.id,
            eventType: event.eventType,
            timestamp: event.timestamp,
            page: event.page,
            data: event.data
        }));
    }
    async getHeatmapData(websiteId, options) {
        const { page, startDate, endDate } = options;
        let whereClause = {
            websiteId,
            eventType: 'click'
        };
        if (page)
            whereClause.page = { path: page };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const clicks = await prisma.trackingEvent.findMany({
            where: whereClause,
            select: { data: true }
        });
        const heatmapData = clicks
            .filter(click => click.data?.position)
            .map(click => ({
            x: click.data.position.x,
            y: click.data.position.y
        }));
        return {
            page,
            clicks: heatmapData,
            totalClicks: heatmapData.length
        };
    }
    async getFunnelAnalysis(websiteId, options) {
        const { steps, startDate, endDate } = options;
        const stepList = steps ? steps.split(',') : ['page_view', 'click', 'conversion'];
        let whereClause = { websiteId };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        const funnelData = await Promise.all(stepList.map(async (step, index) => {
            const count = await prisma.trackingEvent.count({
                where: {
                    ...whereClause,
                    eventType: step
                }
            });
            return {
                step: index + 1,
                eventType: step,
                count,
                conversionRate: index === 0 ? 100 : 0
            };
        }));
        const firstStepCount = funnelData[0]?.count || 0;
        funnelData.forEach((step, index) => {
            if (index > 0 && firstStepCount > 0) {
                step.conversionRate = (step.count / firstStepCount) * 100;
            }
        });
        return {
            steps: funnelData,
            totalSteps: stepList.length
        };
    }
    async exportTrackingData(websiteId, options) {
        const { startDate, endDate, format = 'csv', eventTypes } = options;
        let whereClause = { websiteId };
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate)
                whereClause.timestamp.gte = new Date(startDate);
            if (endDate)
                whereClause.timestamp.lte = new Date(endDate);
        }
        if (eventTypes) {
            const types = eventTypes.split(',');
            whereClause.eventType = { in: types };
        }
        const events = await prisma.trackingEvent.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' }
        });
        if (format === 'csv') {
            return this.convertToCSV(events);
        }
        else {
            return JSON.stringify(events, null, 2);
        }
    }
    groupStatsByPeriod(stats, groupBy) {
        return stats;
    }
    calculateSummary(stats) {
        return {
            totalPageViews: stats.reduce((sum, stat) => sum + stat.pageViews, 0),
            totalClicks: stats.reduce((sum, stat) => sum + stat.clicks, 0),
            totalConversions: stats.reduce((sum, stat) => sum + stat.conversions, 0),
            totalEvents: stats.reduce((sum, stat) => sum + stat.otherEvents, 0)
        };
    }
    convertToCSV(events) {
        const headers = ['id', 'eventType', 'timestamp', 'sessionId', 'userId', 'page', 'data'];
        const csvRows = [headers.join(',')];
        events.forEach(event => {
            const row = headers.map(header => {
                const value = event[header];
                return typeof value === 'object' ? JSON.stringify(value) : value;
            });
            csvRows.push(row.join(','));
        });
        return csvRows.join('\n');
    }
}
exports.TrackingService = TrackingService;
//# sourceMappingURL=TrackingService.js.map