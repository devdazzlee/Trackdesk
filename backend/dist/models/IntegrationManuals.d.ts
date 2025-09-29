export interface IntegrationManual {
    id: string;
    accountId: string;
    title: string;
    description: string;
    category: 'AFFILIATE' | 'MERCHANT' | 'DEVELOPER' | 'ADMIN' | 'GENERAL';
    type: 'GUIDE' | 'TUTORIAL' | 'API_DOCS' | 'FAQ' | 'TROUBLESHOOTING' | 'BEST_PRACTICES';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    content: string;
    htmlContent: string;
    tags: string[];
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    estimatedTime: number;
    prerequisites: string[];
    steps: ManualStep[];
    codeExamples: CodeExample[];
    screenshots: Screenshot[];
    videos: Video[];
    attachments: Attachment[];
    seo: SEOSettings;
    settings: ManualSettings;
    stats: ManualStats;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}
export interface ManualStep {
    id: string;
    title: string;
    description: string;
    content: string;
    order: number;
    isOptional: boolean;
    estimatedTime: number;
    codeExamples: CodeExample[];
    screenshots: Screenshot[];
    videos: Video[];
    attachments: Attachment[];
}
export interface CodeExample {
    id: string;
    title: string;
    description: string;
    language: string;
    code: string;
    output?: string;
    explanation: string;
    isExecutable: boolean;
    dependencies?: string[];
    version?: string;
}
export interface Screenshot {
    id: string;
    title: string;
    description: string;
    url: string;
    alt: string;
    width: number;
    height: number;
    order: number;
}
export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: number;
    order: number;
    platform: 'YOUTUBE' | 'VIMEO' | 'SELF_HOSTED' | 'OTHER';
}
export interface Attachment {
    id: string;
    title: string;
    description: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    order: number;
}
export interface SEOSettings {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    robots: string;
    sitemap: boolean;
}
export interface ManualSettings {
    allowComments: boolean;
    allowRating: boolean;
    allowSharing: boolean;
    requireLogin: boolean;
    showTableOfContents: boolean;
    showProgress: boolean;
    showEstimatedTime: boolean;
    showDifficulty: boolean;
    showPrerequisites: boolean;
    customFields: Record<string, any>;
}
export interface ManualStats {
    views: number;
    uniqueViews: number;
    completions: number;
    averageRating: number;
    totalRatings: number;
    shares: number;
    downloads: number;
    lastViewed?: Date;
    lastCompleted?: Date;
}
export interface ManualComment {
    id: string;
    manualId: string;
    parentId?: string;
    userId: string;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ManualRating {
    id: string;
    manualId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ManualProgress {
    id: string;
    manualId: string;
    userId: string;
    currentStep: number;
    completedSteps: number[];
    totalSteps: number;
    progress: number;
    timeSpent: number;
    isCompleted: boolean;
    startedAt: Date;
    lastActivity: Date;
    completedAt?: Date;
}
export interface ManualCategory {
    id: string;
    accountId: string;
    name: string;
    description: string;
    slug: string;
    parentId?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ManualTag {
    id: string;
    accountId: string;
    name: string;
    description: string;
    slug: string;
    color: string;
    usageCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class IntegrationManualsModel {
    static create(data: Partial<IntegrationManual>): Promise<IntegrationManual>;
    static findById(id: string): Promise<IntegrationManual | null>;
    static findBySlug(accountId: string, slug: string): Promise<IntegrationManual | null>;
    static update(id: string, data: Partial<IntegrationManual>): Promise<IntegrationManual>;
    static delete(id: string): Promise<void>;
    static list(accountId: string, filters?: any): Promise<IntegrationManual[]>;
    static publish(id: string): Promise<IntegrationManual>;
    static unpublish(id: string): Promise<IntegrationManual>;
    static archive(id: string): Promise<IntegrationManual>;
    static recordView(id: string, userId?: string, ipAddress?: string): Promise<void>;
    static recordCompletion(id: string, userId: string): Promise<void>;
    static addComment(manualId: string, userId: string, content: string, parentId?: string, ipAddress?: string, userAgent?: string): Promise<ManualComment>;
    static findCommentById(id: string): Promise<ManualComment | null>;
    static updateCommentStatus(id: string, status: string): Promise<ManualComment>;
    static deleteComment(id: string): Promise<void>;
    static getComments(manualId: string, filters?: any): Promise<ManualComment[]>;
    static addRating(manualId: string, userId: string, rating: number, comment?: string): Promise<ManualRating>;
    static getRatings(manualId: string): Promise<ManualRating[]>;
    static updateRatingStats(manualId: string): Promise<void>;
    static updateProgress(manualId: string, userId: string, currentStep: number, isCompleted?: boolean): Promise<ManualProgress>;
    static getProgress(manualId: string, userId: string): Promise<ManualProgress | null>;
    static createCategory(data: Partial<ManualCategory>): Promise<ManualCategory>;
    static findCategoryById(id: string): Promise<ManualCategory | null>;
    static updateCategory(id: string, data: Partial<ManualCategory>): Promise<ManualCategory>;
    static deleteCategory(id: string): Promise<void>;
    static listCategories(accountId: string): Promise<ManualCategory[]>;
    static createTag(data: Partial<ManualTag>): Promise<ManualTag>;
    static findTagById(id: string): Promise<ManualTag | null>;
    static updateTag(id: string, data: Partial<ManualTag>): Promise<ManualTag>;
    static deleteTag(id: string): Promise<void>;
    static listTags(accountId: string): Promise<ManualTag[]>;
    static getManualStats(accountId: string): Promise<any>;
    static createDefaultManuals(accountId: string): Promise<IntegrationManual[]>;
    static getIntegrationManualsDashboard(accountId: string): Promise<any>;
}
//# sourceMappingURL=IntegrationManuals.d.ts.map