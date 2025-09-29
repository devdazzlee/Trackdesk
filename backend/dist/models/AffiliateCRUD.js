"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateCRUDModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AffiliateCRUDModel {
    static async create(data) {
        return await prisma.affiliateProfile.create({
            data: {
                userId: data.userId,
                companyName: data.companyName || '',
                website: data.website || '',
                phone: data.phone || '',
                address: data.address || '',
                taxId: data.taxId || '',
                bankAccount: data.bankAccount || '',
                status: data.status || 'PENDING',
                tier: data.tier || 'BRONZE',
                totalEarnings: 0,
                totalClicks: 0,
                totalConversions: 0,
                conversionRate: 0,
                lastActivity: new Date(),
                kycVerified: false,
                kycDocuments: [],
                preferredPaymentMethod: data.preferredPaymentMethod || 'PAYPAL',
                paymentDetails: data.paymentDetails || {},
                notes: data.notes || '',
                tags: data.tags || [],
                customFields: data.customFields || {}
            }
        });
    }
    static async findById(id) {
        return await prisma.affiliateProfile.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    static async findByUserId(userId) {
        return await prisma.affiliateProfile.findUnique({
            where: { userId },
            include: {
                user: true
            }
        });
    }
    static async update(id, data) {
        return await prisma.affiliateProfile.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    static async delete(id) {
        await prisma.affiliateProfile.delete({
            where: { id }
        });
    }
    static async list(filters = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.tier)
            where.tier = filters.tier;
        if (filters.kycVerified !== undefined)
            where.kycVerified = filters.kycVerified;
        if (filters.search) {
            where.OR = [
                { companyName: { contains: filters.search } },
                { website: { contains: filters.search } },
                { user: { firstName: { contains: filters.search } } },
                { user: { lastName: { contains: filters.search } } },
                { user: { email: { contains: filters.search } } }
            ];
        }
        if (filters.tags)
            where.tags = { hasSome: filters.tags };
        if (filters.minEarnings)
            where.totalEarnings = { gte: filters.minEarnings };
        if (filters.maxEarnings)
            where.totalEarnings = { lte: filters.maxEarnings };
        if (filters.startDate && filters.endDate) {
            where.createdAt = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        return await prisma.affiliateProfile.findMany({
            where,
            include: {
                user: true
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async approve(id, approvedBy, notes) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedAffiliate = await this.update(id, {
            status: 'ACTIVE'
        });
        await this.logActivity(id, 'STATUS_CHANGE', 'Affiliate approved', {
            previousStatus: affiliate.status,
            newStatus: 'ACTIVE',
            approvedBy,
            notes
        }, '127.0.0.1', 'System');
        return updatedAffiliate;
    }
    static async reject(id, rejectedBy, reason) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedAffiliate = await this.update(id, {
            status: 'REJECTED'
        });
        await this.logActivity(id, 'STATUS_CHANGE', 'Affiliate rejected', {
            previousStatus: affiliate.status,
            newStatus: 'REJECTED',
            rejectedBy,
            reason
        }, '127.0.0.1', 'System');
        return updatedAffiliate;
    }
    static async suspend(id, suspendedBy, reason) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedAffiliate = await this.update(id, {
            status: 'SUSPENDED'
        });
        await this.logActivity(id, 'STATUS_CHANGE', 'Affiliate suspended', {
            previousStatus: affiliate.status,
            newStatus: 'SUSPENDED',
            suspendedBy,
            reason
        }, '127.0.0.1', 'System');
        return updatedAffiliate;
    }
    static async activate(id, activatedBy) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedAffiliate = await this.update(id, {
            status: 'ACTIVE'
        });
        await this.logActivity(id, 'STATUS_CHANGE', 'Affiliate activated', {
            previousStatus: affiliate.status,
            newStatus: 'ACTIVE',
            activatedBy
        }, '127.0.0.1', 'System');
        return updatedAffiliate;
    }
    static async updateTier(id, newTier, updatedBy) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedAffiliate = await this.update(id, {
            tier: newTier
        });
        await this.logActivity(id, 'PROFILE_UPDATE', 'Tier updated', {
            previousTier: affiliate.tier,
            newTier,
            updatedBy
        }, '127.0.0.1', 'System');
        return updatedAffiliate;
    }
    static async updateKYCStatus(id, verified, verifiedBy, notes) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedAffiliate = await this.update(id, {
            kycVerified: verified
        });
        await this.logActivity(id, 'PROFILE_UPDATE', 'KYC status updated', {
            previousStatus: affiliate.kycVerified,
            newStatus: verified,
            verifiedBy,
            notes
        }, '127.0.0.1', 'System');
        return updatedAffiliate;
    }
    static async addTag(id, tag) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedTags = [...affiliate.tags, tag];
        return await this.update(id, { tags: updatedTags });
    }
    static async removeTag(id, tag) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedTags = affiliate.tags.filter(t => t !== tag);
        return await this.update(id, { tags: updatedTags });
    }
    static async updateCustomField(id, field, value) {
        const affiliate = await this.findById(id);
        if (!affiliate) {
            throw new Error('Affiliate not found');
        }
        const updatedCustomFields = {
            ...affiliate.customFields,
            [field]: value
        };
        return await this.update(id, { customFields: updatedCustomFields });
    }
    static async logActivity(affiliateId, type, description, data, ipAddress, userAgent) {
        return await prisma.affiliateActivity.create({
            data: {
                affiliateId,
                type: type,
                description,
                data,
                ipAddress,
                userAgent,
                timestamp: new Date()
            }
        });
    }
    static async getActivities(affiliateId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return await prisma.affiliateActivity.findMany({
            where: { affiliateId },
            skip,
            take: limit,
            orderBy: { timestamp: 'desc' }
        });
    }
    static async uploadDocument(affiliateId, type, name, url, size, mimeType) {
        return await prisma.affiliateDocument.create({
            data: {
                affiliateId,
                type: type,
                name,
                url,
                size,
                mimeType,
                status: 'PENDING',
                uploadedAt: new Date()
            }
        });
    }
    static async findDocumentById(id) {
        return await prisma.affiliateDocument.findUnique({
            where: { id }
        });
    }
    static async listDocuments(affiliateId, filters = {}) {
        const where = { affiliateId };
        if (filters.type)
            where.type = filters.type;
        if (filters.status)
            where.status = filters.status;
        return await prisma.affiliateDocument.findMany({
            where,
            orderBy: { uploadedAt: 'desc' }
        });
    }
    static async updateDocumentStatus(id, status, reviewedBy, notes) {
        return await prisma.affiliateDocument.update({
            where: { id },
            data: {
                status: status,
                reviewedAt: new Date(),
                reviewedBy,
                notes
            }
        });
    }
    static async deleteDocument(id) {
        await prisma.affiliateDocument.delete({
            where: { id }
        });
    }
    static async getAffiliateStats(affiliateId, startDate, endDate) {
        const where = { affiliateId };
        if (startDate && endDate) {
            where.timestamp = {
                gte: startDate,
                lte: endDate
            };
        }
        const activities = await prisma.affiliateActivity.findMany({
            where
        });
        const clicks = await prisma.click.findMany({
            where: { affiliateId }
        });
        const conversions = await prisma.conversion.findMany({
            where: { affiliateId }
        });
        const payouts = await prisma.payout.findMany({
            where: { affiliateId }
        });
        const stats = {
            totalClicks: clicks.length,
            totalConversions: conversions.length,
            totalPayouts: payouts.length,
            totalEarnings: conversions.reduce((sum, c) => sum + c.commissionAmount, 0),
            totalPayoutAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
            conversionRate: clicks.length > 0 ? (conversions.length / clicks.length) * 100 : 0,
            averageOrderValue: conversions.length > 0 ? conversions.reduce((sum, c) => sum + c.orderValue, 0) / conversions.length : 0,
            byMonth: {},
            byOffer: {},
            byCountry: {},
            byDevice: {}
        };
        conversions.forEach(conversion => {
            const month = conversion.createdAt.toISOString().substr(0, 7);
            if (!stats.byMonth[month]) {
                stats.byMonth[month] = { clicks: 0, conversions: 0, earnings: 0 };
            }
            stats.byMonth[month].conversions++;
            stats.byMonth[month].earnings += conversion.commissionAmount;
        });
        clicks.forEach(click => {
            const month = click.timestamp.toISOString().substr(0, 7);
            if (!stats.byMonth[month]) {
                stats.byMonth[month] = { clicks: 0, conversions: 0, earnings: 0 };
            }
            stats.byMonth[month].clicks++;
        });
        conversions.forEach(conversion => {
            if (!stats.byOffer[conversion.offerId]) {
                stats.byOffer[conversion.offerId] = { conversions: 0, earnings: 0 };
            }
            stats.byOffer[conversion.offerId].conversions++;
            stats.byOffer[conversion.offerId].earnings += conversion.commissionAmount;
        });
        clicks.forEach(click => {
            if (click.country) {
                if (!stats.byCountry[click.country]) {
                    stats.byCountry[click.country] = { clicks: 0, conversions: 0 };
                }
                stats.byCountry[click.country].clicks++;
            }
        });
        conversions.forEach(conversion => {
            if (conversion.country) {
                if (!stats.byCountry[conversion.country]) {
                    stats.byCountry[conversion.country] = { clicks: 0, conversions: 0 };
                }
                stats.byCountry[conversion.country].conversions++;
            }
        });
        clicks.forEach(click => {
            if (click.device) {
                if (!stats.byDevice[click.device]) {
                    stats.byDevice[click.device] = { clicks: 0, conversions: 0 };
                }
                stats.byDevice[click.device].clicks++;
            }
        });
        conversions.forEach(conversion => {
            if (conversion.device) {
                if (!stats.byDevice[conversion.device]) {
                    stats.byDevice[conversion.device] = { clicks: 0, conversions: 0 };
                }
                stats.byDevice[conversion.device].conversions++;
            }
        });
        return stats;
    }
    static async getAffiliateDashboard(affiliateId) {
        const affiliate = await this.findById(affiliateId);
        if (!affiliate) {
            return null;
        }
        const stats = await this.getAffiliateStats(affiliateId);
        const recentActivities = await this.getActivities(affiliateId, 1, 10);
        const documents = await this.listDocuments(affiliateId);
        return {
            affiliate,
            stats,
            recentActivities,
            documents
        };
    }
    static async bulkUpdateStatus(affiliateIds, status, updatedBy, reason) {
        const updatedAffiliates = [];
        for (const id of affiliateIds) {
            const affiliate = await this.findById(id);
            if (affiliate) {
                const updatedAffiliate = await this.update(id, { status: status });
                updatedAffiliates.push(updatedAffiliate);
                await this.logActivity(id, 'STATUS_CHANGE', `Bulk status update to ${status}`, {
                    previousStatus: affiliate.status,
                    newStatus: status,
                    updatedBy,
                    reason
                }, '127.0.0.1', 'System');
            }
        }
        return updatedAffiliates;
    }
    static async bulkUpdateTier(affiliateIds, tier, updatedBy) {
        const updatedAffiliates = [];
        for (const id of affiliateIds) {
            const affiliate = await this.findById(id);
            if (affiliate) {
                const updatedAffiliate = await this.update(id, { tier });
                updatedAffiliates.push(updatedAffiliate);
                await this.logActivity(id, 'PROFILE_UPDATE', `Bulk tier update to ${tier}`, {
                    previousTier: affiliate.tier,
                    newTier: tier,
                    updatedBy
                }, '127.0.0.1', 'System');
            }
        }
        return updatedAffiliates;
    }
    static async exportAffiliateData(affiliateId) {
        const affiliate = await this.findById(affiliateId);
        if (!affiliate) {
            return null;
        }
        const stats = await this.getAffiliateStats(affiliateId);
        const activities = await this.getActivities(affiliateId, 1, 1000);
        const documents = await this.listDocuments(affiliateId);
        return {
            affiliate,
            stats,
            activities,
            documents,
            exportedAt: new Date().toISOString()
        };
    }
    static async getAffiliateLeaderboard(filters = {}, limit = 10) {
        const where = { status: 'ACTIVE' };
        if (filters.tier)
            where.tier = filters.tier;
        if (filters.startDate && filters.endDate) {
            where.createdAt = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        const affiliates = await prisma.affiliateProfile.findMany({
            where,
            include: {
                user: true
            },
            orderBy: { totalEarnings: 'desc' },
            take: limit
        });
        return affiliates.map(affiliate => ({
            id: affiliate.id,
            name: `${affiliate.user.firstName} ${affiliate.user.lastName}`,
            companyName: affiliate.companyName,
            tier: affiliate.tier,
            totalEarnings: affiliate.totalEarnings,
            totalClicks: affiliate.totalClicks,
            totalConversions: affiliate.totalConversions,
            conversionRate: affiliate.conversionRate
        }));
    }
    static async getAffiliateSummary() {
        const totalAffiliates = await prisma.affiliateProfile.count();
        const activeAffiliates = await prisma.affiliateProfile.count({
            where: { status: 'ACTIVE' }
        });
        const pendingAffiliates = await prisma.affiliateProfile.count({
            where: { status: 'PENDING' }
        });
        const suspendedAffiliates = await prisma.affiliateProfile.count({
            where: { status: 'SUSPENDED' }
        });
        const totalEarnings = await prisma.affiliateProfile.aggregate({
            _sum: { totalEarnings: true }
        });
        const totalClicks = await prisma.affiliateProfile.aggregate({
            _sum: { totalClicks: true }
        });
        const totalConversions = await prisma.affiliateProfile.aggregate({
            _sum: { totalConversions: true }
        });
        return {
            totalAffiliates,
            activeAffiliates,
            pendingAffiliates,
            suspendedAffiliates,
            totalEarnings: totalEarnings._sum.totalEarnings || 0,
            totalClicks: totalClicks._sum.totalClicks || 0,
            totalConversions: totalConversions._sum.totalConversions || 0,
            averageEarnings: activeAffiliates > 0 ? (totalEarnings._sum.totalEarnings || 0) / activeAffiliates : 0
        };
    }
}
exports.AffiliateCRUDModel = AffiliateCRUDModel;
//# sourceMappingURL=AffiliateCRUD.js.map