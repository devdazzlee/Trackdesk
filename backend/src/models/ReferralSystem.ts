import { prisma } from "../lib/prisma";
import { z } from "zod";

export interface ReferralCode {
  id: string;
  affiliateId: string;
  code: string;
  type: "SIGNUP" | "PRODUCT" | "BOTH";
  commissionRate: number;
  productId?: string | null;
  maxUses?: number | null;
  currentUses: number;
  expiresAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralUsage {
  id: string;
  referralCodeId: string;
  userId: string;
  type: "SIGNUP" | "PRODUCT" | "BOTH";
  productId?: string | null;
  orderValue?: number | null;
  commissionAmount: number;
  status: "PENDING" | "APPROVED" | "PAID";
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    referrals: number;
    commissions: number;
  }>;
}

export class ReferralSystemModel {
  /**
   * Generate a unique referral code for an affiliate
   */
  static async generateReferralCode(
    affiliateId: string,
    data: {
      type: "SIGNUP" | "PRODUCT" | "BOTH";
      commissionRate: number;
      productId?: string;
      maxUses?: number;
      expiresAt?: Date;
    }
  ): Promise<ReferralCode> {
    // Generate unique code
    let code: string;
    let attempts = 0;

    do {
      if (data.productId) {
        // Product-specific code: PRODUCT_ABC123
        code = `PROD_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      } else {
        // General affiliate code: AFF_ABC123
        code = `AFF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      }

      const existing = await prisma.referralCode.findFirst({
        where: { code },
      });

      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new Error("Unable to generate unique referral code");
    }

    const referralCode = await prisma.referralCode.create({
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

    return referralCode as ReferralCode;
  }

  /**
   * Process a referral usage (signup or purchase)
   */
  static async processReferral(
    code: string,
    userId: string,
    type: "SIGNUP" | "PRODUCT",
    data?: {
      productId?: string;
      orderValue?: number;
    }
  ): Promise<ReferralUsage> {
    // Find the referral code
    const referralCode = await prisma.referralCode.findFirst({
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

    // Check if max uses reached
    if (
      referralCode.maxUses &&
      referralCode.currentUses >= referralCode.maxUses
    ) {
      throw new Error("Referral code usage limit reached");
    }

    // Check if product-specific code matches
    if (referralCode.productId && data?.productId !== referralCode.productId) {
      throw new Error("Referral code not valid for this product");
    }

    // Calculate commission
    let commissionAmount = 0;
    if (type === "PRODUCT" && data?.orderValue) {
      commissionAmount = (data.orderValue * referralCode.commissionRate) / 100;
    } else if (type === "SIGNUP") {
      // Fixed signup bonus
      commissionAmount = 5.0; // $5 signup bonus
    }

    // Create referral usage record
    const referralUsage = await prisma.referralUsage.create({
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

    // Update referral code usage count
    await prisma.referralCode.update({
      where: { id: referralCode.id },
      data: { currentUses: { increment: 1 } },
    });

    // Update affiliate total earnings
    if (commissionAmount > 0) {
      await prisma.affiliateProfile.update({
        where: { id: referralCode.affiliateId },
        data: {
          totalEarnings: { increment: commissionAmount },
          totalConversions: { increment: 1 },
        },
      });
    }

    // Note: Commission creation requires a conversion record in the database
    // For now, we track the commission amount in the referralUsage
    // Admin can manually create commission records from the referral usages

    return referralUsage as ReferralUsage;
  }

  /**
   * Get referral statistics for an affiliate
   */
  static async getReferralStats(affiliateId: string): Promise<ReferralStats> {
    const [referralUsages, commissions] = await Promise.all([
      prisma.referralUsage.findMany({
        where: {
          referralCode: { affiliateId },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
        include: {
          referralCode: true,
        },
      }),
      prisma.commission.findMany({
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

    // Calculate conversion rate
    const uniqueUsers = new Set(referralUsages.map((r) => r.userId)).size;
    const conversionRate =
      totalReferrals > 0 ? (uniqueUsers / totalReferrals) * 100 : 0;

    // Get top products
    const productStats = referralUsages
      .filter((r) => r.productId)
      .reduce(
        (acc, r) => {
          if (!acc[r.productId!]) {
            acc[r.productId!] = {
              productId: r.productId!,
              referrals: 0,
              commissions: 0,
            };
          }
          acc[r.productId!].referrals++;
          acc[r.productId!].commissions += r.commissionAmount;
          return acc;
        },
        {} as Record<string, any>
      );

    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.commissions - a.commissions)
      .slice(0, 5);

    return {
      totalReferrals,
      totalCommissions,
      pendingCommissions,
      conversionRate,
      topProducts,
    };
  }

  /**
   * Get all referral codes for an affiliate
   */
  static async getAffiliateReferralCodes(affiliateId: string) {
    return await prisma.referralCode.findMany({
      where: { affiliateId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });
  }

  /**
   * Generate shareable affiliate links with referral codes
   */
  static async generateShareableLinks(
    affiliateId: string,
    platforms: string[] = [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "tiktok",
    ]
  ) {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
      include: { user: true },
    });

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const baseUrl = process.env.FRONTEND_URL || "https://trackdesk.com";
    const links: Record<string, string> = {};

    // Get the most recent general referral code
    let generalCode: ReferralCode | null = (await prisma.referralCode.findFirst(
      {
        where: {
          affiliateId,
          type: "BOTH",
          isActive: true,
        },
        orderBy: {
          createdAt: "desc", // Get the most recently created code
        },
      }
    )) as ReferralCode | null;

    if (!generalCode) {
      generalCode = await this.generateReferralCode(affiliateId, {
        type: "BOTH",
        commissionRate: affiliate.commissionRate,
      });
    }

    // Generate platform-specific links
    platforms.forEach((platform) => {
      const trackingParams = new URLSearchParams({
        ref: generalCode?.code || "",
        utm_source: platform,
        utm_medium: "affiliate",
        utm_campaign:
          `${affiliate.user.firstName}_${affiliate.user.lastName}`.toLowerCase(),
      });

      links[platform] = `${baseUrl}/signup?${trackingParams.toString()}`;
    });

    return {
      referralCode: generalCode?.code || "",
      links,
      qrCode: `${baseUrl}/qr/${generalCode?.code || ""}`, // QR code for easy sharing
    };
  }
}
