import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  notifications: NotificationSettings;
  security: SecuritySettings;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  email: {
    commissionEarned: boolean;
    payoutProcessed: boolean;
    accountUpdates: boolean;
    marketingEmails: boolean;
    systemAlerts: boolean;
  };
  push: {
    commissionEarned: boolean;
    payoutProcessed: boolean;
    accountUpdates: boolean;
    systemAlerts: boolean;
  };
  sms: {
    payoutProcessed: boolean;
    securityAlerts: boolean;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
  loginAlerts: boolean;
  sessionTimeout: number;
  allowedIPs: string[];
  passwordLastChanged: Date;
  lastPasswordChange: Date;
}

export interface UserPreferences {
  dashboard: {
    defaultView: 'OVERVIEW' | 'DETAILED' | 'CUSTOM';
    widgets: string[];
    refreshInterval: number;
  };
  reports: {
    defaultFormat: 'PDF' | 'CSV' | 'EXCEL';
    includeCharts: boolean;
    autoSchedule: boolean;
  };
  affiliate: {
    showPersonalInfo: boolean;
    allowDirectContact: boolean;
    publicProfile: boolean;
  };
}

export class ProfileModel {
  static async createProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
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
    }) as UserProfile;
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    return await prisma.userProfile.findUnique({
      where: { userId }
    }) as UserProfile | null;
  }

  static async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return await prisma.userProfile.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as UserProfile;
  }

  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    // Update profile security settings
    await this.updateProfile(userId, {
      security: {
        passwordLastChanged: new Date(),
        lastPasswordChange: new Date()
      }
    });

    return true;
  }

  static async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<UserProfile> {
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

  static async updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): Promise<UserProfile> {
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

  static async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserProfile> {
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

  static async uploadAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    return await this.updateProfile(userId, { avatar: avatarUrl });
  }

  static async enableTwoFactor(userId: string, secret: string, backupCodes: string[]): Promise<UserProfile> {
    return await this.updateSecuritySettings(userId, {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
      backupCodes
    });
  }

  static async disableTwoFactor(userId: string): Promise<UserProfile> {
    return await this.updateSecuritySettings(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      backupCodes: undefined
    });
  }

  static async addAllowedIP(userId: string, ipAddress: string): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const allowedIPs = [...profile.security.allowedIPs, ipAddress];
    return await this.updateSecuritySettings(userId, { allowedIPs });
  }

  static async removeAllowedIP(userId: string, ipAddress: string): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const allowedIPs = profile.security.allowedIPs.filter(ip => ip !== ipAddress);
    return await this.updateSecuritySettings(userId, { allowedIPs });
  }

  static async getPublicProfile(userId: string): Promise<any> {
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

  static async searchProfiles(query: string, filters: any = {}, page: number = 1, limit: number = 20): Promise<UserProfile[]> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (query) {
      where.OR = [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } }
      ];
    }

    if (filters.timezone) where.timezone = filters.timezone;
    if (filters.language) where.language = filters.language;
    if (filters.currency) where.currency = filters.currency;

    return await prisma.userProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    }) as UserProfile[];
  }

  static async getProfileStats(userId: string): Promise<any> {
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

  static async deleteProfile(userId: string): Promise<void> {
    await prisma.userProfile.delete({
      where: { userId }
    });
  }

  static async exportProfileData(userId: string): Promise<any> {
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


