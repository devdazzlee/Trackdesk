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
var express_1 = require("express");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var crypto = __importStar(require("crypto"));
var multer_1 = __importDefault(require("multer"));
var csv_parser_1 = __importDefault(require("csv-parser"));
var fs = __importStar(require("fs"));
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Configure multer for file uploads
var upload = (0, multer_1.default)({ dest: "uploads/" });
// Get coupons with filtering and pagination
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, search, status_1, type, affiliateId, filters, coupons, total, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, search = _a.search, status_1 = _a.status, type = _a.type, affiliateId = _a.affiliateId;
                filters = {};
                if (search) {
                    filters.OR = [
                        { code: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ];
                }
                if (status_1 && status_1 !== "all") {
                    filters.status = status_1;
                }
                if (type && type !== "all") {
                    filters.type = type;
                }
                if (affiliateId) {
                    filters.affiliateId = affiliateId;
                }
                return [4 /*yield*/, prisma.coupon.findMany({
                        where: filters,
                        include: {
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true,
                                },
                            },
                            // _count not available in schema
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        skip: (Number(page) - 1) * Number(limit),
                        take: Number(limit),
                    })];
            case 1:
                coupons = _d.sent();
                return [4 /*yield*/, prisma.coupon.count({ where: filters })];
            case 2:
                total = _d.sent();
                res.json({
                    coupons: coupons,
                    pagination: {
                        total: total,
                        page: Number(page),
                        limit: Number(limit),
                        pages: Math.ceil(total / Number(limit)),
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                console.error("Error fetching coupons:", error_1);
                res.status(500).json({ error: "Failed to fetch coupons" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get coupon by ID
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, coupon, totalUses, successfulUses, totalRevenue, conversionRate, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.coupon.findUnique({
                        where: { id: id },
                        include: {
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true,
                                },
                            },
                        },
                    })];
            case 1:
                coupon = _a.sent();
                if (!coupon) {
                    return [2 /*return*/, res.status(404).json({ error: "Coupon not found" })];
                }
                totalUses = coupon.usage;
                successfulUses = coupon.usage;
                totalRevenue = 0;
                conversionRate = totalUses > 0 ? ((successfulUses / totalUses) * 100).toFixed(2) : "0.00";
                res.json(__assign(__assign({}, coupon), { statistics: {
                        totalUses: totalUses,
                        successfulUses: successfulUses,
                        totalRevenue: totalRevenue,
                        conversionRate: "".concat(conversionRate, "%"),
                        remainingUses: coupon.maxUsage
                            ? Math.max(0, coupon.maxUsage - totalUses)
                            : "Unlimited",
                    } }));
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching coupon:", error_2);
                res.status(500).json({ error: "Failed to fetch coupon" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create new coupon
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var couponSchema, data, existingCoupon, coupon, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                couponSchema = zod_1.z.object({
                    code: zod_1.z.string().min(3).max(50),
                    description: zod_1.z.string().optional(),
                    type: zod_1.z.enum(["percentage", "fixed_amount", "free_shipping"]),
                    value: zod_1.z.number().min(0),
                    affiliateId: zod_1.z.string(),
                    offerId: zod_1.z.string().optional(),
                    maxUses: zod_1.z.number().min(1).optional(),
                    expiresAt: zod_1.z.string().optional(),
                    minOrderValue: zod_1.z.number().min(0).optional(),
                    isActive: zod_1.z.boolean().default(true),
                });
                data = couponSchema.parse(req.body);
                return [4 /*yield*/, prisma.coupon.findUnique({
                        where: { code: data.code },
                    })];
            case 1:
                existingCoupon = _b.sent();
                if (existingCoupon) {
                    return [2 /*return*/, res.status(400).json({ error: "Coupon code already exists" })];
                }
                return [4 /*yield*/, prisma.coupon.create({
                        data: {
                            code: data.code,
                            description: data.description || "",
                            discount: ((_a = data.value) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
                            affiliateId: data.affiliateId,
                            validUntil: data.expiresAt
                                ? new Date(data.expiresAt)
                                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            maxUsage: data.maxUses,
                            status: data.isActive ? "ACTIVE" : "INACTIVE",
                        },
                        include: {
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true,
                                },
                            },
                        },
                    })];
            case 2:
                coupon = _b.sent();
                res.status(201).json(coupon);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error("Error creating coupon:", error_3);
                res.status(400).json({ error: "Failed to create coupon" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update coupon
router.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateSchema, data, coupon, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateSchema = zod_1.z.object({
                    description: zod_1.z.string().optional(),
                    type: zod_1.z.enum(["percentage", "fixed_amount", "free_shipping"]).optional(),
                    value: zod_1.z.number().min(0).optional(),
                    maxUses: zod_1.z.number().min(1).optional(),
                    expiresAt: zod_1.z.string().optional(),
                    minOrderValue: zod_1.z.number().min(0).optional(),
                    isActive: zod_1.z.boolean().optional(),
                });
                data = updateSchema.parse(req.body);
                return [4 /*yield*/, prisma.coupon.update({
                        where: { id: id },
                        data: {
                            description: data.description,
                            discount: (_a = data.value) === null || _a === void 0 ? void 0 : _a.toString(),
                            maxUsage: data.maxUses,
                            validUntil: data.expiresAt ? new Date(data.expiresAt) : undefined,
                            status: data.isActive ? "ACTIVE" : "INACTIVE",
                        },
                        include: {
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true,
                                },
                            },
                        },
                    })];
            case 1:
                coupon = _b.sent();
                res.json(coupon);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error("Error updating coupon:", error_4);
                res.status(400).json({ error: "Failed to update coupon" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete coupon
router.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.coupon.delete({
                        where: { id: id },
                    })];
            case 1:
                _a.sent();
                res.json({ message: "Coupon deleted successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error deleting coupon:", error_5);
                res.status(500).json({ error: "Failed to delete coupon" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Generate random coupon codes
router.post("/generate", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var generateSchema, data, generatedCoupons, existingCodes, existing, _i, existing_1, coupon, i, code, attempts, randomPart, coupon, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                generateSchema = zod_1.z.object({
                    count: zod_1.z.number().min(1).max(100),
                    length: zod_1.z.number().min(4).max(20).default(8),
                    prefix: zod_1.z.string().optional(),
                    suffix: zod_1.z.string().optional(),
                    type: zod_1.z.enum(["percentage", "fixed_amount", "free_shipping"]),
                    value: zod_1.z.number().min(0),
                    affiliateId: zod_1.z.string(),
                    offerId: zod_1.z.string().optional(),
                    maxUses: zod_1.z.number().min(1).optional(),
                    expiresAt: zod_1.z.string().optional(),
                    minOrderValue: zod_1.z.number().min(0).optional(),
                });
                data = generateSchema.parse(req.body);
                generatedCoupons = [];
                existingCodes = new Set();
                return [4 /*yield*/, prisma.coupon.findMany({
                        select: { code: true },
                    })];
            case 1:
                existing = _b.sent();
                for (_i = 0, existing_1 = existing; _i < existing_1.length; _i++) {
                    coupon = existing_1[_i];
                    existingCodes.add(coupon.code);
                }
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < data.count)) return [3 /*break*/, 5];
                code = void 0;
                attempts = 0;
                do {
                    randomPart = crypto
                        .randomBytes(Math.ceil(data.length / 2))
                        .toString("hex")
                        .substring(0, data.length)
                        .toUpperCase();
                    code = "".concat(data.prefix || "").concat(randomPart).concat(data.suffix || "");
                    attempts++;
                } while (existingCodes.has(code) && attempts < 10);
                if (attempts >= 10) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Unable to generate unique coupon codes" })];
                }
                existingCodes.add(code);
                return [4 /*yield*/, prisma.coupon.create({
                        data: {
                            code: code,
                            description: "Auto-generated coupon ".concat(i + 1, "/").concat(data.count),
                            discount: ((_a = data.value) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
                            affiliateId: data.affiliateId,
                            maxUsage: data.maxUses,
                            validUntil: data.expiresAt
                                ? new Date(data.expiresAt)
                                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            status: "ACTIVE",
                        },
                    })];
            case 3:
                coupon = _b.sent();
                generatedCoupons.push(coupon);
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                res.status(201).json({
                    message: "Successfully generated ".concat(generatedCoupons.length, " coupons"),
                    coupons: generatedCoupons,
                });
                return [3 /*break*/, 7];
            case 6:
                error_6 = _b.sent();
                console.error("Error generating coupons:", error_6);
                res.status(400).json({ error: "Failed to generate coupons" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Import coupons from CSV
router.post("/import", upload.single("csvFile"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var csvFilePath_1, coupons_1, errors_1, codes_1, duplicateCodes, existingCoupons, existingCodes, importedCoupons, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: "No CSV file provided" })];
                }
                csvFilePath_1 = req.file.path;
                coupons_1 = [];
                errors_1 = [];
                // Parse CSV file
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.createReadStream(csvFilePath_1)
                            .pipe((0, csv_parser_1.default)())
                            .on("data", function (row) {
                            var _a, _b;
                            try {
                                // Validate required fields
                                if (!row.code || !row.type || !row.value || !row.affiliateId) {
                                    errors_1.push("Row missing required fields: ".concat(JSON.stringify(row)));
                                    return;
                                }
                                coupons_1.push({
                                    code: row.code.trim(),
                                    description: ((_a = row.description) === null || _a === void 0 ? void 0 : _a.trim()) || "",
                                    type: row.type.trim(),
                                    value: parseFloat(row.value),
                                    affiliateId: row.affiliateId.trim(),
                                    offerId: ((_b = row.offerId) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                                    maxUses: row.maxUses ? parseInt(row.maxUses) : null,
                                    expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
                                    minOrderValue: row.minOrderValue
                                        ? parseFloat(row.minOrderValue)
                                        : null,
                                    isActive: row.isActive !== "false",
                                });
                            }
                            catch (error) {
                                errors_1.push("Error parsing row: ".concat(JSON.stringify(row), " - ").concat(error));
                            }
                        })
                            .on("end", resolve)
                            .on("error", reject);
                    })];
            case 1:
                // Parse CSV file
                _a.sent();
                // Clean up uploaded file
                fs.unlinkSync(csvFilePath_1);
                if (errors_1.length > 0) {
                    return [2 /*return*/, res.status(400).json({
                            error: "CSV parsing errors",
                            errors: errors_1.slice(0, 10), // Limit error messages
                        })];
                }
                codes_1 = coupons_1.map(function (c) { return c.code; });
                duplicateCodes = codes_1.filter(function (code, index) { return codes_1.indexOf(code) !== index; });
                if (duplicateCodes.length > 0) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Duplicate codes in CSV",
                            duplicates: Array.from(new Set(duplicateCodes)),
                        })];
                }
                return [4 /*yield*/, prisma.coupon.findMany({
                        where: {
                            code: {
                                in: codes_1,
                            },
                        },
                        select: { code: true },
                    })];
            case 2:
                existingCoupons = _a.sent();
                existingCodes = existingCoupons.map(function (c) { return c.code; });
                if (existingCodes.length > 0) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Some coupon codes already exist",
                            existingCodes: existingCodes,
                        })];
                }
                return [4 /*yield*/, prisma.coupon.createMany({
                        data: coupons_1.map(function (coupon) { return (__assign(__assign({}, coupon), { createdAt: new Date() })); }),
                    })];
            case 3:
                importedCoupons = _a.sent();
                res.status(201).json({
                    message: "Successfully imported ".concat(importedCoupons.count, " coupons"),
                    imported: importedCoupons.count,
                    errors: errors_1.length,
                });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                console.error("Error importing coupons:", error_7);
                // Clean up uploaded file if it exists
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(500).json({ error: "Failed to import coupons" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Export coupons to CSV
router.get("/export", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, affiliateId, status_2, type, filters, coupons, csv_1, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, affiliateId = _a.affiliateId, status_2 = _a.status, type = _a.type;
                filters = {};
                if (affiliateId)
                    filters.affiliateId = affiliateId;
                if (status_2 && status_2 !== "all")
                    filters.status = status_2;
                if (type && type !== "all")
                    filters.type = type;
                return [4 /*yield*/, prisma.coupon.findMany({
                        where: filters,
                        include: {
                            affiliate: {
                                select: {
                                    id: true,
                                    companyName: true,
                                },
                            },
                            // offer relation not in Coupon schema,
                            // _count not available in schema
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    })];
            case 1:
                coupons = _b.sent();
                csv_1 = __spreadArray([
                    "Code,Description,Type,Value,Affiliate,Offer,Max Uses,Total Uses,Expires At,Status,Created At"
                ], coupons.map(function (coupon) {
                    return [
                        coupon.code,
                        "\"".concat((coupon.description || "").replace(/"/g, '""'), "\""),
                        "percentage", // type not in schema, defaulting
                        coupon.discount,
                        "", // affiliate relation not included in query
                        "", // offer not in schema
                        coupon.maxUsage || "Unlimited",
                        coupon.usage,
                        coupon.validUntil
                            ? coupon.validUntil.toISOString().split("T")[0]
                            : "",
                        coupon.status === "ACTIVE" ? "Active" : "Inactive",
                        coupon.createdAt.toISOString().split("T")[0],
                    ].join(",");
                }), true).join("\n");
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", 'attachment; filename="coupons.csv"');
                res.send(csv_1);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error("Error exporting coupons:", error_8);
                res.status(500).json({ error: "Failed to export coupons" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Validate coupon code
router.post("/validate", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validateSchema, _a, code, _b, orderValue, affiliateId, coupon, discountAmount, discountValue, error_9;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                validateSchema = zod_1.z.object({
                    code: zod_1.z.string(),
                    orderValue: zod_1.z.number().min(0).optional(),
                    affiliateId: zod_1.z.string().optional(),
                });
                _a = validateSchema.parse(req.body), code = _a.code, _b = _a.orderValue, orderValue = _b === void 0 ? 0 : _b, affiliateId = _a.affiliateId;
                return [4 /*yield*/, prisma.coupon.findUnique({
                        where: { code: code },
                        include: {
                        // _count not available in schema
                        },
                    })];
            case 1:
                coupon = _c.sent();
                if (!coupon) {
                    return [2 /*return*/, res.status(404).json({
                            valid: false,
                            error: "Coupon code not found",
                        })];
                }
                // Check if coupon is active
                if (coupon.status !== "ACTIVE") {
                    return [2 /*return*/, res.status(400).json({
                            valid: false,
                            error: "Coupon is not active",
                        })];
                }
                // Check if coupon has expired
                if (coupon.validUntil && coupon.validUntil < new Date()) {
                    return [2 /*return*/, res.status(400).json({
                            valid: false,
                            error: "Coupon has expired",
                        })];
                }
                // Check usage limit
                if (coupon.maxUsage && coupon.usage >= coupon.maxUsage) {
                    return [2 /*return*/, res.status(400).json({
                            valid: false,
                            error: "Coupon usage limit reached",
                        })];
                }
                // Check affiliate restriction
                if (affiliateId && coupon.affiliateId !== affiliateId) {
                    return [2 /*return*/, res.status(400).json({
                            valid: false,
                            error: "Coupon not valid for this affiliate",
                        })];
                }
                discountAmount = 0;
                discountValue = parseFloat(coupon.discount);
                // Assume percentage if discount is less than 1, otherwise fixed amount
                if (discountValue < 1) {
                    discountAmount = (orderValue * discountValue) / 100;
                }
                else {
                    discountAmount = Math.min(discountValue, orderValue);
                }
                res.json({
                    valid: true,
                    coupon: {
                        id: coupon.id,
                        code: coupon.code,
                        description: coupon.description,
                        discount: coupon.discount,
                        discountAmount: discountAmount,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _c.sent();
                console.error("Error validating coupon:", error_9);
                res.status(400).json({ error: "Failed to validate coupon" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
