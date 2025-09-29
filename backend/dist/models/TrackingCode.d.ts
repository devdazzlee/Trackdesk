export interface TrackingCode {
    id: string;
    name: string;
    type: 'PIXEL' | 'JAVASCRIPT' | 'SERVER_TO_SERVER' | 'WEBHOOK';
    code: string;
    placement: 'HEAD' | 'BODY' | 'FOOTER' | 'CUSTOM';
    events: string[];
    parameters: TrackingParameter[];
    status: 'ACTIVE' | 'INACTIVE';
    affiliateId?: string;
    offerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TrackingParameter {
    name: string;
    value: string;
    type: 'STATIC' | 'DYNAMIC' | 'CUSTOM';
    required: boolean;
}
export interface TrackingEvent {
    id: string;
    trackingCodeId: string;
    event: string;
    data: any;
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    timestamp: Date;
}
export declare class TrackingCodeModel {
    static create(data: Partial<TrackingCode>): Promise<TrackingCode>;
    static findById(id: string): Promise<TrackingCode | null>;
    static update(id: string, data: Partial<TrackingCode>): Promise<TrackingCode>;
    static delete(id: string): Promise<void>;
    static list(filters?: any, page?: number, limit?: number): Promise<TrackingCode[]>;
    static generatePixelCode(trackingCodeId: string, baseUrl: string): Promise<string>;
    static generateJavaScriptCode(trackingCodeId: string, baseUrl: string): Promise<string>;
    static generateServerToServerCode(trackingCodeId: string, baseUrl: string): Promise<string>;
    static generateWebhookCode(trackingCodeId: string, baseUrl: string): Promise<string>;
    static recordEvent(trackingCodeId: string, event: string, data: any, ipAddress: string, userAgent: string, referrer?: string): Promise<TrackingEvent>;
    static getEvents(trackingCodeId: string, page?: number, limit?: number): Promise<TrackingEvent[]>;
    static getEventStats(trackingCodeId: string, startDate?: Date, endDate?: Date): Promise<any>;
    static validateTrackingCode(trackingCodeId: string, event: string): Promise<boolean>;
}
//# sourceMappingURL=TrackingCode.d.ts.map