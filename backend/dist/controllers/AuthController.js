"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const EmailService_1 = require("../services/EmailService");
const SecurityService_1 = require("../services/SecurityService");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const authService = new AuthService_1.AuthService();
const emailService = new EmailService_1.EmailService();
const securityService = new SecurityService_1.SecurityService();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.enum(["ADMIN", "AFFILIATE", "MANAGER"]).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    password: zod_1.z.string().min(8),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8),
});
const updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().optional(),
    timezone: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
});
class AuthController {
    async register(req, res) {
        try {
            const data = registerSchema.parse(req.body);
            const result = await authService.register(data);
            await emailService.sendWelcomeEmail(data.email, data.firstName);
            (0, auth_1.setAuthCookies)(res, result.token, result.user);
            res.status(201).json({
                message: "User created successfully",
                token: result.token,
                user: result.user,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res
                    .status(400)
                    .json({ error: "Invalid input data", details: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const data = loginSchema.parse(req.body);
            const result = await authService.login(data, req.ip, req.get("User-Agent"));
            (0, auth_1.setAuthCookies)(res, result.token, result.user);
            res.json({
                message: "Login successful",
                token: result.token,
                user: result.user,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res
                    .status(400)
                    .json({ error: "Invalid input data", details: error.errors });
            }
            res.status(401).json({ error: error.message });
        }
    }
    async logout(req, res) {
        try {
            await authService.logout(req.user.id);
            (0, auth_1.clearAuthCookies)(res);
            res.json({ message: "Logout successful" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getProfile(req, res) {
        try {
            const user = await authService.getProfile(req.user.id);
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const data = updateProfileSchema.parse(req.body);
            const user = await authService.updateProfile(req.user.id, data);
            res.json(user);
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res
                    .status(400)
                    .json({ error: "Invalid input data", details: error.errors });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async changePassword(req, res) {
        try {
            const data = changePasswordSchema.parse(req.body);
            await authService.changePassword(req.user.id, data.currentPassword, data.newPassword);
            res.json({ message: "Password changed successfully" });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res
                    .status(400)
                    .json({ error: "Invalid input data", details: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const data = forgotPasswordSchema.parse(req.body);
            await authService.forgotPassword(data.email);
            res.json({ message: "Password reset email sent" });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res
                    .status(400)
                    .json({ error: "Invalid input data", details: error.errors });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async resetPassword(req, res) {
        try {
            const data = resetPasswordSchema.parse(req.body);
            await authService.resetPassword(data.token, data.password);
            res.json({ message: "Password reset successfully" });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res
                    .status(400)
                    .json({ error: "Invalid input data", details: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }
    async setup2FA(req, res) {
        try {
            const secret = await securityService.generate2FASecret(req.user.id);
            res.json({ secret });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async verify2FA(req, res) {
        try {
            const { token } = req.body;
            const isValid = await securityService.verify2FAToken(req.user.id, token);
            if (isValid) {
                await authService.enable2FA(req.user.id);
                res.json({ message: "2FA enabled successfully" });
            }
            else {
                res.status(400).json({ error: "Invalid token" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async disable2FA(req, res) {
        try {
            await authService.disable2FA(req.user.id);
            res.json({ message: "2FA disabled successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async generateBackupCodes(req, res) {
        try {
            const codes = await authService.generateBackupCodes(req.user.id);
            res.json({ codes });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map