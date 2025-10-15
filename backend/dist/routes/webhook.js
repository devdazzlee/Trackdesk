"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var WebhookController_1 = require("../controllers/WebhookController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var webhookController = new WebhookController_1.WebhookController();
// Public webhook endpoints (no authentication required)
router.post('/stripe', webhookController.handleStripeWebhook);
router.post('/shopify', webhookController.handleShopifyWebhook);
router.post('/mailchimp', webhookController.handleMailchimpWebhook);
// Protected webhook management routes
router.use(auth_1.authenticateToken);
// Webhook management routes
router.get('/', webhookController.getWebhooks);
router.get('/:id', webhookController.getWebhookById);
router.post('/', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), webhookController.createWebhook);
router.put('/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), webhookController.updateWebhook);
router.delete('/:id', (0, auth_1.requireRole)(['ADMIN']), webhookController.deleteWebhook);
// Webhook testing routes
router.post('/:id/test', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), webhookController.testWebhook);
router.post('/:id/retry', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), webhookController.retryWebhook);
// Webhook logs routes
router.get('/:id/logs', webhookController.getWebhookLogs);
router.get('/:id/logs/:logId', webhookController.getWebhookLogById);
// Webhook events routes
router.get('/events', webhookController.getWebhookEvents);
router.post('/events/:event/trigger', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), webhookController.triggerWebhookEvent);
// Webhook security routes
router.post('/:id/regenerate-secret', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), webhookController.regenerateWebhookSecret);
router.get('/:id/verify', webhookController.verifyWebhookSignature);
exports.default = router;
