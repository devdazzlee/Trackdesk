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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var crypto = __importStar(require("crypto"));
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Get generated affiliate links for an affiliate
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, affiliateId, _b, page, _c, limit, search, filters, links, total, linksWithMetrics, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.query, affiliateId = _a.affiliateId, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, search = _a.search;
                filters = {};
                if (affiliateId) {
                    filters.affiliateId = affiliateId;
                }
                if (search) {
                    filters.OR = [
                        { originalUrl: { contains: search, mode: 'insensitive' } },
                        { customAlias: { contains: search, mode: 'insensitive' } },
                        { offer: { title: { contains: search, mode: 'insensitive' } } }
                    ];
                }
                return [4 /*yield*/, prisma.affiliateLink.findMany({
                        where: filters,
                        include: {
                            offer: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    status: true
                                }
                            },
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true
                                }
                            },
                            clickRecords: {
                                select: {
                                    id: true,
                                    createdAt: true,
                                    ipAddress: true,
                                    country: true,
                                    device: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 5
                            },
                            _count: {
                                select: {
                                    clickRecords: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        skip: (Number(page) - 1) * Number(limit),
                        take: Number(limit)
                    })];
            case 1:
                links = _d.sent();
                return [4 /*yield*/, prisma.affiliateLink.count({ where: filters })];
            case 2:
                total = _d.sent();
                return [4 /*yield*/, Promise.all(links.map(function (link) { return __awaiter(void 0, void 0, void 0, function () {
                        var conversions, revenue, conversionRate;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.conversion.count({
                                        where: { affiliateId: link.affiliateId }
                                    })];
                                case 1:
                                    conversions = _a.sent();
                                    return [4 /*yield*/, prisma.conversion.aggregate({
                                            where: { affiliateId: link.affiliateId },
                                            _sum: { customerValue: true }
                                        })];
                                case 2:
                                    revenue = _a.sent();
                                    conversionRate = link._count.clickRecords > 0
                                        ? ((conversions / link._count.clickRecords) * 100).toFixed(2)
                                        : '0.00';
                                    return [2 /*return*/, __assign(__assign({}, link), { metrics: {
                                                clicks: link._count.clickRecords,
                                                conversions: conversions,
                                                conversionRate: "".concat(conversionRate, "%"),
                                                revenue: revenue._sum.customerValue || 0
                                            } })];
                            }
                        });
                    }); }))];
            case 3:
                linksWithMetrics = _d.sent();
                res.json({
                    links: linksWithMetrics,
                    pagination: {
                        total: total,
                        page: Number(page),
                        limit: Number(limit),
                        pages: Math.ceil(total / Number(limit))
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _d.sent();
                console.error('Error fetching affiliate links:', error_1);
                res.status(500).json({ error: 'Failed to fetch affiliate links' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Generate new affiliate link
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var linkSchema, data, trackingCode, existingLink, affiliateLink, baseUrl, affiliateUrl, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                linkSchema = zod_1.z.object({
                    affiliateId: zod_1.z.string(),
                    offerId: zod_1.z.string(),
                    originalUrl: zod_1.z.string().url(),
                    customAlias: zod_1.z.string().optional(),
                    landingPageUrl: zod_1.z.string().url().optional(),
                    expiresAt: zod_1.z.string().optional()
                });
                data = linkSchema.parse(req.body);
                trackingCode = crypto.randomBytes(8).toString('hex');
                if (!data.customAlias) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.affiliateLink.findFirst({
                        where: { customSlug: data.customAlias }
                    })];
            case 1:
                existingLink = _a.sent();
                if (existingLink) {
                    return [2 /*return*/, res.status(400).json({ error: 'Custom alias already exists' })];
                }
                _a.label = 2;
            case 2: return [4 /*yield*/, prisma.affiliateLink.create({
                    data: {
                        affiliateId: data.affiliateId,
                        offerId: data.offerId,
                        originalUrl: data.originalUrl,
                        shortUrl: "track/".concat(trackingCode),
                        customSlug: data.customAlias,
                        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                        isActive: true
                    },
                    include: {
                        offer: {
                            select: {
                                name: true,
                                description: true
                            }
                        },
                        affiliate: {
                            select: {
                                id: true,
                                companyName: true
                            }
                        }
                    }
                })];
            case 3:
                affiliateLink = _a.sent();
                baseUrl = process.env.FRONTEND_URL || 'https://trackdesk.com';
                affiliateUrl = data.customAlias
                    ? "".concat(baseUrl, "/go/").concat(data.customAlias)
                    : "".concat(baseUrl, "/track/").concat(trackingCode);
                res.status(201).json(__assign(__assign({}, affiliateLink), { affiliateUrl: affiliateUrl }));
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error('Error generating affiliate link:', error_2);
                res.status(400).json({ error: 'Failed to generate affiliate link' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Get affiliate link by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, link, totalClicks, totalConversions, totalRevenue, totalCommissions, conversionRate, countryStats, deviceStats, baseUrl, affiliateUrl, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.affiliateLink.findUnique({
                        where: { id: id },
                        include: {
                            offer: {
                                select: {
                                    name: true,
                                    description: true,
                                    status: true
                                }
                            },
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true
                                }
                            },
                            clickRecords: {
                                select: {
                                    id: true,
                                    createdAt: true,
                                    ipAddress: true,
                                    country: true,
                                    city: true,
                                    device: true,
                                    browser: true,
                                    referrer: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 50
                            },
                        }
                    })];
            case 1:
                link = _a.sent();
                if (!link) {
                    return [2 /*return*/, res.status(404).json({ error: 'Affiliate link not found' })];
                }
                totalClicks = link.clicks;
                totalConversions = link.conversions;
                totalRevenue = link.earnings;
                totalCommissions = link.earnings;
                conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00';
                countryStats = {};
                deviceStats = {};
                baseUrl = process.env.FRONTEND_URL || 'https://trackdesk.com';
                affiliateUrl = link.customSlug
                    ? "".concat(baseUrl, "/go/").concat(link.customSlug)
                    : "".concat(baseUrl, "/track/").concat(link.id);
                res.json(__assign(__assign({}, link), { affiliateUrl: affiliateUrl, metrics: {
                        totalClicks: totalClicks,
                        totalConversions: totalConversions,
                        totalRevenue: totalRevenue,
                        totalCommissions: totalCommissions,
                        conversionRate: "".concat(conversionRate, "%"),
                        countryStats: countryStats,
                        deviceStats: deviceStats
                    } }));
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching affiliate link:', error_3);
                res.status(500).json({ error: 'Failed to fetch affiliate link' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update affiliate link
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateSchema, data, existingLink, updatedLink, baseUrl, affiliateUrl, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                updateSchema = zod_1.z.object({
                    customAlias: zod_1.z.string().optional(),
                    landingPageUrl: zod_1.z.string().url().optional(),
                    isActive: zod_1.z.boolean().optional(),
                    expiresAt: zod_1.z.string().optional()
                });
                data = updateSchema.parse(req.body);
                if (!data.customAlias) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.affiliateLink.findFirst({
                        where: {
                            customSlug: data.customAlias,
                            NOT: { id: id }
                        }
                    })];
            case 1:
                existingLink = _a.sent();
                if (existingLink) {
                    return [2 /*return*/, res.status(400).json({ error: 'Custom alias already exists' })];
                }
                _a.label = 2;
            case 2: return [4 /*yield*/, prisma.affiliateLink.update({
                    where: { id: id },
                    data: {
                        customSlug: data.customAlias,
                        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
                        isActive: data.isActive
                    },
                    include: {
                        offer: {
                            select: {
                                name: true,
                                description: true
                            }
                        },
                        affiliate: {
                            select: {
                                id: true,
                                companyName: true
                            }
                        }
                    }
                })];
            case 3:
                updatedLink = _a.sent();
                baseUrl = process.env.FRONTEND_URL || 'https://trackdesk.com';
                affiliateUrl = updatedLink.customSlug
                    ? "".concat(baseUrl, "/go/").concat(updatedLink.customSlug)
                    : "".concat(baseUrl, "/track/").concat(updatedLink.id);
                res.json(__assign(__assign({}, updatedLink), { affiliateUrl: affiliateUrl }));
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error('Error updating affiliate link:', error_4);
                res.status(400).json({ error: 'Failed to update affiliate link' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Delete affiliate link
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.affiliateLink.delete({
                        where: { id: id }
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'Affiliate link deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting affiliate link:', error_5);
                res.status(500).json({ error: 'Failed to delete affiliate link' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get link performance analytics
router.get('/:id/analytics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, period, startDate, dailyClicks, dailyConversions, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.query.period, period = _a === void 0 ? '30d' : _a;
                startDate = new Date();
                switch (period) {
                    case '7d':
                        startDate.setDate(startDate.getDate() - 7);
                        break;
                    case '30d':
                        startDate.setDate(startDate.getDate() - 30);
                        break;
                    case '90d':
                        startDate.setDate(startDate.getDate() - 90);
                        break;
                    default:
                        startDate.setDate(startDate.getDate() - 30);
                }
                return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        DATE(timestamp) as date,\n        COUNT(*) as clicks\n      FROM \"Click\"\n      WHERE \"affiliateLinkId\" = ", "\n        AND timestamp >= ", "\n      GROUP BY DATE(timestamp)\n      ORDER BY date\n    "], ["\n      SELECT \n        DATE(timestamp) as date,\n        COUNT(*) as clicks\n      FROM \"Click\"\n      WHERE \"affiliateLinkId\" = ", "\n        AND timestamp >= ", "\n      GROUP BY DATE(timestamp)\n      ORDER BY date\n    "])), id, startDate)];
            case 1:
                dailyClicks = _b.sent();
                return [4 /*yield*/, prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT \n        DATE(timestamp) as date,\n        COUNT(*) as conversions,\n        SUM(amount) as revenue\n      FROM \"Conversion\"\n      WHERE \"affiliateLinkId\" = ", "\n        AND timestamp >= ", "\n      GROUP BY DATE(timestamp)\n      ORDER BY date\n    "], ["\n      SELECT \n        DATE(timestamp) as date,\n        COUNT(*) as conversions,\n        SUM(amount) as revenue\n      FROM \"Conversion\"\n      WHERE \"affiliateLinkId\" = ", "\n        AND timestamp >= ", "\n      GROUP BY DATE(timestamp)\n      ORDER BY date\n    "])), id, startDate)];
            case 2:
                dailyConversions = _b.sent();
                res.json({
                    dailyClicks: dailyClicks,
                    dailyConversions: dailyConversions
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error('Error fetching link analytics:', error_6);
                res.status(500).json({ error: 'Failed to fetch link analytics' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
var templateObject_1, templateObject_2;
