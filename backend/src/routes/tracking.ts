import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = express.Router();

// Track referral click
router.post("/click", async (req, res) => {
  try {
    const schema = z.object({
      referralCode: z.string(),
      storeId: z.string(),
      url: z.string(),
      referrer: z.string().optional(),
      userAgent: z.string().optional(),
      timestamp: z.string(),
      utm: z
        .object({
          utm_source: z.string().nullable().optional(),
          utm_medium: z.string().nullable().optional(),
          utm_campaign: z.string().nullable().optional(),
          utm_term: z.string().nullable().optional(),
          utm_content: z.string().nullable().optional(),
        })
        .optional(),
    });

    const data = schema.parse(req.body);

    // Find the referral code
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code: data.referralCode,
        isActive: true,
      },
    });

    if (!referralCode) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    // Track the click
    await prisma.affiliateClick.create({
      data: {
        affiliateId: referralCode.affiliateId,
        referralCode: data.referralCode,
        storeId: data.storeId,
        url: data.url,
        referrer: data.referrer,
        userAgent: data.userAgent,
        utmSource: data.utm?.utm_source,
        utmMedium: data.utm?.utm_medium,
        utmCampaign: data.utm?.utm_campaign,
      },
    });

    // Update click count on affiliate profile
    await prisma.affiliateProfile.update({
      where: { id: referralCode.affiliateId },
      data: { totalClicks: { increment: 1 } },
    });

    res.json({ success: true, message: "Click tracked" });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ error: "Failed to track click" });
  }
});

// Track page view
router.post("/pageview", async (req, res) => {
  try {
    const schema = z.object({
      referralCode: z.string(),
      storeId: z.string(),
      url: z.string(),
      timestamp: z.string(),
    });

    const data = schema.parse(req.body);

    // Find the referral code
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code: data.referralCode,
        isActive: true,
      },
    });

    if (!referralCode) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    // Track the page view (optional - can be used for analytics)
    // You can store this in a separate table if needed

    res.json({ success: true, message: "Page view tracked" });
  } catch (error) {
    console.error("Error tracking page view:", error);
    res.status(500).json({ error: "Failed to track page view" });
  }
});

// Track order/purchase
router.post("/order", async (req, res) => {
  try {
    const schema = z.object({
      referralCode: z.string(),
      storeId: z.string(),
      orderId: z.string(),
      orderValue: z.number(),
      currency: z.string().default("USD"),
      customerEmail: z.string().optional(),
      items: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
        )
        .optional(),
      timestamp: z.string(),
      utm: z
        .object({
          utm_source: z.string().nullable().optional(),
          utm_medium: z.string().nullable().optional(),
          utm_campaign: z.string().nullable().optional(),
          utm_term: z.string().nullable().optional(),
          utm_content: z.string().nullable().optional(),
        })
        .optional(),
    });

    const data = schema.parse(req.body);

    // Find the referral code
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code: data.referralCode,
        isActive: true,
      },
      include: {
        affiliate: true,
      },
    });

    if (!referralCode) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    // Check if order already exists
    const existingOrder = await prisma.affiliateOrder.findFirst({
      where: {
        orderId: data.orderId,
        storeId: data.storeId,
      },
    });

    if (existingOrder) {
      return res.json({
        success: true,
        message: "Order already tracked",
        duplicate: true,
      });
    }

    // Calculate commission
    const commissionRate = referralCode.commissionRate;
    const commissionAmount = (data.orderValue * commissionRate) / 100;

    // Create order record
    const order = await prisma.affiliateOrder.create({
      data: {
        affiliateId: referralCode.affiliateId,
        referralCode: data.referralCode,
        storeId: data.storeId,
        orderId: data.orderId,
        orderValue: data.orderValue,
        currency: data.currency,
        customerEmail: data.customerEmail,
        commissionAmount,
        commissionRate,
        status: "PENDING",
        items: data.items || [],
        utmSource: data.utm?.utm_source,
        utmMedium: data.utm?.utm_medium,
        utmCampaign: data.utm?.utm_campaign,
      },
    });

    // Update referral code usage
    await prisma.referralCode.update({
      where: { id: referralCode.id },
      data: { currentUses: { increment: 1 } },
    });

    // Update affiliate stats
    await prisma.affiliateProfile.update({
      where: { id: referralCode.affiliateId },
      data: {
        totalConversions: { increment: 1 },
        totalEarnings: { increment: commissionAmount },
      },
    });

    res.json({
      success: true,
      message: "Order tracked successfully",
      orderId: order.id,
      commissionAmount,
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    res.status(500).json({ error: "Failed to track order" });
  }
});

// Webhook endpoint for e-commerce platforms
router.post("/webhook/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;

    // Verify webhook signature (implement based on your e-commerce platform)
    // const signature = req.headers['x-webhook-signature'];
    // if (!verifySignature(signature, req.body)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const schema = z.object({
      orderId: z.string(),
      orderValue: z.number(),
      currency: z.string().default("USD"),
      customerEmail: z.string().optional(),
      referralCode: z.string().optional(), // If your platform can pass this
      items: z.array(z.any()).optional(),
    });

    const data = schema.parse(req.body);

    // If referral code is not provided, try to look it up by customer email or order metadata
    let referralCode = data.referralCode;

    if (!referralCode) {
      // Try to find the most recent click from this customer
      // This is a fallback mechanism
      return res.json({
        success: true,
        message: "Order received but no referral code found",
      });
    }

    // Process the order using the same logic as /order endpoint
    const trackingData = {
      referralCode,
      storeId,
      orderId: data.orderId,
      orderValue: data.orderValue,
      currency: data.currency,
      customerEmail: data.customerEmail,
      items: data.items,
      timestamp: new Date().toISOString(),
    };

    // Reuse the order tracking logic
    req.body = trackingData;
    return router.handle(req, res);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

export default router;
