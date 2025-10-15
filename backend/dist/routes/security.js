"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var SecurityController_1 = require("../controllers/SecurityController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var securityController = new SecurityController_1.SecurityController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// 2FA routes
router.post('/2fa/setup', securityController.setup2FA);
router.post('/2fa/verify', securityController.verify2FA);
router.post('/2fa/disable', securityController.disable2FA);
router.post('/2fa/backup-codes', securityController.generateBackupCodes);
// Security logs routes
router.get('/logs', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getSecurityLogs);
router.get('/logs/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getSecurityLogById);
// Login attempts routes
router.get('/login-attempts', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getLoginAttempts);
router.get('/login-attempts/:userId', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getUserLoginAttempts);
// IP blocking routes
router.get('/ip-blocks', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getIPBlocks);
router.post('/ip-blocks', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.createIPBlock);
router.delete('/ip-blocks/:id', (0, auth_1.requireRole)(['ADMIN']), securityController.deleteIPBlock);
// Device management routes
router.get('/devices', securityController.getUserDevices);
router.post('/devices/:deviceId/revoke', securityController.revokeDevice);
router.post('/devices/revoke-all', securityController.revokeAllDevices);
// Security settings routes
router.get('/settings', securityController.getSecuritySettings);
router.put('/settings', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.updateSecuritySettings);
// Audit trail routes
router.get('/audit-trail', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getAuditTrail);
router.get('/audit-trail/:userId', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), securityController.getUserAuditTrail);
exports.default = router;
