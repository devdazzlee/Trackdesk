"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const EmailService_1 = require("./EmailService");
const SecurityService_1 = require("./SecurityService");
const prisma = new client_1.PrismaClient();
const emailService = new EmailService_1.EmailService();
const securityService = new SecurityService_1.SecurityService();
class AuthService {
    async register(data) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role || 'AFFILIATE'
            }
        });
        if (data.role === 'AFFILIATE' || !data.role) {
            await prisma.affiliateProfile.create({
                data: {
                    userId: user.id
                }
            });
        }
        else if (data.role === 'ADMIN') {
            await prisma.adminProfile.create({
                data: {
                    userId: user.id,
                    permissions: ['all']
                }
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        await prisma.activity.create({
            data: {
                userId: user.id,
                action: 'user_registered',
                resource: 'User Account',
                details: `User registered with role: ${user.role}`,
                ipAddress: '127.0.0.1',
                userAgent: 'Trackdesk API'
            }
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        };
    }
    async login(data, ipAddress, userAgent) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: {
                affiliateProfile: true,
                adminProfile: true
            }
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const validPassword = await bcryptjs_1.default.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        await prisma.activity.create({
            data: {
                userId: user.id,
                action: 'user_login',
                resource: 'User Account',
                details: 'Successful login',
                ipAddress: ipAddress || '127.0.0.1',
                userAgent: userAgent || 'Trackdesk API'
            }
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                affiliateProfile: user.affiliateProfile,
                adminProfile: user.adminProfile
            }
        };
    }
    async logout(userId) {
        await prisma.session.deleteMany({
            where: { userId }
        });
        await prisma.activity.create({
            data: {
                userId,
                action: 'user_logout',
                resource: 'User Account',
                details: 'User logged out'
            }
        });
    }
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                affiliateProfile: true,
                adminProfile: true
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return {
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
            adminProfile: user.adminProfile
        };
    }
    async updateProfile(userId, data) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                timezone: data.timezone,
                language: data.language
            },
            include: {
                affiliateProfile: true,
                adminProfile: true
            }
        });
        await prisma.activity.create({
            data: {
                userId,
                action: 'profile_updated',
                resource: 'User Profile',
                details: 'Profile information updated'
            }
        });
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const validPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!validPassword) {
            throw new Error('Current password is incorrect');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        await prisma.activity.create({
            data: {
                userId,
                action: 'password_changed',
                resource: 'User Account',
                details: 'Password changed successfully'
            }
        });
    }
    async forgotPassword(email) {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000);
        await prisma.user.update({
            where: { id: user.id },
            data: {}
        });
        await emailService.sendPasswordResetEmail(email, resetToken);
    }
    async resetPassword(token, newPassword) {
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
    }
    async enable2FA(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true }
        });
        await prisma.activity.create({
            data: {
                userId,
                action: '2fa_enabled',
                resource: 'Security',
                details: 'Two-factor authentication enabled'
            }
        });
    }
    async disable2FA(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null
            }
        });
        await prisma.activity.create({
            data: {
                userId,
                action: '2fa_disabled',
                resource: 'Security',
                details: 'Two-factor authentication disabled'
            }
        });
    }
    async generateBackupCodes(userId) {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(crypto_1.default.randomBytes(4).toString('hex').toUpperCase());
        }
        await prisma.activity.create({
            data: {
                userId,
                action: 'backup_codes_generated',
                resource: 'Security',
                details: 'New backup codes generated'
            }
        });
        return codes;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map