"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralSystemModel = void 0;
const prisma_1 = require("../lib/prisma");
class ReferralSystemModel {
    static async generateReferralCode(affiliateId, data) {
        let code;
        let attempts = 0;
        do {
            if (data.productId) {
                code = `PROD_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            }
            else {
                code = `AFF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            }
            const existing = await prisma_1.prisma.referralCode.findFirst({
                where: { code },
            });
            if (!existing)
                break;
            attempts++;
        } while (attempts < 10);
        if (attempts >= 10) {
            throw new Error("Unable to generate unique referral code");
        }
        const referralCode = await prisma_1.prisma.referralCode.create({
            data: {
                affiliateId,
                code,
                type: data.type,
                commissionRate: data.commissionRate,
                productId: data.productId,
                maxUses: data.maxUses,
                expiresAt: data.expiresAt,
                isActive: true,
                currentUses: 0,
            },
        });
        return referralCode;
    }
    static async processReferral(code, userId, type, data) {
        const referralCode = await prisma_1.prisma.referralCode.findFirst({
            where: {
                code,
                isActive: true,
                OR: [{ type: type }, { type: "BOTH" }],
                AND: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            include: {
                affiliate: true,
            },
        });
        if (!referralCode) {
            throw new Error("Invalid or expired referral code");
        }
        if (referralCode.maxUses &&
            referralCode.currentUses >= referralCode.maxUses) {
            throw new Error("Referral code usage limit reached");
        }
        if (referralCode.productId && data?.productId !== referralCode.productId) {
            throw new Error("Referral code not valid for this product");
        }
        let commissionAmount = 0;
        if (type === "PRODUCT" && data?.orderValue) {
            commissionAmount = (data.orderValue * referralCode.commissionRate) / 100;
        }
        else if (type === "SIGNUP") {
            commissionAmount = 5.0;
        }
        const referralUsage = await prisma_1.prisma.referralUsage.create({
            data: {
                referralCodeId: referralCode.id,
                userId,
                type,
                productId: data?.productId,
                orderValue: data?.orderValue,
                commissionAmount,
                status: "PENDING",
            },
        });
        await prisma_1.prisma.referralCode.update({
            where: { id: referralCode.id },
            data: { currentUses: { increment: 1 } },
        });
        if (commissionAmount > 0) {
            await prisma_1.prisma.affiliateProfile.update({
                where: { id: referralCode.affiliateId },
                data: {
                    totalEarnings: { increment: commissionAmount },
                    totalConversions: { increment: 1 },
                },
            });
        }
        return referralUsage;
    }
    static async getReferralStats(affiliateId) {
        const [referralUsages, commissions] = await Promise.all([
            prisma_1.prisma.referralUsage.findMany({
                where: {
                    referralCode: { affiliateId },
                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                },
                include: {
                    referralCode: true,
                },
            }),
            prisma_1.prisma.commission.findMany({
                where: { affiliateId },
            }),
        ]);
        const totalReferrals = referralUsages.length;
        const totalCommissions = commissions
            .filter((c) => c.status === "PAID")
            .reduce((sum, c) => sum + c.amount, 0);
        const pendingCommissions = commissions
            .filter((c) => c.status === "PENDING")
            .reduce((sum, c) => sum + c.amount, 0);
        const uniqueUsers = new Set(referralUsages.map((r) => r.userId)).size;
        const conversionRate = totalReferrals > 0 ? (uniqueUsers / totalReferrals) * 100 : 0;
        const productStats = referralUsages
            .filter((r) => r.productId)
            .reduce((acc, r) => {
            if (!acc[r.productId]) {
                acc[r.productId] = {
                    productId: r.productId,
                    referrals: 0,
                    commissions: 0,
                };
            }
            acc[r.productId].referrals++;
            acc[r.productId].commissions += r.commissionAmount;
            return acc;
        }, {});
        const topProducts = Object.values(productStats)
            .sort((a, b) => b.commissions - a.commissions)
            .slice(0, 5);
        return {
            totalReferrals,
            totalCommissions,
            pendingCommissions,
            conversionRate,
            topProducts,
        };
    }
    static async getAffiliateReferralCodes(affiliateId) {
        return await prisma_1.prisma.referralCode.findMany({
            where: { affiliateId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { usages: true },
                },
            },
        });
    }
    static async generateShareableLinks(affiliateId, platforms = [
        "facebook",
        "twitter",
        "instagram",
        "linkedin",
        "tiktok",
    ]) {
        const affiliate = await prisma_1.prisma.affiliateProfile.findUnique({
            where: { id: affiliateId },
            include: { user: true },
        });
        if (!affiliate) {
            throw new Error("Affiliate not found");
        }
        const baseUrl = process.env.FRONTEND_URL || "https://trackdesk.com";
        const links = {};
        let generalCode = (await prisma_1.prisma.referralCode.findFirst({
            where: {
                affiliateId,
                type: "BOTH",
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }));
        if (!generalCode) {
            generalCode = await this.generateReferralCode(affiliateId, {
                type: "BOTH",
                commissionRate: affiliate.commissionRate,
            });
        }
        platforms.forEach((platform) => {
            const trackingParams = new URLSearchParams({
                ref: generalCode?.code || "",
                utm_source: platform,
                utm_medium: "affiliate",
                utm_campaign: `${affiliate.user.firstName}_${affiliate.user.lastName}`.toLowerCase(),
            });
            links[platform] = `${baseUrl}/signup?${trackingParams.toString()}`;
        });
        return {
            referralCode: generalCode?.code || "",
            links,
            qrCode: `${baseUrl}/qr/${generalCode?.code || ""}`,
        };
    }
}
exports.ReferralSystemModel = ReferralSystemModel;
//# sourceMappingURL=ReferralSystem.js.map