"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DashboardController_1 = require("../controllers/DashboardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const dashboardController = new DashboardController_1.DashboardController();
router.use(auth_1.authenticateToken);
router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/performance-chart', dashboardController.getPerformanceChart);
router.get('/top-offers', dashboardController.getTopOffers);
router.get('/notifications', dashboardController.getNotifications);
router.put('/notifications/:id/read', dashboardController.markNotificationAsRead);
exports.default = router;
//# sourceMappingURL=dashboard.js.map