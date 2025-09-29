export declare class EmailService {
    private transporter;
    sendWelcomeEmail(email: string, firstName: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendCommissionNotification(email: string, amount: number): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendPayoutNotification(email: string, amount: number, method: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
export declare class PaymentService {
    createPayout(affiliateId: string, amount: number, method: string): Promise<{
        method: import(".prisma/client").$Enums.PaymentMethod;
        id: string;
        status: import(".prisma/client").$Enums.PayoutStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        affiliateId: string;
        referenceId: string | null;
        processedAt: Date | null;
    }>;
    processWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
}
export declare class AnalyticsService {
    getFunnelAnalysis(offerId?: string, dateRange?: {
        start: Date;
        end: Date;
    }): Promise<{
        totalClicks: number;
        totalConversions: number;
        conversionRate: number;
    }>;
    getCohortAnalysis(startDate: Date, endDate: Date): Promise<any[]>;
    getAttributionData(conversionId: string): Promise<{
        conversion: {
            click: {
                link: {
                    offer: {
                        name: string;
                        id: string;
                        status: import(".prisma/client").$Enums.OfferStatus;
                        createdAt: Date;
                        updatedAt: Date;
                        commissionRate: number;
                        totalClicks: number;
                        totalConversions: number;
                        description: string;
                        totalRevenue: number;
                        totalCommissions: number;
                        category: string;
                        startDate: Date;
                        endDate: Date | null;
                        terms: string | null;
                        requirements: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    clicks: number;
                    conversions: number;
                    shortUrl: string;
                    originalUrl: string;
                    affiliateId: string;
                    offerId: string | null;
                    customSlug: string | null;
                    earnings: number;
                    isActive: boolean;
                    expiresAt: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                ipAddress: string;
                userAgent: string;
                affiliateId: string;
                conversionId: string | null;
                linkId: string;
                referrer: string | null;
                country: string | null;
                city: string | null;
                device: string | null;
                browser: string | null;
                os: string | null;
                converted: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ConversionStatus;
            createdAt: Date;
            updatedAt: Date;
            customerValue: number;
            commissionAmount: number;
            affiliateId: string;
            offerId: string;
            clickId: string;
            customerEmail: string | null;
        };
        attributionClicks: ({
            link: {
                offer: {
                    name: string;
                    id: string;
                    status: import(".prisma/client").$Enums.OfferStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    commissionRate: number;
                    totalClicks: number;
                    totalConversions: number;
                    description: string;
                    totalRevenue: number;
                    totalCommissions: number;
                    category: string;
                    startDate: Date;
                    endDate: Date | null;
                    terms: string | null;
                    requirements: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                clicks: number;
                conversions: number;
                shortUrl: string;
                originalUrl: string;
                affiliateId: string;
                offerId: string | null;
                customSlug: string | null;
                earnings: number;
                isActive: boolean;
                expiresAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            ipAddress: string;
            userAgent: string;
            affiliateId: string;
            conversionId: string | null;
            linkId: string;
            referrer: string | null;
            country: string | null;
            city: string | null;
            device: string | null;
            browser: string | null;
            os: string | null;
            converted: boolean;
        })[];
        firstClick: {
            link: {
                offer: {
                    name: string;
                    id: string;
                    status: import(".prisma/client").$Enums.OfferStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    commissionRate: number;
                    totalClicks: number;
                    totalConversions: number;
                    description: string;
                    totalRevenue: number;
                    totalCommissions: number;
                    category: string;
                    startDate: Date;
                    endDate: Date | null;
                    terms: string | null;
                    requirements: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                clicks: number;
                conversions: number;
                shortUrl: string;
                originalUrl: string;
                affiliateId: string;
                offerId: string | null;
                customSlug: string | null;
                earnings: number;
                isActive: boolean;
                expiresAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            ipAddress: string;
            userAgent: string;
            affiliateId: string;
            conversionId: string | null;
            linkId: string;
            referrer: string | null;
            country: string | null;
            city: string | null;
            device: string | null;
            browser: string | null;
            os: string | null;
            converted: boolean;
        };
        lastClick: {
            link: {
                offer: {
                    name: string;
                    id: string;
                    status: import(".prisma/client").$Enums.OfferStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    commissionRate: number;
                    totalClicks: number;
                    totalConversions: number;
                    description: string;
                    totalRevenue: number;
                    totalCommissions: number;
                    category: string;
                    startDate: Date;
                    endDate: Date | null;
                    terms: string | null;
                    requirements: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                clicks: number;
                conversions: number;
                shortUrl: string;
                originalUrl: string;
                affiliateId: string;
                offerId: string | null;
                customSlug: string | null;
                earnings: number;
                isActive: boolean;
                expiresAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            ipAddress: string;
            userAgent: string;
            affiliateId: string;
            conversionId: string | null;
            linkId: string;
            referrer: string | null;
            country: string | null;
            city: string | null;
            device: string | null;
            browser: string | null;
            os: string | null;
            converted: boolean;
        };
    }>;
}
export declare class SecurityService {
    generate2FASecret(userId: string): Promise<string>;
    verify2FAToken(userId: string, token: string): Promise<boolean>;
    private generateTOTP;
    logSecurityEvent(userId: string, event: string, details: string, ipAddress?: string, userAgent?: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        resource: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
    }>;
}
export declare class AutomationService {
    triggerWorkflow(workflowId: string, triggerData: any): Promise<{
        success: boolean;
        workflowId: string;
    }>;
    createAutomationRule(ruleData: any): Promise<{
        name: string;
        id: string;
        status: import(".prisma/client").$Enums.RuleStatus;
        createdAt: Date;
        updatedAt: Date;
        action: import(".prisma/client").$Enums.RuleAction;
        type: import(".prisma/client").$Enums.RuleType;
        description: string;
        conditions: import("@prisma/client/runtime/library").JsonValue;
        lastTriggered: Date | null;
        hits: number;
    }>;
}
export declare class IntegrationService {
    syncShopifyProducts(shopDomain: string, apiKey: string): Promise<{
        success: boolean;
        productsSynced: number;
    }>;
    syncMailchimpList(listId: string, apiKey: string): Promise<{
        success: boolean;
        subscribersSynced: number;
    }>;
    createWebhook(url: string, events: string[], secret: string): Promise<{
        name: string;
        url: string;
        id: string;
        status: import(".prisma/client").$Enums.WebhookStatus;
        createdAt: Date;
        updatedAt: Date;
        lastTriggered: Date | null;
        events: string[];
        secret: string;
        successRate: number;
        totalCalls: number;
    }>;
    triggerWebhook(webhookId: string, event: string, data: any): Promise<{
        success: boolean;
        status: number;
    }>;
}
export declare const emailService: EmailService;
export declare const paymentService: PaymentService;
export declare const analyticsService: AnalyticsService;
export declare const securityService: SecurityService;
export declare const automationService: AutomationService;
export declare const integrationService: IntegrationService;
//# sourceMappingURL=index.d.ts.map