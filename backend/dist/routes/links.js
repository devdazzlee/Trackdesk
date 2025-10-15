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
var auth_1 = require("../middleware/auth");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var crypto_1 = __importDefault(require("crypto"));
var router = express_1.default.Router();
var prisma = new client_1.PrismaClient();
// Generate affiliate link
router.post("/generate", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, url, campaignName, customAlias, schema, validatedData, affiliate, trackingCode, affiliateUrl, shortUrl, linkData, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.user.id;
                _a = req.body, url = _a.url, campaignName = _a.campaignName, customAlias = _a.customAlias;
                schema = zod_1.z.object({
                    url: zod_1.z.string().url(),
                    campaignName: zod_1.z.string().optional(),
                    customAlias: zod_1.z.string().optional(),
                });
                validatedData = schema.parse({ url: url, campaignName: campaignName, customAlias: customAlias });
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                trackingCode = customAlias || crypto_1.default.randomBytes(6).toString("hex");
                affiliateUrl = "".concat(validatedData.url, "?ref=").concat(affiliate.id, "&track=").concat(trackingCode);
                shortUrl = "https://track.link/".concat(trackingCode);
                linkData = {
                    id: crypto_1.default.randomUUID(),
                    originalUrl: validatedData.url,
                    affiliateUrl: affiliateUrl,
                    shortUrl: shortUrl,
                    trackingCode: trackingCode,
                    campaignName: validatedData.campaignName || "Default Campaign",
                    clicks: 0,
                    conversions: 0,
                    createdAt: new Date(),
                    affiliateId: affiliate.id,
                };
                res.json({
                    success: true,
                    link: linkData,
                    message: "Affiliate link generated successfully",
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error generating link:", error_1);
                if (error_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Invalid input data", details: error_1.errors })];
                }
                res.status(500).json({ error: "Failed to generate affiliate link" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get all affiliate links
router.get("/my-links", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, affiliate, referralCodes, links, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.user.id;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                return [4 /*yield*/, prisma.referralCode.findMany({
                        where: { affiliateId: affiliate.id },
                        orderBy: { createdAt: "desc" },
                    })];
            case 2:
                referralCodes = _a.sent();
                links = referralCodes.map(function (code) { return ({
                    id: code.id,
                    name: code.code,
                    url: "https://yourstore.com?ref=".concat(code.code),
                    shortUrl: "https://track.link/".concat(code.code),
                    trackingCode: code.code,
                    campaignName: "Referral Campaign - ".concat(code.type),
                    clicks: code.currentUses || 0,
                    conversions: 0,
                    earnings: 0,
                    status: code.isActive ? "Active" : "Inactive",
                    createdAt: code.createdAt,
                }); });
                res.json({
                    links: links,
                    total: links.length,
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error fetching links:", error_2);
                res.status(500).json({ error: "Failed to fetch affiliate links" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get marketing assets
router.get("/assets/banners", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, affiliate, banners, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                banners = [
                    {
                        id: "banner-1",
                        name: "Hero Banner - 1200x628",
                        category: "Social Media",
                        size: "1200x628",
                        format: "PNG",
                        fileSize: "245 KB",
                        downloadUrl: "/assets/banners/hero-1200x628.png",
                        previewUrl: "/assets/banners/preview/hero-1200x628.png",
                        downloads: 156,
                        createdAt: new Date("2024-01-01"),
                    },
                    {
                        id: "banner-2",
                        name: "Square Banner - 1080x1080",
                        category: "Instagram",
                        size: "1080x1080",
                        format: "PNG",
                        fileSize: "312 KB",
                        downloadUrl: "/assets/banners/square-1080x1080.png",
                        previewUrl: "/assets/banners/preview/square-1080x1080.png",
                        downloads: 203,
                        createdAt: new Date("2024-01-05"),
                    },
                    {
                        id: "banner-3",
                        name: "Leaderboard - 728x90",
                        category: "Web Banner",
                        size: "728x90",
                        format: "PNG",
                        fileSize: "89 KB",
                        downloadUrl: "/assets/banners/leaderboard-728x90.png",
                        previewUrl: "/assets/banners/preview/leaderboard-728x90.png",
                        downloads: 98,
                        createdAt: new Date("2024-01-10"),
                    },
                    {
                        id: "banner-4",
                        name: "Skyscraper - 160x600",
                        category: "Web Banner",
                        size: "160x600",
                        format: "PNG",
                        fileSize: "134 KB",
                        downloadUrl: "/assets/banners/skyscraper-160x600.png",
                        previewUrl: "/assets/banners/preview/skyscraper-160x600.png",
                        downloads: 67,
                        createdAt: new Date("2024-01-15"),
                    },
                ];
                res.json({
                    banners: banners,
                    total: banners.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching banners:", error_3);
                res.status(500).json({ error: "Failed to fetch marketing assets" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get available coupons
router.get("/coupons/available", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, affiliate, coupons, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _a.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                coupons = [
                    {
                        id: "coupon-1",
                        code: "SAVE20-".concat(affiliate.id.slice(0, 6).toUpperCase()),
                        description: "20% off on all products",
                        discount: "20%",
                        type: "Percentage",
                        minPurchase: "$50",
                        maxDiscount: "$100",
                        validUntil: "2024-12-31",
                        uses: 45,
                        maxUses: 100,
                        commission: "15%",
                        status: "Active",
                    },
                    {
                        id: "coupon-2",
                        code: "NEWUSER-".concat(affiliate.id.slice(0, 6).toUpperCase()),
                        description: "$10 off for new customers",
                        discount: "$10",
                        type: "Fixed Amount",
                        minPurchase: "$30",
                        maxDiscount: "$10",
                        validUntil: "2024-12-31",
                        uses: 78,
                        maxUses: 200,
                        commission: "10%",
                        status: "Active",
                    },
                    {
                        id: "coupon-3",
                        code: "FLASH25-".concat(affiliate.id.slice(0, 6).toUpperCase()),
                        description: "25% off flash sale",
                        discount: "25%",
                        type: "Percentage",
                        minPurchase: "$100",
                        maxDiscount: "$250",
                        validUntil: "2024-11-30",
                        uses: 23,
                        maxUses: 50,
                        commission: "20%",
                        status: "Active",
                    },
                ];
                res.json({
                    coupons: coupons,
                    total: coupons.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error fetching coupons:", error_4);
                res.status(500).json({ error: "Failed to fetch available coupons" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Generate custom coupon
router.post("/coupons/generate", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, description, discountType, discountValue, minPurchase, schema, validatedData, affiliate, couponCode, coupon, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.user.id;
                _a = req.body, description = _a.description, discountType = _a.discountType, discountValue = _a.discountValue, minPurchase = _a.minPurchase;
                schema = zod_1.z.object({
                    description: zod_1.z.string().min(3),
                    discountType: zod_1.z.enum(["Percentage", "Fixed Amount"]),
                    discountValue: zod_1.z.number().positive(),
                    minPurchase: zod_1.z.number().positive().optional(),
                });
                validatedData = schema.parse({
                    description: description,
                    discountType: discountType,
                    discountValue: discountValue,
                    minPurchase: minPurchase,
                });
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 1:
                affiliate = _b.sent();
                if (!affiliate) {
                    return [2 /*return*/, res.status(404).json({ error: "Affiliate profile not found" })];
                }
                couponCode = "CUSTOM-".concat(crypto_1.default.randomBytes(4).toString("hex").toUpperCase());
                coupon = {
                    id: crypto_1.default.randomUUID(),
                    code: couponCode,
                    description: validatedData.description,
                    discount: validatedData.discountType === "Percentage"
                        ? "".concat(validatedData.discountValue, "%")
                        : "$".concat(validatedData.discountValue),
                    type: validatedData.discountType,
                    minPurchase: validatedData.minPurchase
                        ? "$".concat(validatedData.minPurchase)
                        : "None",
                    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    uses: 0,
                    maxUses: 100,
                    commission: "15%",
                    status: "Active",
                    createdAt: new Date(),
                };
                res.json({
                    success: true,
                    coupon: coupon,
                    message: "Coupon generated successfully",
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error("Error generating coupon:", error_5);
                if (error_5 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Invalid input data", details: error_5.errors })];
                }
                res.status(500).json({ error: "Failed to generate coupon" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Track link click
router.post("/track/:trackingCode", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trackingCode, _a, referrer, userAgent, ipAddress;
    return __generator(this, function (_b) {
        try {
            trackingCode = req.params.trackingCode;
            _a = req.body, referrer = _a.referrer, userAgent = _a.userAgent, ipAddress = _a.ipAddress;
            // In a real app, you would track this in the database
            console.log("Link click tracked:", {
                trackingCode: trackingCode,
                referrer: referrer,
                userAgent: userAgent,
                ipAddress: ipAddress,
            });
            res.json({
                success: true,
                message: "Click tracked successfully",
            });
        }
        catch (error) {
            console.error("Error tracking click:", error);
            res.status(500).json({ error: "Failed to track click" });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
