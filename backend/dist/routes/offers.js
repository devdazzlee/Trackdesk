"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var OffersController_1 = require("../controllers/OffersController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// CRUD Operations
router.post('/', OffersController_1.OffersController.createOffer);
router.get('/', OffersController_1.OffersController.listOffers);
router.get('/dashboard', OffersController_1.OffersController.getOffersDashboard);
router.get('/stats', OffersController_1.OffersController.getOfferStats);
router.post('/default', OffersController_1.OffersController.createDefaultOffers);
// Individual Offer Operations
router.get('/:id', OffersController_1.OffersController.getOffer);
router.put('/:id', OffersController_1.OffersController.updateOffer);
router.delete('/:id', OffersController_1.OffersController.deleteOffer);
router.post('/:id/stats/update', OffersController_1.OffersController.updateStats);
// Landing Pages Management
router.post('/:offerId/landing-pages', OffersController_1.OffersController.addLandingPage);
router.put('/:offerId/landing-pages/:landingPageId', OffersController_1.OffersController.updateLandingPage);
router.delete('/:offerId/landing-pages/:landingPageId', OffersController_1.OffersController.removeLandingPage);
// Creatives Management
router.post('/:offerId/creatives', OffersController_1.OffersController.addCreative);
router.put('/:offerId/creatives/:creativeId', OffersController_1.OffersController.updateCreative);
router.delete('/:offerId/creatives/:creativeId', OffersController_1.OffersController.removeCreative);
// Integrations Management
router.post('/:offerId/integrations', OffersController_1.OffersController.addIntegration);
router.put('/:offerId/integrations/:integrationId', OffersController_1.OffersController.updateIntegration);
router.delete('/:offerId/integrations/:integrationId', OffersController_1.OffersController.removeIntegration);
// Tracking Code Generation
router.post('/:offerId/tracking-code', OffersController_1.OffersController.generateTrackingCode);
// Offer Applications
router.post('/:offerId/applications', OffersController_1.OffersController.createApplication);
router.get('/:offerId/applications', OffersController_1.OffersController.getApplications);
router.get('/applications/:id', OffersController_1.OffersController.getApplication);
router.put('/applications/:id/status', OffersController_1.OffersController.updateApplicationStatus);
exports.default = router;
