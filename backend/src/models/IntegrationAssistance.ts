import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface IntegrationRequest {
  id: string;
  accountId: string;
  userId: string;
  title: string;
  description: string;
  category: 'SETUP' | 'TROUBLESHOOTING' | 'CUSTOMIZATION' | 'API' | 'WEBHOOK' | 'PAYMENT' | 'REPORTING' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_RESPONSE' | 'RESOLVED' | 'CLOSED';
  type: 'INTEGRATION' | 'SUPPORT' | 'CONSULTATION' | 'TRAINING' | 'CUSTOM_DEVELOPMENT';
  estimatedHours: number;
  actualHours: number;
  budget: number;
  currency: string;
  deadline?: Date;
  assignedTo?: string;
  tags: string[];
  attachments: Attachment[];
  messages: IntegrationMessage[];
  timeline: TimelineEvent[];
  requirements: Requirement[];
  deliverables: Deliverable[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface IntegrationMessage {
  id: string;
  requestId: string;
  userId: string;
  content: string;
  type: 'MESSAGE' | 'FILE' | 'SCREENSHOT' | 'CODE' | 'SYSTEM';
  attachments: Attachment[];
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  requestId: string;
  type: 'CREATED' | 'ASSIGNED' | 'STATUS_CHANGED' | 'MESSAGE_ADDED' | 'FILE_ADDED' | 'DEADLINE_CHANGED' | 'RESOLVED' | 'CLOSED';
  title: string;
  description: string;
  userId: string;
  data: any;
  createdAt: Date;
}

export interface Requirement {
  id: string;
  requestId: string;
  title: string;
  description: string;
  type: 'FUNCTIONAL' | 'TECHNICAL' | 'BUSINESS' | 'COMPLIANCE' | 'SECURITY';
  priority: 'MUST_HAVE' | 'SHOULD_HAVE' | 'COULD_HAVE' | 'WONT_HAVE';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  estimatedHours: number;
  actualHours: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deliverable {
  id: string;
  requestId: string;
  title: string;
  description: string;
  type: 'DOCUMENTATION' | 'CODE' | 'CONFIGURATION' | 'TESTING' | 'TRAINING' | 'SUPPORT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  dueDate?: Date;
  completedDate?: Date;
  attachments: Attachment[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  type: string;
  mimeType: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface IntegrationSpecialist {
  id: string;
  accountId: string;
  userId: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  skills: string[];
  certifications: string[];
  experience: number; // years
  hourlyRate: number;
  currency: string;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  timezone: string;
  languages: string[];
  specializations: string[];
  rating: number;
  totalProjects: number;
  completedProjects: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationTemplate {
  id: string;
  accountId: string;
  name: string;
  description: string;
  category: string;
  type: string;
  template: Partial<IntegrationRequest>;
  isPublic: boolean;
  isDefault: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationKnowledge {
  id: string;
  accountId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  htmlContent: string;
  type: 'ARTICLE' | 'FAQ' | 'TUTORIAL' | 'TROUBLESHOOTING' | 'BEST_PRACTICES';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  views: number;
  helpful: number;
  notHelpful: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class IntegrationAssistanceModel {
  static async createRequest(data: Partial<IntegrationRequest>): Promise<IntegrationRequest> {
    return await prisma.integrationRequest.create({
      data: {
        accountId: data.accountId!,
        userId: data.userId!,
        title: data.title!,
        description: data.description!,
        category: data.category!,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        type: data.type!,
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
    }) as IntegrationRequest;
  }

  static async findRequestById(id: string): Promise<IntegrationRequest | null> {
    return await prisma.integrationRequest.findUnique({
      where: { id }
    }) as IntegrationRequest | null;
  }

  static async updateRequest(id: string, data: Partial<IntegrationRequest>): Promise<IntegrationRequest> {
    return await prisma.integrationRequest.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as IntegrationRequest;
  }

  static async deleteRequest(id: string): Promise<void> {
    await prisma.integrationRequest.delete({
      where: { id }
    });
  }

  static async listRequests(accountId: string, filters: any = {}): Promise<IntegrationRequest[]> {
    const where: any = { accountId };
    
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;
    if (filters.type) where.type = filters.type;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters.userId) where.userId = filters.userId;

    return await prisma.integrationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as IntegrationRequest[];
  }

  static async addMessage(requestId: string, userId: string, content: string, type: string = 'MESSAGE', attachments: Attachment[] = [], isInternal: boolean = false): Promise<IntegrationMessage> {
    const message = await prisma.integrationMessage.create({
      data: {
        requestId,
        userId,
        content,
        type: type as any,
        attachments,
        isInternal
      }
    }) as IntegrationMessage;

    // Add timeline event
    await this.addTimelineEvent(requestId, 'MESSAGE_ADDED', 'New Message', `Message added by user`, userId, { messageId: message.id });

    return message;
  }

  static async getMessages(requestId: string, filters: any = {}): Promise<IntegrationMessage[]> {
    const where: any = { requestId };
    
    if (filters.type) where.type = filters.type;
    if (filters.isInternal !== undefined) where.isInternal = filters.isInternal;

    return await prisma.integrationMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    }) as IntegrationMessage[];
  }

  static async addTimelineEvent(requestId: string, type: string, title: string, description: string, userId: string, data: any = {}): Promise<TimelineEvent> {
    return await prisma.timelineEvent.create({
      data: {
        requestId,
        type: type as any,
        title,
        description,
        userId,
        data
      }
    }) as TimelineEvent;
  }

  static async getTimeline(requestId: string): Promise<TimelineEvent[]> {
    return await prisma.timelineEvent.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' }
    }) as TimelineEvent[];
  }

  static async updateStatus(requestId: string, status: string, userId: string, notes?: string): Promise<IntegrationRequest> {
    const request = await this.findRequestById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    const updatedRequest = await this.updateRequest(requestId, { status: status as any });

    // Add timeline event
    await this.addTimelineEvent(requestId, 'STATUS_CHANGED', 'Status Changed', `Status changed from ${request.status} to ${status}${notes ? `: ${notes}` : ''}`, userId, { 
      oldStatus: request.status, 
      newStatus: status,
      notes 
    });

    return updatedRequest;
  }

  static async assignRequest(requestId: string, assignedTo: string, assignedBy: string): Promise<IntegrationRequest> {
    const request = await this.findRequestById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    const updatedRequest = await this.updateRequest(requestId, { assignedTo });

    // Add timeline event
    await this.addTimelineEvent(requestId, 'ASSIGNED', 'Request Assigned', `Request assigned to specialist`, assignedBy, { assignedTo });

    return updatedRequest;
  }

  static async addRequirement(requestId: string, data: Partial<Requirement>): Promise<Requirement> {
    return await prisma.requirement.create({
      data: {
        requestId,
        title: data.title!,
        description: data.description!,
        type: data.type!,
        priority: data.priority || 'SHOULD_HAVE',
        status: 'PENDING',
        estimatedHours: data.estimatedHours || 0,
        actualHours: 0,
        notes: data.notes || ''
      }
    }) as Requirement;
  }

  static async updateRequirement(id: string, data: Partial<Requirement>): Promise<Requirement> {
    return await prisma.requirement.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as Requirement;
  }

  static async deleteRequirement(id: string): Promise<void> {
    await prisma.requirement.delete({
      where: { id }
    });
  }

  static async getRequirements(requestId: string): Promise<Requirement[]> {
    return await prisma.requirement.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' }
    }) as Requirement[];
  }

  static async addDeliverable(requestId: string, data: Partial<Deliverable>): Promise<Deliverable> {
    return await prisma.deliverable.create({
      data: {
        requestId,
        title: data.title!,
        description: data.description!,
        type: data.type!,
        status: 'PENDING',
        dueDate: data.dueDate,
        attachments: data.attachments || [],
        notes: data.notes || ''
      }
    }) as Deliverable;
  }

  static async updateDeliverable(id: string, data: Partial<Deliverable>): Promise<Deliverable> {
    return await prisma.deliverable.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as Deliverable;
  }

  static async deleteDeliverable(id: string): Promise<void> {
    await prisma.deliverable.delete({
      where: { id }
    });
  }

  static async getDeliverables(requestId: string): Promise<Deliverable[]> {
    return await prisma.deliverable.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' }
    }) as Deliverable[];
  }

  static async createSpecialist(data: Partial<IntegrationSpecialist>): Promise<IntegrationSpecialist> {
    return await prisma.integrationSpecialist.create({
      data: {
        accountId: data.accountId!,
        userId: data.userId!,
        name: data.name!,
        email: data.email!,
        title: data.title!,
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
    }) as IntegrationSpecialist;
  }

  static async findSpecialistById(id: string): Promise<IntegrationSpecialist | null> {
    return await prisma.integrationSpecialist.findUnique({
      where: { id }
    }) as IntegrationSpecialist | null;
  }

  static async updateSpecialist(id: string, data: Partial<IntegrationSpecialist>): Promise<IntegrationSpecialist> {
    return await prisma.integrationSpecialist.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as IntegrationSpecialist;
  }

  static async deleteSpecialist(id: string): Promise<void> {
    await prisma.integrationSpecialist.delete({
      where: { id }
    });
  }

  static async listSpecialists(accountId: string, filters: any = {}): Promise<IntegrationSpecialist[]> {
    const where: any = { accountId, isActive: true };
    
    if (filters.availability) where.availability = filters.availability;
    if (filters.specializations && filters.specializations.length > 0) {
      where.specializations = { hasSome: filters.specializations };
    }
    if (filters.skills && filters.skills.length > 0) {
      where.skills = { hasSome: filters.skills };
    }

    return await prisma.integrationSpecialist.findMany({
      where,
      orderBy: { rating: 'desc' }
    }) as IntegrationSpecialist[];
  }

  static async createTemplate(data: Partial<IntegrationTemplate>): Promise<IntegrationTemplate> {
    return await prisma.integrationTemplate.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        description: data.description || '',
        category: data.category!,
        type: data.type!,
        template: data.template!,
        isPublic: data.isPublic || false,
        isDefault: data.isDefault || false,
        usageCount: 0
      }
    }) as IntegrationTemplate;
  }

  static async findTemplateById(id: string): Promise<IntegrationTemplate | null> {
    return await prisma.integrationTemplate.findUnique({
      where: { id }
    }) as IntegrationTemplate | null;
  }

  static async updateTemplate(id: string, data: Partial<IntegrationTemplate>): Promise<IntegrationTemplate> {
    return await prisma.integrationTemplate.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as IntegrationTemplate;
  }

  static async deleteTemplate(id: string): Promise<void> {
    await prisma.integrationTemplate.delete({
      where: { id }
    });
  }

  static async listTemplates(accountId: string, filters: any = {}): Promise<IntegrationTemplate[]> {
    const where: any = { accountId };
    
    if (filters.category) where.category = filters.category;
    if (filters.type) where.type = filters.type;
    if (filters.isPublic !== undefined) where.isPublic = filters.isPublic;

    return await prisma.integrationTemplate.findMany({
      where,
      orderBy: { usageCount: 'desc' }
    }) as IntegrationTemplate[];
  }

  static async createKnowledge(data: Partial<IntegrationKnowledge>): Promise<IntegrationKnowledge> {
    return await prisma.integrationKnowledge.create({
      data: {
        accountId: data.accountId!,
        title: data.title!,
        description: data.description || '',
        category: data.category!,
        tags: data.tags || [],
        content: data.content!,
        htmlContent: data.htmlContent || '',
        type: data.type!,
        difficulty: data.difficulty || 'BEGINNER',
        views: 0,
        helpful: 0,
        notHelpful: 0,
        isPublished: data.isPublished || false
      }
    }) as IntegrationKnowledge;
  }

  static async findKnowledgeById(id: string): Promise<IntegrationKnowledge | null> {
    return await prisma.integrationKnowledge.findUnique({
      where: { id }
    }) as IntegrationKnowledge | null;
  }

  static async updateKnowledge(id: string, data: Partial<IntegrationKnowledge>): Promise<IntegrationKnowledge> {
    return await prisma.integrationKnowledge.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as IntegrationKnowledge;
  }

  static async deleteKnowledge(id: string): Promise<void> {
    await prisma.integrationKnowledge.delete({
      where: { id }
    });
  }

  static async listKnowledge(accountId: string, filters: any = {}): Promise<IntegrationKnowledge[]> {
    const where: any = { accountId, isPublished: true };
    
    if (filters.category) where.category = filters.category;
    if (filters.type) where.type = filters.type;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    return await prisma.integrationKnowledge.findMany({
      where,
      orderBy: { views: 'desc' }
    }) as IntegrationKnowledge[];
  }

  static async recordKnowledgeView(id: string): Promise<void> {
    const knowledge = await this.findKnowledgeById(id);
    if (!knowledge) return;

    await this.updateKnowledge(id, {
      views: knowledge.views + 1
    });
  }

  static async recordKnowledgeFeedback(id: string, helpful: boolean): Promise<void> {
    const knowledge = await this.findKnowledgeById(id);
    if (!knowledge) return;

    if (helpful) {
      await this.updateKnowledge(id, {
        helpful: knowledge.helpful + 1
      });
    } else {
      await this.updateKnowledge(id, {
        notHelpful: knowledge.notHelpful + 1
      });
    }
  }

  static async getIntegrationStats(accountId: string): Promise<any> {
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
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    };

    // Aggregate by category, priority, type, and status
    requests.forEach(request => {
      stats.byCategory[request.category] = (stats.byCategory[request.category] || 0) + 1;
      stats.byPriority[request.priority] = (stats.byPriority[request.priority] || 0) + 1;
      stats.byType[request.type] = (stats.byType[request.type] || 0) + 1;
      stats.byStatus[request.status] = (stats.byStatus[request.status] || 0) + 1;
    });

    return stats;
  }

  static async createDefaultTemplates(accountId: string): Promise<IntegrationTemplate[]> {
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

    const createdTemplates: IntegrationTemplate[] = [];
    for (const templateData of defaultTemplates) {
      const template = await this.createTemplate({
        accountId,
        ...templateData
      });
      createdTemplates.push(template);
    }

    return createdTemplates;
  }

  static async getIntegrationAssistanceDashboard(accountId: string): Promise<any> {
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


