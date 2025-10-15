"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var zod_1 = require("zod");
var auth_1 = require("../middleware/auth");
var prisma_1 = require("../lib/prisma");
var router = express_1.default.Router();
// Get all commissions with filtering
router.get("/", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, status_1, affiliateId, dateFrom, dateTo, _d, sortBy, _e, sortOrder, where, _f, commissions, total, mockCommissions, error_1;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 2, , 3]);
                if (req.user.role !== "ADMIN") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only admins can access commission management" })];
                }
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, status_1 = _a.status, affiliateId = _a.affiliateId, dateFrom = _a.dateFrom, dateTo = _a.dateTo, _d = _a.sortBy, sortBy = _d === void 0 ? "createdAt" : _d, _e = _a.sortOrder, sortOrder = _e === void 0 ? "desc" : _e;
                where = {};
                if (status_1) {
                    where.status = status_1;
                }
                if (affiliateId) {
                    where.affiliateId = affiliateId;
                }
                if (dateFrom || dateTo) {
                    where.createdAt = {};
                    if (dateFrom)
                        where.createdAt.gte = new Date(dateFrom);
                    if (dateTo)
                        where.createdAt.lte = new Date(dateTo);
                }
                return [4 /*yield*/, Promise.all([
                        prisma_1.prisma.commission.findMany({
                            where: where,
                            include: {
                                affiliate: {
                                    include: {
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                                conversion: {
                                    include: {
                                        offer: {
                                            select: {
                                                name: true,
                                                description: true,
                                            },
                                        },
                                    },
                                },
                            },
                            orderBy: (_g = {}, _g[sortBy] = sortOrder, _g),
                            skip: (page - 1) * limit,
                            take: parseInt(limit),
                        }),
                        prisma_1.prisma.commission.count({ where: where }),
                    ])];
            case 1:
                _f = _h.sent(), commissions = _f[0], total = _f[1];
                // If no commissions exist, return mock data for demo purposes
                if (total === 0) {
                    mockCommissions = [
                        {
                            id: "demo-1",
                            amount: 25.0,
                            rate: 5.0,
                            status: "PENDING",
                            createdAt: new Date().toISOString(),
                            affiliate: {
                                id: "affiliate-1",
                                user: {
                                    firstName: "Demo",
                                    lastName: "Affiliate",
                                    email: "demo.affiliate@trackdesk.com",
                                },
                            },
                            conversion: {
                                orderValue: 500.0,
                                offer: {
                                    name: "Demo Product",
                                    description: "Demo product for testing",
                                },
                            },
                        },
                        {
                            id: "demo-2",
                            amount: 50.0,
                            rate: 5.0,
                            status: "APPROVED",
                            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                            affiliate: {
                                id: "affiliate-1",
                                user: {
                                    firstName: "Demo",
                                    lastName: "Affiliate",
                                    email: "demo.affiliate@trackdesk.com",
                                },
                            },
                            conversion: {
                                orderValue: 1000.0,
                                offer: {
                                    name: "Demo Product",
                                    description: "Demo product for testing",
                                },
                            },
                        },
                        {
                            id: "demo-3",
                            amount: 75.0,
                            rate: 5.0,
                            status: "PAID",
                            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            payoutDate: new Date().toISOString(),
                            affiliate: {
                                id: "affiliate-1",
                                user: {
                                    firstName: "Demo",
                                    lastName: "Affiliate",
                                    email: "demo.affiliate@trackdesk.com",
                                },
                            },
                            conversion: {
                                orderValue: 1500.0,
                                offer: {
                                    name: "Demo Product",
                                    description: "Demo product for testing",
                                },
                            },
                        },
                        {
                            id: "demo-4",
                            amount: 30.0,
                            rate: 5.0,
                            status: "PENDING",
                            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                            affiliate: {
                                id: "affiliate-1",
                                user: {
                                    firstName: "Demo",
                                    lastName: "Affiliate",
                                    email: "demo.affiliate@trackdesk.com",
                                },
                            },
                            conversion: {
                                orderValue: 600.0,
                                offer: {
                                    name: "Demo Product",
                                    description: "Demo product for testing",
                                },
                            },
                        },
                        {
                            id: "demo-5",
                            amount: 100.0,
                            rate: 5.0,
                            status: "APPROVED",
                            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                            affiliate: {
                                id: "affiliate-1",
                                user: {
                                    firstName: "Demo",
                                    lastName: "Affiliate",
                                    email: "demo.affiliate@trackdesk.com",
                                },
                            },
                            conversion: {
                                orderValue: 2000.0,
                                offer: {
                                    name: "Demo Product",
                                    description: "Demo product for testing",
                                },
                            },
                        },
                    ];
                    return [2 /*return*/, res.json({
                            data: mockCommissions,
                            pagination: {
                                page: parseInt(page),
                                limit: parseInt(limit),
                                total: mockCommissions.length,
                                pages: Math.ceil(mockCommissions.length / parseInt(limit)),
                            },
                        })];
                }
                res.json({
                    commissions: commissions,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: total,
                        pages: Math.ceil(total / limit),
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _h.sent();
                console.error("Error fetching commissions:", error_1);
                res.status(500).json({ error: "Failed to fetch commissions" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update commission status
router.patch("/:id/status", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, _a, status_2, notes, id, commission, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (req.user.role !== "ADMIN") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only admins can update commission status" })];
                }
                schema = zod_1.z.object({
                    status: zod_1.z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]),
                    notes: zod_1.z.string().optional(),
                });
                _a = schema.parse(req.body), status_2 = _a.status, notes = _a.notes;
                id = req.params.id;
                return [4 /*yield*/, prisma_1.prisma.commission.update({
                        where: { id: id },
                        data: __assign(__assign({ status: status_2 }, (status_2 === "PAID" && { payoutDate: new Date() })), (notes && { metadata: { notes: notes } })),
                        include: {
                            affiliate: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                commission = _b.sent();
                if (!(status_2 === "APPROVED")) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.update({
                        where: { id: commission.affiliateId },
                        data: {
                            totalEarnings: { increment: commission.amount },
                        },
                    })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                res.json(commission);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Error updating commission status:", error_2);
                res.status(500).json({ error: "Failed to update commission status" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Bulk update commission statuses
router.patch("/bulk-status", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, _a, commissionIds, status_3, notes, updateData, result, commissions, affiliateUpdates, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                if (req.user.role !== "ADMIN") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only admins can bulk update commission statuses" })];
                }
                schema = zod_1.z.object({
                    commissionIds: zod_1.z.array(zod_1.z.string()),
                    status: zod_1.z.enum(["PENDING", "APPROVED", "PAID", "CANCELLED"]),
                    notes: zod_1.z.string().optional(),
                });
                _a = schema.parse(req.body), commissionIds = _a.commissionIds, status_3 = _a.status, notes = _a.notes;
                updateData = __assign({ status: status_3 }, (notes && { metadata: { notes: notes } }));
                if (status_3 === "PAID") {
                    updateData.payoutDate = new Date();
                }
                return [4 /*yield*/, prisma_1.prisma.commission.updateMany({
                        where: {
                            id: { in: commissionIds },
                        },
                        data: updateData,
                    })];
            case 1:
                result = _b.sent();
                if (!(status_3 === "APPROVED")) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma_1.prisma.commission.findMany({
                        where: { id: { in: commissionIds } },
                        select: { affiliateId: true, amount: true },
                    })];
            case 2:
                commissions = _b.sent();
                affiliateUpdates = commissions.reduce(function (acc, commission) {
                    if (!acc[commission.affiliateId]) {
                        acc[commission.affiliateId] = 0;
                    }
                    acc[commission.affiliateId] += commission.amount;
                    return acc;
                }, {});
                return [4 /*yield*/, Promise.all(Object.entries(affiliateUpdates).map(function (_a) {
                        var affiliateId = _a[0], amount = _a[1];
                        return prisma_1.prisma.affiliateProfile.update({
                            where: { id: affiliateId },
                            data: { totalEarnings: { increment: amount } },
                        });
                    }))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                res.json({ updated: result.count });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                console.error("Error bulk updating commission statuses:", error_3);
                res
                    .status(500)
                    .json({ error: "Failed to bulk update commission statuses" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get commission analytics
router.get("/analytics", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, period, dateFrom, _b, totalCommissions, totalAmount, statusBreakdown, topAffiliates, dailyStats, topAffiliateIds, affiliateDetails_1, topAffiliatesWithDetails, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                if (req.user.role !== "ADMIN") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only admins can access commission analytics" })];
                }
                _a = req.query.period, period = _a === void 0 ? "30d" : _a;
                dateFrom = void 0;
                switch (period) {
                    case "7d":
                        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case "30d":
                        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case "90d":
                        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                }
                return [4 /*yield*/, Promise.all([
                        prisma_1.prisma.commission.count({
                            where: { createdAt: { gte: dateFrom } },
                        }),
                        prisma_1.prisma.commission.aggregate({
                            where: { createdAt: { gte: dateFrom } },
                            _sum: { amount: true },
                        }),
                        prisma_1.prisma.commission.groupBy({
                            by: ["status"],
                            where: { createdAt: { gte: dateFrom } },
                            _sum: { amount: true },
                            _count: { id: true },
                        }),
                        prisma_1.prisma.commission.groupBy({
                            by: ["affiliateId"],
                            where: { createdAt: { gte: dateFrom } },
                            _sum: { amount: true },
                            _count: { id: true },
                            orderBy: { _sum: { amount: "desc" } },
                            take: 10,
                        }),
                        prisma_1.prisma.commission.groupBy({
                            by: ["createdAt"],
                            where: { createdAt: { gte: dateFrom } },
                            _sum: { amount: true },
                            _count: { id: true },
                            orderBy: { createdAt: "asc" },
                        }),
                    ])];
            case 1:
                _b = _c.sent(), totalCommissions = _b[0], totalAmount = _b[1], statusBreakdown = _b[2], topAffiliates = _b[3], dailyStats = _b[4];
                // If no commissions exist, return mock analytics data
                if (totalCommissions === 0) {
                    return [2 /*return*/, res.json({
                            period: period,
                            totalCommissions: 5,
                            totalAmount: 280.0,
                            statusBreakdown: [
                                { status: "PENDING", _sum: { amount: 55.0 }, _count: { id: 2 } },
                                { status: "APPROVED", _sum: { amount: 150.0 }, _count: { id: 2 } },
                                { status: "PAID", _sum: { amount: 75.0 }, _count: { id: 1 } },
                            ],
                            topAffiliates: [
                                {
                                    affiliateId: "affiliate-1",
                                    affiliateName: "Demo Affiliate",
                                    affiliateEmail: "demo.affiliate@trackdesk.com",
                                    _sum: { amount: 280.0 },
                                    _count: { id: 5 },
                                },
                            ],
                            dailyStats: [],
                        })];
                }
                topAffiliateIds = topAffiliates.map(function (a) { return a.affiliateId; });
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.findMany({
                        where: { id: { in: topAffiliateIds } },
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    })];
            case 2:
                affiliateDetails_1 = _c.sent();
                topAffiliatesWithDetails = topAffiliates.map(function (affiliate) {
                    var details = affiliateDetails_1.find(function (d) { return d.id === affiliate.affiliateId; });
                    return __assign(__assign({}, affiliate), { affiliateName: details
                            ? "".concat(details.user.firstName, " ").concat(details.user.lastName)
                            : "Unknown", affiliateEmail: details === null || details === void 0 ? void 0 : details.user.email });
                });
                res.json({
                    period: period,
                    totalCommissions: totalCommissions,
                    totalAmount: totalAmount._sum.amount || 0,
                    statusBreakdown: statusBreakdown,
                    topAffiliates: topAffiliatesWithDetails,
                    dailyStats: dailyStats,
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _c.sent();
                console.error("Error fetching commission analytics:", error_4);
                res.status(500).json({ error: "Failed to fetch commission analytics" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update affiliate commission rates
router.patch("/affiliate/:affiliateId/rate", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, _a, commissionRate, reason, affiliateId, affiliate, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (req.user.role !== "ADMIN") {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "Only admins can update commission rates" })];
                }
                schema = zod_1.z.object({
                    commissionRate: zod_1.z.number().min(0).max(100),
                    reason: zod_1.z.string().optional(),
                });
                _a = schema.parse(req.body), commissionRate = _a.commissionRate, reason = _a.reason;
                affiliateId = req.params.affiliateId;
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.update({
                        where: { id: affiliateId },
                        data: { commissionRate: commissionRate },
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    })];
            case 1:
                affiliate = _b.sent();
                // Log the rate change
                return [4 /*yield*/, prisma_1.prisma.activity.create({
                        data: {
                            type: "COMMISSION_RATE_CHANGE",
                            description: "Commission rate changed to ".concat(commissionRate, "%").concat(reason ? " - ".concat(reason) : ""),
                            metadata: {
                                oldRate: affiliate.commissionRate,
                                newRate: commissionRate,
                                reason: reason,
                            },
                            userId: req.user.id,
                            affiliateId: affiliateId,
                        },
                    })];
            case 2:
                // Log the rate change
                _b.sent();
                res.json(affiliate);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error("Error updating commission rate:", error_5);
                res.status(500).json({ error: "Failed to update commission rate" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
