"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var AutomationController_1 = require("../controllers/AutomationController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var automationController = new AutomationController_1.AutomationController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Workflow management routes
router.get('/workflows', automationController.getWorkflows);
router.get('/workflows/:id', automationController.getWorkflowById);
router.post('/workflows', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.createWorkflow);
router.put('/workflows/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.updateWorkflow);
router.delete('/workflows/:id', (0, auth_1.requireRole)(['ADMIN']), automationController.deleteWorkflow);
// Workflow execution routes
router.post('/workflows/:id/trigger', automationController.triggerWorkflow);
router.post('/workflows/:id/test', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.testWorkflow);
// Rule management routes
router.get('/rules', automationController.getRules);
router.get('/rules/:id', automationController.getRuleById);
router.post('/rules', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.createRule);
router.put('/rules/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.updateRule);
router.delete('/rules/:id', (0, auth_1.requireRole)(['ADMIN']), automationController.deleteRule);
// Rule execution routes
router.post('/rules/:id/activate', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.activateRule);
router.post('/rules/:id/deactivate', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.deactivateRule);
router.post('/rules/:id/test', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), automationController.testRule);
// Automation analytics routes
router.get('/analytics', automationController.getAutomationAnalytics);
router.get('/analytics/workflows', automationController.getWorkflowAnalytics);
router.get('/analytics/rules', automationController.getRuleAnalytics);
exports.default = router;
