"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
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
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedPayouts = filteredPayouts.slice(skip, skip + parseInt(limit));
        res.json({
            data: paginatedPayouts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredPayouts.length,
                pages: Math.ceil(filteredPayouts.length / parseInt(limit)),
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
    }
    catch (error) {
        console.error("Error fetching payouts:", error);
        res.status(500).json({ error: "Failed to fetch payouts" });
    }
});
router.patch("/:id/status", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const validStatuses = ["pending", "processing", "completed", "failed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
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
    }
    catch (error) {
        console.error("Error updating payout status:", error);
        res.status(500).json({ error: "Failed to update payout status" });
    }
});
router.post("/process-bulk", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { payoutIds } = req.body;
        if (!Array.isArray(payoutIds) || payoutIds.length === 0) {
            return res.status(400).json({ error: "Invalid payout IDs" });
        }
        res.json({
            success: true,
            message: `${payoutIds.length} payouts processed successfully`,
            processedCount: payoutIds.length,
        });
    }
    catch (error) {
        console.error("Error processing bulk payouts:", error);
        res.status(500).json({ error: "Failed to process bulk payouts" });
    }
});
router.get("/analytics", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { period = "30d" } = req.query;
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
    }
    catch (error) {
        console.error("Error fetching payout analytics:", error);
        res.status(500).json({ error: "Failed to fetch payout analytics" });
    }
});
exports.default = router;
//# sourceMappingURL=admin-payouts.js.map