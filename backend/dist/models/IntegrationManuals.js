"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationManualsModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class IntegrationManualsModel {
    static async create(data) {
        return await prisma.integrationManual.create({
            data: {
                accountId: data.accountId,
                title: data.title,
                description: data.description || '',
                category: data.category,
                type: data.type,
                status: data.status || 'DRAFT',
                content: data.content,
                htmlContent: data.htmlContent || '',
                tags: data.tags || [],
                difficulty: data.difficulty || 'BEGINNER',
                estimatedTime: data.estimatedTime || 0,
                prerequisites: data.prerequisites || [],
                steps: data.steps || [],
                codeExamples: data.codeExamples || [],
                screenshots: data.screenshots || [],
                videos: data.videos || [],
                attachments: data.attachments || [],
                seo: data.seo || {
                    metaTitle: data.title,
                    metaDescription: data.description || '',
                    metaKeywords: [],
                    robots: 'index, follow',
                    sitemap: true
                },
                settings: data.settings || {
                    allowComments: true,
                    allowRating: true,
                    allowSharing: true,
                    requireLogin: false,
                    showTableOfContents: true,
                    showProgress: true,
                    showEstimatedTime: true,
                    showDifficulty: true,
                    showPrerequisites: true,
                    customFields: {}
                },
                stats: {
                    views: 0,
                    uniqueViews: 0,
                    completions: 0,
                    averageRating: 0,
                    totalRatings: 0,
                    shares: 0,
                    downloads: 0
                }
            }
        });
    }
    static async findById(id) {
        return await prisma.integrationManual.findUnique({
            where: { id }
        });
    }
    static async findBySlug(accountId, slug) {
        return await prisma.integrationManual.findFirst({
            where: {
                accountId,
                slug,
                status: 'PUBLISHED'
            }
        });
    }
    static async update(id, data) {
        return await prisma.integrationManual.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async delete(id) {
        await prisma.integrationManual.delete({
            where: { id }
        });
    }
    static async list(accountId, filters = {}) {
        const where = { accountId };
        if (filters.status)
            where.status = filters.status;
        if (filters.category)
            where.category = filters.category;
        if (filters.type)
            where.type = filters.type;
        if (filters.difficulty)
            where.difficulty = filters.difficulty;
        if (filters.tags && filters.tags.length > 0) {
            where.tags = { hasSome: filters.tags };
        }
        return await prisma.integrationManual.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async publish(id) {
        const manual = await this.findById(id);
        if (!manual) {
            throw new Error('Manual not found');
        }
        return await this.update(id, {
            status: 'PUBLISHED',
            publishedAt: new Date()
        });
    }
    static async unpublish(id) {
        return await this.update(id, {
            status: 'DRAFT',
            publishedAt: undefined
        });
    }
    static async archive(id) {
        return await this.update(id, {
            status: 'ARCHIVED'
        });
    }
    static async recordView(id, userId, ipAddress) {
        const manual = await this.findById(id);
        if (!manual)
            return;
        const stats = { ...manual.stats };
        stats.views++;
        if (userId) {
            stats.uniqueViews++;
        }
        stats.lastViewed = new Date();
        await this.update(id, { stats });
    }
    static async recordCompletion(id, userId) {
        const manual = await this.findById(id);
        if (!manual)
            return;
        const stats = { ...manual.stats };
        stats.completions++;
        stats.lastCompleted = new Date();
        await this.update(id, { stats });
        await this.updateProgress(id, userId, manual.steps.length, true);
    }
    static async addComment(manualId, userId, content, parentId, ipAddress = '127.0.0.1', userAgent = 'System') {
        return await prisma.manualComment.create({
            data: {
                manualId,
                parentId,
                userId,
                content,
                status: 'PENDING',
                ipAddress,
                userAgent
            }
        });
    }
    static async findCommentById(id) {
        return await prisma.manualComment.findUnique({
            where: { id }
        });
    }
    static async updateCommentStatus(id, status) {
        return await prisma.manualComment.update({
            where: { id },
            data: {
                status: status,
                updatedAt: new Date()
            }
        });
    }
    static async deleteComment(id) {
        await prisma.manualComment.delete({
            where: { id }
        });
    }
    static async getComments(manualId, filters = {}) {
        const where = { manualId };
        if (filters.status)
            where.status = filters.status;
        if (filters.parentId !== undefined)
            where.parentId = filters.parentId;
        return await prisma.manualComment.findMany({
            where,
            orderBy: { createdAt: 'asc' }
        });
    }
    static async addRating(manualId, userId, rating, comment) {
        const existingRating = await prisma.manualRating.findFirst({
            where: { manualId, userId }
        });
        if (existingRating) {
            return await prisma.manualRating.update({
                where: { id: existingRating.id },
                data: {
                    rating,
                    comment,
                    updatedAt: new Date()
                }
            });
        }
        else {
            return await prisma.manualRating.create({
                data: {
                    manualId,
                    userId,
                    rating,
                    comment
                }
            });
        }
    }
    static async getRatings(manualId) {
        return await prisma.manualRating.findMany({
            where: { manualId },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async updateRatingStats(manualId) {
        const ratings = await this.getRatings(manualId);
        if (ratings.length === 0)
            return;
        const totalRatings = ratings.length;
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        const manual = await this.findById(manualId);
        if (!manual)
            return;
        const stats = { ...manual.stats };
        stats.averageRating = averageRating;
        stats.totalRatings = totalRatings;
        await this.update(manualId, { stats });
    }
    static async updateProgress(manualId, userId, currentStep, isCompleted = false) {
        const manual = await this.findById(manualId);
        if (!manual) {
            throw new Error('Manual not found');
        }
        const existingProgress = await prisma.manualProgress.findFirst({
            where: { manualId, userId }
        });
        const completedSteps = Array.from({ length: currentStep }, (_, i) => i + 1);
        const progress = (currentStep / manual.steps.length) * 100;
        if (existingProgress) {
            return await prisma.manualProgress.update({
                where: { id: existingProgress.id },
                data: {
                    currentStep,
                    completedSteps,
                    progress,
                    isCompleted,
                    lastActivity: new Date(),
                    completedAt: isCompleted ? new Date() : undefined
                }
            });
        }
        else {
            return await prisma.manualProgress.create({
                data: {
                    manualId,
                    userId,
                    currentStep,
                    completedSteps,
                    totalSteps: manual.steps.length,
                    progress,
                    isCompleted,
                    startedAt: new Date(),
                    lastActivity: new Date(),
                    completedAt: isCompleted ? new Date() : undefined
                }
            });
        }
    }
    static async getProgress(manualId, userId) {
        return await prisma.manualProgress.findFirst({
            where: { manualId, userId }
        });
    }
    static async createCategory(data) {
        return await prisma.manualCategory.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                description: data.description || '',
                slug: data.slug,
                parentId: data.parentId,
                order: data.order || 0,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
    }
    static async findCategoryById(id) {
        return await prisma.manualCategory.findUnique({
            where: { id }
        });
    }
    static async updateCategory(id, data) {
        return await prisma.manualCategory.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteCategory(id) {
        await prisma.manualCategory.delete({
            where: { id }
        });
    }
    static async listCategories(accountId) {
        return await prisma.manualCategory.findMany({
            where: { accountId, isActive: true },
            orderBy: { order: 'asc' }
        });
    }
    static async createTag(data) {
        return await prisma.manualTag.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                description: data.description || '',
                slug: data.slug,
                color: data.color || '#3b82f6',
                usageCount: 0,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
    }
    static async findTagById(id) {
        return await prisma.manualTag.findUnique({
            where: { id }
        });
    }
    static async updateTag(id, data) {
        return await prisma.manualTag.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async deleteTag(id) {
        await prisma.manualTag.delete({
            where: { id }
        });
    }
    static async listTags(accountId) {
        return await prisma.manualTag.findMany({
            where: { accountId, isActive: true },
            orderBy: { usageCount: 'desc' }
        });
    }
    static async getManualStats(accountId) {
        const manuals = await this.list(accountId);
        const categories = await this.listCategories(accountId);
        const tags = await this.listTags(accountId);
        const stats = {
            totalManuals: manuals.length,
            publishedManuals: manuals.filter(m => m.status === 'PUBLISHED').length,
            draftManuals: manuals.filter(m => m.status === 'DRAFT').length,
            archivedManuals: manuals.filter(m => m.status === 'ARCHIVED').length,
            totalCategories: categories.length,
            totalTags: tags.length,
            totalViews: manuals.reduce((sum, m) => sum + m.stats.views, 0),
            totalCompletions: manuals.reduce((sum, m) => sum + m.stats.completions, 0),
            byCategory: {},
            byType: {},
            byDifficulty: {},
            byStatus: {}
        };
        manuals.forEach(manual => {
            stats.byCategory[manual.category] = (stats.byCategory[manual.category] || 0) + 1;
            stats.byType[manual.type] = (stats.byType[manual.type] || 0) + 1;
            stats.byDifficulty[manual.difficulty] = (stats.byDifficulty[manual.difficulty] || 0) + 1;
            stats.byStatus[manual.status] = (stats.byStatus[manual.status] || 0) + 1;
        });
        return stats;
    }
    static async createDefaultManuals(accountId) {
        const defaultManuals = [
            {
                title: 'Getting Started with Trackdesk',
                description: 'Learn how to set up your Trackdesk account and start tracking your first affiliate links',
                category: 'AFFILIATE',
                type: 'GUIDE',
                difficulty: 'BEGINNER',
                estimatedTime: 15,
                prerequisites: [],
                tags: ['getting-started', 'setup', 'basics'],
                content: 'This guide will walk you through the process of setting up your Trackdesk account...',
                htmlContent: '<h1>Getting Started with Trackdesk</h1><p>This guide will walk you through the process of setting up your Trackdesk account...</p>',
                steps: [
                    {
                        id: 'step1',
                        title: 'Create Your Account',
                        description: 'Sign up for a Trackdesk account',
                        content: 'Visit the Trackdesk website and click the "Sign Up" button...',
                        order: 1,
                        isOptional: false,
                        estimatedTime: 5,
                        codeExamples: [],
                        screenshots: [],
                        videos: [],
                        attachments: []
                    },
                    {
                        id: 'step2',
                        title: 'Verify Your Email',
                        description: 'Check your email and verify your account',
                        content: 'Check your email inbox for a verification email from Trackdesk...',
                        order: 2,
                        isOptional: false,
                        estimatedTime: 2,
                        codeExamples: [],
                        screenshots: [],
                        videos: [],
                        attachments: []
                    },
                    {
                        id: 'step3',
                        title: 'Create Your First Link',
                        description: 'Generate your first affiliate tracking link',
                        content: 'Navigate to the "Links" section and click "Create New Link"...',
                        order: 3,
                        isOptional: false,
                        estimatedTime: 8,
                        codeExamples: [],
                        screenshots: [],
                        videos: [],
                        attachments: []
                    }
                ],
                codeExamples: [],
                screenshots: [],
                videos: [],
                attachments: []
            },
            {
                title: 'API Integration Guide',
                description: 'Learn how to integrate Trackdesk with your application using our REST API',
                category: 'DEVELOPER',
                type: 'API_DOCS',
                difficulty: 'INTERMEDIATE',
                estimatedTime: 45,
                prerequisites: ['Basic programming knowledge', 'Understanding of REST APIs'],
                tags: ['api', 'integration', 'developer', 'rest'],
                content: 'This guide covers the Trackdesk REST API and how to integrate it with your application...',
                htmlContent: '<h1>API Integration Guide</h1><p>This guide covers the Trackdesk REST API and how to integrate it with your application...</p>',
                steps: [
                    {
                        id: 'step1',
                        title: 'Get Your API Key',
                        description: 'Generate an API key from your account settings',
                        content: 'Navigate to Settings > API Keys and click "Generate New Key"...',
                        order: 1,
                        isOptional: false,
                        estimatedTime: 5,
                        codeExamples: [],
                        screenshots: [],
                        videos: [],
                        attachments: []
                    },
                    {
                        id: 'step2',
                        title: 'Make Your First API Call',
                        description: 'Test the API with a simple request',
                        content: 'Use curl or your preferred HTTP client to make a test request...',
                        order: 2,
                        isOptional: false,
                        estimatedTime: 10,
                        codeExamples: [
                            {
                                id: 'example1',
                                title: 'Basic API Request',
                                description: 'Example of a basic API request using curl',
                                language: 'bash',
                                code: 'curl -X GET "https://api.trackdesk.com/v1/links" \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
                                explanation: 'This example shows how to make a basic GET request to retrieve your links.',
                                isExecutable: true
                            }
                        ],
                        screenshots: [],
                        videos: [],
                        attachments: []
                    }
                ],
                codeExamples: [
                    {
                        id: 'example1',
                        title: 'Basic API Request',
                        description: 'Example of a basic API request using curl',
                        language: 'bash',
                        code: 'curl -X GET "https://api.trackdesk.com/v1/links" \\\n  -H "Authorization: Bearer YOUR_API_KEY"',
                        explanation: 'This example shows how to make a basic GET request to retrieve your links.',
                        isExecutable: true
                    }
                ],
                screenshots: [],
                videos: [],
                attachments: []
            }
        ];
        const createdManuals = [];
        for (const manualData of defaultManuals) {
            const manual = await this.create({
                accountId,
                ...manualData
            });
            createdManuals.push(manual);
        }
        return createdManuals;
    }
    static async getIntegrationManualsDashboard(accountId) {
        const manuals = await this.list(accountId);
        const categories = await this.listCategories(accountId);
        const tags = await this.listTags(accountId);
        const stats = await this.getManualStats(accountId);
        return {
            manuals,
            categories,
            tags,
            stats
        };
    }
}
exports.IntegrationManualsModel = IntegrationManualsModel;
//# sourceMappingURL=IntegrationManuals.js.map