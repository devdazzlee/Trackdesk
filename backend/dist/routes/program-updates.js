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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Get program updates with filtering and pagination
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, _d, category_1, _e, priority_1, _f, status_1, search, filters, mockUpdates, filteredUpdates, searchLower_1, total, startIndex, paginatedUpdates;
    return __generator(this, function (_g) {
        try {
            _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, _d = _a.category, category_1 = _d === void 0 ? 'all' : _d, _e = _a.priority, priority_1 = _e === void 0 ? 'all' : _e, _f = _a.status, status_1 = _f === void 0 ? 'published' : _f, search = _a.search;
            filters = {};
            if (category_1 && category_1 !== 'all') {
                filters.category = category_1;
            }
            if (priority_1 && priority_1 !== 'all') {
                filters.priority = priority_1;
            }
            if (status_1 && status_1 !== 'all') {
                filters.status = status_1;
            }
            if (search) {
                filters.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                    { summary: { contains: search, mode: 'insensitive' } }
                ];
            }
            mockUpdates = [
                {
                    id: "UPDATE-001",
                    title: "New Commission Structure Effective March 1st",
                    summary: "We're introducing a new tiered commission structure that rewards top performers with higher rates.",
                    content: "Starting March 1st, 2024, we're implementing a new tiered commission structure based on monthly performance:\n\n• Tier 1 (0-50 conversions): 15% commission\n• Tier 2 (51-100 conversions): 18% commission\n• Tier 3 (101+ conversions): 22% commission\n\nThis change will help reward our most dedicated affiliates while encouraging growth across all performance levels.",
                    category: "commission",
                    priority: "high",
                    status: "published",
                    publishedAt: new Date("2024-02-15T10:00:00Z"),
                    createdAt: new Date("2024-02-10T10:00:00Z"),
                    author: {
                        firstName: "Sarah",
                        lastName: "Johnson",
                        role: "Affiliate Manager"
                    },
                    tags: ["commission", "rates", "tiers"],
                    attachments: [
                        {
                            name: "Commission Structure Guide.pdf",
                            url: "/downloads/commission-guide.pdf",
                            size: "245 KB"
                        }
                    ]
                },
                {
                    id: "UPDATE-002",
                    title: "New Marketing Materials Available",
                    summary: "Fresh banners, landing pages, and email templates now available in your affiliate dashboard.",
                    content: "We've just released a new collection of high-converting marketing materials:\n\n**New Banners:**\n• 728x90 leaderboard banners\n• 300x250 medium rectangles\n• 160x600 skyscrapers\n\n**Landing Pages:**\n• Mobile-optimized product pages\n• Seasonal campaign pages\n• A/B tested high-conversion designs\n\n**Email Templates:**\n• Welcome series templates\n• Product announcement templates\n• Promotional campaign templates\n\nAll materials are available in your dashboard under 'Marketing Materials'.",
                    category: "marketing",
                    priority: "medium",
                    status: "published",
                    publishedAt: new Date("2024-02-10T14:30:00Z"),
                    createdAt: new Date("2024-02-08T09:00:00Z"),
                    author: {
                        firstName: "Mike",
                        lastName: "Chen",
                        role: "Creative Director"
                    },
                    tags: ["marketing", "banners", "templates"],
                    attachments: []
                },
                {
                    id: "UPDATE-003",
                    title: "System Maintenance - February 20th",
                    summary: "Scheduled maintenance window on February 20th from 2-4 AM EST. Minimal impact expected.",
                    content: "We'll be performing routine system maintenance on February 20th, 2024, from 2:00 AM to 4:00 AM EST.\n\n**What to expect:**\n• Brief interruptions to tracking (5-10 minutes)\n• Dashboard may be temporarily unavailable\n• Affiliate links will continue to work normally\n• All data will be preserved and processed\n\n**No action required** from affiliates. Any missed tracking during the maintenance window will be automatically backfilled within 24 hours.\n\nWe appreciate your patience as we work to improve system performance and reliability.",
                    category: "system",
                    priority: "medium",
                    status: "published",
                    publishedAt: new Date("2024-02-05T16:00:00Z"),
                    createdAt: new Date("2024-02-01T11:00:00Z"),
                    author: {
                        firstName: "David",
                        lastName: "Rodriguez",
                        role: "Technical Operations"
                    },
                    tags: ["maintenance", "system", "downtime"],
                    attachments: []
                },
                {
                    id: "UPDATE-004",
                    title: "Q1 2024 Performance Bonuses Announced",
                    summary: "Earn additional bonuses based on Q1 performance metrics. Details and qualification criteria inside.",
                    content: "We're excited to announce our Q1 2024 Performance Bonus program!\n\n**Bonus Tiers:**\n• Bronze: 100+ conversions = $500 bonus\n• Silver: 250+ conversions = $1,250 bonus\n• Gold: 500+ conversions = $3,000 bonus\n• Platinum: 1,000+ conversions = $7,500 bonus\n\n**Additional Qualifiers:**\n• Must maintain 95%+ link compliance\n• No policy violations during Q1\n• Active promotion for all 3 months\n\n**Tracking Period:** January 1 - March 31, 2024\n**Bonus Payout:** April 15, 2024\n\nStart planning your Q1 campaigns now to maximize your bonus potential!",
                    category: "promotion",
                    priority: "high",
                    status: "published",
                    publishedAt: new Date("2024-01-25T12:00:00Z"),
                    createdAt: new Date("2024-01-20T10:00:00Z"),
                    author: {
                        firstName: "Lisa",
                        lastName: "Wang",
                        role: "Affiliate Manager"
                    },
                    tags: ["bonus", "performance", "Q1"],
                    attachments: [
                        {
                            name: "Q1 Bonus Program Details.pdf",
                            url: "/downloads/q1-bonus-details.pdf",
                            size: "189 KB"
                        }
                    ]
                },
                {
                    id: "UPDATE-005",
                    title: "Policy Update: Cookie Duration Extended",
                    summary: "Great news! We've extended our cookie duration from 30 to 45 days, effective immediately.",
                    content: "We're pleased to announce an important policy update that benefits all our affiliates:\n\n**Cookie Duration Extension**\nEffective immediately, our tracking cookie duration has been extended from 30 days to 45 days.\n\n**What this means for you:**\n• Customers have 45 days (instead of 30) to complete their purchase\n• You'll be credited for conversions up to 45 days after the initial click\n• Higher conversion potential for longer consideration products\n• No changes to commission rates or payout terms\n\n**Implementation:**\n• All new clicks will automatically use the 45-day cookie\n• Existing cookies will be honored for their original 30-day term\n• Full implementation will be complete by February 1st\n\nThis change reflects our commitment to supporting affiliate success and recognizing the extended customer journey in today's market.",
                    category: "policy",
                    priority: "high",
                    status: "published",
                    publishedAt: new Date("2024-01-15T09:00:00Z"),
                    createdAt: new Date("2024-01-10T15:30:00Z"),
                    author: {
                        firstName: "Jennifer",
                        lastName: "Adams",
                        role: "Program Director"
                    },
                    tags: ["policy", "cookies", "duration"],
                    attachments: []
                }
            ];
            filteredUpdates = mockUpdates;
            if (category_1 !== 'all') {
                filteredUpdates = filteredUpdates.filter(function (update) { return update.category === category_1; });
            }
            if (priority_1 !== 'all') {
                filteredUpdates = filteredUpdates.filter(function (update) { return update.priority === priority_1; });
            }
            if (search) {
                searchLower_1 = search.toLowerCase();
                filteredUpdates = filteredUpdates.filter(function (update) {
                    return update.title.toLowerCase().includes(searchLower_1) ||
                        update.content.toLowerCase().includes(searchLower_1) ||
                        update.summary.toLowerCase().includes(searchLower_1);
                });
            }
            total = filteredUpdates.length;
            startIndex = (Number(page) - 1) * Number(limit);
            paginatedUpdates = filteredUpdates.slice(startIndex, startIndex + Number(limit));
            res.json({
                updates: paginatedUpdates,
                pagination: {
                    total: total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit))
                }
            });
        }
        catch (error) {
            console.error('Error fetching program updates:', error);
            res.status(500).json({ error: 'Failed to fetch program updates' });
        }
        return [2 /*return*/];
    });
}); });
// Get program update by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, mockUpdate;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            mockUpdate = {
                id: "UPDATE-001",
                title: "New Commission Structure Effective March 1st",
                summary: "We're introducing a new tiered commission structure that rewards top performers with higher rates.",
                content: "Starting March 1st, 2024, we're implementing a new tiered commission structure based on monthly performance:\n\n• Tier 1 (0-50 conversions): 15% commission\n• Tier 2 (51-100 conversions): 18% commission\n• Tier 3 (101+ conversions): 22% commission\n\nThis change will help reward our most dedicated affiliates while encouraging growth across all performance levels.\n\n**Implementation Timeline:**\n\n1. **February 15-28:** Transition period with notifications\n2. **March 1:** New structure goes live\n3. **March 15:** First payouts under new structure\n\n**Frequently Asked Questions:**\n\n**Q: How are tiers calculated?**\nA: Tiers are based on approved conversions in the current calendar month.\n\n**Q: When do tier changes take effect?**\nA: Tier changes are applied in real-time as you reach new thresholds.\n\n**Q: What happens to pending commissions?**\nA: Pending commissions will be paid at the rate active when the conversion was approved.\n\n**Need Help?**\nContact your affiliate manager or submit a support ticket if you have questions about the new commission structure.",
                category: "commission",
                priority: "high",
                status: "published",
                publishedAt: new Date("2024-02-15T10:00:00Z"),
                createdAt: new Date("2024-02-10T10:00:00Z"),
                updatedAt: new Date("2024-02-14T16:30:00Z"),
                author: {
                    firstName: "Sarah",
                    lastName: "Johnson",
                    role: "Affiliate Manager",
                    email: "sarah.johnson@company.com"
                },
                tags: ["commission", "rates", "tiers", "performance"],
                attachments: [
                    {
                        name: "Commission Structure Guide.pdf",
                        url: "/downloads/commission-guide.pdf",
                        size: "245 KB",
                        downloadCount: 127
                    },
                    {
                        name: "FAQ - Commission Changes.pdf",
                        url: "/downloads/commission-faq.pdf",
                        size: "98 KB",
                        downloadCount: 89
                    }
                ],
                relatedUpdates: [
                    {
                        id: "UPDATE-004",
                        title: "Q1 2024 Performance Bonuses Announced",
                        publishedAt: new Date("2024-01-25T12:00:00Z")
                    },
                    {
                        id: "UPDATE-005",
                        title: "Policy Update: Cookie Duration Extended",
                        publishedAt: new Date("2024-01-15T09:00:00Z")
                    }
                ],
                readCount: 342,
                reactions: {
                    likes: 28,
                    helpful: 45,
                    questions: 7
                }
            };
            res.json(mockUpdate);
        }
        catch (error) {
            console.error('Error fetching program update:', error);
            res.status(500).json({ error: 'Failed to fetch program update' });
        }
        return [2 /*return*/];
    });
}); });
// Create new program update (admin only)
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updateSchema, data, programUpdate;
    return __generator(this, function (_a) {
        try {
            updateSchema = zod_1.z.object({
                title: zod_1.z.string().min(5).max(200),
                summary: zod_1.z.string().min(10).max(500),
                content: zod_1.z.string().min(50),
                category: zod_1.z.enum(['commission', 'marketing', 'system', 'policy', 'promotion', 'general']),
                priority: zod_1.z.enum(['low', 'medium', 'high']),
                status: zod_1.z.enum(['draft', 'published', 'archived']).default('draft'),
                tags: zod_1.z.array(zod_1.z.string()).default([]),
                publishAt: zod_1.z.string().optional(),
                notifyAffiliates: zod_1.z.boolean().default(true)
            });
            data = updateSchema.parse(req.body);
            programUpdate = __assign(__assign({ id: "UPDATE-".concat(Date.now()) }, data), { publishedAt: data.status === 'published' ? (data.publishAt ? new Date(data.publishAt) : new Date()) : null, createdAt: new Date(), author: {
                    firstName: "Admin",
                    lastName: "User",
                    role: "System"
                }, attachments: [], readCount: 0, reactions: {
                    likes: 0,
                    helpful: 0,
                    questions: 0
                } });
            // If notifying affiliates and status is published, create notifications
            if (data.notifyAffiliates && data.status === 'published') {
                // In a real implementation, you would create notifications for all affiliates
                console.log('Would create notifications for all affiliates about new program update');
            }
            res.status(201).json(programUpdate);
        }
        catch (error) {
            console.error('Error creating program update:', error);
            res.status(400).json({ error: 'Failed to create program update' });
        }
        return [2 /*return*/];
    });
}); });
// Update program update (admin only)
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateSchema, data, updatedUpdate;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            updateSchema = zod_1.z.object({
                title: zod_1.z.string().min(5).max(200).optional(),
                summary: zod_1.z.string().min(10).max(500).optional(),
                content: zod_1.z.string().min(50).optional(),
                category: zod_1.z.enum(['commission', 'marketing', 'system', 'policy', 'promotion', 'general']).optional(),
                priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
                status: zod_1.z.enum(['draft', 'published', 'archived']).optional(),
                tags: zod_1.z.array(zod_1.z.string()).optional(),
                publishAt: zod_1.z.string().optional()
            });
            data = updateSchema.parse(req.body);
            updatedUpdate = __assign(__assign({ id: id }, data), { updatedAt: new Date() });
            res.json(updatedUpdate);
        }
        catch (error) {
            console.error('Error updating program update:', error);
            res.status(400).json({ error: 'Failed to update program update' });
        }
        return [2 /*return*/];
    });
}); });
// Delete program update (admin only)
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            // In a real implementation, you would delete from the database
            res.json({ message: 'Program update deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting program update:', error);
            res.status(500).json({ error: 'Failed to delete program update' });
        }
        return [2 /*return*/];
    });
}); });
// Get program update categories and statistics
router.get('/meta/categories', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, statistics;
    return __generator(this, function (_a) {
        try {
            categories = [
                {
                    id: 'commission',
                    name: 'Commission & Payouts',
                    description: 'Updates about commission rates, payout schedules, and earning opportunities',
                    count: 8,
                    icon: 'DollarSign'
                },
                {
                    id: 'marketing',
                    name: 'Marketing Materials',
                    description: 'New banners, landing pages, and promotional materials',
                    count: 12,
                    icon: 'Megaphone'
                },
                {
                    id: 'system',
                    name: 'System & Technical',
                    description: 'Platform updates, maintenance schedules, and technical improvements',
                    count: 5,
                    icon: 'Settings'
                },
                {
                    id: 'policy',
                    name: 'Policies & Terms',
                    description: 'Changes to program terms, policies, and compliance requirements',
                    count: 3,
                    icon: 'FileText'
                },
                {
                    id: 'promotion',
                    name: 'Promotions & Bonuses',
                    description: 'Special promotions, bonus opportunities, and contests',
                    count: 6,
                    icon: 'Gift'
                },
                {
                    id: 'general',
                    name: 'General Announcements',
                    description: 'Company news, program updates, and general information',
                    count: 4,
                    icon: 'Bell'
                }
            ];
            statistics = {
                totalUpdates: 38,
                publishedThisMonth: 7,
                averageReadTime: '3.2 minutes',
                mostPopularCategory: 'marketing',
                lastUpdate: new Date("2024-02-15T10:00:00Z")
            };
            res.json({ categories: categories, statistics: statistics });
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
        return [2 /*return*/];
    });
}); });
// Mark update as read for a user
router.post('/:id/read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            userId = req.body.userId;
            // In a real implementation, you would track read status per user
            // For now, just return success
            res.json({
                message: 'Update marked as read',
                updateId: id,
                userId: userId,
                readAt: new Date()
            });
        }
        catch (error) {
            console.error('Error marking update as read:', error);
            res.status(500).json({ error: 'Failed to mark update as read' });
        }
        return [2 /*return*/];
    });
}); });
// Add reaction to update
router.post('/:id/react', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, reactionSchema, _a, userId, type;
    return __generator(this, function (_b) {
        try {
            id = req.params.id;
            reactionSchema = zod_1.z.object({
                userId: zod_1.z.string(),
                type: zod_1.z.enum(['like', 'helpful', 'question'])
            });
            _a = reactionSchema.parse(req.body), userId = _a.userId, type = _a.type;
            // In a real implementation, you would save the reaction to the database
            res.json({
                message: 'Reaction added successfully',
                updateId: id,
                userId: userId,
                reactionType: type,
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('Error adding reaction:', error);
            res.status(400).json({ error: 'Failed to add reaction' });
        }
        return [2 /*return*/];
    });
}); });
// Get update attachments
router.get('/:id/attachments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, attachments;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            attachments = [
                {
                    id: 'ATT-001',
                    name: 'Commission Structure Guide.pdf',
                    url: '/downloads/commission-guide.pdf',
                    size: '245 KB',
                    type: 'application/pdf',
                    downloadCount: 127,
                    uploadedAt: new Date("2024-02-10T10:00:00Z")
                },
                {
                    id: 'ATT-002',
                    name: 'FAQ - Commission Changes.pdf',
                    url: '/downloads/commission-faq.pdf',
                    size: '98 KB',
                    type: 'application/pdf',
                    downloadCount: 89,
                    uploadedAt: new Date("2024-02-12T14:30:00Z")
                }
            ];
            res.json({ attachments: attachments });
        }
        catch (error) {
            console.error('Error fetching attachments:', error);
            res.status(500).json({ error: 'Failed to fetch attachments' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
