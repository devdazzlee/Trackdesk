import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MLMStructure {
  id: string;
  name: string;
  maxTiers: number;
  commissionRates: MLMCommissionRate[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface MLMCommissionRate {
  tier: number;
  rate: number;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
}

export interface MLMRelationship {
  id: string;
  affiliateId: string;
  parentId?: string;
  tier: number;
  path: string; // e.g., "1.2.3" for hierarchy path
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface MLMCommission {
  id: string;
  conversionId: string;
  affiliateId: string;
  tier: number;
  amount: number;
  rate: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
}

export class MLMModel {
  static async createStructure(data: Partial<MLMStructure>): Promise<MLMStructure> {
    return await prisma.mlmStructure.create({
      data: {
        name: data.name!,
        maxTiers: data.maxTiers!,
        commissionRates: data.commissionRates || [],
        status: data.status || 'ACTIVE',
      }
    }) as MLMStructure;
  }

  static async findStructureById(id: string): Promise<MLMStructure | null> {
    return await prisma.mlmStructure.findUnique({
      where: { id }
    }) as MLMStructure | null;
  }

  static async updateStructure(id: string, data: Partial<MLMStructure>): Promise<MLMStructure> {
    return await prisma.mlmStructure.update({
      where: { id },
      data
    }) as MLMStructure;
  }

  static async createRelationship(data: Partial<MLMRelationship>): Promise<MLMRelationship> {
    return await prisma.mlmRelationship.create({
      data: {
        affiliateId: data.affiliateId!,
        parentId: data.parentId,
        tier: data.tier!,
        path: data.path!,
        status: data.status || 'ACTIVE',
      }
    }) as MLMRelationship;
  }

  static async findRelationshipByAffiliate(affiliateId: string): Promise<MLMRelationship | null> {
    return await prisma.mlmRelationship.findUnique({
      where: { affiliateId }
    }) as MLMRelationship | null;
  }

  static async getDownline(affiliateId: string, maxTiers: number = 10): Promise<MLMRelationship[]> {
    const relationship = await this.findRelationshipByAffiliate(affiliateId);
    if (!relationship) {
      return [];
    }

    const pathPattern = `${relationship.path}.%`;
    return await prisma.mlmRelationship.findMany({
      where: {
        path: {
          startsWith: relationship.path + '.'
        },
        tier: {
          lte: relationship.tier + maxTiers
        },
        status: 'ACTIVE'
      },
      orderBy: { tier: 'asc' }
    }) as MLMRelationship[];
  }

  static async getUpline(affiliateId: string): Promise<MLMRelationship[]> {
    const relationship = await this.findRelationshipByAffiliate(affiliateId);
    if (!relationship) {
      return [];
    }

    const pathParts = relationship.path.split('.');
    const upline: MLMRelationship[] = [];

    for (let i = pathParts.length - 1; i > 0; i--) {
      const parentPath = pathParts.slice(0, i).join('.');
      const parent = await prisma.mlmRelationship.findFirst({
        where: {
          path: parentPath,
          status: 'ACTIVE'
        }
      });
      
      if (parent) {
        upline.push(parent as MLMRelationship);
      }
    }

    return upline;
  }

  static async calculateMLMCommissions(conversionId: string, affiliateId: string, amount: number, structureId: string): Promise<MLMCommission[]> {
    const structure = await this.findStructureById(structureId);
    if (!structure) {
      throw new Error('MLM structure not found');
    }

    const commissions: MLMCommission[] = [];
    const upline = await this.getUpline(affiliateId);

    for (const member of upline) {
      if (member.tier > structure.maxTiers) {
        continue;
      }

      const commissionRate = structure.commissionRates.find(rate => rate.tier === member.tier);
      if (!commissionRate) {
        continue;
      }

      let commissionAmount = 0;
      if (commissionRate.type === 'PERCENTAGE') {
        commissionAmount = (amount * commissionRate.rate) / 100;
      } else {
        commissionAmount = commissionRate.rate;
      }

      const commission = await prisma.mlmCommission.create({
        data: {
          conversionId,
          affiliateId: member.affiliateId,
          tier: member.tier,
          amount: commissionAmount,
          rate: commissionRate.rate,
          status: 'PENDING'
        }
      }) as MLMCommission;

      commissions.push(commission);
    }

    return commissions;
  }

  static async getMLMStats(affiliateId: string): Promise<any> {
    const relationship = await this.findRelationshipByAffiliate(affiliateId);
    if (!relationship) {
      return {
        tier: 0,
        downlineCount: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        paidCommissions: 0
      };
    }

    const downline = await this.getDownline(affiliateId);
    const commissions = await prisma.mlmCommission.findMany({
      where: { affiliateId }
    });

    const totalCommissions = commissions.reduce((sum, comm) => sum + comm.amount, 0);
    const pendingCommissions = commissions
      .filter(comm => comm.status === 'PENDING')
      .reduce((sum, comm) => sum + comm.amount, 0);
    const paidCommissions = commissions
      .filter(comm => comm.status === 'PAID')
      .reduce((sum, comm) => sum + comm.amount, 0);

    return {
      tier: relationship.tier,
      downlineCount: downline.length,
      totalCommissions,
      pendingCommissions,
      paidCommissions,
      downlineByTier: downline.reduce((acc, member) => {
        acc[member.tier] = (acc[member.tier] || 0) + 1;
        return acc;
      }, {} as Record<number, number>)
    };
  }

  static async getMLMReport(structureId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = {};
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const commissions = await prisma.mlmCommission.findMany({
      where,
      include: {
        conversion: true,
        affiliate: {
          include: {
            user: true
          }
        }
      }
    });

    const stats = {
      totalCommissions: commissions.length,
      totalAmount: commissions.reduce((sum, comm) => sum + comm.amount, 0),
      byTier: {} as Record<number, any>,
      byAffiliate: {} as Record<string, any>,
      byStatus: {} as Record<string, any>
    };

    commissions.forEach(commission => {
      // By tier
      if (!stats.byTier[commission.tier]) {
        stats.byTier[commission.tier] = {
          count: 0,
          amount: 0
        };
      }
      stats.byTier[commission.tier].count++;
      stats.byTier[commission.tier].amount += commission.amount;

      // By affiliate
      if (!stats.byAffiliate[commission.affiliateId]) {
        stats.byAffiliate[commission.affiliateId] = {
          count: 0,
          amount: 0,
          name: commission.affiliate.user.firstName + ' ' + commission.affiliate.user.lastName
        };
      }
      stats.byAffiliate[commission.affiliateId].count++;
      stats.byAffiliate[commission.affiliateId].amount += commission.amount;

      // By status
      stats.byStatus[commission.status] = (stats.byStatus[commission.status] || 0) + 1;
    });

    return stats;
  }

  static async approveCommission(commissionId: string): Promise<MLMCommission> {
    return await prisma.mlmCommission.update({
      where: { id: commissionId },
      data: { status: 'APPROVED' }
    }) as MLMCommission;
  }

  static async payCommission(commissionId: string): Promise<MLMCommission> {
    return await prisma.mlmCommission.update({
      where: { id: commissionId },
      data: { status: 'PAID' }
    }) as MLMCommission;
  }
}


