"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationAssistanceModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class IntegrationAssistanceModel {
    static async createRequest(data) {
        return await prisma.integrationRequest.create({
            data: {
                accountId: data.accountId,
                userId: data.userId,
                title: data.title,
                description: data.description,
                category: data.category,
                priority: data.priority || 'MEDIUM',
                status: 'OPEN',
                type: data.type,
                estimatedHours: data.estimatedHours || 0,
                actualHours: 0,
                budget: data.budget || 0,
                currency: data.currency || 'USD',
                deadline: data.deadline,
                assignedTo: data.assignedTo,
                tags: data.tags || [],
                attachments: data.attachments || [],
                messages: [],
                timeline: [],
                requirements: data.requirements || [],
                deliverables: data.deliverables || []
            }
        });
    }
    static async findRequestById(id) {
        return await prisma.integrationRequest.findUnique({
            where: { id }
        });
    }
    static async updateRequest(id, data) {
        return await prisma.integrationRequest.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteRequest(id) {
        await prisma.integrationRequest.delete({
            where: { id }
        });
    }
    static async listRequests(accountId, filters = {}) {
        const where = { accountId };
        if (filters.status)
            where.status = filters.status;
        if (filters.category)
            where.category = filters.category;
        if (filters.priority)
            where.priority = filters.priority;
        if (filters.type)
            where.type = filters.type;
        if (filters.assignedTo)
            where.assignedTo = filters.assignedTo;
        if (filters.userId)
            where.userId = filters.userId;
        return await prisma.integrationRequest.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async addMessage(requestId, userId, content, type = 'MESSAGE', attachments = [], isInternal = false) {
        const message = await prisma.integrationMessage.create({
            data: {
                requestId,
                userId,
                content,
                type: type,
                attachments,
                isInternal
            }
        });
        await this.addTimelineEvent(requestId, 'MESSAGE_ADDED', 'New Message', `Message added by user`, userId, { messageId: message.id });
        return message;
    }
    static async getMessages(requestId, filters = {}) {
        const where = { requestId };
        if (filters.type)
            where.type = filters.type;
        if (filters.isInternal !== undefined)
            where.isInternal = filters.isInternal;
        return await prisma.integrationMessage.findMany({
            where,
            orderBy: { createdAt: 'asc' }
        });
    }
    static async addTimelineEvent(requestId, type, title, description, userId, data = {}) {
        return await prisma.timelineEvent.create({
            data: {
                requestId,
                type: type,
                title,
                description,
                userId,
                data
            }
        });
    }
    static async getTimeline(requestId) {
        return await prisma.timelineEvent.findMany({
            where: { requestId },
            orderBy: { createdAt: 'asc' }
        });
    }
    static async updateStatus(requestId, status, userId, notes) {
        const request = await this.findRequestById(requestId);
        if (!request) {
            throw new Error('Request not found');
        }
        const updatedRequest = await this.updateRequest(requestId, { status: status });
        await this.addTimelineEvent(requestId, 'STATUS_CHANGED', 'Status Changed', `Status changed from ${request.status} to ${status}${notes ? `: ${notes}` : ''}`, userId, {
            oldStatus: request.status,
            newStatus: status,
            notes
        });
        return updatedRequest;
    }
    static async assignRequest(requestId, assignedTo, assignedBy) {
        const request = await this.findRequestById(requestId);
        if (!request) {
            throw new Error('Request not found');
        }
        const updatedRequest = await this.updateRequest(requestId, { assignedTo });
        await this.addTimelineEvent(requestId, 'ASSIGNED', 'Request Assigned', `Request assigned to specialist`, assignedBy, { assignedTo });
        return updatedRequest;
    }
    static async addRequirement(requestId, data) {
        return await prisma.requirement.create({
            data: {
                requestId,
                title: data.title,
                description: data.description,
                type: data.type,
                priority: data.priority || 'SHOULD_HAVE',
                status: 'PENDING',
                estimatedHours: data.estimatedHours || 0,
                actualHours: 0,
                notes: data.notes || ''
            }
        });
    }
    static async updateRequirement(id, data) {
        return await prisma.requirement.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteRequirement(id) {
        await prisma.requirement.delete({
            where: { id }
        });
    }
    static async getRequirements(requestId) {
        return await prisma.requirement.findMany({
            where: { requestId },
            orderBy: { createdAt: 'asc' }
        });
    }
    static async addDeliverable(requestId, data) {
        return await prisma.deliverable.create({
            data: {
                requestId,
                title: data.title,
                description: data.description,
                type: data.type,
                status: 'PENDING',
                dueDate: data.dueDate,
                attachments: data.attachments || [],
                notes: data.notes || ''
            }
        });
    }
    static async updateDeliverable(id, data) {
        return await prisma.deliverable.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteDeliverable(id) {
        await prisma.deliverable.delete({
            where: { id }
        });
    }
    static async getDeliverables(requestId) {
        return await prisma.deliverable.findMany({
            where: { requestId },
            orderBy: { createdAt: 'asc' }
        });
    }
    static async createSpecialist(data) {
        return await prisma.integrationSpecialist.create({
            data: {
                accountId: data.accountId,
                userId: data.userId,
                name: data.name,
                email: data.email,
                title: data.title,
                bio: data.bio || '',
                skills: data.skills || [],
                certifications: data.certifications || [],
                experience: data.experience || 0,
                hourlyRate: data.hourlyRate || 0,
                currency: data.currency || 'USD',
                availability: 'AVAILABLE',
                timezone: data.timezone || 'UTC',
                languages: data.languages || ['English'],
                specializations: data.specializations || [],
                rating: 0,
                totalProjects: 0,
                completedProjects: 0,
                isActive: true
            }
        });
    }
    static async findSpecialistById(id) {
        return await prisma.integrationSpecialist.findUnique({
            where: { id }
        });
    }
    static async updateSpecialist(id, data) {
        return await prisma.integrationSpecialist.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteSpecialist(id) {
        await prisma.integrationSpecialist.delete({
            where: { id }
        });
    }
    static async listSpecialists(accountId, filters = {}) {
        const where = { accountId, isActive: true };
        if (filters.availability)
            where.availability = filters.availability;
        if (filters.specializations && filters.specializations.length > 0) {
            where.specializations = { hasSome: filters.specializations };
        }
        if (filters.skills && filters.skills.length > 0) {
            where.skills = { hasSome: filters.skills };
        }
        return await prisma.integrationSpecialist.findMany({
            where,
            orderBy: { rating: 'desc' }
        });
    }
    static async createTemplate(data) {
        return await prisma.integrationTemplate.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                description: data.description || '',
                category: data.category,
                type: data.type,
                template: data.template,
                isPublic: data.isPublic || false,
                isDefault: data.isDefault || false,
                usageCount: 0
            }
        });
    }
    static async findTemplateById(id) {
        return await prisma.integrationTemplate.findUnique({
            where: { id }
        });
    }
    static async updateTemplate(id, data) {
        return await prisma.integrationTemplate.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteTemplate(id) {
        await prisma.integrationTemplate.delete({
            where: { id }
        });
    }
    static async listTemplates(accountId, filters = {}) {
        const where = { accountId };
        if (filters.category)
            where.category = filters.category;
        if (filters.type)
            where.type = filters.type;
        if (filters.isPublic !== undefined)
            where.isPublic = filters.isPublic;
        return await prisma.integrationTemplate.findMany({
            where,
            orderBy: { usageCount: 'desc' }
        });
    }
    static async createKnowledge(data) {
        return await prisma.integrationKnowledge.create({
            data: {
                accountId: data.accountId,
                title: data.title,
                description: data.description || '',
                category: data.category,
                tags: data.tags || [],
                content: data.content,
                htmlContent: data.htmlContent || '',
                type: data.type,
                difficulty: data.difficulty || 'BEGINNER',
                views: 0,
                helpful: 0,
                notHelpful: 0,
                isPublished: data.isPublished || false
            }
        });
    }
    static async findKnowledgeById(id) {
        return await prisma.integrationKnowledge.findUnique({
            where: { id }
        });
    }
    static async updateKnowledge(id, data) {
        return await prisma.integrationKnowledge.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteKnowledge(id) {
        await prisma.integrationKnowledge.delete({
            where: { id }
        });
    }
    static async listKnowledge(accountId, filters = {}) {
        const where = { accountId, isPublished: true };
        if (filters.category)
            where.category = filters.category;
        if (filters.type)
            where.type = filters.type;
        if (filters.difficulty)
            where.difficulty = filters.difficulty;
        if (filters.tags && filters.tags.length > 0) {
            where.tags = { hasSome: filters.tags };
        }
        return await prisma.integrationKnowledge.findMany({
            where,
            orderBy: { views: 'desc' }
        });
    }
    static async recordKnowledgeView(id) {
        const knowledge = await this.findKnowledgeById(id);
        if (!knowledge)
            return;
        await this.updateKnowledge(id, {
            views: knowledge.views + 1
        });
    }
    static async recordKnowledgeFeedback(id, helpful) {
        const knowledge = await this.findKnowledgeById(id);
        if (!knowledge)
            return;
        if (helpful) {
            await this.updateKnowledge(id, {
                helpful: knowledge.helpful + 1
            });
        }
        else {
            await this.updateKnowledge(id, {
                notHelpful: knowledge.notHelpful + 1
            });
        }
    }
    static async getIntegrationStats(accountId) {
        const requests = await this.listRequests(accountId);
        const specialists = await this.listSpecialists(accountId);
        const templates = await this.listTemplates(accountId);
        const knowledge = await this.listKnowledge(accountId);
        const stats = {
            totalRequests: requests.length,
            openRequests: requests.filter(r => r.status === 'OPEN').length,
            inProgressRequests: requests.filter(r => r.status === 'IN_PROGRESS').length,
            resolvedRequests: requests.filter(r => r.status === 'RESOLVED').length,
            closedRequests: requests.filter(r => r.status === 'CLOSED').length,
            totalSpecialists: specialists.length,
            availableSpecialists: specialists.filter(s => s.availability === 'AVAILABLE').length,
            totalTemplates: templates.length,
            totalKnowledge: knowledge.length,
            totalHours: requests.reduce((sum, r) => sum + r.actualHours, 0),
            totalBudget: requests.reduce((sum, r) => sum + r.budget, 0),
            byCategory: {},
            byPriority: {},
            byType: {},
            byStatus: {}
        };
        requests.forEach(request => {
            stats.byCategory[request.category] = (stats.byCategory[request.category] || 0) + 1;
            stats.byPriority[request.priority] = (stats.byPriority[request.priority] || 0) + 1;
            stats.byType[request.type] = (stats.byType[request.type] || 0) + 1;
            stats.byStatus[request.status] = (stats.byStatus[request.status] || 0) + 1;
        });
        return stats;
    }
    static async createDefaultTemplates(accountId) {
        const defaultTemplates = [
            {
                name: 'Basic API Integration',
                description: 'Template for basic API integration requests',
                category: 'API',
                type: 'INTEGRATION',
                template: {
                    category: 'API',
                    type: 'INTEGRATION',
                    priority: 'MEDIUM',
                    estimatedHours: 8,
                    budget: 500,
                    currency: 'USD',
                    tags: ['api', 'integration', 'basic'],
                    requirements: [
                        {
                            title: 'API Documentation',
                            description: 'Provide API documentation and endpoints',
                            type: 'TECHNICAL',
                            priority: 'MUST_HAVE'
                        },
                        {
                            title: 'Authentication Setup',
                            description: 'Set up API authentication and keys',
                            type: 'TECHNICAL',
                            priority: 'MUST_HAVE'
                        }
                    ],
                    deliverables: [
                        {
                            title: 'Integration Code',
                            description: 'Complete integration code with examples',
                            type: 'CODE'
                        },
                        {
                            title: 'Documentation',
                            description: 'Integration documentation and setup guide',
                            type: 'DOCUMENTATION'
                        }
                    ]
                },
                isPublic: true,
                isDefault: true
            },
            {
                name: 'Webhook Setup',
                description: 'Template for webhook integration requests',
                category: 'WEBHOOK',
                type: 'INTEGRATION',
                template: {
                    category: 'WEBHOOK',
                    type: 'INTEGRATION',
                    priority: 'MEDIUM',
                    estimatedHours: 4,
                    budget: 300,
                    currency: 'USD',
                    tags: ['webhook', 'integration', 'real-time'],
                    requirements: [
                        {
                            title: 'Webhook Endpoint',
                            description: 'Provide webhook endpoint URL',
                            type: 'TECHNICAL',
                            priority: 'MUST_HAVE'
                        },
                        {
                            title: 'Event Types',
                            description: 'Specify which events to track',
                            type: 'FUNCTIONAL',
                            priority: 'MUST_HAVE'
                        }
                    ],
                    deliverables: [
                        {
                            title: 'Webhook Configuration',
                            description: 'Configured webhook settings',
                            type: 'CONFIGURATION'
                        },
                        {
                            title: 'Test Results',
                            description: 'Webhook testing and validation results',
                            type: 'TESTING'
                        }
                    ]
                },
                isPublic: true,
                isDefault: true
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
    static async getIntegrationAssistanceDashboard(accountId) {
        const requests = await this.listRequests(accountId);
        const specialists = await this.listSpecialists(accountId);
        const templates = await this.listTemplates(accountId);
        const knowledge = await this.listKnowledge(accountId);
        const stats = await this.getIntegrationStats(accountId);
        return {
            requests,
            specialists,
            templates,
            knowledge,
            stats
        };
    }
}
exports.IntegrationAssistanceModel = IntegrationAssistanceModel;
//# sourceMappingURL=IntegrationAssistance.js.map