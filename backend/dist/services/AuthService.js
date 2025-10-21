"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EmailService_1 = __importStar(require("./EmailService"));
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
class AuthService {
    async register(data) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS || "12"));
        const verificationToken = EmailService_1.EmailService.generateToken();
        const verificationTokenExpiry = EmailService_1.EmailService.generateTokenExpiry();
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role || "AFFILIATE",
                verificationToken,
                verificationTokenExpiry,
                emailVerified: false,
            },
        });
        if (data.role === "AFFILIATE" || !data.role) {
            await prisma.affiliateProfile.create({
                data: {
                    userId: user.id,
                    paymentMethod: "PAYPAL",
                },
            });
        }
        else if (data.role === "ADMIN") {
            await prisma.adminProfile.create({
                data: {
                    userId: user.id,
                    permissions: ["all"],
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
        await prisma.activity.create({
            data: {
                userId: user.id,
                action: "user_registered",
                resource: "User Account",
                details: `User registered with role: ${user.role}`,
                ipAddress: "127.0.0.1",
                userAgent: "Trackdesk API",
            },
        });
        try {
            await EmailService_1.default.sendVerificationEmail(user.email, user.firstName, verificationToken);
            console.log(`Verification email sent to ${user.email}`);
        }
        catch (error) {
            console.error("Failed to send verification email:", error);
        }
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar || null,
                emailVerified: user.emailVerified,
            },
            message: "Registration successful! Please check your email to verify your account.",
        };
    }
    async login(data, ipAddress, userAgent) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: {
                affiliateProfile: true,
                adminProfile: true,
            },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const validPassword = await bcryptjs_1.default.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error("Invalid credentials");
        }
        if (!user.emailVerified) {
            throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
        await prisma.activity.create({
            data: {
                userId: user.id,
                action: "user_login",
                resource: "User Account",
                details: "Successful login",
                ipAddress: ipAddress || "127.0.0.1",
                userAgent: userAgent || "Trackdesk API",
            },
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar || null,
                affiliateProfile: user.affiliateProfile,
                adminProfile: user.adminProfile,
            },
        };
    }
    async verifyEmail(token) {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiry: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new Error("Invalid or expired verification token");
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null,
            },
        });
        await prisma.activity.create({
            data: {
                userId: user.id,
                action: "email_verified",
                resource: "User Account",
                details: "Email successfully verified",
                ipAddress: "127.0.0.1",
                userAgent: "Trackdesk API",
            },
        });
        try {
            await EmailService_1.default.sendWelcomeEmail(user.email, user.firstName);
            console.log(`Welcome email sent to ${user.email}`);
        }
        catch (error) {
            console.error("Failed to send welcome email:", error);
        }
        return {
            message: "Email verified successfully! You can now log in.",
        };
    }
    async resendVerificationEmail(email) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.emailVerified) {
            throw new Error("Email is already verified");
        }
        const verificationToken = EmailService_1.EmailService.generateToken();
        const verificationTokenExpiry = EmailService_1.EmailService.generateTokenExpiry();
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpiry,
            },
        });
        try {
            await EmailService_1.default.sendVerificationEmail(user.email, user.firstName, verificationToken);
            return {
                message: "Verification email sent! Please check your inbox.",
            };
        }
        catch (error) {
            console.error("Failed to send verification email:", error);
            throw new Error("Failed to send verification email");
        }
    }
    async logout(userId) {
        await prisma.session.deleteMany({
            where: { userId },
        });
        await prisma.activity.create({
            data: {
                userId,
                action: "user_logout",
                resource: "User Account",
                details: "User logged out",
            },
        });
    }
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                affiliateProfile: true,
                adminProfile: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        console.log("🔍 AuthService.getProfile - Raw user from DB:", {
            id: user.id,
            email: user.email,
            avatar: user.avatar,
        });
        const response = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            avatar: user.avatar || null,
            phone: user.phone,
            timezone: user.timezone,
            language: user.language,
            twoFactorEnabled: user.twoFactorEnabled,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            affiliateProfile: user.affiliateProfile,
            adminProfile: user.adminProfile,
        };
        console.log("📤 AuthService.getProfile - Response being sent:", {
            id: response.id,
            email: response.email,
            avatar: response.avatar,
        });
        return response;
    }
    async updateProfile(userId, data) {
        const user = await prisma.user.update({
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
        });
        await prisma.activity.create({
            data: {
                userId,
                action: "profile_updated",
                resource: "User Profile",
                details: "Profile information updated",
            },
        });
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const validPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!validPassword) {
            throw new Error("Current password is incorrect");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || "12"));
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await prisma.activity.create({
            data: {
                userId,
                action: "password_changed",
                resource: "User Account",
                details: "Password changed successfully",
            },
        });
    }
    async forgotPassword(email) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000);
        await prisma.user.update({
            where: { id: user.id },
            data: {},
        });
        await EmailService_1.default.sendPasswordResetEmail(email, user.firstName, resetToken);
    }
    async resetPassword(token, newPassword) {
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || "12"));
    }
    async enable2FA(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        await prisma.activity.create({
            data: {
                userId,
                action: "2fa_enabled",
                resource: "Security",
                details: "Two-factor authentication enabled",
            },
        });
    }
    async disable2FA(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null,
            },
        });
        await prisma.activity.create({
            data: {
                userId,
                action: "2fa_disabled",
                resource: "Security",
                details: "Two-factor authentication disabled",
            },
        });
    }
    async generateBackupCodes(userId) {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(crypto_1.default.randomBytes(4).toString("hex").toUpperCase());
        }
        await prisma.activity.create({
            data: {
                userId,
                action: "backup_codes_generated",
                resource: "Security",
                details: "New backup codes generated",
            },
        });
        return codes;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map