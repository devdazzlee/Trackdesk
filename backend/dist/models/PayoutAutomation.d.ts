export interface PayoutRule {
    id: string;
    accountId: string;
    name: string;
    description: string;
    conditions: PayoutCondition[];
    actions: PayoutAction[];
    schedule: PayoutSchedule;
    status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface PayoutCondition {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN' | 'NOT_IN';
    value: any;
    logic: 'AND' | 'OR';
}
export interface PayoutAction {
    type: 'CREATE_PAYOUT' | 'SEND_NOTIFICATION' | 'UPDATE_STATUS' | 'WEBHOOK' | 'EMAIL' | 'SMS';
    parameters: Record<string, any>;
    enabled: boolean;
}
export interface PayoutSchedule {
    type: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    time: string;
    timezone: string;
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    customCron?: string;
}
export interface PayoutAutomation {
    id: string;
    accountId: string;
    name: string;
    description: string;
    rules: PayoutRule[];
    settings: AutomationSettings;
    status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
    lastRun?: Date;
    nextRun?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface AutomationSettings {
    maxPayoutsPerRun: number;
    maxPayoutAmount: number;
    minPayoutAmount: number;
    allowedPaymentMethods: string[];
    requireApproval: boolean;
    autoApprove: boolean;
    notificationSettings: {
        onSuccess: boolean;
        onFailure: boolean;
        onPayoutCreated: boolean;
        recipients: string[];
    };
    retrySettings: {
        maxRetries: number;
        retryDelay: number;
        backoffMultiplier: number;
    };
}
export interface PayoutAutomationLog {
    id: string;
    automationId: string;
    ruleId: string;
    action: string;
    status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
    message: string;
    data: any;
    executionTime: number;
    timestamp: Date;
}
export declare class PayoutAutomationModel {
    static createAutomation(data: Partial<PayoutAutomation>): Promise<PayoutAutomation>;
    static findById(id: string): Promise<PayoutAutomation | null>;
    static update(id: string, data: Partial<PayoutAutomation>): Promise<PayoutAutomation>;
    static delete(id: string): Promise<void>;
    static list(accountId: string, filters?: any): Promise<PayoutAutomation[]>;
    static executeAutomation(automationId: string): Promise<{
        success: boolean;
        message: string;
        payoutsCreated: number;
    }>;
    private static getEligibleAffiliates;
    private static evaluateRule;
    private static evaluateCondition;
    private static getFieldValue;
    private static executeRuleActions;
    private static createPayout;
    private static sendNotification;
    private static updateStatus;
    private static callWebhook;
    private static sendEmail;
    private static sendSMS;
    private static calculateNextRun;
    static logExecution(automationId: string, action: string, status: string, message: string, data: any, executionTime: number): Promise<PayoutAutomationLog>;
    static getExecutionLogs(automationId: string, page?: number, limit?: number): Promise<PayoutAutomationLog[]>;
    static getAutomationStats(accountId: string, startDate?: Date, endDate?: Date): Promise<any>;
    static createDefaultAutomation(accountId: string): Promise<PayoutAutomation>;
    static pauseAutomation(id: string): Promise<PayoutAutomation>;
    static resumeAutomation(id: string): Promise<PayoutAutomation>;
    static testAutomation(id: string): Promise<{
        success: boolean;
        message: string;
        testResults: any;
    }>;
    static getAutomationDashboard(accountId: string): Promise<any>;
}
//# sourceMappingURL=PayoutAutomation.d.ts.map