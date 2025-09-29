import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PaymentMethod {
  id: string;
  accountId: string;
  name: string;
  type: 'PAYPAL' | 'STRIPE' | 'BANK_TRANSFER' | 'WISE' | 'CRYPTO' | 'CHECK' | 'WIRE_TRANSFER' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  settings: PaymentMethodSettings;
  fees: PaymentFees;
  limits: PaymentLimits;
  requirements: PaymentRequirements;
  supportedCurrencies: string[];
  processingTime: string;
  description: string;
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodSettings {
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  sandboxMode: boolean;
  customFields: Record<string, any>;
  additionalSettings: Record<string, any>;
}

export interface PaymentFees {
  fixedFee: number;
  percentageFee: number;
  minimumFee: number;
  maximumFee: number;
  currency: string;
}

export interface PaymentLimits {
  minimumAmount: number;
  maximumAmount: number;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
}

export interface PaymentRequirements {
  kycRequired: boolean;
  bankAccountRequired: boolean;
  taxIdRequired: boolean;
  addressRequired: boolean;
  phoneRequired: boolean;
  additionalDocuments: string[];
}

export interface PaymentMethodUsage {
  id: string;
  paymentMethodId: string;
  affiliateId: string;
  totalPayouts: number;
  totalAmount: number;
  lastUsed: Date;
  successRate: number;
  averageProcessingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentMethodsModel {
  static async create(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return await prisma.paymentMethod.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        type: data.type!,
        status: data.status || 'ACTIVE',
        settings: data.settings || {
          sandboxMode: true,
          customFields: {},
          additionalSettings: {}
        },
        fees: data.fees || {
          fixedFee: 0,
          percentageFee: 0,
          minimumFee: 0,
          maximumFee: 0,
          currency: 'USD'
        },
        limits: data.limits || {
          minimumAmount: 10,
          maximumAmount: 10000,
          dailyLimit: 50000,
          monthlyLimit: 500000,
          currency: 'USD'
        },
        requirements: data.requirements || {
          kycRequired: false,
          bankAccountRequired: false,
          taxIdRequired: false,
          addressRequired: false,
          phoneRequired: false,
          additionalDocuments: []
        },
        supportedCurrencies: data.supportedCurrencies || ['USD'],
        processingTime: data.processingTime || '1-3 business days',
        description: data.description || '',
        instructions: data.instructions || ''
      }
    }) as PaymentMethod;
  }

  static async findById(id: string): Promise<PaymentMethod | null> {
    return await prisma.paymentMethod.findUnique({
      where: { id }
    }) as PaymentMethod | null;
  }

  static async update(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    return await prisma.paymentMethod.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as PaymentMethod;
  }

  static async delete(id: string): Promise<void> {
    await prisma.paymentMethod.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });
  }

  static async list(accountId: string, filters: any = {}): Promise<PaymentMethod[]> {
    const where: any = { accountId };
    
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.supportedCurrency) {
      where.supportedCurrencies = { has: filters.supportedCurrency };
    }

    return await prisma.paymentMethod.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    }) as PaymentMethod[];
  }

  static async getActiveMethods(accountId: string): Promise<PaymentMethod[]> {
    return await this.list(accountId, { status: 'ACTIVE' });
  }

  static async calculateFees(paymentMethodId: string, amount: number, currency: string): Promise<{ totalFees: number; netAmount: number; breakdown: any }> {
    const paymentMethod = await this.findById(paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    const fees = paymentMethod.fees;
    let totalFees = 0;

    // Calculate percentage fee
    const percentageFee = (amount * fees.percentageFee) / 100;
    
    // Add fixed fee
    totalFees += fees.fixedFee;
    
    // Apply minimum and maximum fee limits
    if (totalFees < fees.minimumFee) {
      totalFees = fees.minimumFee;
    } else if (totalFees > fees.maximumFee) {
      totalFees = fees.maximumFee;
    }

    const netAmount = amount - totalFees;

    return {
      totalFees,
      netAmount,
      breakdown: {
        fixedFee: fees.fixedFee,
        percentageFee: percentageFee,
        totalFees,
        netAmount
      }
    };
  }

  static async validatePayment(paymentMethodId: string, amount: number, currency: string, affiliateId: string): Promise<{ valid: boolean; errors: string[] }> {
    const paymentMethod = await this.findById(paymentMethodId);
    if (!paymentMethod) {
      return { valid: false, errors: ['Payment method not found'] };
    }

    const errors: string[] = [];

    // Check if payment method is active
    if (paymentMethod.status !== 'ACTIVE') {
      errors.push('Payment method is not active');
    }

    // Check supported currencies
    if (!paymentMethod.supportedCurrencies.includes(currency)) {
      errors.push(`Currency ${currency} is not supported by this payment method`);
    }

    // Check amount limits
    const limits = paymentMethod.limits;
    if (amount < limits.minimumAmount) {
      errors.push(`Amount must be at least ${limits.minimumAmount} ${limits.currency}`);
    }
    if (amount > limits.maximumAmount) {
      errors.push(`Amount cannot exceed ${limits.maximumAmount} ${limits.currency}`);
    }

    // Check daily and monthly limits
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyUsage = await prisma.payout.aggregate({
      where: {
        affiliateId,
        paymentMethodId,
        status: 'COMPLETED',
        completedAt: {
          gte: startOfDay
        }
      },
      _sum: { amount: true }
    });

    const monthlyUsage = await prisma.payout.aggregate({
      where: {
        affiliateId,
        paymentMethodId,
        status: 'COMPLETED',
        completedAt: {
          gte: startOfMonth
        }
      },
      _sum: { amount: true }
    });

    if (dailyUsage._sum.amount && (dailyUsage._sum.amount + amount) > limits.dailyLimit) {
      errors.push('Daily limit would be exceeded');
    }

    if (monthlyUsage._sum.amount && (monthlyUsage._sum.amount + amount) > limits.monthlyLimit) {
      errors.push('Monthly limit would be exceeded');
    }

    // Check requirements
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateId }
    });

    if (affiliate) {
      const requirements = paymentMethod.requirements;
      
      if (requirements.kycRequired && !affiliate.kycVerified) {
        errors.push('KYC verification is required for this payment method');
      }
      
      if (requirements.bankAccountRequired && !affiliate.bankAccount) {
        errors.push('Bank account information is required for this payment method');
      }
      
      if (requirements.taxIdRequired && !affiliate.taxId) {
        errors.push('Tax ID is required for this payment method');
      }
      
      if (requirements.addressRequired && !affiliate.address) {
        errors.push('Address information is required for this payment method');
      }
      
      if (requirements.phoneRequired && !affiliate.phone) {
        errors.push('Phone number is required for this payment method');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static async recordUsage(paymentMethodId: string, affiliateId: string, amount: number, success: boolean, processingTime: number): Promise<PaymentMethodUsage> {
    const existing = await prisma.paymentMethodUsage.findUnique({
      where: { paymentMethodId_affiliateId: { paymentMethodId, affiliateId } }
    });

    if (existing) {
      const totalPayouts = existing.totalPayouts + 1;
      const totalAmount = existing.totalAmount + amount;
      const successRate = ((existing.successRate * existing.totalPayouts) + (success ? 1 : 0)) / totalPayouts;
      const averageProcessingTime = ((existing.averageProcessingTime * existing.totalPayouts) + processingTime) / totalPayouts;

      return await prisma.paymentMethodUsage.update({
        where: { id: existing.id },
        data: {
          totalPayouts,
          totalAmount,
          lastUsed: new Date(),
          successRate,
          averageProcessingTime
        }
      }) as PaymentMethodUsage;
    } else {
      return await prisma.paymentMethodUsage.create({
        data: {
          paymentMethodId,
          affiliateId,
          totalPayouts: 1,
          totalAmount: amount,
          lastUsed: new Date(),
          successRate: success ? 1 : 0,
          averageProcessingTime: processingTime
        }
      }) as PaymentMethodUsage;
    }
  }

  static async getUsageStats(paymentMethodId: string): Promise<any> {
    const usage = await prisma.paymentMethodUsage.findMany({
      where: { paymentMethodId },
      include: {
        affiliate: {
          include: {
            user: true
          }
        }
      }
    });

    const stats = {
      totalUsers: usage.length,
      totalPayouts: usage.reduce((sum, u) => sum + u.totalPayouts, 0),
      totalAmount: usage.reduce((sum, u) => sum + u.totalAmount, 0),
      averageSuccessRate: usage.length > 0 ? usage.reduce((sum, u) => sum + u.successRate, 0) / usage.length : 0,
      averageProcessingTime: usage.length > 0 ? usage.reduce((sum, u) => sum + u.averageProcessingTime, 0) / usage.length : 0,
      topUsers: usage
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 10)
        .map(u => ({
          affiliateId: u.affiliateId,
          name: `${u.affiliate?.user?.firstName} ${u.affiliate?.user?.lastName}`,
          totalPayouts: u.totalPayouts,
          totalAmount: u.totalAmount,
          successRate: u.successRate
        }))
    };

    return stats;
  }

  static async createDefaultMethods(accountId: string): Promise<PaymentMethod[]> {
    const defaultMethods = [
      {
        name: 'PayPal',
        type: 'PAYPAL' as const,
        settings: {
          sandboxMode: true,
          customFields: {},
          additionalSettings: {}
        },
        fees: {
          fixedFee: 0.30,
          percentageFee: 2.9,
          minimumFee: 0.30,
          maximumFee: 0,
          currency: 'USD'
        },
        limits: {
          minimumAmount: 1,
          maximumAmount: 10000,
          dailyLimit: 50000,
          monthlyLimit: 500000,
          currency: 'USD'
        },
        requirements: {
          kycRequired: false,
          bankAccountRequired: false,
          taxIdRequired: false,
          addressRequired: true,
          phoneRequired: false,
          additionalDocuments: []
        },
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        processingTime: 'Instant',
        description: 'Fast and secure PayPal payments',
        instructions: 'Enter your PayPal email address to receive payments'
      },
      {
        name: 'Bank Transfer',
        type: 'BANK_TRANSFER' as const,
        settings: {
          sandboxMode: false,
          customFields: {},
          additionalSettings: {}
        },
        fees: {
          fixedFee: 0,
          percentageFee: 0,
          minimumFee: 0,
          maximumFee: 0,
          currency: 'USD'
        },
        limits: {
          minimumAmount: 50,
          maximumAmount: 50000,
          dailyLimit: 100000,
          monthlyLimit: 1000000,
          currency: 'USD'
        },
        requirements: {
          kycRequired: true,
          bankAccountRequired: true,
          taxIdRequired: true,
          addressRequired: true,
          phoneRequired: true,
          additionalDocuments: ['Bank statement', 'Government ID']
        },
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        processingTime: '1-3 business days',
        description: 'Direct bank transfer to your account',
        instructions: 'Provide your bank account details including routing number and account number'
      },
      {
        name: 'Wise (formerly TransferWise)',
        type: 'WISE' as const,
        settings: {
          sandboxMode: true,
          customFields: {},
          additionalSettings: {}
        },
        fees: {
          fixedFee: 0,
          percentageFee: 0.5,
          minimumFee: 0,
          maximumFee: 0,
          currency: 'USD'
        },
        limits: {
          minimumAmount: 1,
          maximumAmount: 1000000,
          dailyLimit: 1000000,
          monthlyLimit: 10000000,
          currency: 'USD'
        },
        requirements: {
          kycRequired: true,
          bankAccountRequired: false,
          taxIdRequired: false,
          addressRequired: true,
          phoneRequired: true,
          additionalDocuments: ['Government ID']
        },
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NZD'],
        processingTime: 'Same day',
        description: 'Low-cost international money transfers',
        instructions: 'Create a Wise account and provide your Wise email address'
      }
    ];

    const createdMethods: PaymentMethod[] = [];
    for (const methodData of defaultMethods) {
      const method = await this.create({
        accountId,
        ...methodData
      });
      createdMethods.push(method);
    }

    return createdMethods;
  }

  static async getAffiliateMethods(affiliateId: string): Promise<PaymentMethod[]> {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateId }
    });

    if (!affiliate) {
      return [];
    }

    const allMethods = await this.getActiveMethods(affiliate.userId); // This should be accountId
    const availableMethods: PaymentMethod[] = [];

    for (const method of allMethods) {
      const validation = await this.validatePayment(method.id, 100, 'USD', affiliateId); // Test with $100
      if (validation.valid) {
        availableMethods.push(method);
      }
    }

    return availableMethods;
  }

  static async getMethodComparison(accountId: string): Promise<any[]> {
    const methods = await this.getActiveMethods(accountId);
    
    return methods.map(method => ({
      id: method.id,
      name: method.name,
      type: method.type,
      fees: method.fees,
      limits: method.limits,
      processingTime: method.processingTime,
      supportedCurrencies: method.supportedCurrencies,
      requirements: method.requirements
    }));
  }

  static async updateMethodStatus(id: string, status: string): Promise<PaymentMethod> {
    return await this.update(id, { status: status as any });
  }

  static async getMethodHealth(accountId: string): Promise<any> {
    const methods = await this.list(accountId);
    
    const health = {
      totalMethods: methods.length,
      activeMethods: methods.filter(m => m.status === 'ACTIVE').length,
      inactiveMethods: methods.filter(m => m.status === 'INACTIVE').length,
      suspendedMethods: methods.filter(m => m.status === 'SUSPENDED').length,
      byType: {} as Record<string, number>
    };

    methods.forEach(method => {
      health.byType[method.type] = (health.byType[method.type] || 0) + 1;
    });

    return health;
  }
}


