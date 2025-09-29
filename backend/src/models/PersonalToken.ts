import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface PersonalToken {
  id: string;
  userId: string;
  name: string;
  description?: string;
  token: string;
  permissions: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenUsage {
  id: string;
  tokenId: string;
  endpoint: string;
  method: string;
  ipAddress: string;
  userAgent: string;
  responseStatus: number;
  responseTime: number;
  timestamp: Date;
}

export class PersonalTokenModel {
  static async create(data: Partial<PersonalToken>): Promise<PersonalToken> {
    const token = this.generateToken();
    
    return await prisma.personalToken.create({
      data: {
        userId: data.userId!,
        name: data.name!,
        description: data.description,
        token,
        permissions: data.permissions || [],
        expiresAt: data.expiresAt,
        status: 'ACTIVE'
      }
    }) as PersonalToken;
  }

  static async findById(id: string): Promise<PersonalToken | null> {
    return await prisma.personalToken.findUnique({
      where: { id }
    }) as PersonalToken | null;
  }

  static async findByToken(token: string): Promise<PersonalToken | null> {
    return await prisma.personalToken.findUnique({
      where: { token }
    }) as PersonalToken | null;
  }

  static async findByUserId(userId: string): Promise<PersonalToken[]> {
    return await prisma.personalToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }) as PersonalToken[];
  }

  static async update(id: string, data: Partial<PersonalToken>): Promise<PersonalToken> {
    return await prisma.personalToken.update({
      where: { id },
      data
    }) as PersonalToken;
  }

  static async delete(id: string): Promise<void> {
    await prisma.personalToken.delete({
      where: { id }
    });
  }

  static async revoke(id: string): Promise<PersonalToken> {
    return await this.update(id, { status: 'INACTIVE' });
  }

  static async regenerate(id: string): Promise<PersonalToken> {
    const newToken = this.generateToken();
    return await this.update(id, { 
      token: newToken,
      lastUsedAt: null,
      status: 'ACTIVE'
    });
  }

  static async validateToken(token: string): Promise<{ valid: boolean; token?: PersonalToken; error?: string }> {
    const personalToken = await this.findByToken(token);
    
    if (!personalToken) {
      return { valid: false, error: 'Token not found' };
    }

    if (personalToken.status !== 'ACTIVE') {
      return { valid: false, error: 'Token is inactive' };
    }

    if (personalToken.expiresAt && new Date() > personalToken.expiresAt) {
      // Mark as expired
      await this.update(personalToken.id, { status: 'EXPIRED' });
      return { valid: false, error: 'Token has expired' };
    }

    return { valid: true, token: personalToken };
  }

  static async checkPermission(token: string, permission: string): Promise<boolean> {
    const validation = await this.validateToken(token);
    
    if (!validation.valid || !validation.token) {
      return false;
    }

    return validation.token.permissions.includes(permission) || validation.token.permissions.includes('*');
  }

  static async recordUsage(tokenId: string, endpoint: string, method: string, ipAddress: string, userAgent: string, responseStatus: number, responseTime: number): Promise<TokenUsage> {
    // Update last used timestamp
    await this.update(tokenId, { lastUsedAt: new Date() });

    // Record usage
    return await prisma.tokenUsage.create({
      data: {
        tokenId,
        endpoint,
        method,
        ipAddress,
        userAgent,
        responseStatus,
        responseTime,
        timestamp: new Date()
      }
    }) as TokenUsage;
  }

  static async getTokenUsage(tokenId: string, page: number = 1, limit: number = 50): Promise<TokenUsage[]> {
    const skip = (page - 1) * limit;
    return await prisma.tokenUsage.findMany({
      where: { tokenId },
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' }
    }) as TokenUsage[];
  }

  static async getTokenStats(tokenId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = { tokenId };
    
    if (startDate && endDate) {
      where.timestamp = {
        gte: startDate,
        lte: endDate
      };
    }

    const usage = await prisma.tokenUsage.findMany({
      where
    });

    const stats = {
      totalRequests: usage.length,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      byEndpoint: {} as Record<string, any>,
      byMethod: {} as Record<string, any>,
      byHour: {} as Record<number, any>,
      byDay: {} as Record<string, any>
    };

    let totalResponseTime = 0;

    usage.forEach(record => {
      // Count successful/failed requests
      if (record.responseStatus >= 200 && record.responseStatus < 400) {
        stats.successfulRequests++;
      } else {
        stats.failedRequests++;
      }

      totalResponseTime += record.responseTime;

      // By endpoint
      if (!stats.byEndpoint[record.endpoint]) {
        stats.byEndpoint[record.endpoint] = { total: 0, success: 0, failed: 0, avgTime: 0 };
      }
      stats.byEndpoint[record.endpoint].total++;
      if (record.responseStatus >= 200 && record.responseStatus < 400) {
        stats.byEndpoint[record.endpoint].success++;
      } else {
        stats.byEndpoint[record.endpoint].failed++;
      }

      // By method
      stats.byMethod[record.method] = (stats.byMethod[record.method] || 0) + 1;

      // By hour
      const hour = record.timestamp.getHours();
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

      // By day
      const day = record.timestamp.toISOString().split('T')[0];
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
    });

    // Calculate average response time
    stats.averageResponseTime = usage.length > 0 ? totalResponseTime / usage.length : 0;

    // Calculate average response time by endpoint
    Object.keys(stats.byEndpoint).forEach(endpoint => {
      const endpointUsage = usage.filter(u => u.endpoint === endpoint);
      const endpointTotalTime = endpointUsage.reduce((sum, u) => sum + u.responseTime, 0);
      stats.byEndpoint[endpoint].avgTime = endpointUsage.length > 0 ? endpointTotalTime / endpointUsage.length : 0;
    });

    return stats;
  }

  static async getAvailablePermissions(): Promise<string[]> {
    return [
      'affiliates:read',
      'affiliates:write',
      'affiliates:delete',
      'offers:read',
      'offers:write',
      'offers:delete',
      'conversions:read',
      'conversions:write',
      'clicks:read',
      'payouts:read',
      'payouts:write',
      'reports:read',
      'analytics:read',
      'webhooks:read',
      'webhooks:write',
      'webhooks:delete',
      'settings:read',
      'settings:write',
      'users:read',
      'users:write',
      'users:delete',
      '*'
    ];
  }

  static async createDefaultTokens(userId: string): Promise<PersonalToken[]> {
    const defaultTokens = [
      {
        name: 'Full Access Token',
        description: 'Full access to all API endpoints',
        permissions: ['*'],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      },
      {
        name: 'Read Only Token',
        description: 'Read-only access to all endpoints',
        permissions: [
          'affiliates:read',
          'offers:read',
          'conversions:read',
          'clicks:read',
          'payouts:read',
          'reports:read',
          'analytics:read'
        ],
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      },
      {
        name: 'Affiliate Management Token',
        description: 'Access to affiliate management endpoints',
        permissions: [
          'affiliates:read',
          'affiliates:write',
          'conversions:read',
          'payouts:read',
          'reports:read'
        ],
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days
      }
    ];

    const createdTokens: PersonalToken[] = [];
    for (const tokenData of defaultTokens) {
      const token = await this.create({
        userId,
        ...tokenData
      });
      createdTokens.push(token);
    }

    return createdTokens;
  }

  private static generateToken(): string {
    return `td_${crypto.randomBytes(32).toString('hex')}`;
  }

  static async cleanupExpiredTokens(): Promise<number> {
    const expiredTokens = await prisma.personalToken.findMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        status: 'ACTIVE'
      }
    });

    for (const token of expiredTokens) {
      await this.update(token.id, { status: 'EXPIRED' });
    }

    return expiredTokens.length;
  }

  static async getTokenHealth(): Promise<any> {
    const totalTokens = await prisma.personalToken.count();
    const activeTokens = await prisma.personalToken.count({
      where: { status: 'ACTIVE' }
    });
    const expiredTokens = await prisma.personalToken.count({
      where: { status: 'EXPIRED' }
    });
    const inactiveTokens = await prisma.personalToken.count({
      where: { status: 'INACTIVE' }
    });

    const recentlyUsed = await prisma.personalToken.count({
      where: {
        lastUsedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    return {
      total: totalTokens,
      active: activeTokens,
      expired: expiredTokens,
      inactive: inactiveTokens,
      recentlyUsed,
      healthPercentage: totalTokens > 0 ? (activeTokens / totalTokens) * 100 : 0
    };
  }
}


