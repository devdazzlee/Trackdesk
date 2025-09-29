import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';

const router: Router = Router();
const prisma = new PrismaClient();

// Get generated affiliate links for an affiliate
router.get('/', async (req: Request, res: Response) => {
  try {
    const { affiliateId, page = 1, limit = 20, search } = req.query;

    const filters: any = {};
    
    if (affiliateId) {
      filters.affiliateId = affiliateId;
    }
    
    if (search) {
      filters.OR = [
        { originalUrl: { contains: search as string, mode: 'insensitive' } },
        { customAlias: { contains: search as string, mode: 'insensitive' } },
        { offer: { title: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    const links = await prisma.affiliateLink.findMany({
      where: filters,
      include: {
        offer: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true
          }
        },
        affiliate: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            lastName: true,
            email: true
          }
        },
        clickRecords: {
          select: {
            id: true,
            createdAt: true,
            ipAddress: true,
            country: true,
            deviceType: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            clickRecords: true,
            conversions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.affiliateLink.count({ where: filters });

    // Calculate performance metrics for each link
    const linksWithMetrics = await Promise.all(
      links.map(async (link) => {
        const conversions = await prisma.conversion.count({
          where: { affiliateLinkId: link.id }
        });

        const revenue = await prisma.conversion.aggregate({
          where: { affiliateLinkId: link.id },
          _sum: { amount: true }
        });

        const conversionRate = link._count.clickRecords > 0 
          ? ((conversions / link._count.clickRecords) * 100).toFixed(2)
          : '0.00';

        return {
          ...link,
          metrics: {
            clicks: link._count.clickRecords,
            conversions,
            conversionRate: `${conversionRate}%`,
            revenue: revenue._sum.amount || 0
          }
        };
      })
    );

    res.json({
      links: linksWithMetrics,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate links' });
  }
});

// Generate new affiliate link
router.post('/', async (req: Request, res: Response) => {
  try {
    const linkSchema = z.object({
      affiliateId: z.string(),
      offerId: z.string(),
      originalUrl: z.string().url(),
      customAlias: z.string().optional(),
      landingPageUrl: z.string().url().optional(),
      expiresAt: z.string().optional()
    });

    const data = linkSchema.parse(req.body);

    // Generate unique tracking code
    const trackingCode = crypto.randomBytes(8).toString('hex');

    // Check if custom alias is already taken
    if (data.customSlug) {
      const existingLink = await prisma.affiliateLink.findUnique({
        where: { customAlias: data.customAlias }
      });
      
      if (existingLink) {
        return res.status(400).json({ error: 'Custom alias already exists' });
      }
    }

    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        affiliateId: data.affiliateId,
        offerId: data.offerId,
        originalUrl: data.originalUrl,
        // trackingCode field not in schema
        customAlias: data.customAlias,
        landingPageUrl: data.landingPageUrl,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: true,
        createdAt: new Date()
      },
      include: {
        offer: {
          select: {
            name: true,
            description: true
          }
        },
        affiliate: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            lastName: true,
            email: true
          }
        }
      }
    });

    // Generate the full affiliate URL
    const baseUrl = process.env.FRONTEND_URL || 'https://trackdesk.com';
    const affiliateUrl = data.customAlias 
      ? `${baseUrl}/go/${data.customAlias}`
      : `${baseUrl}/track/${trackingCode}`;

    res.status(201).json({
      ...affiliateLink,
      affiliateUrl
    });
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    res.status(400).json({ error: 'Failed to generate affiliate link' });
  }
});

// Get affiliate link by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const link = await prisma.affiliateLink.findUnique({
      where: { id },
      include: {
        offer: {
          select: {
            name: true,
            description: true,
            status: true
          }
        },
        affiliate: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            lastName: true,
            email: true
          }
        },
        clickRecords: {
          select: {
            id: true,
            createdAt: true,
            ipAddress: true,
            country: true,
            city: true,
            deviceType: true,
            browser: true,
            referrer: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 50
        },
        conversions: {
          select: {
            id: true,
            createdAt: true,
            amount: true,
            status: true,
            commission: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!link) {
      return res.status(404).json({ error: 'Affiliate link not found' });
    }

    // Calculate detailed metrics
    const totalClicks = link.clicks;
    const totalConversions = link.conversions;
    const totalRevenue = link.earnings;
    const totalCommissions = link.earnings;
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00';

    // Get geographic breakdown (simplified since clickRecords not available)
    const countryStats = {};

    // Get device breakdown (simplified since clickRecords not available)
    const deviceStats = {};

    const baseUrl = process.env.FRONTEND_URL || 'https://trackdesk.com';
    const affiliateUrl = link.customSlug 
      ? `${baseUrl}/go/${link.customSlug}`
      : `${baseUrl}/track/${link.id}`;

    res.json({
      ...link,
      affiliateUrl,
      metrics: {
        totalClicks,
        totalConversions,
        totalRevenue,
        totalCommissions,
        conversionRate: `${conversionRate}%`,
        countryStats,
        deviceStats
      }
    });
  } catch (error) {
    console.error('Error fetching affiliate link:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate link' });
  }
});

// Update affiliate link
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateSchema = z.object({
      customAlias: z.string().optional(),
      landingPageUrl: z.string().url().optional(),
      isActive: z.boolean().optional(),
      expiresAt: z.string().optional()
    });

    const data = updateSchema.parse(req.body);

    // Check if custom alias is already taken (if being updated)
    if (data.customSlug) {
      const existingLink = await prisma.affiliateLink.findFirst({
        where: { 
          customSlug: data.customSlug,
          NOT: { id }
        }
      });
      
      if (existingLink) {
        return res.status(400).json({ error: 'Custom alias already exists' });
      }
    }

    const updatedLink = await prisma.affiliateLink.update({
      where: { id },
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        updatedAt: new Date()
      },
      include: {
        offer: {
          select: {
            name: true,
            description: true
          }
        },
        affiliate: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            lastName: true,
            email: true
          }
        }
      }
    });

    const baseUrl = process.env.FRONTEND_URL || 'https://trackdesk.com';
    const affiliateUrl = updatedLink.customSlug
      ? `${baseUrl}/go/${updatedLink.customSlug}`
      : `${baseUrl}/track/${updatedLink.id}`;

    res.json({
      ...updatedLink,
      affiliateUrl
    });
  } catch (error) {
    console.error('Error updating affiliate link:', error);
    res.status(400).json({ error: 'Failed to update affiliate link' });
  }
});

// Delete affiliate link
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.affiliateLink.delete({
      where: { id }
    });

    res.json({ message: 'Affiliate link deleted successfully' });
  } catch (error) {
    console.error('Error deleting affiliate link:', error);
    res.status(500).json({ error: 'Failed to delete affiliate link' });
  }
});

// Get link performance analytics
router.get('/:id/analytics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get daily click data
    const dailyClicks = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as clicks
      FROM "Click"
      WHERE "affiliateLinkId" = ${id}
        AND timestamp >= ${startDate}
      GROUP BY DATE(timestamp)
      ORDER BY date
    ` as any[];

    // Get daily conversion data
    const dailyConversions = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as conversions,
        SUM(amount) as revenue
      FROM "Conversion"
      WHERE "affiliateLinkId" = ${id}
        AND timestamp >= ${startDate}
      GROUP BY DATE(timestamp)
      ORDER BY date
    ` as any[];

    res.json({
      dailyClicks,
      dailyConversions
    });
  } catch (error) {
    console.error('Error fetching link analytics:', error);
    res.status(500).json({ error: 'Failed to fetch link analytics' });
  }
});

export default router;
