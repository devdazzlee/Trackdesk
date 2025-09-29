import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface QualityRule {
  id: string;
  name: string;
  description: string;
  type: 'TRAFFIC_QUALITY' | 'CONVERSION_QUALITY' | 'AFFILIATE_QUALITY' | 'OFFER_QUALITY';
  conditions: QualityCondition[];
  actions: QualityAction[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface QualityCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN' | 'NOT_IN';
  value: any;
  weight: number;
}

export interface QualityAction {
  type: 'APPROVE' | 'REJECT' | 'FLAG' | 'REQUIRE_REVIEW' | 'PAUSE_AFFILIATE' | 'SEND_NOTIFICATION';
  parameters: Record<string, any>;
}

export interface QualityCheck {
  id: string;
  ruleId: string;
  type: string;
  data: any;
  score: number;
  status: 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED';
  action: string;
  affiliateId?: string;
  clickId?: string;
  conversionId?: string;
  offerId?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface QualityMetrics {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  reviewRequired: number;
  passRate: number;
  byType: Record<string, any>;
  byAffiliate: Record<string, any>;
  byOffer: Record<string, any>;
}

export class QualityControlModel {
  static async createRule(data: Partial<QualityRule>): Promise<QualityRule> {
    return await prisma.qualityRule.create({
      data: {
        name: data.name!,
        description: data.description || '',
        type: data.type!,
        conditions: data.conditions || [],
        actions: data.actions || [],
        status: data.status || 'ACTIVE',
      }
    }) as QualityRule;
  }

  static async findRuleById(id: string): Promise<QualityRule | null> {
    return await prisma.qualityRule.findUnique({
      where: { id }
    }) as QualityRule | null;
  }

  static async updateRule(id: string, data: Partial<QualityRule>): Promise<QualityRule> {
    return await prisma.qualityRule.update({
      where: { id },
      data
    }) as QualityRule;
  }

  static async deleteRule(id: string): Promise<void> {
    await prisma.qualityRule.delete({
      where: { id }
    });
  }

  static async listRules(filters: any = {}): Promise<QualityRule[]> {
    const where: any = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;

    return await prisma.qualityRule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as QualityRule[];
  }

  static async performQualityCheck(data: any, type: string, affiliateId?: string, clickId?: string, conversionId?: string, offerId?: string): Promise<QualityCheck[]> {
    const activeRules = await this.listRules({ status: 'ACTIVE' });
    const qualityChecks: QualityCheck[] = [];

    for (const rule of activeRules) {
      if (rule.type !== type) continue;

      const score = this.calculateQualityScore(rule, data);
      const status = this.determineQualityStatus(score, rule);
      const action = this.executeQualityActions(rule.actions, data);

      const qualityCheck = await prisma.qualityCheck.create({
        data: {
          ruleId: rule.id,
          type: rule.type,
          data,
          score,
          status,
          action,
          affiliateId,
          clickId,
          conversionId,
          offerId
        }
      }) as QualityCheck;

      qualityChecks.push(qualityCheck);
    }

    return qualityChecks;
  }

  private static calculateQualityScore(rule: QualityRule, data: any): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const condition of rule.conditions) {
      const conditionScore = this.evaluateCondition(condition, data);
      totalScore += conditionScore * condition.weight;
      totalWeight += condition.weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private static evaluateCondition(condition: QualityCondition, data: any): number {
    const fieldValue = this.getFieldValue(data, condition.field);
    
    switch (condition.operator) {
      case 'EQUALS':
        return fieldValue === condition.value ? 1 : 0;
      case 'NOT_EQUALS':
        return fieldValue !== condition.value ? 1 : 0;
      case 'GREATER_THAN':
        return Number(fieldValue) > Number(condition.value) ? 1 : 0;
      case 'LESS_THAN':
        return Number(fieldValue) < Number(condition.value) ? 1 : 0;
      case 'BETWEEN':
        const [min, max] = Array.isArray(condition.value) ? condition.value : [0, 0];
        return Number(fieldValue) >= min && Number(fieldValue) <= max ? 1 : 0;
      case 'IN':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue) ? 1 : 0;
      case 'NOT_IN':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue) ? 1 : 0;
      default:
        return 0;
    }
  }

  private static getFieldValue(data: any, field: string): any {
    const fields = field.split('.');
    let value = data;
    
    for (const f of fields) {
      value = value?.[f];
    }
    
    return value;
  }

  private static determineQualityStatus(score: number, rule: QualityRule): 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED' {
    if (score >= 0.8) return 'PASSED';
    if (score >= 0.5) return 'REVIEW_REQUIRED';
    return 'FAILED';
  }

  private static executeQualityActions(actions: QualityAction[], data: any): string {
    const executedActions: string[] = [];

    for (const action of actions) {
      switch (action.type) {
        case 'APPROVE':
          executedActions.push('APPROVED');
          break;
        case 'REJECT':
          executedActions.push('REJECTED');
          break;
        case 'FLAG':
          executedActions.push('FLAGGED');
          break;
        case 'REQUIRE_REVIEW':
          executedActions.push('REVIEW_REQUIRED');
          break;
        case 'PAUSE_AFFILIATE':
          executedActions.push('AFFILIATE_PAUSED');
          break;
        case 'SEND_NOTIFICATION':
          executedActions.push('NOTIFICATION_SENT');
          break;
      }
    }

    return executedActions.join(', ');
  }

  static async getQualityChecks(filters: any = {}, page: number = 1, limit: number = 50): Promise<QualityCheck[]> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.affiliateId) where.affiliateId = filters.affiliateId;
    if (filters.offerId) where.offerId = filters.offerId;
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: filters.startDate,
        lte: filters.endDate
      };
    }

    return await prisma.qualityCheck.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }) as QualityCheck[];
  }

  static async updateQualityCheckStatus(id: string, status: string, reviewedBy: string): Promise<QualityCheck> {
    return await prisma.qualityCheck.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy
      }
    }) as QualityCheck;
  }

  static async getQualityMetrics(startDate?: Date, endDate?: Date): Promise<QualityMetrics> {
    const where: any = {};
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const checks = await prisma.qualityCheck.findMany({
      where,
      include: {
        affiliate: {
          include: {
            user: true
          }
        },
        offer: true
      }
    });

    const metrics: QualityMetrics = {
      totalChecks: checks.length,
      passedChecks: 0,
      failedChecks: 0,
      reviewRequired: 0,
      passRate: 0,
      byType: {},
      byAffiliate: {},
      byOffer: {}
    };

    // Count by status
    checks.forEach(check => {
      switch (check.status) {
        case 'PASSED':
          metrics.passedChecks++;
          break;
        case 'FAILED':
          metrics.failedChecks++;
          break;
        case 'REVIEW_REQUIRED':
          metrics.reviewRequired++;
          break;
      }

      // By type
      if (!metrics.byType[check.type]) {
        metrics.byType[check.type] = { total: 0, passed: 0, failed: 0, review: 0 };
      }
      metrics.byType[check.type].total++;
      if (check.status === 'PASSED') metrics.byType[check.type].passed++;
      else if (check.status === 'FAILED') metrics.byType[check.type].failed++;
      else if (check.status === 'REVIEW_REQUIRED') metrics.byType[check.type].review++;

      // By affiliate
      if (check.affiliateId) {
        if (!metrics.byAffiliate[check.affiliateId]) {
          metrics.byAffiliate[check.affiliateId] = {
            total: 0,
            passed: 0,
            failed: 0,
            review: 0,
            name: check.affiliate?.user ? `${check.affiliate.user.firstName} ${check.affiliate.user.lastName}` : 'Unknown'
          };
        }
        metrics.byAffiliate[check.affiliateId].total++;
        if (check.status === 'PASSED') metrics.byAffiliate[check.affiliateId].passed++;
        else if (check.status === 'FAILED') metrics.byAffiliate[check.affiliateId].failed++;
        else if (check.status === 'REVIEW_REQUIRED') metrics.byAffiliate[check.affiliateId].review++;
      }

      // By offer
      if (check.offerId) {
        if (!metrics.byOffer[check.offerId]) {
          metrics.byOffer[check.offerId] = {
            total: 0,
            passed: 0,
            failed: 0,
            review: 0,
            name: check.offer?.name || 'Unknown'
          };
        }
        metrics.byOffer[check.offerId].total++;
        if (check.status === 'PASSED') metrics.byOffer[check.offerId].passed++;
        else if (check.status === 'FAILED') metrics.byOffer[check.offerId].failed++;
        else if (check.status === 'REVIEW_REQUIRED') metrics.byOffer[check.offerId].review++;
      }
    });

    // Calculate pass rate
    metrics.passRate = metrics.totalChecks > 0 ? (metrics.passedChecks / metrics.totalChecks) * 100 : 0;

    return metrics;
  }

  static async createDefaultRules(): Promise<QualityRule[]> {
    const defaultRules = [
      {
        name: 'Traffic Quality Check',
        description: 'Checks for high-quality traffic indicators',
        type: 'TRAFFIC_QUALITY' as const,
        conditions: [
          { field: 'bounce_rate', operator: 'LESS_THAN' as const, value: 0.7, weight: 1 },
          { field: 'session_duration', operator: 'GREATER_THAN' as const, value: 30, weight: 1 },
          { field: 'pages_per_session', operator: 'GREATER_THAN' as const, value: 2, weight: 1 }
        ],
        actions: [{ type: 'APPROVE' as const, parameters: {} }]
      },
      {
        name: 'Conversion Quality Check',
        description: 'Validates conversion quality and legitimacy',
        type: 'CONVERSION_QUALITY' as const,
        conditions: [
          { field: 'conversion_time', operator: 'GREATER_THAN' as const, value: 60, weight: 1 },
          { field: 'conversion_value', operator: 'GREATER_THAN' as const, value: 0, weight: 1 },
          { field: 'customer_info_complete', operator: 'EQUALS' as const, value: true, weight: 1 }
        ],
        actions: [{ type: 'APPROVE' as const, parameters: {} }]
      },
      {
        name: 'Affiliate Quality Check',
        description: 'Monitors affiliate performance and compliance',
        type: 'AFFILIATE_QUALITY' as const,
        conditions: [
          { field: 'conversion_rate', operator: 'GREATER_THAN' as const, value: 0.01, weight: 1 },
          { field: 'complaint_count', operator: 'LESS_THAN' as const, value: 5, weight: 1 },
          { field: 'compliance_score', operator: 'GREATER_THAN' as const, value: 0.8, weight: 1 }
        ],
        actions: [{ type: 'APPROVE' as const, parameters: {} }]
      }
    ];

    const createdRules: QualityRule[] = [];
    for (const ruleData of defaultRules) {
      const rule = await this.createRule(ruleData);
      createdRules.push(rule);
    }

    return createdRules;
  }
}


