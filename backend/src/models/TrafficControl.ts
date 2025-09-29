import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TrafficRule {
  id: string;
  name: string;
  description: string;
  type: 'GEO_BLOCKING' | 'IP_BLOCKING' | 'DEVICE_BLOCKING' | 'RATE_LIMITING' | 'TRAFFIC_SOURCE' | 'TIME_BASED';
  conditions: TrafficCondition[];
  actions: TrafficAction[];
  priority: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface TrafficCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'BETWEEN';
  value: any;
  weight: number;
}

export interface TrafficAction {
  type: 'ALLOW' | 'BLOCK' | 'REDIRECT' | 'THROTTLE' | 'CAPTCHA' | 'NOTIFY';
  parameters: Record<string, any>;
}

export interface TrafficEvent {
  id: string;
  ruleId: string;
  type: string;
  data: any;
  action: string;
  ipAddress: string;
  userAgent: string;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
  affiliateId?: string;
  clickId?: string;
  timestamp: Date;
}

export interface TrafficStats {
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  redirectedRequests: number;
  throttledRequests: number;
  byRule: Record<string, any>;
  byCountry: Record<string, any>;
  byDevice: Record<string, any>;
  byHour: Record<number, any>;
  topIPs: Array<{ ip: string; count: number; action: string }>;
}

export class TrafficControlModel {
  static async createRule(data: Partial<TrafficRule>): Promise<TrafficRule> {
    return await prisma.trafficRule.create({
      data: {
        name: data.name!,
        description: data.description || '',
        type: data.type!,
        conditions: data.conditions || [],
        actions: data.actions || [],
        priority: data.priority || 1,
        status: data.status || 'ACTIVE',
      }
    }) as TrafficRule;
  }

  static async findRuleById(id: string): Promise<TrafficRule | null> {
    return await prisma.trafficRule.findUnique({
      where: { id }
    }) as TrafficRule | null;
  }

  static async updateRule(id: string, data: Partial<TrafficRule>): Promise<TrafficRule> {
    return await prisma.trafficRule.update({
      where: { id },
      data
    }) as TrafficRule;
  }

  static async deleteRule(id: string): Promise<void> {
    await prisma.trafficRule.delete({
      where: { id }
    });
  }

