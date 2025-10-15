"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var TrafficControlController_1 = require("../controllers/TrafficControlController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// CRUD Operations
router.post('/', TrafficControlController_1.TrafficControlController.createRule);
router.get('/', TrafficControlController_1.TrafficControlController.listRules);
router.get('/dashboard', TrafficControlController_1.TrafficControlController.getTrafficControlDashboard);
router.get('/stats', TrafficControlController_1.TrafficControlController.getTrafficStats);
router.post('/default', TrafficControlController_1.TrafficControlController.createDefaultRules);
// Individual Rule Operations
router.get('/:id', TrafficControlController_1.TrafficControlController.getRule);
router.put('/:id', TrafficControlController_1.TrafficControlController.updateRule);
router.delete('/:id', TrafficControlController_1.TrafficControlController.deleteRule);
// Traffic Processing
router.post('/process', TrafficControlController_1.TrafficControlController.processTraffic);
// Traffic Events
router.get('/events', TrafficControlController_1.TrafficControlController.getTrafficEvents);
// Rule Testing
router.post('/:id/test', TrafficControlController_1.TrafficControlController.testRule);
// IP Management
router.post('/ip/block', TrafficControlController_1.TrafficControlController.blockIP);
router.delete('/ip/:ipAddress/unblock', TrafficControlController_1.TrafficControlController.unblockIP);
router.get('/ip/blocked', TrafficControlController_1.TrafficControlController.getBlockedIPs);
// Country Management
router.post('/country/block', TrafficControlController_1.TrafficControlController.blockCountry);
router.delete('/country/:countryCode/unblock', TrafficControlController_1.TrafficControlController.unblockCountry);
router.get('/country/blocked', TrafficControlController_1.TrafficControlController.getBlockedCountries);
// Rate Limiting
router.put('/:ruleId/rate-limit', TrafficControlController_1.TrafficControlController.updateRateLimit);
// Device Management
router.post('/device/block', TrafficControlController_1.TrafficControlController.blockDevice);
router.delete('/device/:deviceType/unblock', TrafficControlController_1.TrafficControlController.unblockDevice);
// Export/Import
router.get('/export', TrafficControlController_1.TrafficControlController.exportRules);
router.post('/import', TrafficControlController_1.TrafficControlController.importRules);
exports.default = router;
