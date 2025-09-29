"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OffersModel {
    static async create(data) {
        return await prisma.offer.create({
            data: {
                accountId: data.accountId,
                name: data.name,
                description: data.description || '',
                category: data.category || 'General',
                type: data.type || 'CPA',
                status: data.status || 'DRAFT',
                priority: data.priority || 0,
                general: data.general || {
                    name: data.name,
                    description: data.description || '',
                    category: data.category || 'General',
                    tags: [],
                    targetAudience: '',
                    restrictions: [],
                    compliance: [],
                    notes: '',
                    isPublic: true,
                    requiresApproval: false,
                    autoApprove: false
                },
                revenue: data.revenue || {
                    type: data.type || 'CPA',
                    basePayout: 0,
                    currency: 'USD',
                    payoutType: 'FIXED',
                    payoutSchedule: 'MONTHLY',
                    minimumPayout: 0,
                    holdPeriod: 30,
                    chargebackPeriod: 90,
                    refundPolicy: ''
                },
                landingPages: data.landingPages || [],
                creatives: data.creatives || [],
                tracking: data.tracking || {
                    clickTracking: true,
                    conversionTracking: true,
                    postbackTracking: false,
                    pixelTracking: false,
                    serverToServer: false,
                    javascriptTracking: false,
                    cookieTracking: true,
                    sessionTracking: true,
                    crossDomainTracking: false,
                    trackingParameters: [],
                    customEvents: [],
                    attributionWindow: 24,
                    conversionWindow: 168,
                    duplicateWindow: 30,
                    allowDuplicates: false,
                    requireValidation: false,
                    validationRules: []
                },
                integrations: data.integrations || [],
                settings: data.settings || {
                    allowMultipleConversions: false,
                    requireApproval: false,
                    autoApprove: false,
                    allowSubAffiliates: false,
                    allowCoupons: false,
                    allowDeepLinks: false,
                    allowDirectLinking: false,
                    requireLandingPage: true,
                    allowMobileTraffic: true,
                    allowDesktopTraffic: true,
                    allowTabletTraffic: true,
                    geoRestrictions: [],
                    deviceRestrictions: [],
                    browserRestrictions: [],
                    timeRestrictions: [],
                    trafficQuality: {
                        minBounceRate: 0,
                        maxBounceRate: 1,
                        minSessionDuration: 0,
                        minPagesPerSession: 1,
                        requireEngagement: false,
                        qualityScore: 0
                    },
                    fraudPrevention: {
                        enableFraudDetection: false,
                        fraudThreshold: 0.7,
                        blockSuspiciousTraffic: false,
                        requireVerification: false,
                        enableAnura: false,
                        customRules: []
                    },
                    compliance: {
                        gdprCompliant: false,
                        ccpaCompliant: false,
                        coppaCompliant: false,
                        requireConsent: false,
                        consentText: '',
                        privacyPolicy: '',
                        termsOfService: '',
                        disclaimer: ''
                    }
                },
                application: data.application || {
                    isOpen: true,
                    requiresApproval: false,
                    autoApprove: false,
                    applicationForm: {
                        fields: [],
                        isCustomizable: false,
                        requireDocuments: false,
                        documentTypes: []
                    },
                    requirements: [],
                    approvalProcess: {
                        steps: [],
                        autoApproval: false,
                        manualReview: true,
                        notificationSettings: {
                            emailNotifications: true,
                            smsNotifications: false,
                            inAppNotifications: true,
                            webhookNotifications: false,
                            notificationTemplates: {}
                        }
                    },
                    rejectionReasons: [],
                    welcomeMessage: '',
                    approvalMessage: '',
                    rejectionMessage: ''
                },
                smartLink: data.smartLink || {
                    enabled: false,
                    baseUrl: '',
                    trackingParameters: [],
                    redirectRules: [],
                    sslEnabled: true,
                    analyticsEnabled: true,
                    aTestingEnabled: false,
                    geoRedirects: [],
                    deviceRedirects: [],
                    timeBasedRedirects: []
                },
                stats: {
                    totalClicks: 0,
                    uniqueClicks: 0,
                    totalConversions: 0,
                    uniqueConversions: 0,
                    conversionRate: 0,
                    totalRevenue: 0,
                    totalPayout: 0,
                    totalAffiliates: 0,
                    activeAffiliates: 0,
                    pendingAffiliates: 0,
                    rejectedAffiliates: 0,
                    byAffiliate: {},
                    byCountry: {},
                    byDevice: {},
                    bySource: {},
                    byHour: {},
                    byDay: {}
                }
            }
        });
    }
    static async findById(id) {
        return await prisma.offer.findUnique({
            where: { id }
        });
    }
    static async update(id, data) {
        return await prisma.offer.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async delete(id) {
        await prisma.offer.delete({
            where: { id }
        });
    }
    static async list(accountId, filters = {}) {
        const where = { accountId };
        if (filters.status)
            where.status = filters.status;
        if (filters.type)
            where.type = filters.type;
        if (filters.category)
            where.category = filters.category;
        if (filters.isPublic !== undefined)
            where.general = { path: ['isPublic'], equals: filters.isPublic };
        return await prisma.offer.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });
    }
    static async addLandingPage(offerId, landingPage) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const newLandingPage = {
            id: `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: landingPage.name,
            url: landingPage.url,
            type: landingPage.type || 'PRIMARY',
            isDefault: landingPage.isDefault || false,
            weight: landingPage.weight || 1,
            conditions: landingPage.conditions || [],
            status: 'ACTIVE'
        };
        const updatedLandingPages = [...offer.landingPages, newLandingPage];
        return await this.update(offerId, { landingPages: updatedLandingPages });
    }
    static async updateLandingPage(offerId, landingPageId, data) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const updatedLandingPages = offer.landingPages.map(lp => lp.id === landingPageId ? { ...lp, ...data } : lp);
        return await this.update(offerId, { landingPages: updatedLandingPages });
    }
    static async removeLandingPage(offerId, landingPageId) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const updatedLandingPages = offer.landingPages.filter(lp => lp.id !== landingPageId);
        return await this.update(offerId, { landingPages: updatedLandingPages });
    }
    static async addCreative(offerId, creative) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const newCreative = {
            id: `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: creative.name,
            type: creative.type,
            format: creative.format || '',
            size: creative.size || '',
            url: creative.url,
            thumbnail: creative.thumbnail,
            altText: creative.altText,
            title: creative.title,
            description: creative.description,
            htmlCode: creative.htmlCode,
            javascriptCode: creative.javascriptCode,
            cssCode: creative.cssCode,
            isActive: creative.isActive !== undefined ? creative.isActive : true,
            isDefault: creative.isDefault || false,
            weight: creative.weight || 1,
            restrictions: creative.restrictions || [],
            trackingCode: creative.trackingCode
        };
        const updatedCreatives = [...offer.creatives, newCreative];
        return await this.update(offerId, { creatives: updatedCreatives });
    }
    static async updateCreative(offerId, creativeId, data) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const updatedCreatives = offer.creatives.map(cr => cr.id === creativeId ? { ...cr, ...data } : cr);
        return await this.update(offerId, { creatives: updatedCreatives });
    }
    static async removeCreative(offerId, creativeId) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const updatedCreatives = offer.creatives.filter(cr => cr.id !== creativeId);
        return await this.update(offerId, { creatives: updatedCreatives });
    }
    static async addIntegration(offerId, integration) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const newIntegration = {
            id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: integration.name,
            type: integration.type,
            url: integration.url,
            method: integration.method || 'POST',
            headers: integration.headers || {},
            parameters: integration.parameters || {},
            authentication: integration.authentication || { type: 'NONE' },
            isActive: integration.isActive !== undefined ? integration.isActive : true,
            retryAttempts: integration.retryAttempts || 3,
            retryDelay: integration.retryDelay || 5,
            timeout: integration.timeout || 30,
            events: integration.events || [],
            conditions: integration.conditions || []
        };
        const updatedIntegrations = [...offer.integrations, newIntegration];
        return await this.update(offerId, { integrations: updatedIntegrations });
    }
    static async updateIntegration(offerId, integrationId, data) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const updatedIntegrations = offer.integrations.map(int => int.id === integrationId ? { ...int, ...data } : int);
        return await this.update(offerId, { integrations: updatedIntegrations });
    }
    static async removeIntegration(offerId, integrationId) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const updatedIntegrations = offer.integrations.filter(int => int.id !== integrationId);
        return await this.update(offerId, { integrations: updatedIntegrations });
    }
    static async generateTrackingCode(offerId, type) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        const baseUrl = process.env.TRACKING_BASE_URL || 'https://track.example.com';
        const trackingId = `offer_${offerId}_${type.toLowerCase()}`;
        switch (type) {
            case 'PIXEL':
                return `
          <!-- Trackdesk Pixel for ${offer.name} -->
          <img src="${baseUrl}/pixel/${trackingId}" width="1" height="1" style="display:none;" alt="" />
          <!-- End Trackdesk Pixel -->
        `;
            case 'JAVASCRIPT':
                return `
          <!-- Trackdesk JavaScript for ${offer.name} -->
          <script>
            (function() {
              var script = document.createElement('script');
              script.src = '${baseUrl}/js/${trackingId}';
              script.async = true;
              document.head.appendChild(script);
            })();
          </script>
          <!-- End Trackdesk JavaScript -->
        `;
            case 'POSTBACK':
                return `
          <!-- Trackdesk Postback for ${offer.name} -->
          Postback URL: ${baseUrl}/postback/${trackingId}
          Method: POST
          Content-Type: application/json
          
          {
            "click_id": "{{click_id}}",
            "affiliate_id": "{{affiliate_id}}",
            "offer_id": "${offerId}",
            "conversion_id": "{{conversion_id}}",
            "amount": "{{amount}}",
            "currency": "{{currency}}",
            "timestamp": "{{timestamp}}"
          }
          <!-- End Trackdesk Postback -->
        `;
            case 'SERVER_TO_SERVER':
                return `
          <!-- Trackdesk Server-to-Server for ${offer.name} -->
          Endpoint: ${baseUrl}/s2s/${trackingId}
          Method: POST
          Content-Type: application/json
          
          {
            "event": "conversion",
            "click_id": "{{click_id}}",
            "affiliate_id": "{{affiliate_id}}",
            "offer_id": "${offerId}",
            "amount": "{{amount}}",
            "currency": "{{currency}}",
            "timestamp": "{{timestamp}}"
          }
          <!-- End Trackdesk Server-to-Server -->
        `;
            default:
                throw new Error('Invalid tracking code type');
        }
    }
    static async createApplication(offerId, affiliateId, applicationData, documents = []) {
        const offer = await this.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        if (!offer.application.isOpen) {
            throw new Error('Offer applications are currently closed');
        }
        return await prisma.offerApplication.create({
            data: {
                offerId,
                affiliateId,
                status: offer.application.autoApprove ? 'APPROVED' : 'PENDING',
                applicationData,
                documents,
                submittedAt: new Date()
            }
        });
    }
    static async findApplicationById(id) {
        return await prisma.offerApplication.findUnique({
            where: { id }
        });
    }
    static async updateApplicationStatus(id, status, reviewedBy, rejectionReason, notes) {
        return await prisma.offerApplication.update({
            where: { id },
            data: {
                status: status,
                reviewedAt: new Date(),
                reviewedBy,
                rejectionReason,
                notes
            }
        });
    }
    static async getApplications(offerId, filters = {}) {
        const where = { offerId };
        if (filters.status)
            where.status = filters.status;
        if (filters.affiliateId)
            where.affiliateId = filters.affiliateId;
        return await prisma.offerApplication.findMany({
            where,
            orderBy: { submittedAt: 'desc' }
        });
    }
    static async updateStats(offerId) {
        const offer = await this.findById(offerId);
        if (!offer)
            return;
        const totalClicks = await prisma.click.count({
            where: { offerId }
        });
        const uniqueClicks = await prisma.click.groupBy({
            by: ['ipAddress'],
            where: { offerId }
        }).then(result => result.length);
        const totalConversions = await prisma.conversion.count({
            where: { offerId }
        });
        const uniqueConversions = await prisma.conversion.groupBy({
            by: ['userId'],
            where: { offerId }
        }).then(result => result.length);
        const totalRevenue = await prisma.conversion.aggregate({
            where: { offerId },
            _sum: { orderValue: true }
        });
        const totalPayout = await prisma.conversion.aggregate({
            where: { offerId },
            _sum: { commissionAmount: true }
        });
        const applications = await this.getApplications(offerId);
        const totalAffiliates = applications.length;
        const activeAffiliates = applications.filter(app => app.status === 'APPROVED').length;
        const pendingAffiliates = applications.filter(app => app.status === 'PENDING').length;
        const rejectedAffiliates = applications.filter(app => app.status === 'REJECTED').length;
        const stats = {
            ...offer.stats,
            totalClicks,
            uniqueClicks,
            totalConversions,
            uniqueConversions,
            conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
            totalRevenue: totalRevenue._sum.orderValue || 0,
            totalPayout: totalPayout._sum.commissionAmount || 0,
            totalAffiliates,
            activeAffiliates,
            pendingAffiliates,
            rejectedAffiliates
        };
        await this.update(offerId, { stats });
    }
    static async getOfferStats(accountId, startDate, endDate) {
        const where = { accountId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }
        const offers = await this.list(accountId);
        const totalClicks = await prisma.click.count({
            where: { offer: { accountId } }
        });
        const totalConversions = await prisma.conversion.count({
            where: { offer: { accountId } }
        });
        const stats = {
            totalOffers: offers.length,
            activeOffers: offers.filter(o => o.status === 'ACTIVE').length,
            pausedOffers: offers.filter(o => o.status === 'PAUSED').length,
            draftOffers: offers.filter(o => o.status === 'DRAFT').length,
            totalClicks,
            totalConversions,
            totalRevenue: offers.reduce((sum, o) => sum + o.stats.totalRevenue, 0),
            totalPayout: offers.reduce((sum, o) => sum + o.stats.totalPayout, 0),
            byType: {},
            byStatus: {},
            byCategory: {}
        };
        offers.forEach(offer => {
            stats.byType[offer.type] = (stats.byType[offer.type] || 0) + 1;
            stats.byStatus[offer.status] = (stats.byStatus[offer.status] || 0) + 1;
            stats.byCategory[offer.category] = (stats.byCategory[offer.category] || 0) + 1;
        });
        return stats;
    }
    static async createDefaultOffers(accountId) {
        const defaultOffers = [
            {
                name: 'E-commerce Sale',
                description: 'Track sales from your e-commerce store',
                category: 'E-commerce',
                type: 'CPS',
                general: {
                    name: 'E-commerce Sale',
                    description: 'Track sales from your e-commerce store',
                    category: 'E-commerce',
                    tags: ['ecommerce', 'sales', 'retail'],
                    targetAudience: 'Online shoppers',
                    restrictions: [],
                    compliance: ['GDPR', 'CCPA'],
                    notes: 'Standard e-commerce tracking offer',
                    isPublic: true,
                    requiresApproval: false,
                    autoApprove: true
                },
                revenue: {
                    type: 'CPS',
                    basePayout: 5.0,
                    currency: 'USD',
                    payoutType: 'PERCENTAGE',
                    payoutSchedule: 'MONTHLY',
                    minimumPayout: 50,
                    holdPeriod: 30,
                    chargebackPeriod: 90,
                    refundPolicy: 'Standard 30-day refund policy'
                }
            },
            {
                name: 'Lead Generation',
                description: 'Generate high-quality leads for your business',
                category: 'Lead Generation',
                type: 'CPL',
                general: {
                    name: 'Lead Generation',
                    description: 'Generate high-quality leads for your business',
                    category: 'Lead Generation',
                    tags: ['leads', 'generation', 'marketing'],
                    targetAudience: 'Business professionals',
                    restrictions: [],
                    compliance: ['GDPR', 'CCPA'],
                    notes: 'Lead generation offer with quality requirements',
                    isPublic: true,
                    requiresApproval: true,
                    autoApprove: false
                },
                revenue: {
                    type: 'CPL',
                    basePayout: 25.0,
                    currency: 'USD',
                    payoutType: 'FIXED',
                    payoutSchedule: 'WEEKLY',
                    minimumPayout: 100,
                    holdPeriod: 7,
                    chargebackPeriod: 30,
                    refundPolicy: 'Leads must be validated within 24 hours'
                }
            }
        ];
        const createdOffers = [];
        for (const offerData of defaultOffers) {
            const offer = await this.create({
                accountId,
                ...offerData
            });
            createdOffers.push(offer);
        }
        return createdOffers;
    }
    static async getOffersDashboard(accountId) {
        const offers = await this.list(accountId);
        const stats = await this.getOfferStats(accountId);
        return {
            offers,
            stats
        };
    }
}
exports.OffersModel = OffersModel;
//# sourceMappingURL=Offers.js.map