export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "ADMIN" | "AFFILIATE" | "MANAGER";
}
export interface LoginData {
    email: string;
    password: string;
}
export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    timezone?: string;
    language?: string;
}
export declare class AuthService {
    register(data: RegisterData): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string;
        };
        message: string;
    }>;
    login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string;
            affiliateProfile: {
                id: string;
                status: string;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                companyName: string | null;
                website: string | null;
                socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentEmail: string | null;
                taxId: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                tier: import(".prisma/client").$Enums.AffiliateTier;
                commissionRate: number;
                totalEarnings: number;
                totalClicks: number;
                totalConversions: number;
                conversionRate: number;
                lastActivityAt: Date | null;
                bankAccount: string | null;
                kycVerified: boolean;
                userId: string;
            };
            adminProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                permissions: string[];
                department: string | null;
            };
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        avatar: string;
        phone: string;
        timezone: string;
        language: string;
        twoFactorEnabled: boolean;
        createdAt: Date;
        lastLoginAt: Date;
        affiliateProfile: {
            id: string;
            status: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyName: string | null;
            website: string | null;
            socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentEmail: string | null;
            taxId: string | null;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            tier: import(".prisma/client").$Enums.AffiliateTier;
            commissionRate: number;
            totalEarnings: number;
            totalClicks: number;
            totalConversions: number;
            conversionRate: number;
            lastActivityAt: Date | null;
            bankAccount: string | null;
            kycVerified: boolean;
            userId: string;
        };
        adminProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            permissions: string[];
            department: string | null;
        };
    }>;
    updateProfile(userId: string, data: UpdateProfileData): Promise<{
        adminProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            permissions: string[];
            department: string | null;
        };
        affiliateProfile: {
            id: string;
            status: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyName: string | null;
            website: string | null;
            socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentEmail: string | null;
            taxId: string | null;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            tier: import(".prisma/client").$Enums.AffiliateTier;
            commissionRate: number;
            totalEarnings: number;
            totalClicks: number;
            totalConversions: number;
            conversionRate: number;
            lastActivityAt: Date | null;
            bankAccount: string | null;
            kycVerified: boolean;
            userId: string;
        };
    } & {
        id: string;
        email: string;
        verificationToken: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        avatar: string | null;
        phone: string | null;
        timezone: string;
        language: string;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
        emailVerified: boolean;
        verificationTokenExpiry: Date | null;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    enable2FA(userId: string): Promise<void>;
    disable2FA(userId: string): Promise<void>;
    generateBackupCodes(userId: string): Promise<any[]>;
}
//# sourceMappingURL=AuthService.d.ts.map