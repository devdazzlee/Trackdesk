"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../middleware/auth");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var crypto_1 = __importDefault(require("crypto"));
var router = express_1.default.Router();
var prisma = new client_1.PrismaClient();
// Get FAQ items
router.get("/faq", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var category_1, faqItems, filteredFAQs, categories;
    return __generator(this, function (_a) {
        try {
            category_1 = req.query.category;
            faqItems = [
                {
                    id: "faq-1",
                    category: "Getting Started",
                    question: "How do I become an affiliate?",
                    answer: "To become an affiliate, simply sign up for an account and complete your profile. Once approved, you'll get access to your unique referral links and marketing materials.",
                    helpful: 245,
                    notHelpful: 12,
                    createdAt: new Date("2024-01-01"),
                },
                {
                    id: "faq-2",
                    category: "Getting Started",
                    question: "How do I generate my first affiliate link?",
                    answer: "Navigate to the 'Links & Assets' section in your dashboard. Enter the URL you want to promote, and click 'Generate Link'. You'll receive a unique tracking link that you can share.",
                    helpful: 198,
                    notHelpful: 8,
                    createdAt: new Date("2024-01-01"),
                },
                {
                    id: "faq-3",
                    category: "Commissions",
                    question: "When do I get paid?",
                    answer: "Commissions are paid out monthly, typically within the first 5 business days of each month. You must have a minimum balance of $50 to request a payout.",
                    helpful: 312,
                    notHelpful: 15,
                    createdAt: new Date("2024-01-02"),
                },
                {
                    id: "faq-4",
                    category: "Commissions",
                    question: "What is the commission rate?",
                    answer: "Commission rates vary based on your tier and the products you promote. Rates typically range from 5% to 30%. Check your dashboard for your current commission rate.",
                    helpful: 267,
                    notHelpful: 19,
                    createdAt: new Date("2024-01-02"),
                },
                {
                    id: "faq-5",
                    category: "Technical",
                    question: "How do I track my performance?",
                    answer: "Your dashboard provides real-time analytics including clicks, conversions, and earnings. You can filter by date range and view detailed reports in the Statistics section.",
                    helpful: 189,
                    notHelpful: 7,
                    createdAt: new Date("2024-01-03"),
                },
                {
                    id: "faq-6",
                    category: "Technical",
                    question: "Can I use my links on social media?",
                    answer: "Yes! Our affiliate links work on all platforms including Facebook, Instagram, Twitter, TikTok, and more. Make sure to disclose your affiliate relationship as required by law.",
                    helpful: 223,
                    notHelpful: 11,
                    createdAt: new Date("2024-01-03"),
                },
                {
                    id: "faq-7",
                    category: "Account",
                    question: "How do I update my payment information?",
                    answer: "Go to Settings > Payout Settings to update your payment method, email, or bank details. Changes may take 24-48 hours to process.",
                    helpful: 156,
                    notHelpful: 6,
                    createdAt: new Date("2024-01-04"),
                },
                {
                    id: "faq-8",
                    category: "Account",
                    question: "Can I have multiple accounts?",
                    answer: "No, each person is allowed only one affiliate account. Multiple accounts may result in suspension and forfeiture of commissions.",
                    helpful: 134,
                    notHelpful: 23,
                    createdAt: new Date("2024-01-04"),
                },
            ];
            filteredFAQs = category_1
                ? faqItems.filter(function (item) { return item.category === category_1; })
                : faqItems;
            categories = __spreadArray([], new Set(faqItems.map(function (item) { return item.category; })), true);
            res.json({
                faqs: filteredFAQs,
                categories: categories,
                total: filteredFAQs.length,
            });
        }
        catch (error) {
            console.error("Error fetching FAQ:", error);
            res.status(500).json({ error: "Failed to fetch FAQ items" });
        }
        return [2 /*return*/];
    });
}); });
// Mark FAQ as helpful
router.post("/faq/:id/helpful", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, helpful;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            helpful = req.body.helpful;
            // In a real app, you would update the database
            res.json({
                success: true,
                message: helpful ? "Marked as helpful" : "Marked as not helpful",
            });
        }
        catch (error) {
            console.error("Error marking FAQ:", error);
            res.status(500).json({ error: "Failed to update FAQ feedback" });
        }
        return [2 /*return*/];
    });
}); });
// Get support tickets
router.get("/tickets", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, status_1, tickets, filteredTickets;
    return __generator(this, function (_a) {
        try {
            userId = req.user.id;
            status_1 = req.query.status;
            tickets = [
                {
                    id: "TICKET-001",
                    subject: "Payment issue",
                    category: "Payment Problems",
                    status: "Open",
                    priority: "High",
                    createdAt: new Date("2024-10-10"),
                    updatedAt: new Date("2024-10-12"),
                    lastResponse: "Support Team",
                    messages: 3,
                },
                {
                    id: "TICKET-002",
                    subject: "Link not tracking clicks",
                    category: "Technical Support",
                    status: "In Progress",
                    priority: "Medium",
                    createdAt: new Date("2024-10-05"),
                    updatedAt: new Date("2024-10-11"),
                    lastResponse: "You",
                    messages: 5,
                },
                {
                    id: "TICKET-003",
                    subject: "Commission rate question",
                    category: "Commission Questions",
                    status: "Resolved",
                    priority: "Low",
                    createdAt: new Date("2024-09-28"),
                    updatedAt: new Date("2024-09-30"),
                    lastResponse: "Support Team",
                    messages: 2,
                },
            ];
            filteredTickets = status_1
                ? tickets.filter(function (ticket) { return ticket.status === status_1; })
                : tickets;
            res.json({
                tickets: filteredTickets,
                total: filteredTickets.length,
                summary: {
                    open: tickets.filter(function (t) { return t.status === "Open"; }).length,
                    inProgress: tickets.filter(function (t) { return t.status === "In Progress"; }).length,
                    resolved: tickets.filter(function (t) { return t.status === "Resolved"; }).length,
                },
            });
        }
        catch (error) {
            console.error("Error fetching tickets:", error);
            res.status(500).json({ error: "Failed to fetch support tickets" });
        }
        return [2 /*return*/];
    });
}); });
// Create support ticket
router.post("/tickets", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, subject, category, priority, message, schema, validatedData, ticket;
    return __generator(this, function (_b) {
        try {
            userId = req.user.id;
            _a = req.body, subject = _a.subject, category = _a.category, priority = _a.priority, message = _a.message;
            schema = zod_1.z.object({
                subject: zod_1.z.string().min(5).max(200),
                category: zod_1.z.string(),
                priority: zod_1.z.enum(["Low", "Medium", "High", "Critical"]),
                message: zod_1.z.string().min(10),
            });
            validatedData = schema.parse({
                subject: subject,
                category: category,
                priority: priority,
                message: message,
            });
            ticket = {
                id: "TICKET-".concat(crypto_1.default.randomBytes(3).toString("hex").toUpperCase()),
                subject: validatedData.subject,
                category: validatedData.category,
                status: "Open",
                priority: validatedData.priority,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastResponse: "You",
                messages: 1,
                userId: userId,
            };
            res.json({
                success: true,
                ticket: ticket,
                message: "Support ticket created successfully. Our team will respond within 24-48 hours.",
            });
        }
        catch (error) {
            console.error("Error creating ticket:", error);
            if (error instanceof zod_1.z.ZodError) {
                return [2 /*return*/, res
                        .status(400)
                        .json({ error: "Invalid input data", details: error.errors })];
            }
            res.status(500).json({ error: "Failed to create support ticket" });
        }
        return [2 /*return*/];
    });
}); });
// Get ticket details
router.get("/tickets/:id", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, ticket;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            userId = req.user.id;
            ticket = {
                id: id,
                subject: "Payment issue",
                category: "Payment Problems",
                status: "Open",
                priority: "High",
                createdAt: new Date("2024-10-10"),
                updatedAt: new Date("2024-10-12"),
                messages: [
                    {
                        id: "msg-1",
                        sender: "You",
                        message: "I haven't received my payment for September. Can you please check?",
                        timestamp: new Date("2024-10-10T10:30:00"),
                        isSupport: false,
                    },
                    {
                        id: "msg-2",
                        sender: "Support Team",
                        message: "Thank you for contacting us. We're looking into your payment issue. Can you please provide your payout ID?",
                        timestamp: new Date("2024-10-11T14:20:00"),
                        isSupport: true,
                    },
                    {
                        id: "msg-3",
                        sender: "You",
                        message: "Sure, it's PAY-001 from September 30th.",
                        timestamp: new Date("2024-10-12T09:15:00"),
                        isSupport: false,
                    },
                ],
            };
            res.json(ticket);
        }
        catch (error) {
            console.error("Error fetching ticket details:", error);
            res.status(500).json({ error: "Failed to fetch ticket details" });
        }
        return [2 /*return*/];
    });
}); });
// Reply to ticket
router.post("/tickets/:id/reply", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, message, schema, validatedData, reply;
    return __generator(this, function (_a) {
        try {
            id = req.params.id;
            message = req.body.message;
            schema = zod_1.z.object({
                message: zod_1.z.string().min(1),
            });
            validatedData = schema.parse({ message: message });
            reply = {
                id: "msg-".concat(crypto_1.default.randomBytes(3).toString("hex")),
                sender: "You",
                message: validatedData.message,
                timestamp: new Date(),
                isSupport: false,
            };
            res.json({
                success: true,
                reply: reply,
                message: "Reply sent successfully",
            });
        }
        catch (error) {
            console.error("Error replying to ticket:", error);
            if (error instanceof zod_1.z.ZodError) {
                return [2 /*return*/, res
                        .status(400)
                        .json({ error: "Invalid input data", details: error.errors })];
            }
            res.status(500).json({ error: "Failed to send reply" });
        }
        return [2 /*return*/];
    });
}); });
// Get program terms
router.get("/terms", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var terms;
    return __generator(this, function (_a) {
        try {
            terms = {
                lastUpdated: new Date("2024-01-01"),
                sections: [
                    {
                        title: "Affiliate Agreement",
                        content: "By joining our affiliate program, you agree to promote our products in accordance with these terms and conditions.",
                    },
                    {
                        title: "Commission Structure",
                        content: "Commissions are calculated based on completed sales. The commission rate depends on your tier level and product category.",
                    },
                    {
                        title: "Payment Terms",
                        content: "Payments are processed monthly with a minimum payout threshold of $50. Payments are made via PayPal or bank transfer.",
                    },
                    {
                        title: "Prohibited Activities",
                        content: "Affiliates may not use spam, misleading advertising, or trademark infringement. Violation may result in account termination.",
                    },
                    {
                        title: "Cookie Duration",
                        content: "Our tracking cookies are valid for 30 days. Any purchase made within this period will be credited to your account.",
                    },
                ],
            };
            res.json(terms);
        }
        catch (error) {
            console.error("Error fetching terms:", error);
            res.status(500).json({ error: "Failed to fetch program terms" });
        }
        return [2 /*return*/];
    });
}); });
// Get knowledge base articles
router.get("/knowledge-base", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category_2, search, articles, filteredArticles, searchLower_1;
    return __generator(this, function (_b) {
        try {
            _a = req.query, category_2 = _a.category, search = _a.search;
            articles = [
                {
                    id: "kb-1",
                    title: "Getting Started with Affiliate Marketing",
                    category: "Guides",
                    excerpt: "Learn the basics of affiliate marketing and how to get started with our program.",
                    views: 1245,
                    helpful: 189,
                    lastUpdated: new Date("2024-09-15"),
                },
                {
                    id: "kb-2",
                    title: "Best Practices for Social Media Promotion",
                    category: "Marketing Tips",
                    excerpt: "Discover effective strategies for promoting affiliate links on social media platforms.",
                    views: 987,
                    helpful: 156,
                    lastUpdated: new Date("2024-09-20"),
                },
                {
                    id: "kb-3",
                    title: "Understanding Commission Tiers",
                    category: "Commissions",
                    excerpt: "Learn about our tier system and how to increase your commission rate.",
                    views: 756,
                    helpful: 134,
                    lastUpdated: new Date("2024-10-01"),
                },
            ];
            filteredArticles = articles;
            if (category_2) {
                filteredArticles = filteredArticles.filter(function (article) { return article.category === category_2; });
            }
            if (search) {
                searchLower_1 = search.toLowerCase();
                filteredArticles = filteredArticles.filter(function (article) {
                    return article.title.toLowerCase().includes(searchLower_1) ||
                        article.excerpt.toLowerCase().includes(searchLower_1);
                });
            }
            res.json({
                articles: filteredArticles,
                total: filteredArticles.length,
            });
        }
        catch (error) {
            console.error("Error fetching knowledge base:", error);
            res.status(500).json({ error: "Failed to fetch knowledge base articles" });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
