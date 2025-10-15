"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var PayoutBuilderController_1 = require("../controllers/PayoutBuilderController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// CRUD Operations
router.post('/', PayoutBuilderController_1.PayoutBuilderController.createPayoutRule);
router.get('/', PayoutBuilderController_1.PayoutBuilderController.listPayoutRules);
router.get('/dashboard', PayoutBuilderController_1.PayoutBuilderController.getPayoutBuilderDashboard);
router.get('/stats', PayoutBuilderController_1.PayoutBuilderController.getPayoutStats);
router.post('/default', PayoutBuilderController_1.PayoutBuilderController.createDefaultRules);
// Individual Rule Operations
router.get('/:id', PayoutBuilderController_1.PayoutBuilderController.getPayoutRule);
router.put('/:id', PayoutBuilderController_1.PayoutBuilderController.updatePayoutRule);
router.delete('/:id', PayoutBuilderController_1.PayoutBuilderController.deletePayoutRule);
// Payout Conditions Management
router.post('/:ruleId/conditions', PayoutBuilderController_1.PayoutBuilderController.addCondition);
router.put('/:ruleId/conditions/:conditionId', PayoutBuilderController_1.PayoutBuilderController.updateCondition);
router.delete('/:ruleId/conditions/:conditionId', PayoutBuilderController_1.PayoutBuilderController.removeCondition);
// Payout Actions Management
router.post('/:ruleId/actions', PayoutBuilderController_1.PayoutBuilderController.addAction);
router.put('/:ruleId/actions/:actionId', PayoutBuilderController_1.PayoutBuilderController.updateAction);
router.delete('/:ruleId/actions/:actionId', PayoutBuilderController_1.PayoutBuilderController.removeAction);
// Payout Processing
router.post('/:ruleId/process', PayoutBuilderController_1.PayoutBuilderController.processPayouts);
router.get('/:ruleId/preview', PayoutBuilderController_1.PayoutBuilderController.previewPayouts);
// Payout History
router.get('/:ruleId/history', PayoutBuilderController_1.PayoutBuilderController.getPayoutHistory);
// Payout Reports
router.post('/:ruleId/reports', PayoutBuilderController_1.PayoutBuilderController.generatePayoutReport);
// Rule Testing
router.post('/:ruleId/test', PayoutBuilderController_1.PayoutBuilderController.testRule);
// Schedule Management
router.put('/:ruleId/schedule', PayoutBuilderController_1.PayoutBuilderController.updateSchedule);
// Export/Import
router.get('/export', PayoutBuilderController_1.PayoutBuilderController.exportRules);
router.post('/import', PayoutBuilderController_1.PayoutBuilderController.importRules);
exports.default = router;
