import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

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

export class LinksService {
  /**
   * Generate a unique short URL slug
   */
  private async generateUniqueSlug(customAlias?: string): Promise<string> {
    if (customAlias) {
      // Check if custom alias is available
      const existing = await prisma.affiliateLink.findFirst({
        where: { customSlug: customAlias },
      });

      if (existing) {
        throw new Error("Custom alias is already taken");
      }

      return customAlias;
    }

    // Generate random slug and ensure it's unique
    let slug: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      slug = crypto.randomBytes(6).toString("hex");
      const existing = await prisma.affiliateLink.findFirst({
        where: { customSlug: slug },
      });

      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error("Failed to generate unique slug");
    }

    return slug;
  }

  /**
   * Generate affiliate tracking link
   */
  async generateLink(userId: string, data: GenerateLinkData) {
    // Find affiliate profile
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
      include: { user: true },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    // Generate unique slug
    const slug = await this.generateUniqueSlug(data.customAlias);

    // Create short URL (you can customize the domain)
    const shortUrl = `${process.env.SHORT_URL_DOMAIN || "https://track.link"}/${slug}`;

    // Create affiliate URL with tracking parameters
    const url = new URL(data.url);
    url.searchParams.set("ref", affiliate.id);
    url.searchParams.set("track", slug);
    const affiliateUrl = url.toString();

    // Create affiliate link in database
    const link = await prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate.id,
        offerId: data.offerId || null,
        originalUrl: data.url,
        shortUrl: shortUrl,
        customSlug: slug,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        isActive: true,
      },
    });

    return {
      id: link.id,
      originalUrl: link.originalUrl,
      affiliateUrl: affiliateUrl,
      shortUrl: link.shortUrl,
      trackingCode: slug,
      campaignName: data.campaignName || "Default Campaign",
      clicks: link.clicks,
      conversions: link.conversions,
      earnings: link.earnings,
      status: link.isActive ? "Active" : "Inactive",
      createdAt: link.createdAt,
    };
  }

  /**
   * Get all affiliate links
   */
  async getMyLinks(userId: string) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    const links = await prisma.affiliateLink.findMany({
      where: { affiliateId: affiliate.id },
      include: {
        offer: {
          select: {
            name: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedLinks = links.map((link) => ({
      id: link.id,
      name: link.customSlug || link.id,
      url: link.originalUrl,
      shortUrl: link.shortUrl,
      trackingCode: link.customSlug || link.id,
      campaignName: link.offer?.name || "Direct Link",
      clicks: link.clicks,
      conversions: link.conversions,
      earnings: link.earnings,
      status: link.isActive ? "Active" : "Inactive",
      createdAt: link.createdAt,
      category: link.offer?.category || "General",
    }));

    console.log(
      "LinksService.getMyLinks - Raw database links:",
      links.map((l) => ({ id: l.id, customSlug: l.customSlug }))
    );
    console.log(
      "LinksService.getMyLinks - Mapped links:",
      mappedLinks.map((l) => ({ id: l.id, name: l.name }))
    );

    return mappedLinks;
  }

  /**
   * Get link statistics
   */
  async getLinkStats(userId: string, linkId: string) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    const link = await prisma.affiliateLink.findFirst({
      where: {
        id: linkId,
        affiliateId: affiliate.id,
      },
    });

    if (!link) {
      throw new Error("Link not found");
    }

    // Get click details using tracking code
    const clicks = await prisma.affiliateClick.findMany({
      where: {
        affiliateId: affiliate.id,
        referralCode: link.customSlug || link.id,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return {
      link,
      clicks,
      totalClicks: link.clicks,
      totalConversions: link.conversions,
      totalEarnings: link.earnings,
      conversionRate:
        link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0,
    };
  }

  /**
   * Track link click
   */
  async trackClick(trackingCode: string, clickData: TrackClickData) {
    // Find link by custom slug or short URL
    const link = await prisma.affiliateLink.findFirst({
      where: {
        OR: [
          { customSlug: trackingCode },
          { shortUrl: { contains: trackingCode } },
        ],
        isActive: true,
      },
      include: {
        affiliate: true,
      },
    });

    if (!link) {
      throw new Error("Tracking link not found or inactive");
    }

    // Create click record using existing AffiliateClick schema
    const click = await prisma.affiliateClick.create({
      data: {
        affiliateId: link.affiliateId,
        referralCode: trackingCode,
        storeId: "default", // You can make this dynamic based on your setup
        url: link.shortUrl,
        referrer: clickData.referrer,
        userAgent: clickData.userAgent,
        ipAddress: clickData.ipAddress,
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
      },
    });

    // Update link click count
    await prisma.affiliateLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    // Update affiliate total clicks
    await prisma.affiliateProfile.update({
      where: { id: link.affiliateId },
      data: { totalClicks: { increment: 1 } },
    });

    return {
      success: true,
      redirectUrl: link.originalUrl,
      click,
    };
  }

  /**
   * Update link status
   */
  async updateLinkStatus(userId: string, linkId: string, isActive: boolean) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    const link = await prisma.affiliateLink.update({
      where: {
        id: linkId,
        affiliateId: affiliate.id,
      },
      data: { isActive },
    });

    return link;
  }

  /**
   * Delete affiliate link
   */
  async deleteLink(userId: string, linkId: string) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    await prisma.affiliateLink.delete({
      where: {
        id: linkId,
        affiliateId: affiliate.id,
      },
    });

    return { success: true, message: "Link deleted successfully" };
  }

  /**
   * Get available coupons
   */
  async getAvailableCoupons(userId: string) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    const coupons = await prisma.coupon.findMany({
      where: {
        affiliateId: affiliate.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });

    return coupons.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount,
      type: coupon.discount.includes("%") ? "Percentage" : "Fixed Amount",
      validUntil: coupon.validUntil.toISOString().split("T")[0],
      uses: coupon.usage,
      maxUses: coupon.maxUsage || 1000,
      status: coupon.status,
      createdAt: coupon.createdAt,
    }));
  }

  /**
   * Generate custom coupon
   */
  async generateCoupon(userId: string, data: GenerateCouponData) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    // Generate unique coupon code
    let couponCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      couponCode = `${data.discountType === "PERCENTAGE" ? "PCT" : "FIX"}-${crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase()}`;

      const existing = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error("Failed to generate unique coupon code");
    }

    // Calculate expiration date
    const validDays = data.validDays || 90;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    // Format discount string
    const discount =
      data.discountType === "PERCENTAGE"
        ? `${data.discountValue}%`
        : `$${data.discountValue}`;

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        affiliateId: affiliate.id,
        code: couponCode,
        description: data.description,
        discount: discount,
        validUntil: validUntil,
        usage: 0,
        maxUsage: data.maxUsage || 100,
        status: "ACTIVE",
      },
    });

    return {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount,
      type: data.discountType === "PERCENTAGE" ? "Percentage" : "Fixed Amount",
      minPurchase: data.minPurchase ? `$${data.minPurchase}` : "None",
      validUntil: coupon.validUntil.toISOString().split("T")[0],
      uses: coupon.usage,
      maxUses: coupon.maxUsage,
      status: coupon.status,
      createdAt: coupon.createdAt,
    };
  }

  /**
   * Validate and use coupon
   */
  async useCoupon(couponCode: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
      include: { affiliate: true },
    });

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    if (coupon.status !== "ACTIVE") {
      throw new Error("Coupon is not active");
    }

    if (coupon.validUntil < new Date()) {
      throw new Error("Coupon has expired");
    }

    if (coupon.maxUsage && coupon.usage >= coupon.maxUsage) {
      throw new Error("Coupon usage limit reached");
    }

    // Increment usage
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usage: { increment: 1 } },
    });

    return {
      valid: true,
      discount: coupon.discount,
      affiliateId: coupon.affiliateId,
    };
  }

  /**
   * Deactivate coupon
   */
  async deactivateCoupon(userId: string, couponId: string) {
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error("Affiliate profile not found");
    }

    const coupon = await prisma.coupon.update({
      where: {
        id: couponId,
        affiliateId: affiliate.id,
      },
      data: { status: "INACTIVE" },
    });

    return coupon;
  }
}

export default new LinksService();
