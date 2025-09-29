export interface StatsParams {
    timeRange?: '7d' | '30d' | '90d' | '1y';
    startDate?: string;
    endDate?: string;
}
export interface PerformanceChartParams {
    timeRange?: '7d' | '30d' | '90d' | '1y';
    metric?: 'clicks' | 'conversions' | 'revenue' | 'commission';
    groupBy?: 'day' | 'week' | 'month';
}
export declare class DashboardService {
    getStats(userId: string, userRole: string, params: StatsParams): Promise<{
        totalClicks: number;
        totalConversions: number;
        totalEarnings: number;
        totalPayouts: number;
        conversionRate: number;
        availableBalance: number;
        totalAffiliates?: undefined;
        totalRevenue?: undefined;
        totalCommissions?: undefined;
    } | {
        totalAffiliates: number;
        totalClicks: number;
        totalConversions: number;
        totalRevenue: number;
        totalCommissions: number;
        conversionRate: number;
        totalEarnings?: undefined;
        totalPayouts?: undefined;
        availableBalance?: undefined;
    }>;
    getRecentActivity(userId: string, limit: number): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        action: string;
        resource: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
    })[]>;
    getPerformanceChart(userId: string, userRole: string, params: PerformanceChartParams): Promise<any[]>;
    getTopOffers(userId: string, userRole: string, limit: number): Promise<{
        id: string;
        name: string;
        category: string;
        commissionRate: number;
        totalClicks: number;
        totalConversions: number;
        conversionRate: number;
    }[]>;
    getNotifications(userId: string, page: number, limit: number, unreadOnly: boolean): Promise<{
        notifications: {
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            read: boolean;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    markNotificationAsRead(userId: string, notificationId: string): Promise<void>;
}
//# sourceMappingURL=DashboardService.d.ts.map