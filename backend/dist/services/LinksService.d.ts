export interface GenerateLinkData {
    url: string;
    campaignName?: string;
    customAlias?: string;
    offerId?: string;
}
export interface GenerateCouponData {
    description: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minPurchase?: number;
    maxUsage?: number;
    validDays?: number;
}
export interface TrackClickData {
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
    country?: string;
    device?: string;
}
export declare class LinksService {
    private generateUniqueSlug;
    generateLink(userId: string, data: GenerateLinkData): Promise<{
        id: string;
        originalUrl: string;
        affiliateUrl: string;
        shortUrl: string;
        trackingCode: string;
        campaignName: string;
        clicks: number;
        conversions: number;
        earnings: number;
        status: string;
        createdAt: Date;
    }>;
    getMyLinks(userId: string): Promise<{
        id: string;
        name: string;
        url: string;
        shortUrl: string;
        trackingCode: string;
        campaignName: string;
        clicks: number;
        conversions: number;
        earnings: number;
        status: string;
        createdAt: Date;
        category: string;
    }[]>;
    getLinkStats(userId: string, linkId: string): Promise<{
        link: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clicks: number;
            conversions: number;
            affiliateId: string;
            expiresAt: Date | null;
            isActive: boolean;
            earnings: number;
            shortUrl: string;
            originalUrl: string;
            offerId: string | null;
            customSlug: string | null;
        };
        clicks: {
            url: string;
            id: string;
            createdAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            affiliateId: string;
            referralCode: string;
            storeId: string;
            utmSource: string | null;
            utmMedium: string | null;
            utmCampaign: string | null;
            referrer: string | null;
        }[];
        totalClicks: number;
        totalConversions: number;
        totalEarnings: number;
        conversionRate: number;
    }>;
    trackClick(trackingCode: string, clickData: TrackClickData): Promise<{
        success: boolean;
        redirectUrl: string;
        click: {
            url: string;
            id: string;
            createdAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            affiliateId: string;
            referralCode: string;
            storeId: string;
            utmSource: string | null;
            utmMedium: string | null;
            utmCampaign: string | null;
            referrer: string | null;
        };
    }>;
    updateLinkStatus(userId: string, linkId: string, isActive: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clicks: number;
        conversions: number;
        affiliateId: string;
        expiresAt: Date | null;
        isActive: boolean;
        earnings: number;
        shortUrl: string;
        originalUrl: string;
        offerId: string | null;
        customSlug: string | null;
    }>;
    deleteLink(userId: string, linkId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAvailableCoupons(userId: string): Promise<{
        id: string;
        code: string;
        description: string;
        discount: string;
        type: string;
        validUntil: string;
        uses: number;
        maxUses: number;
        status: import(".prisma/client").$Enums.CouponStatus;
        createdAt: Date;
    }[]>;
    generateCoupon(userId: string, data: GenerateCouponData): Promise<{
        id: string;
        code: string;
        description: string;
        discount: string;
        type: string;
        minPurchase: string;
        validUntil: string;
        uses: number;
        maxUses: number;
        status: import(".prisma/client").$Enums.CouponStatus;
        createdAt: Date;
    }>;
    useCoupon(couponCode: string): Promise<{
        valid: boolean;
        discount: string;
        affiliateId: string;
    }>;
    deactivateCoupon(userId: string, couponId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CouponStatus;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        affiliateId: string;
        description: string;
        discount: string;
        validUntil: Date;
        usage: number;
        maxUsage: number | null;
    }>;
}
declare const _default: LinksService;
export default _default;
//# sourceMappingURL=LinksService.d.ts.map