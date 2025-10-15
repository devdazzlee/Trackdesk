import express, { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Generate affiliate link
router.post("/generate", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { url, campaignName, customAlias } = req.body;

    // Validate input
    const schema = z.object({
      url: z.string().url(),
      campaignName: z.string().optional(),
      customAlias: z.string().optional(),
    });

    const validatedData = schema.parse({ url, campaignName, customAlias });

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Generate unique tracking code
    const trackingCode = customAlias || crypto.randomBytes(6).toString("hex");

    // Create affiliate link (simplified - in real app, store in database)
    const affiliateUrl = `${validatedData.url}?ref=${affiliate.id}&track=${trackingCode}`;
    const shortUrl = `https://track.link/${trackingCode}`;

    const linkData = {
      id: crypto.randomUUID(),
      originalUrl: validatedData.url,
      affiliateUrl,
      shortUrl,
      trackingCode,
      campaignName: validatedData.campaignName || "Default Campaign",
      clicks: 0,
      conversions: 0,
      createdAt: new Date(),
      affiliateId: affiliate.id,
    };

    res.json({
      success: true,
      link: linkData,
      message: "Affiliate link generated successfully",
    });
  } catch (error) {
    console.error("Error generating link:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to generate affiliate link" });
  }
});

// Get all affiliate links
router.get("/my-links", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Get referral codes as links
    const referralCodes = await prisma.referralCode.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: "desc" },
    });

    const links = referralCodes.map((code) => ({
      id: code.id,
      name: code.code,
      url: `https://yourstore.com?ref=${code.code}`,
      shortUrl: `https://track.link/${code.code}`,
      trackingCode: code.code,
      campaignName: `Referral Campaign - ${code.type}`,
      clicks: code.currentUses || 0,
      conversions: 0,
      earnings: 0,
      status: code.isActive ? "Active" : "Inactive",
      createdAt: code.createdAt,
    }));

    res.json({
      links,
      total: links.length,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Failed to fetch affiliate links" });
  }
});

// Get marketing assets
router.get("/assets/banners", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Mock banner assets
    const banners = [
      {
        id: "banner-1",
        name: "Hero Banner - 1200x628",
        category: "Social Media",
        size: "1200x628",
        format: "PNG",
        fileSize: "245 KB",
        downloadUrl: "/assets/banners/hero-1200x628.png",
        previewUrl: "/assets/banners/preview/hero-1200x628.png",
        downloads: 156,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "banner-2",
        name: "Square Banner - 1080x1080",
        category: "Instagram",
        size: "1080x1080",
        format: "PNG",
        fileSize: "312 KB",
        downloadUrl: "/assets/banners/square-1080x1080.png",
        previewUrl: "/assets/banners/preview/square-1080x1080.png",
        downloads: 203,
        createdAt: new Date("2024-01-05"),
      },
      {
        id: "banner-3",
        name: "Leaderboard - 728x90",
        category: "Web Banner",
        size: "728x90",
        format: "PNG",
        fileSize: "89 KB",
        downloadUrl: "/assets/banners/leaderboard-728x90.png",
        previewUrl: "/assets/banners/preview/leaderboard-728x90.png",
        downloads: 98,
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "banner-4",
        name: "Skyscraper - 160x600",
        category: "Web Banner",
        size: "160x600",
        format: "PNG",
        fileSize: "134 KB",
        downloadUrl: "/assets/banners/skyscraper-160x600.png",
        previewUrl: "/assets/banners/preview/skyscraper-160x600.png",
        downloads: 67,
        createdAt: new Date("2024-01-15"),
      },
    ];

    res.json({
      banners,
      total: banners.length,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ error: "Failed to fetch marketing assets" });
  }
});

// Get available coupons
router.get("/coupons/available", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Mock coupon data
    const coupons = [
      {
        id: "coupon-1",
        code: `SAVE20-${affiliate.id.slice(0, 6).toUpperCase()}`,
        description: "20% off on all products",
        discount: "20%",
        type: "Percentage",
        minPurchase: "$50",
        maxDiscount: "$100",
        validUntil: "2024-12-31",
        uses: 45,
        maxUses: 100,
        commission: "15%",
        status: "Active",
      },
      {
        id: "coupon-2",
        code: `NEWUSER-${affiliate.id.slice(0, 6).toUpperCase()}`,
        description: "$10 off for new customers",
        discount: "$10",
        type: "Fixed Amount",
        minPurchase: "$30",
        maxDiscount: "$10",
        validUntil: "2024-12-31",
        uses: 78,
        maxUses: 200,
        commission: "10%",
        status: "Active",
      },
      {
        id: "coupon-3",
        code: `FLASH25-${affiliate.id.slice(0, 6).toUpperCase()}`,
        description: "25% off flash sale",
        discount: "25%",
        type: "Percentage",
        minPurchase: "$100",
        maxDiscount: "$250",
        validUntil: "2024-11-30",
        uses: 23,
        maxUses: 50,
        commission: "20%",
        status: "Active",
      },
    ];

    res.json({
      coupons,
      total: coupons.length,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch available coupons" });
  }
});

// Generate custom coupon
router.post("/coupons/generate", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { description, discountType, discountValue, minPurchase } = req.body;

    // Validate input
    const schema = z.object({
      description: z.string().min(3),
      discountType: z.enum(["Percentage", "Fixed Amount"]),
      discountValue: z.number().positive(),
      minPurchase: z.number().positive().optional(),
    });

    const validatedData = schema.parse({
      description,
      discountType,
      discountValue,
      minPurchase,
    });

    const affiliate = await prisma.affiliateProfile.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    // Generate unique coupon code
    const couponCode = `CUSTOM-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const coupon = {
      id: crypto.randomUUID(),
      code: couponCode,
      description: validatedData.description,
      discount:
        validatedData.discountType === "Percentage"
          ? `${validatedData.discountValue}%`
          : `$${validatedData.discountValue}`,
      type: validatedData.discountType,
      minPurchase: validatedData.minPurchase
        ? `$${validatedData.minPurchase}`
        : "None",
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      uses: 0,
      maxUses: 100,
      commission: "15%",
      status: "Active",
      createdAt: new Date(),
    };

    res.json({
      success: true,
      coupon,
      message: "Coupon generated successfully",
    });
  } catch (error) {
    console.error("Error generating coupon:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to generate coupon" });
  }
});

// Track link click
router.post("/track/:trackingCode", async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const { referrer, userAgent, ipAddress } = req.body;

    // In a real app, you would track this in the database
    console.log("Link click tracked:", {
      trackingCode,
      referrer,
      userAgent,
      ipAddress,
    });

    res.json({
      success: true,
      message: "Click tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ error: "Failed to track click" });
  }
});

export default router;
