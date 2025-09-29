"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateCommunicationModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AffiliateCommunicationModel {
    static async createChannel(data) {
        return await prisma.communicationChannel.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                type: data.type,
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
        });
    }
    static async findChannelById(id) {
        return await prisma.communicationChannel.findUnique({
            where: { id }
        });
    }
    static async updateChannel(id, data) {
        return await prisma.communicationChannel.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteChannel(id) {
        await prisma.communicationChannel.delete({
            where: { id }
        });
    }
    static async listChannels(accountId, filters = {}) {
        const where = { accountId };
        if (filters.type)
            where.type = filters.type;
        if (filters.status)
            where.status = filters.status;
        return await prisma.communicationChannel.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async createTemplate(data) {
        return await prisma.communicationTemplate.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                type: data.type,
                channel: data.channel,
                subject: data.subject,
                content: data.content,
                variables: data.variables || [],
                status: data.status || 'DRAFT'
            }
        });
    }
    static async findTemplateById(id) {
        return await prisma.communicationTemplate.findUnique({
            where: { id }
        });
    }
    static async updateTemplate(id, data) {
        return await prisma.communicationTemplate.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteTemplate(id) {
        await prisma.communicationTemplate.delete({
            where: { id }
        });
    }
    static async listTemplates(accountId, filters = {}) {
        const where = { accountId };
        if (filters.type)
            where.type = filters.type;
        if (filters.channel)
            where.channel = filters.channel;
        if (filters.status)
            where.status = filters.status;
        return await prisma.communicationTemplate.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async sendMessage(data) {
        return await prisma.communicationMessage.create({
            data: {
                accountId: data.accountId,
                templateId: data.templateId,
                channel: data.channel,
                recipientId: data.recipientId,
                recipientType: data.recipientType,
                subject: data.subject,
                content: data.content,
                status: 'PENDING',
                priority: data.priority || 'NORMAL',
                scheduledAt: data.scheduledAt,
                metadata: data.metadata || {}
            }
        });
    }
    static async sendTemplateMessage(templateId, recipientId, recipientType, variables, accountId) {
        const template = await this.findTemplateById(templateId);
        if (!template) {
            throw new Error('Template not found');
        }
        let content = template.content;
        let subject = template.subject;
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
            recipientType: recipientType,
            subject,
            content
        });
    }
    static async updateMessageStatus(id, status, additionalData) {
        const updateData = { status };
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
        });
    }
    static async getMessages(filters = {}, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.accountId)
            where.accountId = filters.accountId;
        if (filters.recipientId)
            where.recipientId = filters.recipientId;
        if (filters.channel)
            where.channel = filters.channel;
        if (filters.status)
            where.status = filters.status;
        if (filters.priority)
            where.priority = filters.priority;
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
        });
    }
    static async createCampaign(data) {
        return await prisma.communicationCampaign.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                description: data.description || '',
                templateId: data.templateId,
                channel: data.channel,
                recipientType: data.recipientType,
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
        });
    }
    static async findCampaignById(id) {
        return await prisma.communicationCampaign.findUnique({
            where: { id }
        });
    }
    static async updateCampaign(id, data) {
        return await prisma.communicationCampaign.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteCampaign(id) {
        await prisma.communicationCampaign.delete({
            where: { id }
        });
    }
    static async listCampaigns(accountId, filters = {}) {
        const where = { accountId };
        if (filters.status)
            where.status = filters.status;
        if (filters.channel)
            where.channel = filters.channel;
        if (filters.recipientType)
            where.recipientType = filters.recipientType;
        return await prisma.communicationCampaign.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async executeCampaign(campaignId) {
        const campaign = await this.findCampaignById(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        if (campaign.status !== 'DRAFT' && campaign.status !== 'SCHEDULED') {
            throw new Error('Campaign is not in a sendable state');
        }
        await this.updateCampaign(campaignId, {
            status: 'SENDING',
            startedAt: new Date()
        });
        try {
            const recipients = await this.getCampaignRecipients(campaign);
            const template = await this.findTemplateById(campaign.templateId);
            if (!template) {
                throw new Error('Template not found');
            }
            for (const recipient of recipients) {
                const variables = await this.getRecipientVariables(recipient.id);
                await this.sendTemplateMessage(campaign.templateId, recipient.id, recipient.type, variables, campaign.accountId);
            }
            await this.updateCampaign(campaignId, {
                status: 'SENT',
                completedAt: new Date(),
                totalRecipients: recipients.length
            });
        }
        catch (error) {
            await this.updateCampaign(campaignId, { status: 'CANCELLED' });
            throw error;
        }
    }
    static async getCampaignRecipients(campaign) {
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
    static async getRecipientVariables(recipientId) {
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
    static async setCommunicationPreference(userId, channel, enabled, frequency, quietHours) {
        return await prisma.communicationPreference.upsert({
            where: { userId_channel: { userId, channel } },
            update: {
                enabled,
                frequency: frequency,
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
                frequency: frequency,
                quietHours: quietHours || {
                    enabled: false,
                    startTime: '22:00',
                    endTime: '08:00',
                    timezone: 'UTC'
                }
            }
        });
    }
    static async getCommunicationPreferences(userId) {
        return await prisma.communicationPreference.findMany({
            where: { userId }
        });
    }
    static async getCommunicationStats(accountId, startDate, endDate) {
        const where = { accountId };
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
            byChannel: {},
            byStatus: {},
            byPriority: {},
            deliveryRate: 0,
            readRate: 0
        };
        if (stats.totalMessages > 0) {
            stats.deliveryRate = (stats.deliveredMessages / stats.totalMessages) * 100;
            stats.readRate = (stats.readMessages / stats.totalMessages) * 100;
        }
        messages.forEach(message => {
            if (!stats.byChannel[message.channel]) {
                stats.byChannel[message.channel] = { total: 0, sent: 0, delivered: 0, read: 0, failed: 0 };
            }
            stats.byChannel[message.channel].total++;
            if (message.status === 'SENT')
                stats.byChannel[message.channel].sent++;
            else if (message.status === 'DELIVERED')
                stats.byChannel[message.channel].delivered++;
            else if (message.status === 'READ')
                stats.byChannel[message.channel].read++;
            else if (message.status === 'FAILED')
                stats.byChannel[message.channel].failed++;
            stats.byStatus[message.status] = (stats.byStatus[message.status] || 0) + 1;
            stats.byPriority[message.priority] = (stats.byPriority[message.priority] || 0) + 1;
        });
        return stats;
    }
    static async createDefaultTemplates(accountId) {
        const defaultTemplates = [
            {
                name: 'Welcome Email',
                type: 'WELCOME',
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
                type: 'COMMISSION_EARNED',
                channel: 'EMAIL',
                subject: 'You earned ${{amount}} commission!',
                content: `
          <h1>Commission Earned!</h1>
          <p>Congratulations {{firstName}}!</p>
          <p>You have earned ${{ amount }} commission from {{offerName}}.</p>
          <p>Your total earnings are now ${{ totalEarnings }}.</p>
          <p>Keep up the great work!</p>
        `,
                variables: ['firstName', 'amount', 'offerName', 'totalEarnings']
            },
            {
                name: 'Payout Processed',
                type: 'PAYOUT_PROCESSED',
                channel: 'EMAIL',
                subject: 'Your payout of ${{amount}} has been processed',
                content: `
          <h1>Payout Processed</h1>
          <p>Hello {{firstName}},</p>
          <p>Your payout of ${{ amount }} has been successfully processed via {{paymentMethod}}.</p>
          <p>Transaction ID: {{transactionId}}</p>
          <p>Thank you for your partnership!</p>
        `,
                variables: ['firstName', 'amount', 'paymentMethod', 'transactionId']
            }
        ];
        const createdTemplates = [];
        for (const templateData of defaultTemplates) {
            const template = await this.createTemplate({
                accountId,
                ...templateData
            });
            createdTemplates.push(template);
        }
        return createdTemplates;
    }
    static async createDefaultChannels(accountId) {
        const defaultChannels = [
            {
                name: 'Email',
                type: 'EMAIL',
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
                type: 'SMS',
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
                type: 'PUSH',
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
                type: 'IN_APP',
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
        const createdChannels = [];
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
exports.AffiliateCommunicationModel = AffiliateCommunicationModel;
//# sourceMappingURL=AffiliateCommunication.js.map