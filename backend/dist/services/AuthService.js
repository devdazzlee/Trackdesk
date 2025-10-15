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
exports.AuthService = void 0;
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var crypto_1 = __importDefault(require("crypto"));
var EmailService_1 = require("./EmailService");
var SecurityService_1 = require("./SecurityService");
var prisma = new client_1.PrismaClient();
var emailService = new EmailService_1.EmailService();
var securityService = new SecurityService_1.SecurityService();
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.prototype.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, user, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.findUnique({
                            where: { email: data.email },
                        })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error("User already exists");
                        }
                        return [4 /*yield*/, bcryptjs_1.default.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS || "12"))];
                    case 2:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, prisma.user.create({
                                data: {
                                    email: data.email,
                                    password: hashedPassword,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    role: data.role || "AFFILIATE",
                                },
                            })];
                    case 3:
                        user = _a.sent();
                        if (!(data.role === "AFFILIATE" || !data.role)) return [3 /*break*/, 5];
                        return [4 /*yield*/, prisma.affiliateProfile.create({
                                data: {
                                    userId: user.id,
                                    paymentMethod: "PAYPAL",
                                },
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(data.role === "ADMIN")) return [3 /*break*/, 7];
                        return [4 /*yield*/, prisma.adminProfile.create({
                                data: {
                                    userId: user.id,
                                    permissions: ["all"],
                                },
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: user.id,
                                    action: "user_registered",
                                    resource: "User Account",
                                    details: "User registered with role: ".concat(user.role),
                                    ipAddress: "127.0.0.1", // This should be passed from the controller
                                    userAgent: "Trackdesk API",
                                },
                            })];
                    case 8:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/, {
                                token: token,
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role,
                                },
                            }];
                }
            });
        });
    };
    AuthService.prototype.login = function (data, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function () {
            var user, validPassword, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.findUnique({
                            where: { email: data.email },
                            include: {
                                affiliateProfile: true,
                                adminProfile: true,
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("Invalid credentials");
                        }
                        return [4 /*yield*/, bcryptjs_1.default.compare(data.password, user.password)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword) {
                            throw new Error("Invalid credentials");
                        }
                        // Update last login
                        return [4 /*yield*/, prisma.user.update({
                                where: { id: user.id },
                                data: { lastLoginAt: new Date() },
                            })];
                    case 3:
                        // Update last login
                        _a.sent();
                        token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: user.id,
                                    action: "user_login",
                                    resource: "User Account",
                                    details: "Successful login",
                                    ipAddress: ipAddress || "127.0.0.1",
                                    userAgent: userAgent || "Trackdesk API",
                                },
                            })];
                    case 4:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/, {
                                token: token,
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role,
                                    affiliateProfile: user.affiliateProfile,
                                    adminProfile: user.adminProfile,
                                },
                            }];
                }
            });
        });
    };
    AuthService.prototype.logout = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Invalidate all sessions for the user
                    return [4 /*yield*/, prisma.session.deleteMany({
                            where: { userId: userId },
                        })];
                    case 1:
                        // Invalidate all sessions for the user
                        _a.sent();
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: userId,
                                    action: "user_logout",
                                    resource: "User Account",
                                    details: "User logged out",
                                },
                            })];
                    case 2:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.getProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                affiliateProfile: true,
                                adminProfile: true,
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                                status: user.status,
                                avatar: user.avatar,
                                phone: user.phone,
                                timezone: user.timezone,
                                language: user.language,
                                twoFactorEnabled: user.twoFactorEnabled,
                                createdAt: user.createdAt,
                                lastLoginAt: user.lastLoginAt,
                                affiliateProfile: user.affiliateProfile,
                                adminProfile: user.adminProfile,
                            }];
                }
            });
        });
    };
    AuthService.prototype.updateProfile = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.update({
                            where: { id: userId },
                            data: {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                phone: data.phone,
                                timezone: data.timezone,
                                language: data.language,
                            },
                            include: {
                                affiliateProfile: true,
                                adminProfile: true,
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: userId,
                                    action: "profile_updated",
                                    resource: "User Profile",
                                    details: "Profile information updated",
                                },
                            })];
                    case 2:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AuthService.prototype.changePassword = function (userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, validPassword, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.findUnique({
                            where: { id: userId },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        return [4 /*yield*/, bcryptjs_1.default.compare(currentPassword, user.password)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword) {
                            throw new Error("Current password is incorrect");
                        }
                        return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || "12"))];
                    case 3:
                        hashedPassword = _a.sent();
                        // Update password
                        return [4 /*yield*/, prisma.user.update({
                                where: { id: userId },
                                data: { password: hashedPassword },
                            })];
                    case 4:
                        // Update password
                        _a.sent();
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: userId,
                                    action: "password_changed",
                                    resource: "User Account",
                                    details: "Password changed successfully",
                                },
                            })];
                    case 5:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resetToken, expiresAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.findUnique({
                            where: { email: email },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            // Don't reveal if user exists or not
                            return [2 /*return*/];
                        }
                        resetToken = crypto_1.default.randomBytes(32).toString("hex");
                        expiresAt = new Date(Date.now() + 3600000);
                        // Store reset token (you might want to create a separate table for this)
                        // For now, we'll use a simple approach
                        return [4 /*yield*/, prisma.user.update({
                                where: { id: user.id },
                                data: {
                                // You might want to add resetToken and resetTokenExpires fields to your schema
                                },
                            })];
                    case 2:
                        // Store reset token (you might want to create a separate table for this)
                        // For now, we'll use a simple approach
                        _a.sent();
                        // Send reset email
                        return [4 /*yield*/, emailService.sendPasswordResetEmail(email, resetToken)];
                    case 3:
                        // Send reset email
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || "12"))];
                    case 1:
                        hashedPassword = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.enable2FA = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.update({
                            where: { id: userId },
                            data: { twoFactorEnabled: true },
                        })];
                    case 1:
                        _a.sent();
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: userId,
                                    action: "2fa_enabled",
                                    resource: "Security",
                                    details: "Two-factor authentication enabled",
                                },
                            })];
                    case 2:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.disable2FA = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.update({
                            where: { id: userId },
                            data: {
                                twoFactorEnabled: false,
                                twoFactorSecret: null,
                            },
                        })];
                    case 1:
                        _a.sent();
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: userId,
                                    action: "2fa_disabled",
                                    resource: "Security",
                                    details: "Two-factor authentication disabled",
                                },
                            })];
                    case 2:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.generateBackupCodes = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var codes, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codes = [];
                        for (i = 0; i < 10; i++) {
                            codes.push(crypto_1.default.randomBytes(4).toString("hex").toUpperCase());
                        }
                        // Store backup codes (you might want to create a separate table for this)
                        // For now, we'll return them
                        // Log activity
                        return [4 /*yield*/, prisma.activity.create({
                                data: {
                                    userId: userId,
                                    action: "backup_codes_generated",
                                    resource: "Security",
                                    details: "New backup codes generated",
                                },
                            })];
                    case 1:
                        // Store backup codes (you might want to create a separate table for this)
                        // For now, we'll return them
                        // Log activity
                        _a.sent();
                        return [2 /*return*/, codes];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
