export interface Tier {
    id: string;
    accountId: string;
    name: string;
    description: string;
    level: number;
    requirements: TierRequirements;
    benefits: TierBenefits;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}
export interface TierRequirements {
    minimumClicks: number;
    minimumConversions: number;
    minimumEarnings: number;
    minimumReferrals: number;
    timePeriod: number;
    otherRequirements: string[];
}
export interface TierBenefits {
    commissionRate: number;
    bonusRate: number;
    prioritySupport: boolean;
    customFeatures: string[];
    exclusiveOffers: boolean;
    higherPayouts: boolean;
    marketingMaterials: boolean;
    dedicatedManager: boolean;
}
export interface TierAssignment {
    id: string;
    affiliateId: string;
    tierId: string;
    assignedAt: Date;
    assignedBy: string;
    reason: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    expiresAt?: Date;
}
export interface TierProgress {
    id: string;
    affiliateId: string;
    tierId: string;
    currentClicks: number;
    currentConversions: number;
    currentEarnings: number;
    currentReferrals: number;
    progressPercentage: number;
    nextTierId?: string;
    lastUpdated: Date;
}
export declare class TiersModel {
    static create(data: Partial<Tier>): Promise<Tier>;
    static findById(id: string): Promise<Tier | null>;
    static update(id: string, data: Partial<Tier>): Promise<Tier>;
    static delete(id: string): Promise<void>;
    static list(accountId: string, filters?: any): Promise<Tier[]>;
    static assignTier(affiliateId: string, tierId: string, assignedBy: string, reason: string, expiresAt?: Date): Promise<TierAssignment>;
    static getAffiliateTier(affiliateId: string): Promise<Tier | null>;
    static calculateTierProgress(affiliateId: string, tierId: string): Promise<TierProgress>;
    static getAffiliateProgress(affiliateId: string): Promise<TierProgress[]>;
    static checkTierEligibility(affiliateId: string): Promise<{
        eligible: boolean;
        tier?: Tier;
        reason?: string;
    }>;
    static autoAssignTiers(accountId: string): Promise<{
        assigned: number;
        errors: string[];
    }>;
    static getTierStats(accountId: string): Promise<any>;
    static createDefaultTiers(accountId: string): Promise<Tier[]>;
    static getTierBenefits(affiliateId: string): Promise<any>;
    static updateTierProgress(affiliateId: string): Promise<void>;
    static getTierLeaderboard(accountId: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=Tiers.d.ts.map