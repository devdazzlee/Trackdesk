import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Account {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  settings: AccountSettings;
  branding: BrandingSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountSettings {
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
  allowAffiliateRegistration: boolean;
  requireApproval: boolean;
  minimumPayout: number;
  payoutSchedule: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  fraudDetection: boolean;
  qualityControl: boolean;
  mlmEnabled: boolean;
  maxTiers: number;
}

export interface BrandingSettings {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  customCss: string;
  customJs: string;
  footerText: string;
  removeBranding: boolean;
  customDomain: string;
}

export class AccountModel {
  static async create(data: Partial<Account>): Promise<Account> {
    return await prisma.account.create({
      data: {
        name: data.name!,
        domain: data.domain!,
        subdomain: data.subdomain!,
        status: data.status || 'PENDING',
        plan: data.plan || 'STARTER',
        settings: data.settings || {},
        branding: data.branding || {},
      }
    }) as Account;
  }

  static async findById(id: string): Promise<Account | null> {
    return await prisma.account.findUnique({
      where: { id }
    }) as Account | null;
  }

  static async findBySubdomain(subdomain: string): Promise<Account | null> {
    return await prisma.account.findUnique({
      where: { subdomain }
    }) as Account | null;
  }

  static async update(id: string, data: Partial<Account>): Promise<Account> {
    return await prisma.account.update({
      where: { id },
      data
    }) as Account;
  }

  static async delete(id: string): Promise<void> {
    await prisma.account.delete({
      where: { id }
    });
  }

  static async list(page: number = 1, limit: number = 10): Promise<Account[]> {
    const skip = (page - 1) * limit;
    return await prisma.account.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }) as Account[];
  }
}


