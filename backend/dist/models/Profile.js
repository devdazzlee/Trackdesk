"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
class ProfileModel {
    static async createProfile(userId, data) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return await prisma.userProfile.create({
            data: {
                userId,
                firstName: data.firstName || user.firstName,
                lastName: data.lastName || user.lastName,
                email: data.email || user.email,
                phone: data.phone,
                avatar: data.avatar,
                timezone: data.timezone || 'UTC',
                language: data.language || 'en',
                dateFormat: data.dateFormat || 'MM/DD/YYYY',
                currency: data.currency || 'USD',
                notifications: data.notifications || {
                    email: {
                        commissionEarned: true,
                        payoutProcessed: true,
                        accountUpdates: true,
                        marketingEmails: false,
                        systemAlerts: true
                    },
                    push: {
                        commissionEarned: true,
                        payoutProcessed: true,
                        accountUpdates: true,
                        systemAlerts: true
                    },
                    sms: {
                        payoutProcessed: false,
                        securityAlerts: true
                    }
                },
                security: data.security || {
                    twoFactorEnabled: false,
                    loginAlerts: true,
                    sessionTimeout: 30,
                    allowedIPs: [],
                    passwordLastChanged: new Date(),
                    lastPasswordChange: new Date()
                },
                preferences: data.preferences || {
                    dashboard: {
                        defaultView: 'OVERVIEW',
                        widgets: ['earnings', 'clicks', 'conversions', 'offers'],
                        refreshInterval: 30
                    },
                    reports: {
                        defaultFormat: 'PDF',
                        includeCharts: true,
                        autoSchedule: false
                    },
                    affiliate: {
                        showPersonalInfo: true,
                        allowDirectContact: true,
                        publicProfile: false
                    }
                }
            }
        });
    }
    static async getProfile(userId) {
        return await prisma.userProfile.findUnique({
            where: { userId }
        });
    }
    static async updateProfile(userId, data) {
        return await prisma.userProfile.update({
            where: { userId },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async updatePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
        await this.updateProfile(userId, {
            security: {
                passwordLastChanged: new Date(),
                lastPasswordChange: new Date()
            }
        });
        return true;
    }
    static async updateNotificationSettings(userId, settings) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        const updatedNotifications = {
            ...profile.notifications,
            ...settings
        };
        return await this.updateProfile(userId, {
            notifications: updatedNotifications
        });
    }
    static async updateSecuritySettings(userId, settings) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        const updatedSecurity = {
            ...profile.security,
            ...settings
        };
        return await this.updateProfile(userId, {
            security: updatedSecurity
        });
    }
    static async updatePreferences(userId, preferences) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        const updatedPreferences = {
            ...profile.preferences,
            ...preferences
        };
        return await this.updateProfile(userId, {
            preferences: updatedPreferences
        });
    }
    static async uploadAvatar(userId, avatarUrl) {
        return await this.updateProfile(userId, { avatar: avatarUrl });
    }
    static async enableTwoFactor(userId, secret, backupCodes) {
        return await this.updateSecuritySettings(userId, {
            twoFactorEnabled: true,
            twoFactorSecret: secret,
            backupCodes
        });
    }
    static async disableTwoFactor(userId) {
        return await this.updateSecuritySettings(userId, {
            twoFactorEnabled: false,
            twoFactorSecret: undefined,
            backupCodes: undefined
        });
    }
    static async addAllowedIP(userId, ipAddress) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        const allowedIPs = [...profile.security.allowedIPs, ipAddress];
        return await this.updateSecuritySettings(userId, { allowedIPs });
    }
    static async removeAllowedIP(userId, ipAddress) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        const allowedIPs = profile.security.allowedIPs.filter(ip => ip !== ipAddress);
        return await this.updateSecuritySettings(userId, { allowedIPs });
    }
    static async getPublicProfile(userId) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            return null;
        }
        const affiliate = await prisma.affiliateProfile.findUnique({
            where: { userId },
            include: {
                user: true
            }
        });
        return {
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            avatar: profile.avatar,
            timezone: profile.timezone,
            language: profile.language,
            currency: profile.currency,
            affiliate: affiliate ? {
                companyName: affiliate.companyName,
                website: affiliate.website,
                totalEarnings: affiliate.totalEarnings,
                totalClicks: affiliate.totalClicks,
                totalConversions: affiliate.totalConversions,
                tier: affiliate.tier
            } : null,
            preferences: profile.preferences.affiliate
        };
    }
    static async searchProfiles(query, filters = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {};
        if (query) {
            where.OR = [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { email: { contains: query } }
            ];
        }
        if (filters.timezone)
            where.timezone = filters.timezone;
        if (filters.language)
            where.language = filters.language;
        if (filters.currency)
            where.currency = filters.currency;
        return await prisma.userProfile.findMany({
            where,
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' }
        });
    }
    static async getProfileStats(userId) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            return null;
        }
        const affiliate = await prisma.affiliateProfile.findUnique({
            where: { userId }
        });
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        return {
            profile,
            affiliate,
            user: {
                id: user?.id,
                email: user?.email,
                role: user?.role,
                status: user?.status,
                createdAt: user?.createdAt,
                lastLoginAt: user?.lastLoginAt
            },
            security: {
                twoFactorEnabled: profile.security.twoFactorEnabled,
                loginAlerts: profile.security.loginAlerts,
                allowedIPsCount: profile.security.allowedIPs.length,
                passwordAge: Math.floor((Date.now() - profile.security.lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24))
            },
            notifications: profile.notifications,
            preferences: profile.preferences
        };
    }
    static async deleteProfile(userId) {
        await prisma.userProfile.delete({
            where: { userId }
        });
    }
    static async exportProfileData(userId) {
        const profile = await this.getProfile(userId);
        if (!profile) {
            return null;
        }
        const affiliate = await prisma.affiliateProfile.findUnique({
            where: { userId }
        });
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        return {
            profile,
            affiliate,
            user: {
                id: user?.id,
                email: user?.email,
                role: user?.role,
                status: user?.status,
                createdAt: user?.createdAt,
                lastLoginAt: user?.lastLoginAt
            },
            exportedAt: new Date().toISOString()
        };
    }
}
exports.ProfileModel = ProfileModel;
//# sourceMappingURL=Profile.js.map