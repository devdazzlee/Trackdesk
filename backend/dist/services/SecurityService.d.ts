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
//# sourceMappingURL=SecurityService.d.ts.map