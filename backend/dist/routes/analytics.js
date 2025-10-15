"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var AnalyticsController_1 = require("../controllers/AnalyticsController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var analyticsController = new AnalyticsController_1.AnalyticsController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Real-time analytics routes
router.get('/realtime', analyticsController.getRealTimeAnalytics);
router.get('/realtime/activity', analyticsController.getRealTimeActivity);
router.get('/realtime/metrics', analyticsController.getRealTimeMetrics);
// Advanced analytics routes
router.get('/funnel', analyticsController.getFunnelAnalysis);
router.get('/cohort', analyticsController.getCohortAnalysis);
router.get('/attribution/:conversionId', analyticsController.getAttributionData);
router.get('/attribution/models', analyticsController.getAttributionModels);
// Performance analytics routes
router.get('/performance', analyticsController.getPerformanceAnalytics);
router.get('/performance/trends', analyticsController.getPerformanceTrends);
router.get('/performance/comparison', analyticsController.getPerformanceComparison);
// Geographic analytics routes
router.get('/geographic', analyticsController.getGeographicAnalytics);
router.get('/geographic/countries', analyticsController.getCountryAnalytics);
router.get('/geographic/cities', analyticsController.getCityAnalytics);
// Device analytics routes
router.get('/devices', analyticsController.getDeviceAnalytics);
router.get('/devices/types', analyticsController.getDeviceTypeAnalytics);
router.get('/devices/browsers', analyticsController.getBrowserAnalytics);
// Custom reports routes
router.get('/reports', analyticsController.getCustomReports);
router.post('/reports', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), analyticsController.createCustomReport);
router.put('/reports/:reportId', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), analyticsController.updateCustomReport);
router.delete('/reports/:reportId', (0, auth_1.requireRole)(['ADMIN']), analyticsController.deleteCustomReport);
router.post('/reports/:reportId/export', analyticsController.exportReport);
exports.default = router;
