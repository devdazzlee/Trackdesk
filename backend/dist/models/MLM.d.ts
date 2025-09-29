export interface MLMStructure {
    id: string;
    name: string;
    maxTiers: number;
    commissionRates: MLMCommissionRate[];
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}
export interface MLMCommissionRate {
    tier: number;
    rate: number;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
}
export interface MLMRelationship {
    id: string;
    affiliateId: string;
    parentId?: string;
    tier: number;
    path: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}
export interface MLMCommission {
    id: string;
    conversionId: string;
    affiliateId: string;
    tier: number;
    amount: number;
    rate: number;
    status: 'PENDING' | 'APPROVED' | 'PAID';
    createdAt: Date;
    updatedAt: Date;
}
export declare class MLMModel {
    static createStructure(data: Partial<MLMStructure>): Promise<MLMStructure>;
    static findStructureById(id: string): Promise<MLMStructure | null>;
    static updateStructure(id: string, data: Partial<MLMStructure>): Promise<MLMStructure>;
    static createRelationship(data: Partial<MLMRelationship>): Promise<MLMRelationship>;
    static findRelationshipByAffiliate(affiliateId: string): Promise<MLMRelationship | null>;
    static getDownline(affiliateId: string, maxTiers?: number): Promise<MLMRelationship[]>;
    static getUpline(affiliateId: string): Promise<MLMRelationship[]>;
    static calculateMLMCommissions(conversionId: string, affiliateId: string, amount: number, structureId: string): Promise<MLMCommission[]>;
    static getMLMStats(affiliateId: string): Promise<any>;
    static getMLMReport(structureId: string, startDate?: Date, endDate?: Date): Promise<any>;
    static approveCommission(commissionId: string): Promise<MLMCommission>;
    static payCommission(commissionId: string): Promise<MLMCommission>;
}
//# sourceMappingURL=MLM.d.ts.map