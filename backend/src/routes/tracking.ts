import { Router } from 'express';
import { TrackingController } from '../controllers/TrackingController';

const router = Router();
const trackingController = new TrackingController();

// CDN tracking endpoints
router.post('/events', trackingController.trackEvents);

// Analytics endpoints
router.get('/stats/:websiteId', trackingController.getTrackingStats);
router.get('/realtime/:websiteId', trackingController.getRealtimeAnalytics);
router.get('/pages/:websiteId', trackingController.getPageAnalytics);
router.get('/devices/:websiteId', trackingController.getDeviceAnalytics);
router.get('/geographic/:websiteId', trackingController.getGeographicAnalytics);
router.get('/conversions/:websiteId', trackingController.getConversionAnalytics);
router.get('/journey/:websiteId', trackingController.getUserJourney);
router.get('/heatmap/:websiteId', trackingController.getHeatmapData);
router.get('/funnel/:websiteId', trackingController.getFunnelAnalysis);

// Export endpoints
router.get('/export/:websiteId', trackingController.exportTrackingData);

export default router;
