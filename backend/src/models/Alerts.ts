import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Alert {
  id: string;
  accountId: string;
  name: string;
  description: string;
  type: 'SYSTEM' | 'PERFORMANCE' | 'SECURITY' | 'BUSINESS' | 'COMPLIANCE' | 'CUSTOM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'INACTIVE' | 'TRIGGERED' | 'RESOLVED';
  conditions: AlertCondition[];
  actions: AlertAction[];
  recipients: string[];
  cooldownPeriod: number; // minutes
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'NOT_CONTAINS' | 'IN' | 'NOT_IN' | 'BETWEEN';
  value: any;
  threshold?: number;
  timeWindow?: number; // minutes
}

export interface AlertAction {
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK' | 'SLACK' | 'DISCORD' | 'CUSTOM';
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface AlertEvent {
  id: string;
  alertId: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  data: any;
  status: 'TRIGGERED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED';
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface AlertSubscription {
  id: string;
  userId: string;
  alertId: string;
  notificationMethods: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AlertsModel {
  static async create(data: Partial<Alert>): Promise<Alert> {
    return await prisma.alert.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        description: data.description || '',
        type: data.type!,
        severity: data.severity || 'MEDIUM',
        status: data.status || 'ACTIVE',
        conditions: data.conditions || [],
        actions: data.actions || [],
        recipients: data.recipients || [],
        cooldownPeriod: data.cooldownPeriod || 60,
        triggerCount: 0
      }
    }) as Alert;
  }

  static async findById(id: string): Promise<Alert | null> {
    return await prisma.alert.findUnique({
      where: { id }
    }) as Alert | null;
  }

  static async update(id: string, data: Partial<Alert>): Promise<Alert> {
    return await prisma.alert.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as Alert;
  }

  static async delete(id: string): Promise<void> {
    await prisma.alert.delete({
      where: { id }
    });
  }

  static async list(accountId: string, filters: any = {}): Promise<Alert[]> {
    const where: any = { accountId };
    
    if (filters.type) where.type = filters.type;
    if (filters.severity) where.severity = filters.severity;
    if (filters.status) where.status = filters.status;

    return await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as Alert[];
  }

  static async triggerAlert(alertId: string, data: any): Promise<AlertEvent> {
    const alert = await this.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.status !== 'ACTIVE') {
      throw new Error('Alert is not active');
    }

    // Check cooldown period
    if (alert.lastTriggered) {
      const timeSinceLastTrigger = Date.now() - alert.lastTriggered.getTime();
      const cooldownMs = alert.cooldownPeriod * 60 * 1000;
      
      if (timeSinceLastTrigger < cooldownMs) {
        throw new Error('Alert is in cooldown period');
      }
    }

    // Create alert event
    const alertEvent = await prisma.alertEvent.create({
      data: {
        alertId,
        type: alert.type,
        severity: alert.severity,
        title: alert.name,
        message: alert.description,
        data,
        status: 'TRIGGERED',
        triggeredAt: new Date()
      }
    }) as AlertEvent;

    // Update alert
    await this.update(alertId, {
      status: 'TRIGGERED',
      lastTriggered: new Date(),
      triggerCount: { increment: 1 }
    });

    // Execute actions
    await this.executeActions(alert, alertEvent);

