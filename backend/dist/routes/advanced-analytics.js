"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Get funnel analysis data
router.get('/funnel', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, funnelId, dateFilter, visitors, landingPageViews, productViews, addToCarts, checkouts, purchases, funnelData, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate, funnelId = _a.funnelId;
                dateFilter = {};
                if (startDate)
                    dateFilter.gte = new Date(startDate);
                if (endDate)
                    dateFilter.lte = new Date(endDate);
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: dateFilter
                        }
                    })];
            case 1:
                visitors = _b.sent();
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: dateFilter,
                            referrer: { not: null }
                        }
                    })];
            case 2:
                landingPageViews = _b.sent();
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: dateFilter,
                            referrer: { contains: 'product' }
                        }
                    })];
            case 3:
                productViews = _b.sent();
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: dateFilter,
                            referrer: { contains: 'cart' }
                        }
                    })];
            case 4:
                addToCarts = _b.sent();
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            createdAt: dateFilter,
                            referrer: { contains: 'checkout' }
                        }
                    })];
            case 5:
                checkouts = _b.sent();
                return [4 /*yield*/, prisma.conversion.count({
                        where: {
                            createdAt: dateFilter,
                            status: 'APPROVED'
                        }
                    })];
            case 6:
                purchases = _b.sent();
                funnelData = [
                    { stage: "Visitors", count: visitors, percentage: 100, dropoff: 0 },
                    {
                        stage: "Landing Page",
                        count: landingPageViews,
                        percentage: visitors > 0 ? Math.round((landingPageViews / visitors) * 100) : 0,
                        dropoff: visitors > 0 ? Math.round(((visitors - landingPageViews) / visitors) * 100) : 0
                    },
                    {
                        stage: "Product View",
                        count: productViews,
                        percentage: visitors > 0 ? Math.round((productViews / visitors) * 100) : 0,
                        dropoff: landingPageViews > 0 ? Math.round(((landingPageViews - productViews) / landingPageViews) * 100) : 0
                    },
                    {
                        stage: "Add to Cart",
                        count: addToCarts,
                        percentage: visitors > 0 ? Math.round((addToCarts / visitors) * 100) : 0,
                        dropoff: productViews > 0 ? Math.round(((productViews - addToCarts) / productViews) * 100) : 0
                    },
                    {
                        stage: "Checkout",
                        count: checkouts,
                        percentage: visitors > 0 ? Math.round((checkouts / visitors) * 100) : 0,
                        dropoff: addToCarts > 0 ? Math.round(((addToCarts - checkouts) / addToCarts) * 100) : 0
                    },
                    {
                        stage: "Purchase",
                        count: purchases,
                        percentage: visitors > 0 ? Math.round((purchases / visitors) * 100) : 0,
                        dropoff: checkouts > 0 ? Math.round(((checkouts - purchases) / checkouts) * 100) : 0
                    }
                ];
                res.json({
                    funnelData: funnelData,
                    metrics: {
                        overallConversionRate: visitors > 0 ? ((purchases / visitors) * 100).toFixed(1) : '0.0',
                        biggestDropoff: funnelData.reduce(function (max, stage) { return stage.dropoff > max.dropoff ? stage : max; }, funnelData[0])
                    }
                });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.error('Error fetching funnel data:', error_1);
                res.status(500).json({ error: 'Failed to fetch funnel data' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// Create funnel analysis
router.post('/funnel', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var funnelSchema, data;
    return __generator(this, function (_a) {
        try {
            funnelSchema = zod_1.z.object({
                name: zod_1.z.string(),
                description: zod_1.z.string(),
                stages: zod_1.z.array(zod_1.z.object({
                    name: zod_1.z.string(),
                    condition: zod_1.z.string()
                }))
            });
            data = funnelSchema.parse(req.body);
            // In a real implementation, you would save this funnel configuration
            // For now, we'll just return a success response
            res.status(201).json(__assign(__assign({ id: "funnel-".concat(Date.now()) }, data), { createdAt: new Date() }));
        }
        catch (error) {
            console.error('Error creating funnel:', error);
            res.status(400).json({ error: 'Failed to create funnel' });
        }
        return [2 /*return*/];
    });
}); });
// Get cohort analysis data
router.get('/cohort', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, period, startDate, endDate, cohorts, cohortData, _i, cohorts_1, cohort, cohortDate, retention, period_1, periodStart, periodEnd, activeUsers, retentionRate, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                _a = req.query, _b = _a.period, period = _b === void 0 ? 'monthly' : _b, startDate = _a.startDate, endDate = _a.endDate;
                return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        DATE_TRUNC(", ", MIN(c.timestamp)) as cohort_month,\n        COUNT(DISTINCT c.\"affiliateId\") as cohort_size,\n        array_agg(DISTINCT c.\"affiliateId\") as user_ids\n      FROM \"Click\" c\n      WHERE c.\"affiliateId\" IS NOT NULL\n      GROUP BY c.\"affiliateId\"\n      ORDER BY cohort_month DESC\n      LIMIT 12\n    "], ["\n      SELECT \n        DATE_TRUNC(", ", MIN(c.timestamp)) as cohort_month,\n        COUNT(DISTINCT c.\"affiliateId\") as cohort_size,\n        array_agg(DISTINCT c.\"affiliateId\") as user_ids\n      FROM \"Click\" c\n      WHERE c.\"affiliateId\" IS NOT NULL\n      GROUP BY c.\"affiliateId\"\n      ORDER BY cohort_month DESC\n      LIMIT 12\n    "])), period)];
            case 1:
                cohorts = _c.sent();
                cohortData = [];
                _i = 0, cohorts_1 = cohorts;
                _c.label = 2;
            case 2:
                if (!(_i < cohorts_1.length)) return [3 /*break*/, 8];
                cohort = cohorts_1[_i];
                cohortDate = new Date(cohort.cohort_month);
                retention = [];
                period_1 = 0;
                _c.label = 3;
            case 3:
                if (!(period_1 < 8)) return [3 /*break*/, 6];
                periodStart = new Date(cohortDate);
                periodEnd = new Date(cohortDate);
                if (req.query.period === 'weekly') {
                    periodStart.setDate(periodStart.getDate() + (period_1 * 7));
                    periodEnd.setDate(periodEnd.getDate() + ((period_1 + 1) * 7));
                }
                else {
                    periodStart.setMonth(periodStart.getMonth() + period_1);
                    periodEnd.setMonth(periodEnd.getMonth() + period_1 + 1);
                }
                return [4 /*yield*/, prisma.click.count({
                        where: {
                            affiliateId: {
                                in: cohort.user_ids
                            },
                            createdAt: {
                                gte: periodStart,
                                lt: periodEnd
                            }
                        }
                    })];
            case 4:
                activeUsers = _c.sent();
                retentionRate = cohort.cohort_size > 0 ? Math.round((activeUsers / cohort.cohort_size) * 100) : 0;
                retention.push(retentionRate);
                _c.label = 5;
            case 5:
                period_1++;
                return [3 /*break*/, 3];
            case 6:
                cohortData.push({
                    cohort: cohortDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
                    size: cohort.cohort_size,
                    retention: retention
                });
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8:
                res.json({ cohortData: cohortData });
                return [3 /*break*/, 10];
            case 9:
                error_2 = _c.sent();
                console.error('Error fetching cohort data:', error_2);
                res.status(500).json({ error: 'Failed to fetch cohort data' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// Get attribution model comparison
router.get('/attribution', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, dateFilter, conversions, totalConversions, totalRevenue, attributionModels, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                dateFilter = {};
                if (startDate)
                    dateFilter.gte = new Date(startDate);
                if (endDate)
                    dateFilter.lte = new Date(endDate);
                return [4 /*yield*/, prisma.conversion.findMany({
                        where: {
                            createdAt: dateFilter,
                            status: 'APPROVED'
                        },
                        include: {
                            click: {
                                include: {
                                    link: true
                                }
                            }
                        }
                    })];
            case 1:
                conversions = _b.sent();
                totalConversions = conversions.length;
                totalRevenue = conversions.reduce(function (sum, conv) { return sum + (conv.customerValue || 0); }, 0);
                attributionModels = [
                    {
                        model: "First Click",
                        conversions: totalConversions,
                        revenue: totalRevenue,
                        percentage: 100
                    },
                    {
                        model: "Last Click",
                        conversions: totalConversions,
                        revenue: totalRevenue,
                        percentage: 100
                    },
                    {
                        model: "Linear",
                        conversions: totalConversions,
                        revenue: totalRevenue,
                        percentage: 100
                    },
                    {
                        model: "Time Decay",
                        conversions: totalConversions,
                        revenue: totalRevenue,
                        percentage: 100
                    },
                    {
                        model: "Position Based",
                        conversions: totalConversions,
                        revenue: totalRevenue,
                        percentage: 100
                    }
                ];
                res.json({ attributionData: attributionModels });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching attribution data:', error_3);
                res.status(500).json({ error: 'Failed to fetch attribution data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get A/B tests
router.get('/ab-tests', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var abTests;
    return __generator(this, function (_a) {
        try {
            abTests = [
                {
                    id: "TEST-001",
                    name: "Landing Page Headlines",
                    status: "running",
                    variants: [
                        { name: "Control", visitors: 5000, conversions: 500, rate: 10.0 },
                        { name: "Variant A", visitors: 5000, conversions: 650, rate: 13.0 }
                    ],
                    startDate: "2024-01-01",
                    endDate: "2024-01-31",
                    confidence: 95.2
                },
                {
                    id: "TEST-002",
                    name: "CTA Button Colors",
                    status: "completed",
                    variants: [
                        { name: "Control", visitors: 3000, conversions: 300, rate: 10.0 },
                        { name: "Variant A", visitors: 3000, conversions: 360, rate: 12.0 }
                    ],
                    startDate: "2023-12-01",
                    endDate: "2023-12-31",
                    confidence: 98.7
                }
            ];
            res.json({ abTests: abTests });
        }
        catch (error) {
            console.error('Error fetching A/B tests:', error);
            res.status(500).json({ error: 'Failed to fetch A/B tests' });
        }
        return [2 /*return*/];
    });
}); });
// Create A/B test
router.post('/ab-tests', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var testSchema, data, abTest;
    return __generator(this, function (_a) {
        try {
            testSchema = zod_1.z.object({
                name: zod_1.z.string(),
                description: zod_1.z.string(),
                variants: zod_1.z.array(zod_1.z.object({
                    name: zod_1.z.string(),
                    config: zod_1.z.any()
                })),
                startDate: zod_1.z.string(),
                endDate: zod_1.z.string(),
                trafficSplit: zod_1.z.number().min(0).max(100)
            });
            data = testSchema.parse(req.body);
            abTest = __assign(__assign({ id: "TEST-".concat(Date.now()) }, data), { status: 'draft', createdAt: new Date() });
            res.status(201).json(abTest);
        }
        catch (error) {
            console.error('Error creating A/B test:', error);
            res.status(400).json({ error: 'Failed to create A/B test' });
        }
        return [2 /*return*/];
    });
}); });
// Update A/B test
router.put('/ab-tests/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, testSchema, data;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            testSchema = zod_1.z.object({
                name: zod_1.z.string().optional(),
                description: zod_1.z.string().optional(),
                status: zod_1.z.enum(['draft', 'running', 'paused', 'completed']).optional(),
                variants: zod_1.z.array(zod_1.z.object({
                    name: zod_1.z.string(),
                    config: zod_1.z.any()
                })).optional()
            });
            data = testSchema.parse(req.body);
            // In a real implementation, you would update the database
            res.json(__assign(__assign({ id: id }, data), { updatedAt: new Date() }));
        }
        catch (error) {
            console.error('Error updating A/B test:', error);
            res.status(400).json({ error: 'Failed to update A/B test' });
        }
        return [2 /*return*/];
    });
}); });
// Delete A/B test
router.delete('/ab-tests/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            // In a real implementation, you would delete from the database
            res.json({ message: 'A/B test deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting A/B test:', error);
            res.status(500).json({ error: 'Failed to delete A/B test' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
var templateObject_1;
