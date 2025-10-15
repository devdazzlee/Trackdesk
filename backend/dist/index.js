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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var dotenv_1 = __importDefault(require("dotenv"));
var winston_1 = __importDefault(require("winston"));
// Import routes
var auth_1 = __importDefault(require("./routes/auth"));
var dashboard_1 = __importDefault(require("./routes/dashboard"));
var affiliate_1 = __importDefault(require("./routes/affiliate"));
var offer_1 = __importDefault(require("./routes/offer"));
var analytics_1 = __importDefault(require("./routes/analytics"));
var automation_1 = __importDefault(require("./routes/automation"));
var integration_1 = __importDefault(require("./routes/integration"));
var security_1 = __importDefault(require("./routes/security"));
var enterprise_1 = __importDefault(require("./routes/enterprise"));
var mobile_1 = __importDefault(require("./routes/mobile"));
var compliance_1 = __importDefault(require("./routes/compliance"));
var webhook_1 = __importDefault(require("./routes/webhook"));
var offers_1 = __importDefault(require("./routes/offers")); // Newly added
var alerts_1 = __importDefault(require("./routes/alerts")); // Newly added
var payout_builder_1 = __importDefault(require("./routes/payout-builder")); // Newly added
var traffic_control_1 = __importDefault(require("./routes/traffic-control")); // Newly added
var webhooks_1 = __importDefault(require("./routes/webhooks")); // Newly added
var system_logs_1 = __importDefault(require("./routes/system-logs")); // Newly added
var real_time_analytics_1 = __importDefault(require("./routes/real-time-analytics")); // Newly added
var advanced_analytics_1 = __importDefault(require("./routes/advanced-analytics")); // Newly added
var affiliate_links_1 = __importDefault(require("./routes/affiliate-links")); // Newly added
var coupons_1 = __importDefault(require("./routes/coupons")); // Newly added
var notifications_1 = __importDefault(require("./routes/notifications")); // Newly added
var program_updates_1 = __importDefault(require("./routes/program-updates")); // Newly added
var tracking_1 = __importDefault(require("./routes/tracking")); // CDN tracking routes
var referral_1 = __importDefault(require("./routes/referral")); // Referral system routes
var commission_management_1 = __importDefault(require("./routes/commission-management")); // Commission management routes
var commissions_1 = __importDefault(require("./routes/commissions")); // Affiliate commissions routes
var statistics_1 = __importDefault(require("./routes/statistics")); // Statistics routes
var links_1 = __importDefault(require("./routes/links")); // Links & Assets routes
var support_1 = __importDefault(require("./routes/support")); // Support & Resources routes
var settings_1 = __importDefault(require("./routes/settings")); // Settings routes
var admin_dashboard_1 = __importDefault(require("./routes/admin-dashboard")); // Admin dashboard routes
var admin_affiliates_1 = __importDefault(require("./routes/admin-affiliates")); // Admin affiliate management routes
var admin_payouts_1 = __importDefault(require("./routes/admin-payouts")); // Admin payout management routes
var admin_offers_1 = __importDefault(require("./routes/admin-offers")); // Admin offers management routes
// Load environment variables
dotenv_1.default.config();
// Initialize logger
var logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "logs/combined.log" }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }),
    ],
});
// Initialize Express app
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
// Initialize Socket.IO
var io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || "http://localhost:3001",
            "http://localhost:3000",
            "http://localhost:3001",
            "null", // Allow file:// origins for testing
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
    },
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:3001",
        "null", // Allow file:// origins for testing
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
var limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use("/api/affiliates", affiliate_1.default);
app.use("/api/offers", offer_1.default);
app.use("/api/analytics", analytics_1.default);
app.use("/api/automation", automation_1.default);
app.use("/api/integrations", integration_1.default);
app.use("/api/security", security_1.default);
app.use("/api/enterprise", enterprise_1.default);
app.use("/api/mobile", mobile_1.default);
app.use("/api/compliance", compliance_1.default);
app.use("/api/webhooks", webhook_1.default);
app.use("/api/offers", offers_1.default); // Newly added
app.use("/api/alerts", alerts_1.default); // Newly added
app.use("/api/payout-builder", payout_builder_1.default); // Newly added
app.use("/api/traffic-control", traffic_control_1.default); // Newly added
app.use("/api/webhooks-v2", webhooks_1.default); // Newly added (different endpoint to avoid conflict)
app.use("/api/system-logs", system_logs_1.default); // Newly added
app.use("/api/real-time-analytics", real_time_analytics_1.default); // Newly added
app.use("/api/advanced-analytics", advanced_analytics_1.default); // Newly added
app.use("/api/affiliate-links", affiliate_links_1.default); // Newly added
app.use("/api/coupons", coupons_1.default); // Newly added
app.use("/api/notifications", notifications_1.default); // Newly added
app.use("/api/program-updates", program_updates_1.default); // Newly added
app.use("/api/tracking", tracking_1.default); // CDN tracking routes
app.use("/api/referral", referral_1.default); // Referral system routes
app.use("/api/commission-management", commission_management_1.default); // Commission management routes
app.use("/api/commissions", commissions_1.default); // Affiliate commissions routes
app.use("/api/statistics", statistics_1.default); // Statistics routes
app.use("/api/links", links_1.default); // Links & Assets routes
app.use("/api/support", support_1.default); // Support & Resources routes
app.use("/api/settings", settings_1.default); // Settings routes
app.use("/api/admin/dashboard", admin_dashboard_1.default); // Admin dashboard routes
app.use("/api/admin/affiliates", admin_affiliates_1.default); // Admin affiliate management
app.use("/api/admin/payouts", admin_payouts_1.default); // Admin payout management
app.use("/api/admin/offers", admin_offers_1.default); // Admin offers management
// WebSocket connection handling
io.on("connection", function (socket) {
    logger.info("Client connected: ".concat(socket.id));
    socket.on("join_affiliate", function (affiliateId) {
        socket.join("affiliate_".concat(affiliateId));
        logger.info("Client ".concat(socket.id, " joined affiliate room: ").concat(affiliateId));
    });
    socket.on("join_admin", function () {
        socket.join("admin");
        logger.info("Client ".concat(socket.id, " joined admin room"));
    });
    socket.on("disconnect", function () {
        logger.info("Client disconnected: ".concat(socket.id));
    });
});
// Error handling middleware
app.use(function (error, req, res, next) {
    logger.error("Unhandled error:", error);
    res.status(500).json({ error: "Internal server error" });
});
// Root route
app.get("/", function (req, res) {
    res.json({
        message: "Trackdesk Affiliate Management Platform API",
        version: "1.0.0",
        status: "running",
        endpoints: {
            auth: "/api/auth",
            dashboard: "/api/dashboard",
            affiliates: "/api/affiliates",
            offers: "/api/offers",
            analytics: "/api/analytics",
            automation: "/api/automation",
            integrations: "/api/integrations",
            security: "/api/security",
            enterprise: "/api/enterprise",
            mobile: "/api/mobile",
            compliance: "/api/compliance",
            webhooks: "/api/webhooks",
            alerts: "/api/alerts",
            payoutBuilder: "/api/payout-builder",
            trafficControl: "/api/traffic-control",
            webhooksV2: "/api/webhooks-v2",
            systemLogs: "/api/system-logs",
            realTimeAnalytics: "/api/real-time-analytics",
            advancedAnalytics: "/api/advanced-analytics",
            affiliateLinks: "/api/affiliate-links",
            coupons: "/api/coupons",
            notifications: "/api/notifications",
            programUpdates: "/api/program-updates",
        },
        documentation: "https://docs.trackdesk.com",
        support: "support@trackdesk.com",
    });
});
// Health check endpoint
app.get("/health", function (req, res) {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});
// 404 handler
app.use("*", function (req, res) {
    res.status(404).json({ error: "Route not found" });
});
// Start server
var PORT = process.env.PORT || 3002;
server.listen(PORT, function () {
    logger.info("\uD83D\uDE80 Trackdesk Backend Server running on port ".concat(PORT));
    logger.info("\uD83D\uDCE1 WebSocket server running on port ".concat(PORT));
    logger.info("\uD83C\uDF10 Environment: ".concat(process.env.NODE_ENV || "development"));
});
// Graceful shutdown
process.on("SIGTERM", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        logger.info("SIGTERM received, shutting down gracefully");
        server.close(function () {
            logger.info("Server closed");
            process.exit(0);
        });
        return [2 /*return*/];
    });
}); });
exports.default = app;