  static async listRules(filters: any = {}): Promise<TrafficRule[]> {
    const where: any = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;

    return await prisma.trafficRule.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    }) as TrafficRule[];
  }

  static async processTraffic(data: any, ipAddress: string, userAgent: string, affiliateId?: string, clickId?: string): Promise<TrafficEvent> {
    const activeRules = await this.listRules({ status: 'ACTIVE' });
    
    // Sort rules by priority (highest first)
    activeRules.sort((a, b) => b.priority - a.priority);

    for (const rule of activeRules) {
      const matches = this.evaluateRule(rule, data);
      
      if (matches) {
        const action = this.executeTrafficAction(rule.actions[0], data);
        
        const trafficEvent = await prisma.trafficEvent.create({
          data: {
            ruleId: rule.id,
            type: rule.type,
            data,
            action: action.type,
            ipAddress,
            userAgent,
            country: data.country,
            device: data.device,
            browser: data.browser,
            os: data.os,
            affiliateId,
            clickId,
            timestamp: new Date()
          }
        }) as TrafficEvent;

        return trafficEvent;
      }
    }

    // Default action if no rules match
    const defaultEvent = await prisma.trafficEvent.create({
      data: {
        ruleId: 'default',
        type: 'DEFAULT',
        data,
        action: 'ALLOW',
        ipAddress,
        userAgent,
        country: data.country,
        device: data.device,
        browser: data.browser,
        os: data.os,
        affiliateId,
        clickId,
        timestamp: new Date()
      }
    }) as TrafficEvent;

    return defaultEvent;
  }

  private static evaluateRule(rule: TrafficRule, data: any): boolean {
    for (const condition of rule.conditions) {
      const fieldValue = this.getFieldValue(data, condition.field);
      const matches = this.evaluateCondition(condition, fieldValue);
      
      if (!matches) {
        return false;
      }
    }
    
    return true;
  }

  private static evaluateCondition(condition: TrafficCondition, fieldValue: any): boolean {
    switch (condition.operator) {
      case 'EQUALS':
        return fieldValue === condition.value;
      case 'NOT_EQUALS':
        return fieldValue !== condition.value;
      case 'CONTAINS':
        return String(fieldValue).includes(String(condition.value));
      case 'NOT_CONTAINS':
        return !String(fieldValue).includes(String(condition.value));
      case 'GREATER_THAN':
        return Number(fieldValue) > Number(condition.value);
      case 'LESS_THAN':
        return Number(fieldValue) < Number(condition.value);
      case 'IN':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'NOT_IN':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'BETWEEN':
        const [min, max] = Array.isArray(condition.value) ? condition.value : [0, 0];
        return Number(fieldValue) >= min && Number(fieldValue) <= max;
      default:
        return false;
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

  private static executeTrafficAction(action: TrafficAction, data: any): TrafficAction {
    // Execute the action logic here
    // This could involve redirecting, blocking, throttling, etc.
    return action;
  }

  static async getTrafficEvents(filters: any = {}, page: number = 1, limit: number = 50): Promise<TrafficEvent[]> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.type) where.type = filters.type;
    if (filters.action) where.action = filters.action;
    if (filters.affiliateId) where.affiliateId = filters.affiliateId;
    if (filters.country) where.country = filters.country;
    if (filters.startDate && filters.endDate) {
      where.timestamp = {
        gte: filters.startDate,
        lte: filters.endDate
      };
    }

    return await prisma.trafficEvent.findMany({
      where,
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' }
    }) as TrafficEvent[];
  }

  static async getTrafficStats(startDate?: Date, endDate?: Date): Promise<TrafficStats> {
    const where: any = {};
    
    if (startDate && endDate) {
      where.timestamp = {
        gte: startDate,
        lte: endDate
      };
    }

    const events = await prisma.trafficEvent.findMany({
      where
    });

    const stats: TrafficStats = {
      totalRequests: events.length,
      allowedRequests: 0,
      blockedRequests: 0,
      redirectedRequests: 0,
      throttledRequests: 0,
      byRule: {},
      byCountry: {},
      byDevice: {},
      byHour: {},
      topIPs: []
    };

    // Count by action
    events.forEach(event => {
      switch (event.action) {
        case 'ALLOW':
          stats.allowedRequests++;
          break;
        case 'BLOCK':
          stats.blockedRequests++;
          break;
        case 'REDIRECT':
          stats.redirectedRequests++;
          break;
        case 'THROTTLE':
          stats.throttledRequests++;
          break;
      }

      // By rule
      if (!stats.byRule[event.ruleId]) {
        stats.byRule[event.ruleId] = { total: 0, allowed: 0, blocked: 0, redirected: 0, throttled: 0 };
      }
      stats.byRule[event.ruleId].total++;
      if (event.action === 'ALLOW') stats.byRule[event.ruleId].allowed++;
      else if (event.action === 'BLOCK') stats.byRule[event.ruleId].blocked++;
      else if (event.action === 'REDIRECT') stats.byRule[event.ruleId].redirected++;
      else if (event.action === 'THROTTLE') stats.byRule[event.ruleId].throttled++;

      // By country
      if (event.country) {
        if (!stats.byCountry[event.country]) {
          stats.byCountry[event.country] = { total: 0, allowed: 0, blocked: 0 };
        }
        stats.byCountry[event.country].total++;
        if (event.action === 'ALLOW') stats.byCountry[event.country].allowed++;
        else if (event.action === 'BLOCK') stats.byCountry[event.country].blocked++;
      }

      // By device
      if (event.device) {
        if (!stats.byDevice[event.device]) {
          stats.byDevice[event.device] = { total: 0, allowed: 0, blocked: 0 };
        }
        stats.byDevice[event.device].total++;
        if (event.action === 'ALLOW') stats.byDevice[event.device].allowed++;
        else if (event.action === 'BLOCK') stats.byDevice[event.device].blocked++;
      }

      // By hour
      const hour = event.timestamp.getHours();
      if (!stats.byHour[hour]) {
        stats.byHour[hour] = { total: 0, allowed: 0, blocked: 0 };
      }
      stats.byHour[hour].total++;
      if (event.action === 'ALLOW') stats.byHour[hour].allowed++;
      else if (event.action === 'BLOCK') stats.byHour[hour].blocked++;
    });

    // Top IPs
    const ipCounts: Record<string, { count: number; action: string }> = {};
    events.forEach(event => {
      if (!ipCounts[event.ipAddress]) {
        ipCounts[event.ipAddress] = { count: 0, action: event.action };
      }
      ipCounts[event.ipAddress].count++;
    });

    stats.topIPs = Object.entries(ipCounts)
      .map(([ip, data]) => ({ ip, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  static async createDefaultRules(): Promise<TrafficRule[]> {
    const defaultRules = [
      {
        name: 'Block Suspicious Countries',
        description: 'Blocks traffic from high-risk countries',
        type: 'GEO_BLOCKING' as const,
        conditions: [
          { field: 'country', operator: 'IN' as const, value: ['CN', 'RU', 'KP', 'IR'], weight: 1 }
        ],
        actions: [{ type: 'BLOCK' as const, parameters: { reason: 'Country blocked' } }],
        priority: 10
      },
      {
        name: 'Rate Limiting',
        description: 'Limits requests per IP per hour',
        type: 'RATE_LIMITING' as const,
        conditions: [
          { field: 'requests_per_hour', operator: 'GREATER_THAN' as const, value: 1000, weight: 1 }
        ],
        actions: [{ type: 'THROTTLE' as const, parameters: { delay: 5000 } }],
        priority: 5
      },
      {
        name: 'Block Bot Traffic',
        description: 'Blocks known bot user agents',
        type: 'DEVICE_BLOCKING' as const,
        conditions: [
          { field: 'user_agent', operator: 'CONTAINS' as const, value: 'bot', weight: 1 },
          { field: 'user_agent', operator: 'CONTAINS' as const, value: 'crawler', weight: 1 },
          { field: 'user_agent', operator: 'CONTAINS' as const, value: 'spider', weight: 1 }
        ],
        actions: [{ type: 'BLOCK' as const, parameters: { reason: 'Bot detected' } }],
        priority: 8
      },
      {
        name: 'Time-based Blocking',
        description: 'Blocks traffic during maintenance hours',
        type: 'TIME_BASED' as const,
        conditions: [
          { field: 'hour', operator: 'BETWEEN' as const, value: [2, 4], weight: 1 }
        ],
        actions: [{ type: 'BLOCK' as const, parameters: { reason: 'Maintenance hours' } }],
        priority: 3
      }
    ];

    const createdRules: TrafficRule[] = [];
    for (const ruleData of defaultRules) {
      const rule = await this.createRule(ruleData);
      createdRules.push(rule);
    }

    return createdRules;
  }
}


