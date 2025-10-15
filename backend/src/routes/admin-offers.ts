import express, { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all offers
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;

      // Mock offers data
      const offers = [
        {
          id: "OFFER-001",
          name: "Premium Plan Promotion",
          description: "30% commission on premium plan sales",
          commissionType: "Percentage",
          commissionValue: 30,
          category: "Software",
          status: "active",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          clicks: 1250,
          conversions: 45,
          revenue: 12500.0,
          affiliatesCount: 23,
          conversionRate: 3.6,
        },
        {
          id: "OFFER-002",
          name: "Basic Plan Special",
          description: "20% commission on basic plan",
          commissionType: "Percentage",
          commissionValue: 20,
          category: "Software",
          status: "active",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          clicks: 890,
          conversions: 32,
          revenue: 3200.0,
          affiliatesCount: 18,
          conversionRate: 3.6,
        },
        {
          id: "OFFER-003",
          name: "Enterprise Package",
          description: "Flat $500 commission per enterprise sale",
          commissionType: "Fixed",
          commissionValue: 500,
          category: "Enterprise",
          status: "active",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          clicks: 345,
          conversions: 8,
          revenue: 80000.0,
          affiliatesCount: 5,
          conversionRate: 2.3,
        },
      ];

      const filteredOffers = status
        ? offers.filter((o) => o.status === status)
        : offers;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const paginatedOffers = filteredOffers.slice(
        skip,
        skip + parseInt(limit as string)
      );

      res.json({
        data: paginatedOffers,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: filteredOffers.length,
          pages: Math.ceil(filteredOffers.length / parseInt(limit as string)),
        },
        summary: {
          active: offers.filter((o) => o.status === "active").length,
          paused: offers.filter((o) => o.status === "paused").length,
          ended: offers.filter((o) => o.status === "ended").length,
          totalRevenue: offers.reduce((sum, o) => sum + o.revenue, 0),
        },
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  }
);

// Create new offer
router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const {
        name,
        description,
        commissionType,
        commissionValue,
        category,
        startDate,
        endDate,
      } = req.body;

      // Validate input
      const schema = z.object({
        name: z.string().min(3),
        description: z.string().min(10),
        commissionType: z.enum(["Percentage", "Fixed"]),
        commissionValue: z.number().positive(),
        category: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
      });

      const validatedData = schema.parse({
        name,
        description,
        commissionType,
        commissionValue,
        category,
        startDate,
        endDate,
      });

      const offer = {
        id: `OFFER-${Date.now()}`,
        ...validatedData,
        status: "active",
        clicks: 0,
        conversions: 0,
        revenue: 0,
        affiliatesCount: 0,
        conversionRate: 0,
        createdAt: new Date(),
      };

      res.json({
        success: true,
        message: "Offer created successfully",
        offer,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid input data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create offer" });
    }
  }
);

// Update offer
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      res.json({
        success: true,
        message: "Offer updated successfully",
        offer: {
          id,
          ...updates,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error updating offer:", error);
      res.status(500).json({ error: "Failed to update offer" });
    }
  }
);

// Delete offer
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: any, res) => {
    try {
      const { id } = req.params;

      res.json({
        success: true,
        message: "Offer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting offer:", error);
      res.status(500).json({ error: "Failed to delete offer" });
    }
  }
);

export default router;
