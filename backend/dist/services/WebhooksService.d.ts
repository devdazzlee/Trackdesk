export declare class WebhooksService {
    static createWebhook(accountId: string, webhookData: any): Promise<any>;
    static getWebhook(id: string): Promise<any>;
    static updateWebhook(id: string, updateData: any): Promise<any>;
    static deleteWebhook(id: string): Promise<any>;
    static listWebhooks(accountId: string, filters?: any): Promise<any>;
    static addEvent(webhookId: string, eventData: any): Promise<any>;
    static updateEvent(webhookId: string, eventId: string, updateData: any): Promise<any>;
    static removeEvent(webhookId: string, eventId: string): Promise<any>;
    static testWebhook(id: string, testData: any): Promise<any>;
    static triggerWebhook(id: string, eventData: any): Promise<any>;
    static getWebhookHistory(id: string, filters?: any): Promise<any>;
    static getWebhookLogs(id: string, page?: number, limit?: number): Promise<any>;
    static getWebhookStats(id: string, startDate?: Date, endDate?: Date): Promise<any>;
    static getWebhookTemplates(): Promise<any>;
    static createWebhookFromTemplate(accountId: string, templateId: string, customizations: any): Promise<any>;
    static generateSecret(id: string): Promise<any>;
    static validateSignature(id: string, signature: string, payload: string): Promise<any>;
    static retryWebhook(id: string, logId: string): Promise<any>;
    static getWebhooksDashboard(accountId: string): Promise<any>;
    static createDefaultWebhooks(accountId: string): Promise<any>;
    static receiveWebhook(webhookId: string, payload: any, headers: any): Promise<any>;
    static exportWebhooks(accountId: string, format: string): Promise<any>;
    static importWebhooks(accountId: string, webhooks: any[], overwrite?: boolean): Promise<any>;
    static executeWebhook(webhookId: string, eventData: any): Promise<{
        success: boolean;
        status: number;
        statusText: string;
        responseTime: number;
        response: string;
        headers: {
            [k: string]: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        responseTime: number;
        status?: undefined;
        statusText?: undefined;
        response?: undefined;
        headers?: undefined;
    }>;
    private static preparePayload;
    private static applyTransformation;
    private static formatField;
    private static calculateField;
    private static getFieldValue;
    private static evaluateFilter;
    private static sendWebhook;
    private static logWebhookAttempt;
    static retryFailedWebhook(webhookId: string, logId: string): Promise<{
        success: boolean;
        status: number;
        statusText: string;
        responseTime: number;
        response: string;
        headers: {
            [k: string]: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        responseTime: number;
        status?: undefined;
        statusText?: undefined;
        response?: undefined;
        headers?: undefined;
    }>;
    static getWebhookPerformance(webhookId: string, startDate?: Date, endDate?: Date): Promise<{
        totalAttempts: any;
        successfulAttempts: any;
        failedAttempts: any;
        successRate: number;
        averageResponseTime: number;
        byStatus: Record<string, number>;
        byEvent: Record<string, number>;
        byHour: Record<number, number>;
        byDay: Record<string, number>;
    }>;
    static getWebhookRecommendations(webhookId: string): Promise<string[]>;
    static validateWebhookConfiguration(webhookId: string): Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
}
//# sourceMappingURL=WebhooksService.d.ts.map