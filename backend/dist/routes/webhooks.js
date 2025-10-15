"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var WebhooksController_1 = require("../controllers/WebhooksController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// CRUD Operations
router.post('/', WebhooksController_1.WebhooksController.createWebhook);
router.get('/', WebhooksController_1.WebhooksController.listWebhooks);
router.get('/dashboard', WebhooksController_1.WebhooksController.getWebhooksDashboard);
router.get('/templates', WebhooksController_1.WebhooksController.getWebhookTemplates);
router.post('/default', WebhooksController_1.WebhooksController.createDefaultWebhooks);
// Individual Webhook Operations
router.get('/:id', WebhooksController_1.WebhooksController.getWebhook);
router.put('/:id', WebhooksController_1.WebhooksController.updateWebhook);
router.delete('/:id', WebhooksController_1.WebhooksController.deleteWebhook);
// Webhook Events Management
router.post('/:webhookId/events', WebhooksController_1.WebhooksController.addEvent);
router.put('/:webhookId/events/:eventId', WebhooksController_1.WebhooksController.updateEvent);
router.delete('/:webhookId/events/:eventId', WebhooksController_1.WebhooksController.removeEvent);
// Webhook Testing
router.post('/:id/test', WebhooksController_1.WebhooksController.testWebhook);
router.post('/:id/trigger', WebhooksController_1.WebhooksController.triggerWebhook);
// Webhook History and Logs
router.get('/:id/history', WebhooksController_1.WebhooksController.getWebhookHistory);
router.get('/:id/logs', WebhooksController_1.WebhooksController.getWebhookLogs);
// Webhook Statistics
router.get('/:id/stats', WebhooksController_1.WebhooksController.getWebhookStats);
// Webhook Templates
router.post('/templates/:templateId', WebhooksController_1.WebhooksController.createWebhookFromTemplate);
// Webhook Security
router.post('/:id/secret', WebhooksController_1.WebhooksController.generateSecret);
router.post('/:id/validate', WebhooksController_1.WebhooksController.validateSignature);
// Webhook Retry
router.post('/:id/retry', WebhooksController_1.WebhooksController.retryWebhook);
// Webhook Endpoint (for receiving webhooks)
router.post('/receive/:webhookId', WebhooksController_1.WebhooksController.receiveWebhook);
// Export/Import
router.get('/export', WebhooksController_1.WebhooksController.exportWebhooks);
router.post('/import', WebhooksController_1.WebhooksController.importWebhooks);
exports.default = router;
