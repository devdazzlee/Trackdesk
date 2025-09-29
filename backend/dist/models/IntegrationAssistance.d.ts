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
    experience: number;
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
export declare class IntegrationAssistanceModel {
    static createRequest(data: Partial<IntegrationRequest>): Promise<IntegrationRequest>;
    static findRequestById(id: string): Promise<IntegrationRequest | null>;
    static updateRequest(id: string, data: Partial<IntegrationRequest>): Promise<IntegrationRequest>;
    static deleteRequest(id: string): Promise<void>;
    static listRequests(accountId: string, filters?: any): Promise<IntegrationRequest[]>;
    static addMessage(requestId: string, userId: string, content: string, type?: string, attachments?: Attachment[], isInternal?: boolean): Promise<IntegrationMessage>;
    static getMessages(requestId: string, filters?: any): Promise<IntegrationMessage[]>;
    static addTimelineEvent(requestId: string, type: string, title: string, description: string, userId: string, data?: any): Promise<TimelineEvent>;
    static getTimeline(requestId: string): Promise<TimelineEvent[]>;
    static updateStatus(requestId: string, status: string, userId: string, notes?: string): Promise<IntegrationRequest>;
    static assignRequest(requestId: string, assignedTo: string, assignedBy: string): Promise<IntegrationRequest>;
    static addRequirement(requestId: string, data: Partial<Requirement>): Promise<Requirement>;
    static updateRequirement(id: string, data: Partial<Requirement>): Promise<Requirement>;
    static deleteRequirement(id: string): Promise<void>;
    static getRequirements(requestId: string): Promise<Requirement[]>;
    static addDeliverable(requestId: string, data: Partial<Deliverable>): Promise<Deliverable>;
    static updateDeliverable(id: string, data: Partial<Deliverable>): Promise<Deliverable>;
    static deleteDeliverable(id: string): Promise<void>;
    static getDeliverables(requestId: string): Promise<Deliverable[]>;
    static createSpecialist(data: Partial<IntegrationSpecialist>): Promise<IntegrationSpecialist>;
    static findSpecialistById(id: string): Promise<IntegrationSpecialist | null>;
    static updateSpecialist(id: string, data: Partial<IntegrationSpecialist>): Promise<IntegrationSpecialist>;
    static deleteSpecialist(id: string): Promise<void>;
    static listSpecialists(accountId: string, filters?: any): Promise<IntegrationSpecialist[]>;
    static createTemplate(data: Partial<IntegrationTemplate>): Promise<IntegrationTemplate>;
    static findTemplateById(id: string): Promise<IntegrationTemplate | null>;
    static updateTemplate(id: string, data: Partial<IntegrationTemplate>): Promise<IntegrationTemplate>;
    static deleteTemplate(id: string): Promise<void>;
    static listTemplates(accountId: string, filters?: any): Promise<IntegrationTemplate[]>;
    static createKnowledge(data: Partial<IntegrationKnowledge>): Promise<IntegrationKnowledge>;
    static findKnowledgeById(id: string): Promise<IntegrationKnowledge | null>;
    static updateKnowledge(id: string, data: Partial<IntegrationKnowledge>): Promise<IntegrationKnowledge>;
    static deleteKnowledge(id: string): Promise<void>;
    static listKnowledge(accountId: string, filters?: any): Promise<IntegrationKnowledge[]>;
    static recordKnowledgeView(id: string): Promise<void>;
    static recordKnowledgeFeedback(id: string, helpful: boolean): Promise<void>;
    static getIntegrationStats(accountId: string): Promise<any>;
    static createDefaultTemplates(accountId: string): Promise<IntegrationTemplate[]>;
    static getIntegrationAssistanceDashboard(accountId: string): Promise<any>;
}
//# sourceMappingURL=IntegrationAssistance.d.ts.map