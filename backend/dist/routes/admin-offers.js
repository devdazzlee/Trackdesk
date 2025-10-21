"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { page = 1, limit = 20, status, affiliateId } = req.query;
        const whereClause = {};
        if (status) {
            whereClause.status = status.toUpperCase();
        }
        if (affiliateId) {
            whereClause.applications = {
                some: {
                    affiliateId: affiliateId,
                },
            };
        }
        const offers = await prisma.offer.findMany({
            where: whereClause,
            include: {
                applications: {
                    include: {
                        affiliate: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
                creatives: true,
                _count: {
                    select: {
                        applications: true,
                        creatives: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
        });
        const formattedOffers = offers.map((offer) => ({
            id: offer.id,
            name: offer.name,
            description: offer.description,
            category: offer.category,
            commissionRate: offer.commissionRate,
            status: offer.status.toLowerCase(),
            startDate: offer.startDate.toISOString().split("T")[0],
            endDate: offer.endDate?.toISOString().split("T")[0] || null,
            terms: offer.terms,
            requirements: offer.requirements,
            tags: offer.tags,
            totalClicks: offer.totalClicks,
            totalConversions: offer.totalConversions,
            totalRevenue: offer.totalRevenue,
            totalCommissions: offer.totalCommissions,
            conversionRate: offer.totalClicks > 0
                ? (offer.totalConversions / offer.totalClicks) * 100
                : 0,
            affiliatesCount: offer._count.applications,
            creativesCount: offer._count.creatives,
            applications: offer.applications.map((app) => ({
                id: app.id,
                affiliateId: app.affiliateId,
                affiliateName: `${app.affiliate.user.firstName} ${app.affiliate.user.lastName}`,
                affiliateEmail: app.affiliate.user.email,
                status: app.status.toLowerCase(),
                appliedAt: app.createdAt.toISOString().split("T")[0],
            })),
            creatives: offer.creatives.map((creative) => ({
                id: creative.id,
                name: creative.name,
                type: creative.type.toLowerCase(),
                size: creative.size,
                format: creative.format,
                url: creative.url,
                downloadUrl: creative.downloadUrl,
            })),
            createdAt: offer.createdAt.toISOString().split("T")[0],
            updatedAt: offer.updatedAt.toISOString().split("T")[0],
        }));
        const totalCount = await prisma.offer.count({ where: whereClause });
        const summary = await prisma.offer.aggregate({
            where: whereClause,
            _count: {
                id: true,
            },
            _sum: {
                totalRevenue: true,
                totalCommissions: true,
            },
        });
        const statusCounts = await prisma.offer.groupBy({
            by: ["status"],
            _count: {
                id: true,
            },
        });
        res.json({
            data: formattedOffers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit)),
            },
            summary: {
                total: summary._count.id,
                totalRevenue: summary._sum.totalRevenue || 0,
                totalCommissions: summary._sum.totalCommissions || 0,
                active: statusCounts.find((s) => s.status === "ACTIVE")?._count.id || 0,
                paused: statusCounts.find((s) => s.status === "PAUSED")?._count.id || 0,
                ended: 0,
            },
        });
    }
    catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({ error: "Failed to fetch offers" });
    }
});
router.get("/affiliates", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const affiliates = await prisma.affiliateProfile.findMany({
            where: {
                status: "ACTIVE",
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                user: {
                    firstName: "asc",
                },
            },
        });
        const formattedAffiliates = affiliates.map((affiliate) => ({
            id: affiliate.id,
            name: `${affiliate.user.firstName} ${affiliate.user.lastName}`,
            email: affiliate.user.email,
            tier: affiliate.tier,
            status: affiliate.status,
        }));
        res.json({
            success: true,
            affiliates: formattedAffiliates,
        });
    }
    catch (error) {
        console.error("Error fetching affiliates:", error);
        res.status(500).json({ error: "Failed to fetch affiliates" });
    }
});
router.post("/", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { name, description, category, commissionRate, startDate, endDate, terms, requirements, tags, affiliateIds, } = req.body;
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(3, "Name must be at least 3 characters"),
            description: zod_1.z
                .string()
                .min(10, "Description must be at least 10 characters"),
            category: zod_1.z.string().min(1, "Category is required"),
            commissionRate: zod_1.z
                .number()
                .min(0)
                .max(100, "Commission rate must be between 0 and 100"),
            startDate: zod_1.z.string().min(1, "Start date is required"),
            endDate: zod_1.z.string().optional(),
            terms: zod_1.z.string().optional(),
            requirements: zod_1.z.string().optional(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
            affiliateIds: zod_1.z.array(zod_1.z.string()).optional(),
        });
        const validatedData = schema.parse({
            name,
            description,
            category,
            commissionRate,
            startDate,
            endDate,
            terms,
            requirements,
            tags: tags || [],
            affiliateIds: affiliateIds || [],
        });
        const offer = await prisma.offer.create({
            data: {
                accountId: "trackdesk-system",
                name: validatedData.name,
                description: validatedData.description,
                category: validatedData.category,
                commissionRate: validatedData.commissionRate,
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate
                    ? new Date(validatedData.endDate)
                    : null,
                terms: validatedData.terms,
                requirements: validatedData.requirements,
                tags: validatedData.tags,
            },
        });
        if (validatedData.affiliateIds.length > 0) {
            const applications = await Promise.all(validatedData.affiliateIds.map((affiliateId) => prisma.offerApplication.create({
                data: {
                    affiliateId,
                    offerId: offer.id,
                    status: "APPROVED",
                },
            })));
            await prisma.activity.create({
                data: {
                    userId: req.user.id,
                    action: "offer_created",
                    resource: "offer",
                    details: {
                        offerId: offer.id,
                        offerName: offer.name,
                        assignedAffiliates: validatedData.affiliateIds.length,
                        affiliateIds: validatedData.affiliateIds,
                    },
                },
            });
            res.json({
                success: true,
                message: `Offer created successfully and assigned to ${applications.length} affiliate(s)`,
                offer: {
                    id: offer.id,
                    name: offer.name,
                    description: offer.description,
                    category: offer.category,
                    commissionRate: offer.commissionRate,
                    status: offer.status.toLowerCase(),
                    startDate: offer.startDate.toISOString().split("T")[0],
                    endDate: offer.endDate?.toISOString().split("T")[0] || null,
                    assignedAffiliates: applications.length,
                },
            });
        }
        else {
            await prisma.activity.create({
                data: {
                    userId: req.user.id,
                    action: "offer_created",
                    resource: "offer",
                    details: {
                        offerId: offer.id,
                        offerName: offer.name,
                        assignedAffiliates: 0,
                    },
                },
            });
            res.json({
                success: true,
                message: "Offer created successfully (no affiliates assigned yet)",
                offer: {
                    id: offer.id,
                    name: offer.name,
                    description: offer.description,
                    category: offer.category,
                    commissionRate: offer.commissionRate,
                    status: offer.status.toLowerCase(),
                    startDate: offer.startDate.toISOString().split("T")[0],
                    endDate: offer.endDate?.toISOString().split("T")[0] || null,
                    assignedAffiliates: 0,
                },
            });
        }
    }
    catch (error) {
        console.error("Error creating offer:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to create offer" });
    }
});
router.put("/:id", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, commissionRate, startDate, endDate, terms, requirements, tags, status, } = req.body;
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(3).optional(),
            description: zod_1.z.string().min(10).optional(),
            category: zod_1.z.string().min(1).optional(),
            commissionRate: zod_1.z.number().min(0).max(100).optional(),
            startDate: zod_1.z.string().optional(),
            endDate: zod_1.z.string().optional(),
            terms: zod_1.z.string().optional(),
            requirements: zod_1.z.string().optional(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
            status: zod_1.z.enum(["ACTIVE", "PAUSED", "ENDED"]).optional(),
        });
        const validatedData = schema.parse({
            name,
            description,
            category,
            commissionRate,
            startDate,
            endDate,
            terms,
            requirements,
            tags,
            status,
        });
        const updateData = {};
        Object.keys(validatedData).forEach((key) => {
            if (validatedData[key] !== undefined) {
                if (key === "startDate" || key === "endDate") {
                    updateData[key] = validatedData[key]
                        ? new Date(validatedData[key])
                        : null;
                }
                else {
                    updateData[key] = validatedData[key];
                }
            }
        });
        const updatedOffer = await prisma.offer.update({
            where: { id },
            data: updateData,
            include: {
                applications: {
                    include: {
                        affiliate: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        applications: true,
                        creatives: true,
                    },
                },
            },
        });
        await prisma.activity.create({
            data: {
                userId: req.user.id,
                action: "offer_updated",
                resource: "offer",
                details: {
                    offerId: id,
                    offerName: updatedOffer.name,
                    changes: updateData,
                },
            },
        });
        res.json({
            success: true,
            message: "Offer updated successfully",
            offer: {
                id: updatedOffer.id,
                name: updatedOffer.name,
                description: updatedOffer.description,
                category: updatedOffer.category,
                commissionRate: updatedOffer.commissionRate,
                status: updatedOffer.status.toLowerCase(),
                startDate: updatedOffer.startDate.toISOString().split("T")[0],
                endDate: updatedOffer.endDate?.toISOString().split("T")[0] || null,
                affiliatesCount: updatedOffer._count.applications,
                creativesCount: updatedOffer._count.creatives,
            },
        });
    }
    catch (error) {
        console.error("Error updating offer:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to update offer" });
    }
});
router.delete("/:id", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await prisma.offer.findUnique({
            where: { id },
            select: { name: true, _count: { select: { applications: true } } },
        });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }
        await prisma.offer.delete({
            where: { id },
        });
        await prisma.activity.create({
            data: {
                userId: req.user.id,
                action: "offer_deleted",
                resource: "offer",
                details: {
                    offerId: id,
                    offerName: offer.name,
                    affectedApplications: offer._count.applications,
                },
            },
        });
        res.json({
            success: true,
            message: "Offer deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting offer:", error);
        res.status(500).json({ error: "Failed to delete offer" });
    }
});
router.post("/:id/assign", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { affiliateIds } = req.body;
        const schema = zod_1.z.object({
            affiliateIds: zod_1.z
                .array(zod_1.z.string())
                .min(1, "At least one affiliate must be selected"),
        });
        const validatedData = schema.parse({ affiliateIds });
        const offer = await prisma.offer.findUnique({
            where: { id },
            select: { name: true },
        });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }
        const applications = await Promise.all(validatedData.affiliateIds.map((affiliateId) => prisma.offerApplication.upsert({
            where: {
                affiliateId_offerId: {
                    affiliateId,
                    offerId: id,
                },
            },
            update: {
                status: "APPROVED",
            },
            create: {
                affiliateId,
                offerId: id,
                status: "APPROVED",
            },
        })));
        await prisma.activity.create({
            data: {
                userId: req.user.id,
                action: "offer_assigned",
                resource: "offer",
                details: {
                    offerId: id,
                    offerName: offer.name,
                    assignedAffiliates: applications.length,
                    affiliateIds: validatedData.affiliateIds,
                },
            },
        });
        res.json({
            success: true,
            message: `Offer assigned to ${applications.length} affiliate(s)`,
            assignedCount: applications.length,
        });
    }
    catch (error) {
        console.error("Error assigning offer:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to assign offer" });
    }
});
router.get("/:id/creatives", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const creatives = await prisma.creative.findMany({
            where: { offerId: id },
            orderBy: { createdAt: "desc" },
        });
        const formattedCreatives = creatives.map((creative) => ({
            id: creative.id,
            name: creative.name,
            type: creative.type.toLowerCase(),
            size: creative.size,
            format: creative.format,
            url: creative.url,
            downloadUrl: creative.downloadUrl,
            createdAt: creative.createdAt.toISOString().split("T")[0],
        }));
        res.json({
            success: true,
            creatives: formattedCreatives,
        });
    }
    catch (error) {
        console.error("Error fetching creatives:", error);
        res.status(500).json({ error: "Failed to fetch creatives" });
    }
});
router.post("/:id/creatives", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, size, format, url, downloadUrl } = req.body;
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(1, "Name is required"),
            type: zod_1.z.enum([
                "BANNER",
                "EMAIL",
                "SOCIAL",
                "LANDING",
                "VIDEO",
                "OTHER",
            ]),
            size: zod_1.z.string().min(1, "Size is required"),
            format: zod_1.z.string().min(1, "Format is required"),
            url: zod_1.z.string().url("Valid URL is required"),
            downloadUrl: zod_1.z.string().url("Valid download URL is required"),
        });
        const validatedData = schema.parse({
            name,
            type: type.toUpperCase(),
            size,
            format,
            url,
            downloadUrl,
        });
        const offer = await prisma.offer.findUnique({
            where: { id },
            select: { name: true },
        });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }
        const creative = await prisma.creative.create({
            data: {
                offerId: id,
                name: validatedData.name,
                type: validatedData.type,
                size: validatedData.size,
                format: validatedData.format,
                url: validatedData.url,
                downloadUrl: validatedData.downloadUrl,
            },
        });
        await prisma.activity.create({
            data: {
                userId: req.user.id,
                action: "creative_added",
                resource: "creative",
                details: {
                    creativeId: creative.id,
                    creativeName: creative.name,
                    offerId: id,
                    offerName: offer.name,
                    creativeType: creative.type,
                },
            },
        });
        res.json({
            success: true,
            message: "Creative added successfully",
            creative: {
                id: creative.id,
                name: creative.name,
                type: creative.type.toLowerCase(),
                size: creative.size,
                format: creative.format,
                url: creative.url,
                downloadUrl: creative.downloadUrl,
            },
        });
    }
    catch (error) {
        console.error("Error adding creative:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to add creative" });
    }
});
router.put("/:offerId/creatives/:creativeId", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { offerId, creativeId } = req.params;
        const { name, type, size, format, url, downloadUrl } = req.body;
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(1, "Name is required"),
            type: zod_1.z.enum([
                "BANNER",
                "EMAIL",
                "SOCIAL",
                "LANDING",
                "VIDEO",
                "OTHER",
            ]),
            size: zod_1.z.string().min(1, "Size is required"),
            format: zod_1.z.string().min(1, "Format is required"),
            url: zod_1.z.string().url("Valid URL is required"),
            downloadUrl: zod_1.z.string().url("Valid download URL is required"),
        });
        const validatedData = schema.parse({
            name,
            type: type.toUpperCase(),
            size,
            format,
            url,
            downloadUrl,
        });
        const existingCreative = await prisma.creative.findUnique({
            where: { id: creativeId },
            select: { name: true, offerId: true },
        });
        if (!existingCreative) {
            return res.status(404).json({ error: "Creative not found" });
        }
        if (existingCreative.offerId !== offerId) {
            return res
                .status(400)
                .json({ error: "Creative does not belong to this offer" });
        }
        const updatedCreative = await prisma.creative.update({
            where: { id: creativeId },
            data: {
                name: validatedData.name,
                type: validatedData.type,
                size: validatedData.size,
                format: validatedData.format,
                url: validatedData.url,
                downloadUrl: validatedData.downloadUrl,
            },
        });
        await prisma.activity.create({
            data: {
                userId: req.user.id,
                action: "creative_updated",
                resource: "creative",
                details: {
                    creativeId,
                    creativeName: updatedCreative.name,
                    offerId,
                    changes: validatedData,
                },
            },
        });
        res.json({
            success: true,
            message: "Creative updated successfully",
            creative: {
                id: updatedCreative.id,
                name: updatedCreative.name,
                type: updatedCreative.type.toLowerCase(),
                size: updatedCreative.size,
                format: updatedCreative.format,
                url: updatedCreative.url,
                downloadUrl: updatedCreative.downloadUrl,
            },
        });
    }
    catch (error) {
        console.error("Error updating creative:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to update creative" });
    }
});
router.delete("/:offerId/creatives/:creativeId", auth_1.authenticateToken, (0, auth_1.requireRole)(["ADMIN"]), async (req, res) => {
    try {
        const { offerId, creativeId } = req.params;
        const creative = await prisma.creative.findUnique({
            where: { id: creativeId },
            select: { name: true, offerId: true },
        });
        if (!creative) {
            return res.status(404).json({ error: "Creative not found" });
        }
        if (creative.offerId !== offerId) {
            return res
                .status(400)
                .json({ error: "Creative does not belong to this offer" });
        }
        await prisma.creative.delete({
            where: { id: creativeId },
        });
        await prisma.activity.create({
            data: {
                userId: req.user.id,
                action: "creative_deleted",
                resource: "creative",
                details: {
                    creativeId,
                    creativeName: creative.name,
                    offerId,
                },
            },
        });
        res.json({
            success: true,
            message: "Creative deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting creative:", error);
        res.status(500).json({ error: "Failed to delete creative" });
    }
});
exports.default = router;
//# sourceMappingURL=admin-offers.js.map