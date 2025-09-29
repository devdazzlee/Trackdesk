"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLMModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MLMModel {
    static async createStructure(data) {
        return await prisma.mlmStructure.create({
            data: {
                name: data.name,
                maxTiers: data.maxTiers,
                commissionRates: data.commissionRates || [],
                status: data.status || 'ACTIVE',
            }
        });
    }
    static async findStructureById(id) {
        return await prisma.mlmStructure.findUnique({
            where: { id }
        });
    }
    static async updateStructure(id, data) {
        return await prisma.mlmStructure.update({
            where: { id },
            data
        });
    }
    static async createRelationship(data) {
        return await prisma.mlmRelationship.create({
            data: {
                affiliateId: data.affiliateId,
                parentId: data.parentId,
                tier: data.tier,
                path: data.path,
                status: data.status || 'ACTIVE',
            }
        });
    }
    static async findRelationshipByAffiliate(affiliateId) {
        return await prisma.mlmRelationship.findUnique({
            where: { affiliateId }
        });
    }
    static async getDownline(affiliateId, maxTiers = 10) {
        const relationship = await this.findRelationshipByAffiliate(affiliateId);
        if (!relationship) {
            return [];
        }
        const pathPattern = `${relationship.path}.%`;
        return await prisma.mlmRelationship.findMany({
            where: {
                path: {
                    startsWith: relationship.path + '.'
                },
                tier: {
                    lte: relationship.tier + maxTiers
                },
                status: 'ACTIVE'
            },
            orderBy: { tier: 'asc' }
        });
    }
    static async getUpline(affiliateId) {
        const relationship = await this.findRelationshipByAffiliate(affiliateId);
        if (!relationship) {
            return [];
        }
        const pathParts = relationship.path.split('.');
        const upline = [];
        for (let i = pathParts.length - 1; i > 0; i--) {
            const parentPath = pathParts.slice(0, i).join('.');
            const parent = await prisma.mlmRelationship.findFirst({
                where: {
                    path: parentPath,
                    status: 'ACTIVE'
                }
            });
            if (parent) {
                upline.push(parent);
            }
        }
        return upline;
    }
    static async calculateMLMCommissions(conversionId, affiliateId, amount, structureId) {
        const structure = await this.findStructureById(structureId);
        if (!structure) {
            throw new Error('MLM structure not found');
        }
        const commissions = [];
        const upline = await this.getUpline(affiliateId);
        for (const member of upline) {
            if (member.tier > structure.maxTiers) {
                continue;
            }
            const commissionRate = structure.commissionRates.find(rate => rate.tier === member.tier);
            if (!commissionRate) {
                continue;
            }
            let commissionAmount = 0;
            if (commissionRate.type === 'PERCENTAGE') {
                commissionAmount = (amount * commissionRate.rate) / 100;
            }
            else {
                commissionAmount = commissionRate.rate;
            }
            const commission = await prisma.mlmCommission.create({
                data: {
                    conversionId,
                    affiliateId: member.affiliateId,
                    tier: member.tier,
                    amount: commissionAmount,
                    rate: commissionRate.rate,
                    status: 'PENDING'
                }
            });
            commissions.push(commission);
        }
        return commissions;
    }
    static async getMLMStats(affiliateId) {
        const relationship = await this.findRelationshipByAffiliate(affiliateId);
        if (!relationship) {
            return {
                tier: 0,
                downlineCount: 0,
                totalCommissions: 0,
                pendingCommissions: 0,
                paidCommissions: 0
            };
        }
        const downline = await this.getDownline(affiliateId);
        const commissions = await prisma.mlmCommission.findMany({
            where: { affiliateId }
        });
        const totalCommissions = commissions.reduce((sum, comm) => sum + comm.amount, 0);
        const pendingCommissions = commissions
            .filter(comm => comm.status === 'PENDING')
            .reduce((sum, comm) => sum + comm.amount, 0);
        const paidCommissions = commissions
            .filter(comm => comm.status === 'PAID')
            .reduce((sum, comm) => sum + comm.amount, 0);
        return {
            tier: relationship.tier,
            downlineCount: downline.length,
            totalCommissions,
            pendingCommissions,
            paidCommissions,
            downlineByTier: downline.reduce((acc, member) => {
                acc[member.tier] = (acc[member.tier] || 0) + 1;
                return acc;
            }, {})
        };
    }
    static async getMLMReport(structureId, startDate, endDate) {
        const where = {};
        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }
        const commissions = await prisma.mlmCommission.findMany({
            where,
            include: {
                conversion: true,
                affiliate: {
                    include: {
                        user: true
                    }
                }
            }
        });
        const stats = {
            totalCommissions: commissions.length,
            totalAmount: commissions.reduce((sum, comm) => sum + comm.amount, 0),
            byTier: {},
            byAffiliate: {},
            byStatus: {}
        };
        commissions.forEach(commission => {
            if (!stats.byTier[commission.tier]) {
                stats.byTier[commission.tier] = {
                    count: 0,
                    amount: 0
                };
            }
            stats.byTier[commission.tier].count++;
            stats.byTier[commission.tier].amount += commission.amount;
            if (!stats.byAffiliate[commission.affiliateId]) {
                stats.byAffiliate[commission.affiliateId] = {
                    count: 0,
                    amount: 0,
                    name: commission.affiliate.user.firstName + ' ' + commission.affiliate.user.lastName
                };
            }
            stats.byAffiliate[commission.affiliateId].count++;
            stats.byAffiliate[commission.affiliateId].amount += commission.amount;
            stats.byStatus[commission.status] = (stats.byStatus[commission.status] || 0) + 1;
        });
        return stats;
    }
    static async approveCommission(commissionId) {
        return await prisma.mlmCommission.update({
            where: { id: commissionId },
            data: { status: 'APPROVED' }
        });
    }
    static async payCommission(commissionId) {
        return await prisma.mlmCommission.update({
            where: { id: commissionId },
            data: { status: 'PAID' }
        });
    }
}
exports.MLMModel = MLMModel;
//# sourceMappingURL=MLM.js.map