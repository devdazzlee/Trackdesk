"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var AffiliateController_1 = require("../controllers/AffiliateController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var affiliateController = new AffiliateController_1.AffiliateController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Public affiliate routes
router.get('/', affiliateController.getAllAffiliates);
router.get('/:id', affiliateController.getAffiliateById);
router.post('/', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), affiliateController.createAffiliate);
router.put('/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), affiliateController.updateAffiliate);
router.delete('/:id', (0, auth_1.requireRole)(['ADMIN']), affiliateController.deleteAffiliate);
// Affiliate profile routes
router.get('/profile/me', affiliateController.getMyProfile);
router.put('/profile/me', affiliateController.updateMyProfile);
router.post('/profile/me/avatar', affiliateController.uploadAvatar);
// Affiliate links routes
router.get('/:id/links', affiliateController.getAffiliateLinks);
router.post('/:id/links', affiliateController.createAffiliateLink);
router.put('/links/:linkId', affiliateController.updateAffiliateLink);
router.delete('/links/:linkId', affiliateController.deleteAffiliateLink);
// Affiliate commissions routes
router.get('/:id/commissions', affiliateController.getCommissions);
router.get('/:id/payouts', affiliateController.getPayouts);
router.post('/:id/payouts/request', affiliateController.requestPayout);
// Affiliate analytics routes
router.get('/:id/analytics', affiliateController.getAnalytics);
router.get('/:id/analytics/clicks', affiliateController.getClicksAnalytics);
router.get('/:id/analytics/conversions', affiliateController.getConversionsAnalytics);
exports.default = router;
