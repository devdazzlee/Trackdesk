import express, { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all payouts
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;

      // Mock payout data for now
      const payouts = [
        {
          id: "PAY-001",
          affiliateId: "aff-1",
          affiliateName: "John Doe",
          amount: 250.0,
          method: "PayPal",
          status: "pending",
          requestDate: "2024-10-10",
          email: "john@example.com",
          commissionsCount: 15,
        },
        {
          id: "PAY-002",
          affiliateId: "aff-2",
          affiliateName: "Sarah Wilson",
          amount: 180.5,
          method: "Bank Transfer",
          status: "processing",
          requestDate: "2024-10-09",
          email: "sarah@example.com",
          commissionsCount: 12,
        },
        {
          id: "PAY-003",
          affiliateId: "aff-3",
          affiliateName: "Mike Johnson",
          amount: 420.75,
          method: "PayPal",
          status: "completed",
          requestDate: "2024-10-05",
          email: "mike@example.com",
          commissionsCount: 25,
          processedDate: "2024-10-08",
        },
      ];

      const filteredPayouts = status
        ? payouts.filter((p) => p.status === status)
        : payouts;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const paginatedPayouts = filteredPayouts.slice(
        skip,
        skip + parseInt(limit as string)
      );

      res.json({
        data: paginatedPayouts,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: filteredPayouts.length,
          pages: Math.ceil(filteredPayouts.length / parseInt(limit as string)),
        },
        summary: {
          pending: payouts.filter((p) => p.status === "pending").length,
          processing: payouts.filter((p) => p.status === "processing").length,
          completed: payouts.filter((p) => p.status === "completed").length,
          totalPendingAmount: payouts
            .filter((p) => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0),
        },
      });
    } catch (error) {
      console.error("Error fetching payouts:", error);
      res.status(500).json({ error: "Failed to fetch payouts" });
    }
  }
);

// Update payout status
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validate status
      const validStatuses = ["pending", "processing", "completed", "failed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // In a real app, update the database
      res.json({
        success: true,
        message: `Payout status updated to ${status}`,
        payout: {
          id,
          status,
          notes,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error updating payout status:", error);
      res.status(500).json({ error: "Failed to update payout status" });
    }
  }
);

// Process bulk payouts
router.post(
  "/process-bulk",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { payoutIds } = req.body;

      if (!Array.isArray(payoutIds) || payoutIds.length === 0) {
        return res.status(400).json({ error: "Invalid payout IDs" });
      }

      // In a real app, process all payouts
      res.json({
        success: true,
        message: `${payoutIds.length} payouts processed successfully`,
        processedCount: payoutIds.length,
      });
    } catch (error) {
      console.error("Error processing bulk payouts:", error);
      res.status(500).json({ error: "Failed to process bulk payouts" });
    }
  }
);

// Get payout analytics
router.get(
  "/analytics",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { period = "30d" } = req.query;

      // Mock analytics data
      const analytics = {
        period,
        totalPayouts: 156,
        totalAmount: 45320.5,
        averagePayoutAmount: 290.51,
        byStatus: {
          pending: 12,
          processing: 5,
          completed: 135,
          failed: 4,
        },
        byMethod: {
          PayPal: 98,
          "Bank Transfer": 52,
          Check: 6,
        },
        dailyStats: [
          { date: "2024-10-09", payouts: 5, amount: 1250.0 },
          { date: "2024-10-10", payouts: 8, amount: 2150.5 },
          { date: "2024-10-11", payouts: 3, amount: 890.0 },
          { date: "2024-10-12", payouts: 6, amount: 1680.75 },
          { date: "2024-10-13", payouts: 4, amount: 1120.0 },
          { date: "2024-10-14", payouts: 7, amount: 1950.25 },
          { date: "2024-10-15", payouts: 2, amount: 580.0 },
        ],
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching payout analytics:", error);
      res.status(500).json({ error: "Failed to fetch payout analytics" });
    }
  }
);

export default router;
