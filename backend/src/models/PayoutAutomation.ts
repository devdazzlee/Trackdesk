import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PayoutRule {
  id: string;
  accountId: string;
  name: string;
  description: string;
  conditions: PayoutCondition[];
  actions: PayoutAction[];
  schedule: PayoutSchedule;
  status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN' | 'NOT_IN';
  value: any;
  logic: 'AND' | 'OR';
}

export interface PayoutAction {
  type: 'CREATE_PAYOUT' | 'SEND_NOTIFICATION' | 'UPDATE_STATUS' | 'WEBHOOK' | 'EMAIL' | 'SMS';
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface PayoutSchedule {
  type: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  time: string;
  timezone: string;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  customCron?: string;
}

export interface PayoutAutomation {
  id: string;
  accountId: string;
  name: string;
  description: string;
  rules: PayoutRule[];
  settings: AutomationSettings;
  status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationSettings {
  maxPayoutsPerRun: number;
  maxPayoutAmount: number;
  minPayoutAmount: number;
  allowedPaymentMethods: string[];
  requireApproval: boolean;
  autoApprove: boolean;
  notificationSettings: {
    onSuccess: boolean;
    onFailure: boolean;
    onPayoutCreated: boolean;
    recipients: string[];
  };
  retrySettings: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
}

export interface PayoutAutomationLog {
  id: string;
  automationId: string;
  ruleId: string;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  message: string;
  data: any;
  executionTime: number;
  timestamp: Date;
}

export class PayoutAutomationModel {
  static async createAutomation(data: Partial<PayoutAutomation>): Promise<PayoutAutomation> {
    return await prisma.payoutAutomation.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        description: data.description || '',
        rules: data.rules || [],
        settings: data.settings || {
          maxPayoutsPerRun: 100,
          maxPayoutAmount: 10000,
          minPayoutAmount: 10,
          allowedPaymentMethods: [],
          requireApproval: false,
          autoApprove: true,
          notificationSettings: {
            onSuccess: true,
            onFailure: true,
            onPayoutCreated: true,
            recipients: []
          },
          retrySettings: {
            maxRetries: 3,
            retryDelay: 5,
            backoffMultiplier: 2
          }
        },
        status: data.status || 'ACTIVE'
      }
    }) as PayoutAutomation;
  }

  static async findById(id: string): Promise<PayoutAutomation | null> {
    return await prisma.payoutAutomation.findUnique({
      where: { id }
    }) as PayoutAutomation | null;
  }

  static async update(id: string, data: Partial<PayoutAutomation>): Promise<PayoutAutomation> {
    return await prisma.payoutAutomation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as PayoutAutomation;
  }

  static async delete(id: string): Promise<void> {
    await prisma.payoutAutomation.delete({
      where: { id }
    });
  }

  static async list(accountId: string, filters: any = {}): Promise<PayoutAutomation[]> {
    const where: any = { accountId };
    
    if (filters.status) where.status = filters.status;

    return await prisma.payoutAutomation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as PayoutAutomation[];
  }

  static async executeAutomation(automationId: string): Promise<{ success: boolean; message: string; payoutsCreated: number }> {
    const automation = await this.findById(automationId);
    if (!automation) {
      throw new Error('Automation not found');
    }

    if (automation.status !== 'ACTIVE') {
      throw new Error('Automation is not active');
    }

    const startTime = Date.now();
    let payoutsCreated = 0;
    let errors: string[] = [];

    try {
      // Get eligible affiliates
      const eligibleAffiliates = await this.getEligibleAffiliates(automation);
      
      for (const affiliate of eligibleAffiliates) {
        try {
          // Check if affiliate meets conditions for any rule
          for (const rule of automation.rules) {
            if (await this.evaluateRule(rule, affiliate)) {
              // Execute rule actions
              await this.executeRuleActions(rule, affiliate, automation);
              payoutsCreated++;
              break; // Only execute one rule per affiliate
            }
          }
        } catch (error: any) {
          errors.push(`Failed to process affiliate ${affiliate.id}: ${error.message}`);
        }
      }

      // Update automation last run
      await this.update(automationId, {
        lastRun: new Date(),
        nextRun: this.calculateNextRun(automation)
      });

      // Log execution
      await this.logExecution(automationId, 'EXECUTE_AUTOMATION', 'SUCCESS', 
        `Automation executed successfully. Created ${payoutsCreated} payouts.`, 
        { payoutsCreated, errors }, Date.now() - startTime);

      return {
        success: true,
        message: `Automation executed successfully. Created ${payoutsCreated} payouts.`,
        payoutsCreated
      };

    } catch (error: any) {
      // Log failure
      await this.logExecution(automationId, 'EXECUTE_AUTOMATION', 'FAILED', 
        error.message, { errors }, Date.now() - startTime);

      return {
        success: false,
        message: error.message,
        payoutsCreated
      };
    }
  }

  private static async getEligibleAffiliates(automation: PayoutAutomation): Promise<any[]> {
    const settings = automation.settings;
    
    // Get affiliates with pending balances
    const affiliates = await prisma.affiliateProfile.findMany({
      where: {
        status: 'ACTIVE',
        totalEarnings: {
          gte: settings.minPayoutAmount
        }
      },
      include: {
        user: true,
        balance: true
      }
    });

    // Filter by payment method if specified
    if (settings.allowedPaymentMethods.length > 0) {
      return affiliates.filter(affiliate => 
        settings.allowedPaymentMethods.includes(affiliate.preferredPaymentMethod || '')
      );
    }

    return affiliates;
  }

  private static async evaluateRule(rule: PayoutRule, affiliate: any): Promise<boolean> {
    if (rule.conditions.length === 0) {
      return true;
    }

    let result = true;
    let logic = 'AND';

    for (const condition of rule.conditions) {
      const conditionResult = await this.evaluateCondition(condition, affiliate);
      
      if (logic === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }
      
      logic = condition.logic;
    }

    return result;
  }

  private static async evaluateCondition(condition: PayoutCondition, affiliate: any): Promise<boolean> {
    const value = this.getFieldValue(affiliate, condition.field);
    
    switch (condition.operator) {
      case 'EQUALS':
        return value === condition.value;
      case 'NOT_EQUALS':
        return value !== condition.value;
      case 'GREATER_THAN':
        return Number(value) > Number(condition.value);
      case 'LESS_THAN':
        return Number(value) < Number(condition.value);
      case 'BETWEEN':
        const [min, max] = Array.isArray(condition.value) ? condition.value : [0, 0];
        return Number(value) >= min && Number(value) <= max;
      case 'IN':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'NOT_IN':
        return Array.isArray(condition.value) && !condition.value.includes(value);
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

  private static async executeRuleActions(rule: PayoutRule, affiliate: any, automation: PayoutAutomation): Promise<void> {
    for (const action of rule.actions) {
      if (!action.enabled) continue;

      try {
        switch (action.type) {
          case 'CREATE_PAYOUT':
            await this.createPayout(affiliate, action.parameters, automation);
            break;
          case 'SEND_NOTIFICATION':
            await this.sendNotification(affiliate, action.parameters);
            break;
          case 'UPDATE_STATUS':
            await this.updateStatus(affiliate, action.parameters);
            break;
          case 'WEBHOOK':
            await this.callWebhook(affiliate, action.parameters);
            break;
          case 'EMAIL':
            await this.sendEmail(affiliate, action.parameters);
            break;
          case 'SMS':
            await this.sendSMS(affiliate, action.parameters);
            break;
        }
      } catch (error: any) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }

  private static async createPayout(affiliate: any, parameters: any, automation: PayoutAutomation): Promise<void> {
    const amount = Math.min(affiliate.totalEarnings, automation.settings.maxPayoutAmount);
    
    if (amount < automation.settings.minPayoutAmount) {
      return;
    }

    const payout = await prisma.payout.create({
      data: {
        affiliateId: affiliate.id,
        amount,
        currency: 'USD',
        method: parameters.paymentMethod || 'PAYPAL',
        status: automation.settings.autoApprove ? 'APPROVED' : 'PENDING',
        paymentDetails: parameters.paymentDetails || {},
        requestedAt: new Date(),
        approvedAt: automation.settings.autoApprove ? new Date() : undefined,
        approvedBy: automation.settings.autoApprove ? 'system' : undefined
      }
    });

    // Update affiliate balance
    await prisma.balance.update({
      where: { affiliateId: affiliate.id },
      data: {
        openBalance: { decrement: amount },
        pendingBalance: { increment: amount }
      }
    });
  }

  private static async sendNotification(affiliate: any, parameters: any): Promise<void> {
    // Implementation for sending notifications
    console.log('Sending notification to affiliate:', affiliate.id);
  }

  private static async updateStatus(affiliate: any, parameters: any): Promise<void> {
    await prisma.affiliateProfile.update({
      where: { id: affiliate.id },
      data: { status: parameters.status }
    });
  }

  private static async callWebhook(affiliate: any, parameters: any): Promise<void> {
    // Implementation for calling webhooks
    console.log('Calling webhook for affiliate:', affiliate.id);
  }

  private static async sendEmail(affiliate: any, parameters: any): Promise<void> {
    // Implementation for sending emails
    console.log('Sending email to affiliate:', affiliate.id);
  }

  private static async sendSMS(affiliate: any, parameters: any): Promise<void> {
    // Implementation for sending SMS
    console.log('Sending SMS to affiliate:', affiliate.id);
  }

  private static calculateNextRun(automation: PayoutAutomation): Date {
    const now = new Date();
    
    // This is a simplified implementation
    // In a real system, you'd use a proper cron scheduler
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next day
  }

  static async logExecution(automationId: string, action: string, status: string, message: string, data: any, executionTime: number): Promise<PayoutAutomationLog> {
    return await prisma.payoutAutomationLog.create({
      data: {
        automationId,
        ruleId: 'system',
        action,
        status: status as any,
        message,
        data,
        executionTime,
        timestamp: new Date()
      }
    }) as PayoutAutomationLog;
  }

  static async getExecutionLogs(automationId: string, page: number = 1, limit: number = 50): Promise<PayoutAutomationLog[]> {
    const skip = (page - 1) * limit;
    return await prisma.payoutAutomationLog.findMany({
      where: { automationId },
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' }
    }) as PayoutAutomationLog[];
  }

  static async getAutomationStats(accountId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = { accountId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const automations = await prisma.payoutAutomation.findMany({
      where
    });

    const logs = await prisma.payoutAutomationLog.findMany({
      where: {
        automation: { accountId }
      }
    });

    const stats = {
      totalAutomations: automations.length,
      activeAutomations: automations.filter(a => a.status === 'ACTIVE').length,
      totalExecutions: logs.length,
      successfulExecutions: logs.filter(l => l.status === 'SUCCESS').length,
      failedExecutions: logs.filter(l => l.status === 'FAILED').length,
      averageExecutionTime: 0,
      byStatus: {} as Record<string, number>,
      byAction: {} as Record<string, number>
    };

    // Calculate average execution time
    if (logs.length > 0) {
      stats.averageExecutionTime = logs.reduce((sum, log) => sum + log.executionTime, 0) / logs.length;
    }

    // Count by status and action
    logs.forEach(log => {
      stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
    });

    return stats;
  }

  static async createDefaultAutomation(accountId: string): Promise<PayoutAutomation> {
    const defaultRules: PayoutRule[] = [
      {
        name: 'Weekly Payout Rule',
        description: 'Automatically create payouts for affiliates with minimum balance',
        conditions: [
          {
            field: 'totalEarnings',
            operator: 'GREATER_THAN',
            value: 50,
            logic: 'AND'
          }
        ],
        actions: [
          {
            type: 'CREATE_PAYOUT',
            parameters: {
              paymentMethod: 'PAYPAL'
            },
            enabled: true
          },
          {
            type: 'SEND_NOTIFICATION',
            parameters: {
              template: 'payout_created'
            },
            enabled: true
          }
        ],
        schedule: {
          type: 'WEEKLY',
          time: '09:00',
          timezone: 'UTC',
          daysOfWeek: [1] // Monday
        },
        status: 'ACTIVE',
        priority: 1
      }
    ];

    return await this.createAutomation({
      accountId,
      name: 'Default Payout Automation',
      description: 'Automatically process payouts for eligible affiliates',
      rules: defaultRules,
      settings: {
        maxPayoutsPerRun: 100,
        maxPayoutAmount: 5000,
        minPayoutAmount: 50,
        allowedPaymentMethods: ['PAYPAL', 'BANK_TRANSFER'],
        requireApproval: false,
        autoApprove: true,
        notificationSettings: {
          onSuccess: true,
          onFailure: true,
          onPayoutCreated: true,
          recipients: ['admin@trackdesk.com']
        },
        retrySettings: {
          maxRetries: 3,
          retryDelay: 5,
          backoffMultiplier: 2
        }
      }
    });
  }

  static async pauseAutomation(id: string): Promise<PayoutAutomation> {
    return await this.update(id, { status: 'PAUSED' });
  }

  static async resumeAutomation(id: string): Promise<PayoutAutomation> {
    return await this.update(id, { status: 'ACTIVE' });
  }

  static async testAutomation(id: string): Promise<{ success: boolean; message: string; testResults: any }> {
    const automation = await this.findById(id);
    if (!automation) {
      return { success: false, message: 'Automation not found', testResults: {} };
    }

    try {
      // Get a sample of eligible affiliates
      const eligibleAffiliates = await this.getEligibleAffiliates(automation);
      const sampleSize = Math.min(5, eligibleAffiliates.length);
      const sampleAffiliates = eligibleAffiliates.slice(0, sampleSize);

      const testResults = {
        totalEligibleAffiliates: eligibleAffiliates.length,
        sampleSize,
        sampleResults: []
      };

      for (const affiliate of sampleAffiliates) {
        const result = {
          affiliateId: affiliate.id,
          affiliateName: `${affiliate.user.firstName} ${affiliate.user.lastName}`,
          totalEarnings: affiliate.totalEarnings,
          rulesMatched: []
        };

        for (const rule of automation.rules) {
          const matches = await this.evaluateRule(rule, affiliate);
          result.rulesMatched.push({
            ruleName: rule.name,
            matches
          });
        }

        testResults.sampleResults.push(result);
      }

      return {
        success: true,
        message: 'Automation test completed successfully',
        testResults
      };

    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        testResults: {}
      };
    }
  }

  static async getAutomationDashboard(accountId: string): Promise<any> {
    const automations = await this.list(accountId);
    const stats = await this.getAutomationStats(accountId);
    const recentLogs = await prisma.payoutAutomationLog.findMany({
      where: {
        automation: { accountId }
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return {
      automations,
      stats,
      recentLogs
    };
  }
}


