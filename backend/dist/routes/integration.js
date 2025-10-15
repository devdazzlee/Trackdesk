"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var IntegrationController_1 = require("../controllers/IntegrationController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var integrationController = new IntegrationController_1.IntegrationController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Integration management routes
router.get('/', integrationController.getIntegrations);
router.get('/:id', integrationController.getIntegrationById);
router.post('/', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.createIntegration);
router.put('/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.updateIntegration);
router.delete('/:id', (0, auth_1.requireRole)(['ADMIN']), integrationController.deleteIntegration);
// Shopify integration routes
router.post('/shopify/connect', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.connectShopify);
router.post('/shopify/sync', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.syncShopifyProducts);
router.get('/shopify/products', integrationController.getShopifyProducts);
router.get('/shopify/orders', integrationController.getShopifyOrders);
// Mailchimp integration routes
router.post('/mailchimp/connect', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.connectMailchimp);
router.post('/mailchimp/sync', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.syncMailchimpList);
router.get('/mailchimp/lists', integrationController.getMailchimpLists);
router.get('/mailchimp/campaigns', integrationController.getMailchimpCampaigns);
// Stripe integration routes
router.post('/stripe/connect', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.connectStripe);
router.get('/stripe/balance', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.getStripeBalance);
router.get('/stripe/payouts', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.getStripePayouts);
// Google Analytics integration routes
router.post('/google-analytics/connect', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.connectGoogleAnalytics);
router.get('/google-analytics/data', integrationController.getGoogleAnalyticsData);
// Facebook Pixel integration routes
router.post('/facebook-pixel/connect', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.connectFacebookPixel);
router.get('/facebook-pixel/events', integrationController.getFacebookPixelEvents);
// Integration status routes
router.get('/:id/status', integrationController.getIntegrationStatus);
router.post('/:id/test', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.testIntegration);
router.post('/:id/sync', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), integrationController.syncIntegration);
exports.default = router;
