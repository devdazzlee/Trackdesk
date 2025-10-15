"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AlertsController_1 = require("../controllers/AlertsController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// CRUD Operations
router.post('/', AlertsController_1.AlertsController.createAlert);
router.get('/', AlertsController_1.AlertsController.listAlerts);
router.get('/dashboard', AlertsController_1.AlertsController.getAlertsDashboard);
router.get('/stats', AlertsController_1.AlertsController.getAlertStats);
router.post('/default', AlertsController_1.AlertsController.createDefaultAlerts);
// Individual Alert Operations
router.get('/:id', AlertsController_1.AlertsController.getAlert);
router.put('/:id', AlertsController_1.AlertsController.updateAlert);
router.delete('/:id', AlertsController_1.AlertsController.deleteAlert);
// Alert Rules Management
router.post('/:alertId/rules', AlertsController_1.AlertsController.addRule);
router.put('/:alertId/rules/:ruleId', AlertsController_1.AlertsController.updateRule);
router.delete('/:alertId/rules/:ruleId', AlertsController_1.AlertsController.removeRule);
// Alert Actions Management
router.post('/:alertId/actions', AlertsController_1.AlertsController.addAction);
router.put('/:alertId/actions/:actionId', AlertsController_1.AlertsController.updateAction);
router.delete('/:alertId/actions/:actionId', AlertsController_1.AlertsController.removeAction);
// Alert Triggers
router.post('/:alertId/trigger', AlertsController_1.AlertsController.triggerAlert);
router.post('/:alertId/test', AlertsController_1.AlertsController.testAlert);
// Alert History
router.get('/:alertId/history', AlertsController_1.AlertsController.getAlertHistory);
exports.default = router;
