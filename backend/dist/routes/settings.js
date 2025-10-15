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
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var router = express_1.default.Router();
var prisma = new client_1.PrismaClient();
// Get user profile
router.get("/profile", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, affiliate, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.user.id;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            createdAt: true,
                            role: true,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 2:
                affiliate = _a.sent();
                res.json({
                    user: user,
                    affiliate: affiliate
                        ? {
                            id: affiliate.id,
                            companyName: affiliate.companyName,
                            website: affiliate.website,
                            tier: affiliate.tier,
                            status: affiliate.status,
                        }
                        : null,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching profile:", error_1);
                res.status(500).json({ error: "Failed to fetch user profile" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update user profile
router.put("/profile", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, firstName, lastName, phone, companyName, website, schema, validatedData, updatedUser, affiliate, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                userId = req.user.id;
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, phone = _a.phone, companyName = _a.companyName, website = _a.website;
                schema = zod_1.z.object({
                    firstName: zod_1.z.string().min(1).optional(),
                    lastName: zod_1.z.string().min(1).optional(),
                    phone: zod_1.z.string().optional(),
                    companyName: zod_1.z.string().optional(),
                    website: zod_1.z.string().url().optional(),
                });
                validatedData = schema.parse({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    companyName: companyName,
                    website: website,
                });
                return [4 /*yield*/, prisma.user.update({
                        where: { id: userId },
                        data: {
                            firstName: validatedData.firstName,
                            lastName: validatedData.lastName,
                            phone: validatedData.phone,
                        },
                    })];
            case 1:
                updatedUser = _b.sent();
                if (!(validatedData.companyName || validatedData.website)) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.affiliateProfile.findFirst({
                        where: { userId: userId },
                    })];
            case 2:
                affiliate = _b.sent();
                if (!affiliate) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.affiliateProfile.update({
                        where: { id: affiliate.id },
                        data: {
                            companyName: validatedData.companyName,
                            website: validatedData.website,
                        },
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                res.json({
                    success: true,
                    message: "Profile updated successfully",
                    user: {
                        id: updatedUser.id,
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        phone: updatedUser.phone,
                    },
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error("Error updating profile:", error_2);
                if (error_2 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Invalid input data", details: error_2.errors })];
                }
                res.status(500).json({ error: "Failed to update profile" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get security settings
router.get("/security", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: userId },
                        select: {
                            email: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.json({
                    email: user.email,
                    lastPasswordChange: user.updatedAt,
                    twoFactorEnabled: false,
                    loginHistory: [
                        {
                            id: "login-1",
                            timestamp: new Date(),
                            ipAddress: "192.168.1.1",
                            device: "Chrome on MacOS",
                            location: "New York, USA",
                            status: "Success",
                        },
                        {
                            id: "login-2",
                            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                            ipAddress: "192.168.1.1",
                            device: "Safari on iOS",
                            location: "New York, USA",
                            status: "Success",
                        },
                    ],
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching security settings:", error_3);
                res.status(500).json({ error: "Failed to fetch security settings" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Change password
router.post("/security/change-password", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, currentPassword, newPassword, confirmPassword, schema, validatedData, user, isValid, hashedPassword, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                userId = req.user.id;
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword, confirmPassword = _a.confirmPassword;
                schema = zod_1.z.object({
                    currentPassword: zod_1.z.string().min(6),
                    newPassword: zod_1.z.string().min(6),
                    confirmPassword: zod_1.z.string().min(6),
                });
                validatedData = schema.parse({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                });
                if (validatedData.newPassword !== validatedData.confirmPassword) {
                    return [2 /*return*/, res.status(400).json({ error: "New passwords do not match" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: userId },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(validatedData.currentPassword, user.password)];
            case 2:
                isValid = _b.sent();
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json({ error: "Current password is incorrect" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(validatedData.newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                // Update password
                return [4 /*yield*/, prisma.user.update({
                        where: { id: userId },
                        data: { password: hashedPassword },
                    })];
            case 4:
                // Update password
                _b.sent();
                res.json({
                    success: true,
                    message: "Password changed successfully",
                });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error("Error changing password:", error_4);
                if (error_4 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Invalid input data", details: error_4.errors })];
                }
                res.status(500).json({ error: "Failed to change password" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get notification settings
router.get("/notifications", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, settings;
    return __generator(this, function (_a) {
        try {
            userId = req.user.id;
            settings = {
                email: {
                    newCommission: true,
                    payoutProcessed: true,
                    weeklyReport: true,
                    monthlyReport: true,
                    systemUpdates: false,
                    marketingEmails: false,
                },
                push: {
                    newCommission: true,
                    payoutProcessed: true,
                    highValueSale: true,
                    systemAlerts: true,
                },
                preferences: {
                    frequency: "Immediate",
                    quietHours: {
                        enabled: false,
                        start: "22:00",
                        end: "08:00",
                    },
                },
            };
            res.json(settings);
        }
        catch (error) {
            console.error("Error fetching notification settings:", error);
            res.status(500).json({ error: "Failed to fetch notification settings" });
        }
        return [2 /*return*/];
    });
}); });
// Update notification settings
router.put("/notifications", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, email, push, preferences, schema, validatedData;
    return __generator(this, function (_b) {
        try {
            userId = req.user.id;
            _a = req.body, email = _a.email, push = _a.push, preferences = _a.preferences;
            schema = zod_1.z.object({
                email: zod_1.z
                    .object({
                    newCommission: zod_1.z.boolean().optional(),
                    payoutProcessed: zod_1.z.boolean().optional(),
                    weeklyReport: zod_1.z.boolean().optional(),
                    monthlyReport: zod_1.z.boolean().optional(),
                    systemUpdates: zod_1.z.boolean().optional(),
                    marketingEmails: zod_1.z.boolean().optional(),
                })
                    .optional(),
                push: zod_1.z
                    .object({
                    newCommission: zod_1.z.boolean().optional(),
                    payoutProcessed: zod_1.z.boolean().optional(),
                    highValueSale: zod_1.z.boolean().optional(),
                    systemAlerts: zod_1.z.boolean().optional(),
                })
                    .optional(),
                preferences: zod_1.z
                    .object({
                    frequency: zod_1.z
                        .enum(["Immediate", "Daily Digest", "Weekly Digest"])
                        .optional(),
                    quietHours: zod_1.z
                        .object({
                        enabled: zod_1.z.boolean(),
                        start: zod_1.z.string(),
                        end: zod_1.z.string(),
                    })
                        .optional(),
                })
                    .optional(),
            });
            validatedData = schema.parse({ email: email, push: push, preferences: preferences });
            // In a real app, save to database
            res.json({
                success: true,
                message: "Notification settings updated successfully",
                settings: validatedData,
            });
        }
        catch (error) {
            console.error("Error updating notification settings:", error);
            if (error instanceof zod_1.z.ZodError) {
                return [2 /*return*/, res
                        .status(400)
                        .json({ error: "Invalid input data", details: error.errors })];
            }
            res.status(500).json({ error: "Failed to update notification settings" });
        }
        return [2 /*return*/];
    });
}); });
// Delete account
router.delete("/account", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, password, confirmation, user, isValid, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = req.user.id;
                _a = req.body, password = _a.password, confirmation = _a.confirmation;
                if (confirmation !== "DELETE") {
                    return [2 /*return*/, res.status(400).json({ error: "Please type DELETE to confirm" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: userId },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isValid = _b.sent();
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json({ error: "Password is incorrect" })];
                }
                // In production, you might want to soft delete or archive the data
                // For now, we'll just return success
                res.json({
                    success: true,
                    message: "Account deletion request received. Your account will be deleted within 24 hours.",
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error("Error deleting account:", error_5);
                res.status(500).json({ error: "Failed to delete account" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
