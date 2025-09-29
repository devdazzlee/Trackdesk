import express, { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const dashboardController = new DashboardController();

// All routes require authentication
router.use(authenticateToken);

// Dashboard routes
router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/performance-chart', dashboardController.getPerformanceChart);
router.get('/top-offers', dashboardController.getTopOffers);
router.get('/notifications', dashboardController.getNotifications);
router.put('/notifications/:id/read', dashboardController.markNotificationAsRead);

export default router;
