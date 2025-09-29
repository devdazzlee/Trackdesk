export interface TrafficRule {
    id: string;
    name: string;
    description: string;
    type: 'GEO_BLOCKING' | 'IP_BLOCKING' | 'DEVICE_BLOCKING' | 'RATE_LIMITING' | 'TRAFFIC_SOURCE' | 'TIME_BASED';
    conditions: TrafficCondition[];
    actions: TrafficAction[];
    priority: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}
export interface TrafficCondition {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'BETWEEN';
    value: any;
    weight: number;
}
export interface TrafficAction {
    type: 'ALLOW' | 'BLOCK' | 'REDIRECT' | 'THROTTLE' | 'CAPTCHA' | 'NOTIFY';
    parameters: Record<string, any>;
}
export interface TrafficEvent {
    id: string;
    ruleId: string;
    type: string;
    data: any;
    action: string;
    ipAddress: string;
    userAgent: string;
    country?: string;
    device?: string;
    browser?: string;
    os?: string;
    affiliateId?: string;
    clickId?: string;
    timestamp: Date;
}
export interface TrafficStats {
    totalRequests: number;
    allowedRequests: number;
    blockedRequests: number;
    redirectedRequests: number;
    throttledRequests: number;
    byRule: Record<string, any>;
    byCountry: Record<string, any>;
    byDevice: Record<string, any>;
    byHour: Record<number, any>;
    topIPs: Array<{
        ip: string;
        count: number;
        action: string;
    }>;
}
export declare class TrafficControlModel {
    static createRule(data: Partial<TrafficRule>): Promise<TrafficRule>;
    static findRuleById(id: string): Promise<TrafficRule | null>;
    static updateRule(id: string, data: Partial<TrafficRule>): Promise<TrafficRule>;
    static deleteRule(id: string): Promise<void>;
    static listRules(filters?: any): Promise<TrafficRule[]>;
    static processTraffic(data: any, ipAddress: string, userAgent: string, affiliateId?: string, clickId?: string): Promise<TrafficEvent>;
    private static evaluateRule;
    private static evaluateCondition;
    private static getFieldValue;
    private static executeTrafficAction;
    static getTrafficEvents(filters?: any, page?: number, limit?: number): Promise<TrafficEvent[]>;
    static getTrafficStats(startDate?: Date, endDate?: Date): Promise<TrafficStats>;
    static createDefaultRules(): Promise<TrafficRule[]>;
}
//# sourceMappingURL=TrafficControl.d.ts.map