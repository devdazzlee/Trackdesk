"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
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
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedOffers = filteredOffers.slice(skip, skip + parseInt(limit));
        res.json({
            data: paginatedOffers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredOffers.length,
                pages: Math.ceil(filteredOffers.length / parseInt(limit)),
            },
            summary: {
                active: offers.filter((o) => o.status === "active").length,
                paused: offers.filter((o) => o.status === "paused").length,
                ended: offers.filter((o) => o.status === "ended").length,
                totalRevenue: offers.reduce((sum, o) => sum + o.revenue, 0),
            },
        });
    }
    catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({ error: "Failed to fetch offers" });
    }
});
router.post("/", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { name, description, commissionType, commissionValue, category, startDate, endDate, } = req.body;
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(3),
            description: zod_1.z.string().min(10),
            commissionType: zod_1.z.enum(["Percentage", "Fixed"]),
            commissionValue: zod_1.z.number().positive(),
            category: zod_1.z.string(),
            startDate: zod_1.z.string(),
            endDate: zod_1.z.string().optional(),
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
    }
    catch (error) {
        console.error("Error creating offer:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to create offer" });
    }
});
router.put("/:id", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
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
    }
    catch (error) {
        console.error("Error updating offer:", error);
        res.status(500).json({ error: "Failed to update offer" });
    }
});
router.delete("/:id", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            message: "Offer deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting offer:", error);
        res.status(500).json({ error: "Failed to delete offer" });
    }
});
exports.default = router;
//# sourceMappingURL=admin-offers.js.map