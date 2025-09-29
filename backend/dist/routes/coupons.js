"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status, type, affiliateId } = req.query;
        const filters = {};
        if (search) {
            filters.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status && status !== 'all') {
            filters.status = status;
        }
        if (type && type !== 'all') {
            filters.type = type;
        }
        if (affiliateId) {
            filters.affiliateId = affiliateId;
        }
        const coupons = await prisma.coupon.findMany({
            where: filters,
            include: {
                affiliate: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                offer: {
                    select: {
                        id: true,
                        title: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });
        const total = await prisma.coupon.count({ where: filters });
        res.json({
            coupons,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await prisma.coupon.findUnique({
            where: { id },
            include: {
                affiliate: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                offer: {
                    select: {
                        title: true,
                        description: true
                    }
                },
                uses: {
                    include: {
                        conversion: {
                            select: {
                                id: true,
                                amount: true,
                                timestamp: true,
                                status: true
                            }
                        }
                    },
                    orderBy: {
                        usedAt: 'desc'
                    }
                }
            }
        });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        const totalUses = coupon.uses.length;
        const successfulUses = coupon.uses.filter(use => use.conversion?.status === 'approved').length;
        const totalRevenue = coupon.uses.reduce((sum, use) => sum + (use.conversion?.amount || 0), 0);
        const conversionRate = totalUses > 0 ? ((successfulUses / totalUses) * 100).toFixed(2) : '0.00';
        res.json({
            ...coupon,
            statistics: {
                totalUses,
                successfulUses,
                totalRevenue,
                conversionRate: `${conversionRate}%`,
                remainingUses: coupon.maxUses ? Math.max(0, coupon.maxUses - totalUses) : 'Unlimited'
            }
        });
    }
    catch (error) {
        console.error('Error fetching coupon:', error);
        res.status(500).json({ error: 'Failed to fetch coupon' });
    }
});
router.post('/', async (req, res) => {
    try {
        const couponSchema = zod_1.z.object({
            code: zod_1.z.string().min(3).max(50),
            description: zod_1.z.string().optional(),
            type: zod_1.z.enum(['percentage', 'fixed_amount', 'free_shipping']),
            value: zod_1.z.number().min(0),
            affiliateId: zod_1.z.string(),
            offerId: zod_1.z.string().optional(),
            maxUses: zod_1.z.number().min(1).optional(),
            expiresAt: zod_1.z.string().optional(),
            minOrderValue: zod_1.z.number().min(0).optional(),
            isActive: zod_1.z.boolean().default(true)
        });
        const data = couponSchema.parse(req.body);
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: data.code }
        });
        if (existingCoupon) {
            return res.status(400).json({ error: 'Coupon code already exists' });
        }
        const coupon = await prisma.coupon.create({
            data: {
                ...data,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                createdAt: new Date()
            },
            include: {
                affiliate: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                offer: {
                    select: {
                        title: true
                    }
                }
            }
        });
        res.status(201).json(coupon);
    }
    catch (error) {
        console.error('Error creating coupon:', error);
        res.status(400).json({ error: 'Failed to create coupon' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateSchema = zod_1.z.object({
            description: zod_1.z.string().optional(),
            type: zod_1.z.enum(['percentage', 'fixed_amount', 'free_shipping']).optional(),
            value: zod_1.z.number().min(0).optional(),
            maxUses: zod_1.z.number().min(1).optional(),
            expiresAt: zod_1.z.string().optional(),
            minOrderValue: zod_1.z.number().min(0).optional(),
            isActive: zod_1.z.boolean().optional()
        });
        const data = updateSchema.parse(req.body);
        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                ...data,
                validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
                updatedAt: new Date()
            },
            include: {
                affiliate: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                offer: {
                    select: {
                        title: true
                    }
                }
            }
        });
        res.json(coupon);
    }
    catch (error) {
        console.error('Error updating coupon:', error);
        res.status(400).json({ error: 'Failed to update coupon' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({
            where: { id }
        });
        res.json({ message: 'Coupon deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
});
router.post('/generate', async (req, res) => {
    try {
        const generateSchema = zod_1.z.object({
            count: zod_1.z.number().min(1).max(100),
            length: zod_1.z.number().min(4).max(20).default(8),
            prefix: zod_1.z.string().optional(),
            suffix: zod_1.z.string().optional(),
            type: zod_1.z.enum(['percentage', 'fixed_amount', 'free_shipping']),
            value: zod_1.z.number().min(0),
            affiliateId: zod_1.z.string(),
            offerId: zod_1.z.string().optional(),
            maxUses: zod_1.z.number().min(1).optional(),
            expiresAt: zod_1.z.string().optional(),
            minOrderValue: zod_1.z.number().min(0).optional()
        });
        const data = generateSchema.parse(req.body);
        const generatedCoupons = [];
        const existingCodes = new Set();
        const existing = await prisma.coupon.findMany({
            select: { code: true }
        });
        existing.forEach(coupon => existingCodes.add(coupon.code));
        for (let i = 0; i < data.count; i++) {
            let code;
            let attempts = 0;
            do {
                const randomPart = crypto_1.default.randomBytes(Math.ceil(data.length / 2))
                    .toString('hex')
                    .substring(0, data.length)
                    .toUpperCase();
                code = `${data.prefix || ''}${randomPart}${data.suffix || ''}`;
                attempts++;
            } while (existingCodes.has(code) && attempts < 10);
            if (attempts >= 10) {
                return res.status(400).json({ error: 'Unable to generate unique coupon codes' });
            }
            existingCodes.add(code);
            const coupon = await prisma.coupon.create({
                data: {
                    code,
                    description: `Auto-generated coupon ${i + 1}/${data.count}`,
                    discount: data.discount,
                    affiliateId: data.affiliateId,
                    maxUsage: data.maxUsage,
                    validUntil: data.validUntil ? new Date(data.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    status: 'ACTIVE'
                }
            });
            generatedCoupons.push(coupon);
        }
        res.status(201).json({
            message: `Successfully generated ${generatedCoupons.length} coupons`,
            coupons: generatedCoupons
        });
    }
    catch (error) {
        console.error('Error generating coupons:', error);
        res.status(400).json({ error: 'Failed to generate coupons' });
    }
});
router.post('/import', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No CSV file provided' });
        }
        const csvFilePath = req.file.path;
        const coupons = [];
        const errors = [];
        await new Promise((resolve, reject) => {
            fs_1.default.createReadStream(csvFilePath)
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                try {
                    if (!row.code || !row.type || !row.value || !row.affiliateId) {
                        errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
                        return;
                    }
                    coupons.push({
                        code: row.code.trim(),
                        description: row.description?.trim() || '',
                        type: row.type.trim(),
                        value: parseFloat(row.value),
                        affiliateId: row.affiliateId.trim(),
                        offerId: row.offerId?.trim() || null,
                        maxUses: row.maxUses ? parseInt(row.maxUses) : null,
                        expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
                        minOrderValue: row.minOrderValue ? parseFloat(row.minOrderValue) : null,
                        isActive: row.isActive !== 'false'
                    });
                }
                catch (error) {
                    errors.push(`Error parsing row: ${JSON.stringify(row)} - ${error}`);
                }
            })
                .on('end', resolve)
                .on('error', reject);
        });
        fs_1.default.unlinkSync(csvFilePath);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 'CSV parsing errors',
                errors: errors.slice(0, 10)
            });
        }
        const codes = coupons.map(c => c.code);
        const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
        if (duplicateCodes.length > 0) {
            return res.status(400).json({
                error: 'Duplicate codes in CSV',
                duplicates: [...new Set(duplicateCodes)]
            });
        }
        const existingCoupons = await prisma.coupon.findMany({
            where: {
                code: {
                    in: codes
                }
            },
            select: { code: true }
        });
        const existingCodes = existingCoupons.map(c => c.code);
        if (existingCodes.length > 0) {
            return res.status(400).json({
                error: 'Some coupon codes already exist',
                existingCodes
            });
        }
        const importedCoupons = await prisma.coupon.createMany({
            data: coupons.map(coupon => ({
                ...coupon,
                createdAt: new Date()
            }))
        });
        res.status(201).json({
            message: `Successfully imported ${importedCoupons.count} coupons`,
            imported: importedCoupons.count,
            errors: errors.length
        });
    }
    catch (error) {
        console.error('Error importing coupons:', error);
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to import coupons' });
    }
});
router.get('/export', async (req, res) => {
    try {
        const { affiliateId, status, type } = req.query;
        const filters = {};
        if (affiliateId)
            filters.affiliateId = affiliateId;
        if (status && status !== 'all')
            filters.status = status;
        if (type && type !== 'all')
            filters.type = type;
        const coupons = await prisma.coupon.findMany({
            where: filters,
            include: {
                affiliate: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                offer: {
                    select: {
                        title: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        const csv = [
            'Code,Description,Type,Value,Affiliate,Offer,Max Uses,Total Uses,Expires At,Status,Created At',
            ...coupons.map(coupon => [
                coupon.code,
                `"${(coupon.description || '').replace(/"/g, '""')}"`,
                'percentage',
                coupon.discount,
                coupon.affiliate?.user ? `${coupon.affiliate.user.firstName} ${coupon.affiliate.user.lastName}` : '',
                '',
                coupon.maxUsage || 'Unlimited',
                coupon.usage,
                coupon.validUntil ? coupon.validUntil.toISOString().split('T')[0] : '',
                coupon.status === 'ACTIVE' ? 'Active' : 'Inactive',
                coupon.createdAt.toISOString().split('T')[0]
            ].join(','))
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="coupons.csv"');
        res.send(csv);
    }
    catch (error) {
        console.error('Error exporting coupons:', error);
        res.status(500).json({ error: 'Failed to export coupons' });
    }
});
router.post('/validate', async (req, res) => {
    try {
        const validateSchema = zod_1.z.object({
            code: zod_1.z.string(),
            orderValue: zod_1.z.number().min(0).optional(),
            affiliateId: zod_1.z.string().optional()
        });
        const { code, orderValue = 0, affiliateId } = validateSchema.parse(req.body);
        const coupon = await prisma.coupon.findUnique({
            where: { code },
            include: {}
        });
        if (!coupon) {
            return res.status(404).json({
                valid: false,
                error: 'Coupon code not found'
            });
        }
        if (coupon.status !== 'ACTIVE') {
            return res.status(400).json({
                valid: false,
                error: 'Coupon is not active'
            });
        }
        if (coupon.validUntil && coupon.validUntil < new Date()) {
            return res.status(400).json({
                valid: false,
                error: 'Coupon has expired'
            });
        }
        if (coupon.maxUsage && coupon.usage >= coupon.maxUsage) {
            return res.status(400).json({
                valid: false,
                error: 'Coupon usage limit reached'
            });
        }
        if (affiliateId && coupon.affiliateId !== affiliateId) {
            return res.status(400).json({
                valid: false,
                error: 'Coupon not valid for this affiliate'
            });
        }
        let discountAmount = 0;
        const discountValue = parseFloat(coupon.discount);
        if (discountValue < 1) {
            discountAmount = (orderValue * discountValue) / 100;
        }
        else {
            discountAmount = Math.min(discountValue, orderValue);
        }
        res.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discount: coupon.discount,
                discountAmount
            }
        });
    }
    catch (error) {
        console.error('Error validating coupon:', error);
        res.status(400).json({ error: 'Failed to validate coupon' });
    }
});
exports.default = router;
//# sourceMappingURL=coupons.js.map