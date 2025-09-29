import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CommunicationChannel {
  id: string;
  accountId: string;
  name: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'SLACK' | 'DISCORD' | 'WEBHOOK';
  settings: ChannelSettings;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelSettings {
  enabled: boolean;
  priority: number;
  deliveryTime: string;
  retryAttempts: number;
  retryDelay: number;
  customSettings: Record<string, any>;
}

export interface CommunicationTemplate {
  id: string;
  accountId: string;
  name: string;
  type: 'WELCOME' | 'COMMISSION_EARNED' | 'PAYOUT_PROCESSED' | 'ACCOUNT_UPDATE' | 'PROMOTIONAL' | 'SYSTEM_ALERT' | 'CUSTOM';
  channel: string;
  subject?: string;
  content: string;
  variables: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationMessage {
  id: string;
  accountId: string;
  templateId?: string;
  channel: string;
  recipientId: string;
  recipientType: 'AFFILIATE' | 'MANAGER' | 'ADMIN' | 'CUSTOM';
  subject?: string;
  content: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'BOUNCED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationCampaign {
  id: string;
  accountId: string;
  name: string;
  description: string;
  templateId: string;
  channel: string;
  recipientType: 'ALL_AFFILIATES' | 'SPECIFIC_AFFILIATES' | 'AFFILIATE_GROUP' | 'TIER_BASED' | 'CUSTOM_LIST';
  recipientIds: string[];
  filters: any;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED' | 'CANCELLED';
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationPreference {
  id: string;
  userId: string;
  channel: string;
  enabled: boolean;
  frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NEVER';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class AffiliateCommunicationModel {
  static async createChannel(data: Partial<CommunicationChannel>): Promise<CommunicationChannel> {
    return await prisma.communicationChannel.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        type: data.type!,
        settings: data.settings || {
          enabled: true,
          priority: 1,
          deliveryTime: 'immediate',
          retryAttempts: 3,
          retryDelay: 5,
          customSettings: {}
        },
        status: data.status || 'ACTIVE'
      }
    }) as CommunicationChannel;
  }

  static async findChannelById(id: string): Promise<CommunicationChannel | null> {
    return await prisma.communicationChannel.findUnique({
      where: { id }
    }) as CommunicationChannel | null;
  }

  static async updateChannel(id: string, data: Partial<CommunicationChannel>): Promise<CommunicationChannel> {
    return await prisma.communicationChannel.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as CommunicationChannel;
  }

  static async deleteChannel(id: string): Promise<void> {
    await prisma.communicationChannel.delete({
      where: { id }
    });
  }

  static async listChannels(accountId: string, filters: any = {}): Promise<CommunicationChannel[]> {
    const where: any = { accountId };
    
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;

    return await prisma.communicationChannel.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as CommunicationChannel[];
  }

  static async createTemplate(data: Partial<CommunicationTemplate>): Promise<CommunicationTemplate> {
    return await prisma.communicationTemplate.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        type: data.type!,
        channel: data.channel!,
        subject: data.subject,
        content: data.content!,
        variables: data.variables || [],
        status: data.status || 'DRAFT'
      }
    }) as CommunicationTemplate;
  }

  static async findTemplateById(id: string): Promise<CommunicationTemplate | null> {
    return await prisma.communicationTemplate.findUnique({
      where: { id }
    }) as CommunicationTemplate | null;
  }

  static async updateTemplate(id: string, data: Partial<CommunicationTemplate>): Promise<CommunicationTemplate> {
    return await prisma.communicationTemplate.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as CommunicationTemplate;
  }

  static async deleteTemplate(id: string): Promise<void> {
    await prisma.communicationTemplate.delete({
      where: { id }
    });
  }

  static async listTemplates(accountId: string, filters: any = {}): Promise<CommunicationTemplate[]> {
    const where: any = { accountId };
    
    if (filters.type) where.type = filters.type;
    if (filters.channel) where.channel = filters.channel;
    if (filters.status) where.status = filters.status;

    return await prisma.communicationTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as CommunicationTemplate[];
  }

  static async sendMessage(data: Partial<CommunicationMessage>): Promise<CommunicationMessage> {
    return await prisma.communicationMessage.create({
      data: {
        accountId: data.accountId!,
        templateId: data.templateId,
        channel: data.channel!,
        recipientId: data.recipientId!,
        recipientType: data.recipientType!,
        subject: data.subject,
        content: data.content!,
        status: 'PENDING',
        priority: data.priority || 'NORMAL',
        scheduledAt: data.scheduledAt,
        metadata: data.metadata || {}
      }
    }) as CommunicationMessage;
  }

  static async sendTemplateMessage(templateId: string, recipientId: string, recipientType: string, variables: Record<string, any>, accountId: string): Promise<CommunicationMessage> {
    const template = await this.findTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    let content = template.content;
    let subject = template.subject;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
      if (subject) {
        subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      }
    }

    return await this.sendMessage({
      accountId,
      templateId,
      channel: template.channel,
      recipientId,
      recipientType: recipientType as any,
      subject,
      content
    });
  }

  static async updateMessageStatus(id: string, status: string, additionalData?: any): Promise<CommunicationMessage> {
    const updateData: any = { status };
    
    switch (status) {
      case 'SENT':
        updateData.sentAt = new Date();
        break;
      case 'DELIVERED':
        updateData.deliveredAt = new Date();
        break;
      case 'READ':
        updateData.readAt = new Date();
        break;
      case 'FAILED':
        updateData.failedAt = new Date();
        updateData.errorMessage = additionalData?.errorMessage;
        break;
    }

    return await prisma.communicationMessage.update({
      where: { id },
      data: updateData
    }) as CommunicationMessage;
  }

  static async getMessages(filters: any = {}, page: number = 1, limit: number = 50): Promise<CommunicationMessage[]> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.accountId) where.accountId = filters.accountId;
    if (filters.recipientId) where.recipientId = filters.recipientId;
    if (filters.channel) where.channel = filters.channel;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: filters.startDate,
        lte: filters.endDate
      };
    }

    return await prisma.communicationMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }) as CommunicationMessage[];
  }

  static async createCampaign(data: Partial<CommunicationCampaign>): Promise<CommunicationCampaign> {
    return await prisma.communicationCampaign.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        description: data.description || '',
        templateId: data.templateId!,
        channel: data.channel!,
        recipientType: data.recipientType!,
        recipientIds: data.recipientIds || [],
        filters: data.filters || {},
        status: data.status || 'DRAFT',
        scheduledAt: data.scheduledAt,
        totalRecipients: data.totalRecipients || 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 0
      }
    }) as CommunicationCampaign;
  }

  static async findCampaignById(id: string): Promise<CommunicationCampaign | null> {
    return await prisma.communicationCampaign.findUnique({
      where: { id }
    }) as CommunicationCampaign | null;
  }

  static async updateCampaign(id: string, data: Partial<CommunicationCampaign>): Promise<CommunicationCampaign> {
    return await prisma.communicationCampaign.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as CommunicationCampaign;
  }

  static async deleteCampaign(id: string): Promise<void> {
    await prisma.communicationCampaign.delete({
      where: { id }
    });
  }

  static async listCampaigns(accountId: string, filters: any = {}): Promise<CommunicationCampaign[]> {
    const where: any = { accountId };
    
    if (filters.status) where.status = filters.status;
    if (filters.channel) where.channel = filters.channel;
    if (filters.recipientType) where.recipientType = filters.recipientType;

    return await prisma.communicationCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as CommunicationCampaign[];
  }

  static async executeCampaign(campaignId: string): Promise<void> {
    const campaign = await this.findCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'DRAFT' && campaign.status !== 'SCHEDULED') {
      throw new Error('Campaign is not in a sendable state');
    }

    // Update campaign status
    await this.updateCampaign(campaignId, { 
      status: 'SENDING',
      startedAt: new Date()
    });

    try {
      // Get recipients based on campaign type
      const recipients = await this.getCampaignRecipients(campaign);
      
      // Get template
      const template = await this.findTemplateById(campaign.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Send messages to all recipients
      for (const recipient of recipients) {
        const variables = await this.getRecipientVariables(recipient.id);
        await this.sendTemplateMessage(campaign.templateId, recipient.id, recipient.type, variables, campaign.accountId);
      }

      // Update campaign status
      await this.updateCampaign(campaignId, { 
        status: 'SENT',
        completedAt: new Date(),
        totalRecipients: recipients.length
      });

    } catch (error) {
      // Update campaign status to failed
      await this.updateCampaign(campaignId, { status: 'CANCELLED' });
      throw error;
    }
  }

  private static async getCampaignRecipients(campaign: CommunicationCampaign): Promise<Array<{ id: string; type: string }>> {
    switch (campaign.recipientType) {
      case 'ALL_AFFILIATES':
        const affiliates = await prisma.affiliateProfile.findMany({
          where: { status: 'ACTIVE' }
        });
        return affiliates.map(affiliate => ({
          id: affiliate.id,
          type: 'AFFILIATE'
        }));
      
      case 'SPECIFIC_AFFILIATES':
        return campaign.recipientIds.map(id => ({
          id,
          type: 'AFFILIATE'
        }));
      
      case 'TIER_BASED':
        const tierAffiliates = await prisma.affiliateProfile.findMany({
          where: {
            status: 'ACTIVE',
            tier: { in: campaign.filters.tierIds }
          }
        });
        return tierAffiliates.map(affiliate => ({
          id: affiliate.id,
          type: 'AFFILIATE'
        }));
      
      default:
        return [];
    }
  }

  private static async getRecipientVariables(recipientId: string): Promise<Record<string, any>> {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id: recipientId },
      include: {
        user: true
      }
    });

    if (!affiliate) {
      return {};
    }

    return {
      firstName: affiliate.user.firstName,
      lastName: affiliate.user.lastName,
      email: affiliate.user.email,
      companyName: affiliate.companyName,
      totalEarnings: affiliate.totalEarnings,
      totalClicks: affiliate.totalClicks,
      totalConversions: affiliate.totalConversions
    };
  }

  static async setCommunicationPreference(userId: string, channel: string, enabled: boolean, frequency: string, quietHours?: any): Promise<CommunicationPreference> {
    return await prisma.communicationPreference.upsert({
      where: { userId_channel: { userId, channel } },
      update: {
        enabled,
        frequency: frequency as any,
        quietHours: quietHours || {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'UTC'
        }
      },
      create: {
        userId,
        channel,
        enabled,
        frequency: frequency as any,
        quietHours: quietHours || {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'UTC'
        }
      }
    }) as CommunicationPreference;
  }

  static async getCommunicationPreferences(userId: string): Promise<CommunicationPreference[]> {
    return await prisma.communicationPreference.findMany({
      where: { userId }
    }) as CommunicationPreference[];
  }

  static async getCommunicationStats(accountId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = { accountId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const messages = await prisma.communicationMessage.findMany({
      where
    });

    const campaigns = await prisma.communicationCampaign.findMany({
      where: { accountId }
    });

    const stats = {
      totalMessages: messages.length,
      sentMessages: messages.filter(m => m.status === 'SENT').length,
      deliveredMessages: messages.filter(m => m.status === 'DELIVERED').length,
      readMessages: messages.filter(m => m.status === 'READ').length,
      failedMessages: messages.filter(m => m.status === 'FAILED').length,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'SENDING').length,
      completedCampaigns: campaigns.filter(c => c.status === 'SENT').length,
      byChannel: {} as Record<string, any>,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      deliveryRate: 0,
      readRate: 0
    };

    // Calculate rates
    if (stats.totalMessages > 0) {
      stats.deliveryRate = (stats.deliveredMessages / stats.totalMessages) * 100;
      stats.readRate = (stats.readMessages / stats.totalMessages) * 100;
    }

    // Count by channel, status, and priority
    messages.forEach(message => {
      if (!stats.byChannel[message.channel]) {
        stats.byChannel[message.channel] = { total: 0, sent: 0, delivered: 0, read: 0, failed: 0 };
      }
      stats.byChannel[message.channel].total++;
      if (message.status === 'SENT') stats.byChannel[message.channel].sent++;
      else if (message.status === 'DELIVERED') stats.byChannel[message.channel].delivered++;
      else if (message.status === 'READ') stats.byChannel[message.channel].read++;
      else if (message.status === 'FAILED') stats.byChannel[message.channel].failed++;

      stats.byStatus[message.status] = (stats.byStatus[message.status] || 0) + 1;
      stats.byPriority[message.priority] = (stats.byPriority[message.priority] || 0) + 1;
    });

    return stats;
  }

  static async createDefaultTemplates(accountId: string): Promise<CommunicationTemplate[]> {
    const defaultTemplates = [
      {
        name: 'Welcome Email',
        type: 'WELCOME' as const,
        channel: 'EMAIL',
        subject: 'Welcome to {{companyName}} Affiliate Program!',
        content: `
          <h1>Welcome {{firstName}}!</h1>
          <p>Thank you for joining the {{companyName}} affiliate program.</p>
          <p>Your affiliate ID is: {{affiliateId}}</p>
          <p>You can start promoting our products and earn commissions.</p>
          <p>Best regards,<br>The {{companyName}} Team</p>
        `,
        variables: ['firstName', 'companyName', 'affiliateId']
      },
      {
        name: 'Commission Earned',
        type: 'COMMISSION_EARNED' as const,
        channel: 'EMAIL',
        subject: 'You earned ${{amount}} commission!',
        content: `
          <h1>Commission Earned!</h1>
          <p>Congratulations {{firstName}}!</p>
          <p>You have earned ${{amount}} commission from {{offerName}}.</p>
          <p>Your total earnings are now ${{totalEarnings}}.</p>
          <p>Keep up the great work!</p>
        `,
        variables: ['firstName', 'amount', 'offerName', 'totalEarnings']
      },
      {
        name: 'Payout Processed',
        type: 'PAYOUT_PROCESSED' as const,
        channel: 'EMAIL',
        subject: 'Your payout of ${{amount}} has been processed',
        content: `
          <h1>Payout Processed</h1>
          <p>Hello {{firstName}},</p>
          <p>Your payout of ${{amount}} has been successfully processed via {{paymentMethod}}.</p>
          <p>Transaction ID: {{transactionId}}</p>
          <p>Thank you for your partnership!</p>
        `,
        variables: ['firstName', 'amount', 'paymentMethod', 'transactionId']
      }
    ];

    const createdTemplates: CommunicationTemplate[] = [];
    for (const templateData of defaultTemplates) {
      const template = await this.createTemplate({
        accountId,
        ...templateData
      });
      createdTemplates.push(template);
    }

    return createdTemplates;
  }

  static async createDefaultChannels(accountId: string): Promise<CommunicationChannel[]> {
    const defaultChannels = [
      {
        name: 'Email',
        type: 'EMAIL' as const,
        settings: {
          enabled: true,
          priority: 1,
          deliveryTime: 'immediate',
          retryAttempts: 3,
          retryDelay: 5,
          customSettings: {}
        }
      },
      {
        name: 'SMS',
        type: 'SMS' as const,
        settings: {
          enabled: true,
          priority: 2,
          deliveryTime: 'immediate',
          retryAttempts: 2,
          retryDelay: 10,
          customSettings: {}
        }
      },
      {
        name: 'Push Notifications',
        type: 'PUSH' as const,
        settings: {
          enabled: true,
          priority: 3,
          deliveryTime: 'immediate',
          retryAttempts: 1,
          retryDelay: 5,
          customSettings: {}
        }
      },
      {
        name: 'In-App Messages',
        type: 'IN_APP' as const,
        settings: {
          enabled: true,
          priority: 4,
          deliveryTime: 'immediate',
          retryAttempts: 0,
          retryDelay: 0,
          customSettings: {}
        }
      }
    ];

    const createdChannels: CommunicationChannel[] = [];
    for (const channelData of defaultChannels) {
      const channel = await this.createChannel({
        accountId,
        ...channelData
      });
      createdChannels.push(channel);
    }

    return createdChannels;
  }
}


