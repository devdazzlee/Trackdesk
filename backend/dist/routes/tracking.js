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
var zod_1 = require("zod");
var prisma_1 = require("../lib/prisma");
var router = express_1.default.Router();
// Track referral click
router.post("/click", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, data, referralCode, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                schema = zod_1.z.object({
                    referralCode: zod_1.z.string(),
                    storeId: zod_1.z.string(),
                    url: zod_1.z.string(),
                    referrer: zod_1.z.string().optional(),
                    userAgent: zod_1.z.string().optional(),
                    timestamp: zod_1.z.string(),
                    utm: zod_1.z
                        .object({
                        utm_source: zod_1.z.string().nullable().optional(),
                        utm_medium: zod_1.z.string().nullable().optional(),
                        utm_campaign: zod_1.z.string().nullable().optional(),
                        utm_term: zod_1.z.string().nullable().optional(),
                        utm_content: zod_1.z.string().nullable().optional(),
                    })
                        .optional(),
                });
                data = schema.parse(req.body);
                return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                        where: {
                            code: data.referralCode,
                            isActive: true,
                        },
                    })];
            case 1:
                referralCode = _d.sent();
                if (!referralCode) {
                    return [2 /*return*/, res.status(404).json({ error: "Referral code not found" })];
                }
                // Track the click
                return [4 /*yield*/, prisma_1.prisma.affiliateClick.create({
                        data: {
                            affiliateId: referralCode.affiliateId,
                            referralCode: data.referralCode,
                            storeId: data.storeId,
                            url: data.url,
                            referrer: data.referrer,
                            userAgent: data.userAgent,
                            utmSource: (_a = data.utm) === null || _a === void 0 ? void 0 : _a.utm_source,
                            utmMedium: (_b = data.utm) === null || _b === void 0 ? void 0 : _b.utm_medium,
                            utmCampaign: (_c = data.utm) === null || _c === void 0 ? void 0 : _c.utm_campaign,
                        },
                    })];
            case 2:
                // Track the click
                _d.sent();
                // Update click count on affiliate profile
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.update({
                        where: { id: referralCode.affiliateId },
                        data: { totalClicks: { increment: 1 } },
                    })];
            case 3:
                // Update click count on affiliate profile
                _d.sent();
                res.json({ success: true, message: "Click tracked" });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _d.sent();
                console.error("Error tracking click:", error_1);
                res.status(500).json({ error: "Failed to track click" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Track page view
router.post("/pageview", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, data, referralCode, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                schema = zod_1.z.object({
                    referralCode: zod_1.z.string(),
                    storeId: zod_1.z.string(),
                    url: zod_1.z.string(),
                    timestamp: zod_1.z.string(),
                });
                data = schema.parse(req.body);
                return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                        where: {
                            code: data.referralCode,
                            isActive: true,
                        },
                    })];
            case 1:
                referralCode = _a.sent();
                if (!referralCode) {
                    return [2 /*return*/, res.status(404).json({ error: "Referral code not found" })];
                }
                // Track the page view (optional - can be used for analytics)
                // You can store this in a separate table if needed
                res.json({ success: true, message: "Page view tracked" });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error tracking page view:", error_2);
                res.status(500).json({ error: "Failed to track page view" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Track order/purchase
router.post("/order", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, data, referralCode, existingOrder, commissionRate, commissionAmount, order, error_3;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                schema = zod_1.z.object({
                    referralCode: zod_1.z.string(),
                    storeId: zod_1.z.string(),
                    orderId: zod_1.z.string(),
                    orderValue: zod_1.z.number(),
                    currency: zod_1.z.string().default("USD"),
                    customerEmail: zod_1.z.string().optional(),
                    items: zod_1.z
                        .array(zod_1.z.object({
                        id: zod_1.z.string(),
                        name: zod_1.z.string(),
                        price: zod_1.z.number(),
                        quantity: zod_1.z.number(),
                    }))
                        .optional(),
                    timestamp: zod_1.z.string(),
                    utm: zod_1.z
                        .object({
                        utm_source: zod_1.z.string().nullable().optional(),
                        utm_medium: zod_1.z.string().nullable().optional(),
                        utm_campaign: zod_1.z.string().nullable().optional(),
                        utm_term: zod_1.z.string().nullable().optional(),
                        utm_content: zod_1.z.string().nullable().optional(),
                    })
                        .optional(),
                });
                data = schema.parse(req.body);
                return [4 /*yield*/, prisma_1.prisma.referralCode.findFirst({
                        where: {
                            code: data.referralCode,
                            isActive: true,
                        },
                        include: {
                            affiliate: true,
                        },
                    })];
            case 1:
                referralCode = _d.sent();
                if (!referralCode) {
                    return [2 /*return*/, res.status(404).json({ error: "Referral code not found" })];
                }
                return [4 /*yield*/, prisma_1.prisma.affiliateOrder.findFirst({
                        where: {
                            orderId: data.orderId,
                            storeId: data.storeId,
                        },
                    })];
            case 2:
                existingOrder = _d.sent();
                if (existingOrder) {
                    return [2 /*return*/, res.json({
                            success: true,
                            message: "Order already tracked",
                            duplicate: true,
                        })];
                }
                commissionRate = referralCode.commissionRate;
                commissionAmount = (data.orderValue * commissionRate) / 100;
                return [4 /*yield*/, prisma_1.prisma.affiliateOrder.create({
                        data: {
                            affiliateId: referralCode.affiliateId,
                            referralCode: data.referralCode,
                            storeId: data.storeId,
                            orderId: data.orderId,
                            orderValue: data.orderValue,
                            currency: data.currency,
                            customerEmail: data.customerEmail,
                            commissionAmount: commissionAmount,
                            commissionRate: commissionRate,
                            status: "PENDING",
                            items: data.items || [],
                            utmSource: (_a = data.utm) === null || _a === void 0 ? void 0 : _a.utm_source,
                            utmMedium: (_b = data.utm) === null || _b === void 0 ? void 0 : _b.utm_medium,
                            utmCampaign: (_c = data.utm) === null || _c === void 0 ? void 0 : _c.utm_campaign,
                        },
                    })];
            case 3:
                order = _d.sent();
                // Update referral code usage
                return [4 /*yield*/, prisma_1.prisma.referralCode.update({
                        where: { id: referralCode.id },
                        data: { currentUses: { increment: 1 } },
                    })];
            case 4:
                // Update referral code usage
                _d.sent();
                // Update affiliate stats
                return [4 /*yield*/, prisma_1.prisma.affiliateProfile.update({
                        where: { id: referralCode.affiliateId },
                        data: {
                            totalConversions: { increment: 1 },
                            totalEarnings: { increment: commissionAmount },
                        },
                    })];
            case 5:
                // Update affiliate stats
                _d.sent();
                res.json({
                    success: true,
                    message: "Order tracked successfully",
                    orderId: order.id,
                    commissionAmount: commissionAmount,
                });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _d.sent();
                console.error("Error tracking order:", error_3);
                res.status(500).json({ error: "Failed to track order" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Webhook endpoint for e-commerce platforms
router.post("/webhook/:storeId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storeId, schema, data, referralCode, trackingData;
    return __generator(this, function (_a) {
        try {
            storeId = req.params.storeId;
            schema = zod_1.z.object({
                orderId: zod_1.z.string(),
                orderValue: zod_1.z.number(),
                currency: zod_1.z.string().default("USD"),
                customerEmail: zod_1.z.string().optional(),
                referralCode: zod_1.z.string().optional(), // If your platform can pass this
                items: zod_1.z.array(zod_1.z.any()).optional(),
            });
            data = schema.parse(req.body);
            referralCode = data.referralCode;
            if (!referralCode) {
                // Try to find the most recent click from this customer
                // This is a fallback mechanism
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Order received but no referral code found",
                    })];
            }
            trackingData = {
                referralCode: referralCode,
                storeId: storeId,
                orderId: data.orderId,
                orderValue: data.orderValue,
                currency: data.currency,
                customerEmail: data.customerEmail,
                items: data.items,
                timestamp: new Date().toISOString(),
            };
            // Reuse the order tracking logic
            req.body = trackingData;
            return [2 /*return*/, router.handle(req, res)];
        }
        catch (error) {
            console.error("Error processing webhook:", error);
            res.status(500).json({ error: "Failed to process webhook" });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
