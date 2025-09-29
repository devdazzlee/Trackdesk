export interface Postback {
    id: string;
    name: string;
    url: string;
    method: 'GET' | 'POST';
    events: string[];
    parameters: PostbackParameter[];
    headers: Record<string, string>;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    lastTriggered?: Date;
    successCount: number;
    failureCount: number;
    affiliateId?: string;
    offerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PostbackParameter {
    name: string;
    value: string;
    type: 'STATIC' | 'DYNAMIC' | 'CUSTOM';
    required: boolean;
}
export interface PostbackLog {
    id: string;
    postbackId: string;
    event: string;
    url: string;
    method: string;
    payload: any;
    response?: any;
    statusCode?: number;
    success: boolean;
    error?: string;
    triggeredAt: Date;
    responseTime: number;
}
export declare class PostbackModel {
    static create(data: Partial<Postback>): Promise<Postback>;
    static findById(id: string): Promise<Postback | null>;
    static update(id: string, data: Partial<Postback>): Promise<Postback>;
    static delete(id: string): Promise<void>;
    static list(filters?: any, page?: number, limit?: number): Promise<Postback[]>;
    static triggerPostback(postbackId: string, event: string, data: any): Promise<PostbackLog>;
    private static getDynamicValue;
    private static getCustomValue;
    static getLogs(postbackId: string, page?: number, limit?: number): Promise<PostbackLog[]>;
    static testPostback(postbackId: string, testData: any): Promise<PostbackLog>;
}
//# sourceMappingURL=Postback.d.ts.map