import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import winston from "winston";

// Import routes
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import affiliateRoutes from "./routes/affiliate";
import offerRoutes from "./routes/offer";
import analyticsRoutes from "./routes/analytics";
import automationRoutes from "./routes/automation";
import integrationRoutes from "./routes/integration";
import securityRoutes from "./routes/security";
import enterpriseRoutes from "./routes/enterprise";
import mobileRoutes from "./routes/mobile";
import complianceRoutes from "./routes/compliance";
import webhookRoutes from "./routes/webhook";
import offersRoutes from "./routes/offers"; // Newly added
import alertsRoutes from "./routes/alerts"; // Newly added
import payoutBuilderRoutes from "./routes/payout-builder"; // Newly added
import trafficControlRoutes from "./routes/traffic-control"; // Newly added
import webhooksRoutes from "./routes/webhooks"; // Newly added
import systemLogsRoutes from "./routes/system-logs"; // Newly added
import realTimeAnalyticsRoutes from "./routes/real-time-analytics"; // Newly added
import advancedAnalyticsRoutes from "./routes/advanced-analytics"; // Newly added
import affiliateLinksRoutes from "./routes/affiliate-links"; // Newly added
import couponsRoutes from "./routes/coupons"; // Newly added
import notificationsRoutes from "./routes/notifications"; // Newly added
import programUpdatesRoutes from "./routes/program-updates"; // Newly added
import trackingRoutes from "./routes/tracking"; // CDN tracking routes
import referralRoutes from "./routes/referral"; // Referral system routes
import commissionManagementRoutes from "./routes/commission-management"; // Commission management routes
import commissionsRoutes from "./routes/commissions"; // Affiliate commissions routes
import statisticsRoutes from "./routes/statistics"; // Statistics routes
import linksRoutes from "./routes/links"; // Links & Assets routes
import supportRoutes from "./routes/support"; // Support & Resources routes
import settingsRoutes from "./routes/settings"; // Settings routes
import adminDashboardRoutes from "./routes/admin-dashboard"; // Admin dashboard routes
import adminAffiliatesRoutes from "./routes/admin-affiliates"; // Admin affiliate management routes
import adminPayoutsRoutes from "./routes/admin-payouts"; // Admin payout management routes
import adminOffersRoutes from "./routes/admin-offers"; // Admin offers management routes

// Load environment variables
dotenv.config();

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Initialize Express app
const app: Express = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
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
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3001",
      "null", // Allow file:// origins for testing
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/affiliates", affiliateRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/enterprise", enterpriseRoutes);
app.use("/api/mobile", mobileRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/offers", offersRoutes); // Newly added
app.use("/api/alerts", alertsRoutes); // Newly added
app.use("/api/payout-builder", payoutBuilderRoutes); // Newly added
app.use("/api/traffic-control", trafficControlRoutes); // Newly added
app.use("/api/webhooks-v2", webhooksRoutes); // Newly added (different endpoint to avoid conflict)
app.use("/api/system-logs", systemLogsRoutes); // Newly added
app.use("/api/real-time-analytics", realTimeAnalyticsRoutes); // Newly added
app.use("/api/advanced-analytics", advancedAnalyticsRoutes); // Newly added
app.use("/api/affiliate-links", affiliateLinksRoutes); // Newly added
app.use("/api/coupons", couponsRoutes); // Newly added
app.use("/api/notifications", notificationsRoutes); // Newly added
app.use("/api/program-updates", programUpdatesRoutes); // Newly added
app.use("/api/tracking", trackingRoutes); // CDN tracking routes
app.use("/api/referral", referralRoutes); // Referral system routes
app.use("/api/commission-management", commissionManagementRoutes); // Commission management routes
app.use("/api/commissions", commissionsRoutes); // Affiliate commissions routes
app.use("/api/statistics", statisticsRoutes); // Statistics routes
app.use("/api/links", linksRoutes); // Links & Assets routes
app.use("/api/support", supportRoutes); // Support & Resources routes
app.use("/api/settings", settingsRoutes); // Settings routes
app.use("/api/admin/dashboard", adminDashboardRoutes); // Admin dashboard routes
app.use("/api/admin/affiliates", adminAffiliatesRoutes); // Admin affiliate management
app.use("/api/admin/payouts", adminPayoutsRoutes); // Admin payout management
app.use("/api/admin/offers", adminOffersRoutes); // Admin offers management

// WebSocket connection handling
io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on("join_affiliate", (affiliateId) => {
    socket.join(`affiliate_${affiliateId}`);
    logger.info(`Client ${socket.id} joined affiliate room: ${affiliateId}`);
  });

  socket.on("join_admin", () => {
    socket.join("admin");
    logger.info(`Client ${socket.id} joined admin room`);
  });

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  logger.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Root route
app.get("/", (req, res) => {
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
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  logger.info(`🚀 Trackdesk Backend Server running on port ${PORT}`);
  logger.info(`📡 WebSocket server running on port ${PORT}`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

export default app;
