import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { EmailService } from './EmailService';
import { SecurityService } from './SecurityService';

const prisma = new PrismaClient();
const emailService = new EmailService();
const securityService = new SecurityService();

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'AFFILIATE' | 'MANAGER';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  language?: string;
}

export class AuthService {
  async register(data: RegisterData) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'AFFILIATE'
      }
    });

    // Create profile based on role
    if (data.role === 'AFFILIATE' || !data.role) {
      await prisma.affiliateProfile.create({
        data: {
          userId: user.id
        }
      });
    } else if (data.role === 'ADMIN') {
      await prisma.adminProfile.create({
        data: {
          userId: user.id,
          permissions: ['all']
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: 'user_registered',
        resource: 'User Account',
        details: `User registered with role: ${user.role}`,
        ipAddress: '127.0.0.1', // This should be passed from the controller
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

  async login(data: LoginData, ipAddress?: string, userAgent?: string) {
    // Find user
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

    // Check password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    // Log activity
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

  async logout(userId: string) {
    // Invalidate all sessions for the user
    await prisma.session.deleteMany({
      where: { userId }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        action: 'user_logout',
        resource: 'User Account',
        details: 'User logged out'
      }
    });
  }

  async getProfile(userId: string) {
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

  async updateProfile(userId: string, data: UpdateProfileData) {
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

    // Log activity
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

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        action: 'password_changed',
        resource: 'User Account',
        details: 'Password changed successfully'
      }
    });
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token (you might want to create a separate table for this)
    // For now, we'll use a simple approach
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        // You might want to add resetToken and resetTokenExpires fields to your schema
      }
    });

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    // Verify token and get user
    // This is a simplified implementation
    // In production, you'd want to store reset tokens in a separate table
    
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));
    
    // Update password (you'd need to implement proper token verification)
    // await prisma.user.update({ where: { resetToken: token }, data: { password: hashedPassword } });
  }

  async enable2FA(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        action: '2fa_enabled',
        resource: 'Security',
        details: 'Two-factor authentication enabled'
      }
    });
  }

  async disable2FA(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        action: '2fa_disabled',
        resource: 'Security',
        details: 'Two-factor authentication disabled'
      }
    });
  }

  async generateBackupCodes(userId: string) {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Store backup codes (you might want to create a separate table for this)
    // For now, we'll return them

    // Log activity
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