    return alertEvent;
  }

  private static async executeActions(alert: Alert, event: AlertEvent): Promise<void> {
    for (const action of alert.actions) {
      if (!action.enabled) continue;

      try {
        switch (action.type) {
          case 'EMAIL':
            await this.sendEmailAlert(alert, event, action.parameters);
            break;
          case 'SMS':
            await this.sendSMSAlert(alert, event, action.parameters);
            break;
          case 'PUSH':
            await this.sendPushAlert(alert, event, action.parameters);
            break;
          case 'WEBHOOK':
            await this.sendWebhookAlert(alert, event, action.parameters);
            break;
          case 'SLACK':
            await this.sendSlackAlert(alert, event, action.parameters);
            break;
          case 'DISCORD':
            await this.sendDiscordAlert(alert, event, action.parameters);
            break;
          case 'CUSTOM':
            await this.executeCustomAction(alert, event, action.parameters);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute alert action ${action.type}:`, error);
      }
    }
  }

  private static async sendEmailAlert(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for sending email alerts
    console.log('Sending email alert:', { alert: alert.name, event: event.title });
  }

  private static async sendSMSAlert(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for sending SMS alerts
    console.log('Sending SMS alert:', { alert: alert.name, event: event.title });
  }

  private static async sendPushAlert(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for sending push notifications
    console.log('Sending push alert:', { alert: alert.name, event: event.title });
  }

  private static async sendWebhookAlert(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for sending webhook alerts
    console.log('Sending webhook alert:', { alert: alert.name, event: event.title });
  }

  private static async sendSlackAlert(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for sending Slack alerts
    console.log('Sending Slack alert:', { alert: alert.name, event: event.title });
  }

  private static async sendDiscordAlert(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for sending Discord alerts
    console.log('Sending Discord alert:', { alert: alert.name, event: event.title });
  }

  private static async executeCustomAction(alert: Alert, event: AlertEvent, parameters: any): Promise<void> {
    // Implementation for custom actions
    console.log('Executing custom action:', { alert: alert.name, event: event.title });
  }

  static async acknowledgeEvent(eventId: string, userId: string, notes?: string): Promise<AlertEvent> {
    return await prisma.alertEvent.update({
      where: { id: eventId },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date(),
        acknowledgedBy: userId,
        notes
      }
    }) as AlertEvent;
  }

  static async resolveEvent(eventId: string, userId: string, notes?: string): Promise<AlertEvent> {
    const event = await prisma.alertEvent.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new Error('Alert event not found');
    }

    const updatedEvent = await prisma.alertEvent.update({
      where: { id: eventId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedBy: userId,
        notes
      }
    }) as AlertEvent;

    // Update alert status if all events are resolved
    const activeEvents = await prisma.alertEvent.count({
      where: {
        alertId: event.alertId,
        status: { in: ['TRIGGERED', 'ACKNOWLEDGED'] }
      }
    });

    if (activeEvents === 0) {
      await this.update(event.alertId, { status: 'RESOLVED' });
    }

    return updatedEvent;
  }

  static async getEvents(alertId: string, filters: any = {}, page: number = 1, limit: number = 50): Promise<AlertEvent[]> {
    const skip = (page - 1) * limit;
    const where: any = { alertId };
    
    if (filters.status) where.status = filters.status;
    if (filters.severity) where.severity = filters.severity;
    if (filters.startDate && filters.endDate) {
      where.triggeredAt = {
        gte: filters.startDate,
        lte: filters.endDate
      };
    }

    return await prisma.alertEvent.findMany({
      where,
      skip,
      take: limit,
      orderBy: { triggeredAt: 'desc' }
    }) as AlertEvent[];
  }

  static async subscribeToAlert(userId: string, alertId: string, notificationMethods: string[]): Promise<AlertSubscription> {
    return await prisma.alertSubscription.create({
      data: {
        userId,
        alertId,
        notificationMethods,
        isActive: true
      }
    }) as AlertSubscription;
  }

  static async unsubscribeFromAlert(userId: string, alertId: string): Promise<void> {
    await prisma.alertSubscription.updateMany({
      where: { userId, alertId },
      data: { isActive: false }
    });
  }

  static async getUserSubscriptions(userId: string): Promise<AlertSubscription[]> {
    return await prisma.alertSubscription.findMany({
      where: { userId, isActive: true },
      include: {
        alert: true
      }
    }) as AlertSubscription[];
  }

  static async getAlertStats(accountId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = { accountId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const alerts = await prisma.alert.findMany({
      where
    });

    const events = await prisma.alertEvent.findMany({
      where: {
        alert: { accountId }
      }
    });

    const stats = {
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length,
      triggeredAlerts: alerts.filter(a => a.status === 'TRIGGERED').length,
      resolvedAlerts: alerts.filter(a => a.status === 'RESOLVED').length,
      totalEvents: events.length,
      eventsByType: {} as Record<string, number>,
      eventsBySeverity: {} as Record<string, number>,
      eventsByStatus: {} as Record<string, number>,
      topAlerts: [] as Array<{ alertId: string; name: string; count: number }>
    };

    // Count events by type, severity, and status
    events.forEach(event => {
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
      stats.eventsBySeverity[event.severity] = (stats.eventsBySeverity[event.severity] || 0) + 1;
      stats.eventsByStatus[event.status] = (stats.eventsByStatus[event.status] || 0) + 1;
    });

    // Top alerts by event count
    const alertEventCounts: Record<string, number> = {};
    events.forEach(event => {
      alertEventCounts[event.alertId] = (alertEventCounts[event.alertId] || 0) + 1;
    });

    stats.topAlerts = Object.entries(alertEventCounts)
      .map(([alertId, count]) => {
        const alert = alerts.find(a => a.id === alertId);
        return {
          alertId,
          name: alert?.name || 'Unknown',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  static async createDefaultAlerts(accountId: string): Promise<Alert[]> {
    const defaultAlerts = [
      {
        name: 'High Conversion Rate',
        description: 'Alert when conversion rate exceeds 10%',
        type: 'PERFORMANCE' as const,
        severity: 'MEDIUM' as const,
        conditions: [
          {
            field: 'conversion_rate',
            operator: 'GREATER_THAN' as const,
            value: 10,
            timeWindow: 60
          }
        ],
        actions: [
          {
            type: 'EMAIL' as const,
            parameters: { template: 'high_conversion_rate' },
            enabled: true
          }
        ],
        recipients: ['admin@trackdesk.com'],
        cooldownPeriod: 120
      },
      {
        name: 'Low Traffic',
        description: 'Alert when traffic drops below 100 clicks per hour',
        type: 'PERFORMANCE' as const,
        severity: 'HIGH' as const,
        conditions: [
          {
            field: 'clicks_per_hour',
            operator: 'LESS_THAN' as const,
            value: 100,
            timeWindow: 60
          }
        ],
        actions: [
          {
            type: 'EMAIL' as const,
            parameters: { template: 'low_traffic' },
            enabled: true
          },
          {
            type: 'SLACK' as const,
            parameters: { channel: '#alerts' },
            enabled: true
          }
        ],
        recipients: ['admin@trackdesk.com'],
        cooldownPeriod: 60
      },
      {
        name: 'Security Breach',
        description: 'Alert when suspicious activity is detected',
        type: 'SECURITY' as const,
        severity: 'CRITICAL' as const,
        conditions: [
          {
            field: 'failed_login_attempts',
            operator: 'GREATER_THAN' as const,
            value: 10,
            timeWindow: 15
          }
        ],
        actions: [
          {
            type: 'EMAIL' as const,
            parameters: { template: 'security_breach' },
            enabled: true
          },
          {
            type: 'SMS' as const,
            parameters: { phone: '+1234567890' },
            enabled: true
          },
          {
            type: 'WEBHOOK' as const,
            parameters: { url: 'https://security.trackdesk.com/webhook' },
            enabled: true
          }
        ],
        recipients: ['security@trackdesk.com'],
        cooldownPeriod: 0
      }
    ];

    const createdAlerts: Alert[] = [];
    for (const alertData of defaultAlerts) {
      const alert = await this.create({
        accountId,
        ...alertData
      });
      createdAlerts.push(alert);
    }

    return createdAlerts;
  }

  static async testAlert(alertId: string): Promise<AlertEvent> {
    const alert = await this.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test alert'
    };

    return await this.triggerAlert(alertId, testData);
  }

  static async getAlertDashboard(accountId: string): Promise<any> {
    const alerts = await this.list(accountId);
    const recentEvents = await prisma.alertEvent.findMany({
      where: {
        alert: { accountId }
      },
      orderBy: { triggeredAt: 'desc' },
      take: 10
    });

    const stats = await this.getAlertStats(accountId);

    return {
      alerts,
      recentEvents,
      stats
    };
  }
}


