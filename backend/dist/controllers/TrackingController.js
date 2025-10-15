"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingController = void 0;
const TrackingService_1 = require("../services/TrackingService");
const zod_1 = require("zod");
const trackingService = new TrackingService_1.TrackingService();
const trackEventsSchema = zod_1.z.object({
    events: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        event: zod_1.z.string(),
        data: zod_1.z.any(),
        timestamp: zod_1.z.string(),
        sessionId: zod_1.z.string(),
        userId: zod_1.z.string().optional(),
        websiteId: zod_1.z.string(),
        page: zod_1.z.object({
            url: zod_1.z.string(),
            title: zod_1.z.string(),
            referrer: zod_1.z.string().optional(),
            path: zod_1.z.string(),
            search: zod_1.z.string(),
            hash: zod_1.z.string()
        }),
        device: zod_1.z.object({
            userAgent: zod_1.z.string(),
            language: zod_1.z.string(),
            platform: zod_1.z.string(),
            screenWidth: zod_1.z.number(),
            screenHeight: zod_1.z.number(),
            viewportWidth: zod_1.z.number(),
            viewportHeight: zod_1.z.number(),
            colorDepth: zod_1.z.number(),
            timezone: zod_1.z.string()
        }),
        browser: zod_1.z.object({
            browser: zod_1.z.string(),
            version: zod_1.z.string()
        })
    })),
    websiteId: zod_1.z.string(),
    sessionId: zod_1.z.string(),
    timestamp: zod_1.z.string()
});
const createWebsiteSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    domain: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    settings: zod_1.z.object({
        trackClicks: zod_1.z.boolean().default(true),
        trackScrolls: zod_1.z.boolean().default(true),
        trackForms: zod_1.z.boolean().default(true),
        trackPageViews: zod_1.z.boolean().default(true),
        trackConversions: zod_1.z.boolean().default(true),
        respectDoNotTrack: zod_1.z.boolean().default(true),
        anonymizeIP: zod_1.z.boolean().default(false)
    }).optional()
});
const updateWebsiteSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    domain: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    settings: zod_1.z.object({
        trackClicks: zod_1.z.boolean(),
        trackScrolls: zod_1.z.boolean(),
        trackForms: zod_1.z.boolean(),
        trackPageViews: zod_1.z.boolean(),
        trackConversions: zod_1.z.boolean(),
        respectDoNotTrack: zod_1.z.boolean(),
        anonymizeIP: zod_1.z.boolean()
    }).optional()
});
class TrackingController {
    async trackEvents(req, res) {
        try {
            const data = trackEventsSchema.parse(req.body);
            const result = await trackingService.processEvents(data);
            res.json({
                success: true,
                processed: result.processed,
                failed: result.failed,
                message: 'Events processed successfully'
            });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    error: 'Invalid event data',
                    details: error.errors
                });
            }
            console.error('Tracking error:', error);
            res.status(500).json({ error: 'Failed to process events' });
        }
    }
    async getTrackingStats(req, res) {
        try {
            const { websiteId } = req.params;
            const { startDate, endDate, groupBy = 'day', timezone = 'UTC' } = req.query;
            const stats = await trackingService.getTrackingStats(websiteId, {
                startDate: startDate,
                endDate: endDate,
                groupBy: groupBy,
                timezone: timezone
            });
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getRealtimeAnalytics(req, res) {
        try {
            const { websiteId } = req.params;
            const analytics = await trackingService.getRealtimeAnalytics(websiteId);
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getPageAnalytics(req, res) {
        try {
            const { websiteId } = req.params;
            const { startDate, endDate, limit = 50, sortBy = 'views', sortOrder = 'desc' } = req.query;
            const analytics = await trackingService.getPageAnalytics(websiteId, {
                startDate: startDate,
                endDate: endDate,
                limit: parseInt(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getDeviceAnalytics(req, res) {
        try {
            const { websiteId } = req.params;
            const { startDate, endDate, groupBy = 'browser' } = req.query;
            const analytics = await trackingService.getDeviceAnalytics(websiteId, {
                startDate: startDate,
                endDate: endDate,
                groupBy: groupBy
            });
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getGeographicAnalytics(req, res) {
        try {
            const { websiteId } = req.params;
            const { startDate, endDate, groupBy = 'country' } = req.query;
            const analytics = await trackingService.getGeographicAnalytics(websiteId, {
                startDate: startDate,
                endDate: endDate,
                groupBy: groupBy
            });
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getConversionAnalytics(req, res) {
        try {
            const { websiteId } = req.params;
            const { startDate, endDate, conversionType } = req.query;
            const analytics = await trackingService.getConversionAnalytics(websiteId, {
                startDate: startDate,
                endDate: endDate,
                conversionType: conversionType
            });
            res.json(analytics);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getUserJourney(req, res) {
        try {
            const { websiteId } = req.params;
            const { sessionId, userId, startDate, endDate } = req.query;
            const journey = await trackingService.getUserJourney(websiteId, {
                sessionId: sessionId,
                userId: userId,
                startDate: startDate,
                endDate: endDate
            });
            res.json(journey);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getHeatmapData(req, res) {
        try {
            const { websiteId } = req.params;
            const { page, startDate, endDate } = req.query;
            const heatmap = await trackingService.getHeatmapData(websiteId, {
                page: page,
                startDate: startDate,
                endDate: endDate
            });
            res.json(heatmap);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getFunnelAnalysis(req, res) {
        try {
            const { websiteId } = req.params;
            const { steps, startDate, endDate } = req.query;
            const funnel = await trackingService.getFunnelAnalysis(websiteId, {
                steps: steps,
                startDate: startDate,
                endDate: endDate
            });
            res.json(funnel);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async exportTrackingData(req, res) {
        try {
            const { websiteId } = req.params;
            const { startDate, endDate, format = 'csv', eventTypes } = req.query;
            const exportData = await trackingService.exportTrackingData(websiteId, {
                startDate: startDate,
                endDate: endDate,
                format: format,
                eventTypes: eventTypes
            });
            const filename = `tracking-data-${websiteId}-${Date.now()}.${format}`;
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
            res.send(exportData);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.TrackingController = TrackingController;
//# sourceMappingURL=TrackingController.js.map