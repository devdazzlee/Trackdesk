import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  applicableTo: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS' | 'CATEGORIES';
  productIds?: string[];
  categoryIds?: string[];
  affiliateId?: string;
  offerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  orderId: string;
  customerId: string;
  affiliateId: string;
  discountAmount: number;
  usedAt: Date;
}

export class CouponModel {
  static async create(data: Partial<Coupon>): Promise<Coupon> {
    return await prisma.coupon.create({
      data: {
        code: data.code!,
        name: data.name!,
        description: data.description || '',
        type: data.type!,
        value: data.value!,
        minimumAmount: data.minimumAmount,
        maximumDiscount: data.maximumDiscount,
        usageLimit: data.usageLimit,
        usedCount: 0,
        startDate: data.startDate!,
        endDate: data.endDate,
        status: data.status || 'ACTIVE',
        applicableTo: data.applicableTo || 'ALL_PRODUCTS',
        productIds: data.productIds,
        categoryIds: data.categoryIds,
        affiliateId: data.affiliateId,
        offerId: data.offerId,
      }
    }) as Coupon;
  }

  static async findById(id: string): Promise<Coupon | null> {
    return await prisma.coupon.findUnique({
      where: { id }
    }) as Coupon | null;
  }

  static async findByCode(code: string): Promise<Coupon | null> {
    return await prisma.coupon.findUnique({
      where: { code }
    }) as Coupon | null;
  }

  static async update(id: string, data: Partial<Coupon>): Promise<Coupon> {
    return await prisma.coupon.update({
      where: { id },
      data
    }) as Coupon;
  }

  static async delete(id: string): Promise<void> {
    await prisma.coupon.delete({
      where: { id }
    });
  }

  static async list(filters: any = {}, page: number = 1, limit: number = 10): Promise<Coupon[]> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.affiliateId) where.affiliateId = filters.affiliateId;
    if (filters.offerId) where.offerId = filters.offerId;

    return await prisma.coupon.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }) as Coupon[];
  }

  static async validateCoupon(code: string, orderAmount: number, productIds: string[]): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; error?: string }> {
    const coupon = await this.findByCode(code);
    
    if (!coupon) {
      return { valid: false, error: 'Coupon not found' };
    }

    if (coupon.status !== 'ACTIVE') {
      return { valid: false, error: 'Coupon is not active' };
    }

    if (coupon.endDate && new Date() > coupon.endDate) {
      return { valid: false, error: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    if (coupon.minimumAmount && orderAmount < coupon.minimumAmount) {
      return { valid: false, error: `Minimum order amount of ${coupon.minimumAmount} required` };
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maximumDiscount) {
        discount = Math.min(discount, coupon.maximumDiscount);
      }
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discount = coupon.value;
    }

    return { valid: true, coupon, discount };
  }

  static async recordUsage(couponId: string, orderId: string, customerId: string, affiliateId: string, discountAmount: number): Promise<CouponUsage> {
    // Record usage
    const usage = await prisma.couponUsage.create({
      data: {
        couponId,
        orderId,
        customerId,
        affiliateId,
        discountAmount,
        usedAt: new Date()
      }
    }) as CouponUsage;

    // Update usage count
    await prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1
        }
      }
    });

    return usage;
  }

  static async importFromCSV(csvData: string, affiliateId?: string, offerId?: string): Promise<Coupon[]> {
    const lines = csvData.split('\n');
    const coupons: Coupon[] = [];

    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',');
      if (columns.length < 4) continue;

      const coupon = await this.create({
        code: columns[0].trim(),
        name: columns[1].trim(),
        description: columns[2].trim(),
        type: columns[3].trim() as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING',
        value: parseFloat(columns[4].trim()),
        minimumAmount: columns[5] ? parseFloat(columns[5].trim()) : undefined,
        maximumDiscount: columns[6] ? parseFloat(columns[6].trim()) : undefined,
        usageLimit: columns[7] ? parseInt(columns[7].trim()) : undefined,
        startDate: new Date(columns[8].trim()),
        endDate: columns[9] ? new Date(columns[9].trim()) : undefined,
        status: 'ACTIVE',
        applicableTo: 'ALL_PRODUCTS',
        affiliateId,
        offerId,
      });

      coupons.push(coupon);
    }

    return coupons;
  }
}


