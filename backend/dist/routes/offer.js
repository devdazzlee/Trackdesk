"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var OfferController_1 = require("../controllers/OfferController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var offerController = new OfferController_1.OfferController();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Offer management routes
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);
router.post('/', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), offerController.createOffer);
router.put('/:id', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), offerController.updateOffer);
router.delete('/:id', (0, auth_1.requireRole)(['ADMIN']), offerController.deleteOffer);
// Offer applications routes
router.get('/:id/applications', offerController.getOfferApplications);
router.post('/:id/apply', offerController.applyForOffer);
router.put('/applications/:applicationId', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), offerController.updateApplication);
router.delete('/applications/:applicationId', (0, auth_1.requireRole)(['ADMIN']), offerController.deleteApplication);
// Offer creatives routes
router.get('/:id/creatives', offerController.getOfferCreatives);
router.post('/:id/creatives', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), offerController.createCreative);
router.put('/creatives/:creativeId', (0, auth_1.requireRole)(['ADMIN', 'MANAGER']), offerController.updateCreative);
router.delete('/creatives/:creativeId', (0, auth_1.requireRole)(['ADMIN']), offerController.deleteCreative);
// Offer analytics routes
router.get('/:id/analytics', offerController.getOfferAnalytics);
router.get('/:id/analytics/clicks', offerController.getOfferClicks);
router.get('/:id/analytics/conversions', offerController.getOfferConversions);
exports.default = router;
