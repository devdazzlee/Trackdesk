export interface PersonalToken {
    id: string;
    userId: string;
    name: string;
    description?: string;
    token: string;
    permissions: string[];
    lastUsedAt?: Date;
    expiresAt?: Date;
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    createdAt: Date;
    updatedAt: Date;
}
export interface TokenUsage {
    id: string;
    tokenId: string;
    endpoint: string;
    method: string;
    ipAddress: string;
    userAgent: string;
    responseStatus: number;
    responseTime: number;
    timestamp: Date;
}
export declare class PersonalTokenModel {
    static create(data: Partial<PersonalToken>): Promise<PersonalToken>;
    static findById(id: string): Promise<PersonalToken | null>;
    static findByToken(token: string): Promise<PersonalToken | null>;
    static findByUserId(userId: string): Promise<PersonalToken[]>;
    static update(id: string, data: Partial<PersonalToken>): Promise<PersonalToken>;
    static delete(id: string): Promise<void>;
    static revoke(id: string): Promise<PersonalToken>;
    static regenerate(id: string): Promise<PersonalToken>;
    static validateToken(token: string): Promise<{
        valid: boolean;
        token?: PersonalToken;
        error?: string;
    }>;
    static checkPermission(token: string, permission: string): Promise<boolean>;
    static recordUsage(tokenId: string, endpoint: string, method: string, ipAddress: string, userAgent: string, responseStatus: number, responseTime: number): Promise<TokenUsage>;
    static getTokenUsage(tokenId: string, page?: number, limit?: number): Promise<TokenUsage[]>;
    static getTokenStats(tokenId: string, startDate?: Date, endDate?: Date): Promise<any>;
    static getAvailablePermissions(): Promise<string[]>;
    static createDefaultTokens(userId: string): Promise<PersonalToken[]>;
    private static generateToken;
    static cleanupExpiredTokens(): Promise<number>;
    static getTokenHealth(): Promise<any>;
}
//# sourceMappingURL=PersonalToken.d.ts.map