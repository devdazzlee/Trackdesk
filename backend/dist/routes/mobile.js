"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var MobileController_1 = require("../controllers/MobileController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var mobileController = new MobileController_1.MobileController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Mobile analytics routes
router.get('/analytics', mobileController.getMobileAnalytics);
router.get('/analytics/users', mobileController.getMobileUsers);
router.get('/analytics/devices', mobileController.getMobileDevices);
// PWA routes
router.get('/pwa/manifest', mobileController.getPWAManifest);
router.get('/pwa/service-worker', mobileController.getServiceWorker);
router.post('/pwa/install', mobileController.trackPWAInstall);
// Push notifications routes
router.post('/push/subscribe', mobileController.subscribeToPush);
router.post('/push/unsubscribe', mobileController.unsubscribeFromPush);
router.post('/push/send', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), mobileController.sendPushNotification);
router.get('/push/history', mobileController.getPushHistory);
// Mobile app routes
router.get('/app/version', mobileController.getAppVersion);
router.get('/app/config', mobileController.getAppConfig);
router.post('/app/feedback', mobileController.submitAppFeedback);
// Offline support routes
router.get('/offline/data', mobileController.getOfflineData);
router.post('/offline/sync', mobileController.syncOfflineData);
// Mobile-specific features routes
router.get('/features', mobileController.getMobileFeatures);
router.post('/features/track', mobileController.trackFeatureUsage);
exports.default = router;
