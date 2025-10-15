"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var EnterpriseController_1 = require("../controllers/EnterpriseController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var enterpriseController = new EnterpriseController_1.EnterpriseController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// White-label routes
router.get('/white-label', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getWhiteLabelSettings);
router.put('/white-label', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.updateWhiteLabelSettings);
router.post('/white-label/preview', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.previewWhiteLabel);
// Multi-tenant routes
router.get('/tenants', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getTenants);
router.get('/tenants/:id', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getTenantById);
router.post('/tenants', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.createTenant);
router.put('/tenants/:id', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.updateTenant);
router.delete('/tenants/:id', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.deleteTenant);
// Tenant settings routes
router.get('/tenants/:id/settings', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getTenantSettings);
router.put('/tenants/:id/settings', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.updateTenantSettings);
// Tenant analytics routes
router.get('/tenants/:id/analytics', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getTenantAnalytics);
router.get('/tenants/:id/usage', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getTenantUsage);
// Enterprise features routes
router.get('/features', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getEnterpriseFeatures);
router.put('/features', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.updateEnterpriseFeatures);
// API limits routes
router.get('/api-limits', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getAPILimits);
router.put('/api-limits', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.updateAPILimits);
// Custom domains routes
router.get('/domains', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getCustomDomains);
router.post('/domains', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.addCustomDomain);
router.delete('/domains/:id', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.removeCustomDomain);
// SSO routes
router.get('/sso', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.getSSOSettings);
router.put('/sso', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.updateSSOSettings);
router.post('/sso/test', (0, auth_1.requireRole)(['ADMIN']), enterpriseController.testSSO);
exports.default = router;
