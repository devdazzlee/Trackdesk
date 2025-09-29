import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Offer {
  id: string;
  accountId: string;
  name: string;
  description: string;
  category: string;
  type: 'CPA' | 'CPS' | 'CPL' | 'CPM' | 'CPC' | 'REVENUE_SHARE' | 'HYBRID';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  priority: number;
  
  // General Settings
  general: OfferGeneral;
  
  // Revenue & Payouts
  revenue: OfferRevenue;
  
  // Landing Pages
  landingPages: OfferLandingPage[];
  
  // Creatives
  creatives: OfferCreative[];
  
  // Affiliate Tracking
  tracking: OfferTracking;
  
  // Integrations
  integrations: OfferIntegration[];
  
  // Settings
  settings: OfferSettings;
  
  // Application Settings
  application: OfferApplication;
  
  // Smart Link Settings
  smartLink: OfferSmartLink;
  
  stats: OfferStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferGeneral {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  targetAudience: string;
  restrictions: string[];
  compliance: string[];
  notes: string;
  isPublic: boolean;
  requiresApproval: boolean;
  autoApprove: boolean;
  maxAffiliates?: number;
  minTraffic?: number;
  minConversions?: number;
}

export interface OfferRevenue {
  type: 'CPA' | 'CPS' | 'CPL' | 'CPM' | 'CPC' | 'REVENUE_SHARE' | 'HYBRID';
  basePayout: number;
  currency: string;
  payoutType: 'FIXED' | 'PERCENTAGE' | 'TIERED';
  payoutSchedule: 'IMMEDIATE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  minimumPayout: number;
  maximumPayout?: number;
  tieredRates?: TieredRate[];
  revenueShare?: number;
  capType: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  capAmount?: number;
  holdPeriod: number; // days
  chargebackPeriod: number; // days
  refundPolicy: string;
}

export interface TieredRate {
  min: number;
  max?: number;
  rate: number;
  type: 'FIXED' | 'PERCENTAGE';
}

export interface OfferLandingPage {
  id: string;
  name: string;
  url: string;
  type: 'PRIMARY' | 'BACKUP' | 'MOBILE' | 'DESKTOP';
  isDefault: boolean;
  weight: number;
  conditions: LandingPageCondition[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LandingPageCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'IN' | 'NOT_IN';
  value: any;
}

export interface OfferCreative {
  id: string;
  name: string;
  type: 'BANNER' | 'TEXT' | 'EMAIL' | 'VIDEO' | 'AUDIO' | 'POPUP' | 'OVERLAY';
  format: string;
  size: string;
  url: string;
  thumbnail?: string;
  altText?: string;
  title?: string;
  description?: string;
  htmlCode?: string;
  javascriptCode?: string;
  cssCode?: string;
  isActive: boolean;
  isDefault: boolean;
  weight: number;
  restrictions: string[];
  trackingCode?: string;
}

export interface OfferTracking {
  clickTracking: boolean;
  conversionTracking: boolean;
  postbackTracking: boolean;
  pixelTracking: boolean;
  serverToServer: boolean;
  javascriptTracking: boolean;
  cookieTracking: boolean;
  sessionTracking: boolean;
  crossDomainTracking: boolean;
  trackingDomain?: string;
  trackingParameters: TrackingParameter[];
  customEvents: CustomEvent[];
  attributionWindow: number; // hours
  conversionWindow: number; // hours
  duplicateWindow: number; // minutes
  allowDuplicates: boolean;
  requireValidation: boolean;
  validationRules: ValidationRule[];
}

export interface TrackingParameter {
  name: string;
  value: string;
  type: 'STATIC' | 'DYNAMIC' | 'CUSTOM';
  required: boolean;
  description?: string;
}

export interface CustomEvent {
  name: string;
  description: string;
  parameters: string[];
  isActive: boolean;
}

export interface ValidationRule {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'REGEX';
  value: any;
  message: string;
  isActive: boolean;
}

export interface OfferIntegration {
  id: string;
  name: string;
  type: 'WEBHOOK' | 'API' | 'PIXEL' | 'POSTBACK' | 'EMAIL' | 'SMS';
  url?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  parameters: Record<string, string>;
  authentication: {
    type: 'NONE' | 'BASIC' | 'BEARER' | 'API_KEY' | 'OAUTH';
    credentials?: Record<string, string>;
  };
  isActive: boolean;
  retryAttempts: number;
  retryDelay: number; // seconds
  timeout: number; // seconds
  events: string[];
  conditions: IntegrationCondition[];
}

export interface IntegrationCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';
  value: any;
}

export interface OfferSettings {
  allowMultipleConversions: boolean;
  requireApproval: boolean;
  autoApprove: boolean;
  allowSubAffiliates: boolean;
  allowCoupons: boolean;
  allowDeepLinks: boolean;
  allowDirectLinking: boolean;
  requireLandingPage: boolean;
  allowMobileTraffic: boolean;
  allowDesktopTraffic: boolean;
  allowTabletTraffic: boolean;
  geoRestrictions: string[];
  deviceRestrictions: string[];
  browserRestrictions: string[];
  timeRestrictions: TimeRestriction[];
  trafficQuality: TrafficQualitySettings;
  fraudPrevention: FraudPreventionSettings;
  compliance: ComplianceSettings;
}

export interface TimeRestriction {
  day: number; // 0-6 (Sunday-Saturday)
  startHour: number; // 0-23
  endHour: number; // 0-23
  timezone: string;
}

export interface TrafficQualitySettings {
  minBounceRate: number;
  maxBounceRate: number;
  minSessionDuration: number; // seconds
  minPagesPerSession: number;
  requireEngagement: boolean;
  qualityScore: number;
}

export interface FraudPreventionSettings {
  enableFraudDetection: boolean;
  fraudThreshold: number;
  blockSuspiciousTraffic: boolean;
  requireVerification: boolean;
  enableAnura: boolean;
  customRules: FraudRule[];
}

export interface FraudRule {
  name: string;
  condition: string;
  action: 'ALLOW' | 'BLOCK' | 'FLAG' | 'REVIEW';
  weight: number;
}

export interface ComplianceSettings {
  gdprCompliant: boolean;
  ccpaCompliant: boolean;
  coppaCompliant: boolean;
  requireConsent: boolean;
  consentText: string;
  privacyPolicy: string;
  termsOfService: string;
  disclaimer: string;
}

export interface OfferApplication {
  isOpen: boolean;
  requiresApproval: boolean;
  autoApprove: boolean;
  applicationForm: ApplicationForm;
  requirements: ApplicationRequirement[];
  approvalProcess: ApprovalProcess;
  rejectionReasons: string[];
  welcomeMessage: string;
  approvalMessage: string;
  rejectionMessage: string;
}

export interface ApplicationForm {
  fields: ApplicationField[];
  isCustomizable: boolean;
  requireDocuments: boolean;
  documentTypes: string[];
}

export interface ApplicationField {
  name: string;
  label: string;
  type: 'TEXT' | 'EMAIL' | 'PHONE' | 'URL' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO' | 'FILE';
  required: boolean;
  options?: string[];
  validation?: string;
  placeholder?: string;
  helpText?: string;
}

export interface ApplicationRequirement {
  type: 'MINIMUM_TRAFFIC' | 'MINIMUM_CONVERSIONS' | 'WEBSITE_QUALITY' | 'EXPERIENCE' | 'DOCUMENTS' | 'CUSTOM';
  value: any;
  description: string;
  isRequired: boolean;
}

export interface ApprovalProcess {
  steps: ApprovalStep[];
  autoApproval: boolean;
  manualReview: boolean;
  notificationSettings: NotificationSettings;
}

export interface ApprovalStep {
  name: string;
  description: string;
  order: number;
  isRequired: boolean;
  estimatedTime: number; // hours
  assignedTo?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  webhookNotifications: boolean;
  notificationTemplates: Record<string, string>;
}

export interface OfferSmartLink {
  enabled: boolean;
  baseUrl: string;
  shortDomain?: string;
  trackingParameters: string[];
  redirectRules: SmartLinkRule[];
  fallbackUrl?: string;
  customDomain?: string;
  sslEnabled: boolean;
  analyticsEnabled: boolean;
  aTestingEnabled: boolean;
  geoRedirects: GeoRedirect[];
  deviceRedirects: DeviceRedirect[];
  timeBasedRedirects: TimeBasedRedirect[];
}

export interface SmartLinkRule {
  id: string;
  name: string;
  conditions: SmartLinkCondition[];
  actions: SmartLinkAction[];
  priority: number;
  isActive: boolean;
}

export interface SmartLinkCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN';
  value: any;
}

export interface SmartLinkAction {
  type: 'REDIRECT' | 'BLOCK' | 'MODIFY_URL' | 'ADD_PARAMETER' | 'REMOVE_PARAMETER';
  parameters: Record<string, any>;
}

export interface GeoRedirect {
  country: string;
  url: string;
  isActive: boolean;
}

export interface DeviceRedirect {
  device: 'MOBILE' | 'TABLET' | 'DESKTOP';
  url: string;
  isActive: boolean;
}

export interface TimeBasedRedirect {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  days: number[]; // 0-6 (Sunday-Saturday)
  url: string;
  isActive: boolean;
}

export interface OfferStats {
  totalClicks: number;
  uniqueClicks: number;
  totalConversions: number;
  uniqueConversions: number;
  conversionRate: number;
  totalRevenue: number;
  totalPayout: number;
  totalAffiliates: number;
  activeAffiliates: number;
  pendingAffiliates: number;
  rejectedAffiliates: number;
  lastClick?: Date;
  lastConversion?: Date;
  byAffiliate: Record<string, any>;
  byCountry: Record<string, any>;
  byDevice: Record<string, any>;
  bySource: Record<string, any>;
  byHour: Record<number, any>;
  byDay: Record<string, any>;
}

export interface OfferApplication {
  id: string;
  offerId: string;
  affiliateId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  applicationData: Record<string, any>;
  documents: ApplicationDocument[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export class OffersModel {
  static async create(data: Partial<Offer>): Promise<Offer> {
    return await prisma.offer.create({
      data: {
        accountId: data.accountId!,
        name: data.name!,
        description: data.description || '',
        category: data.category || 'General',
        type: data.type || 'CPA',
        status: data.status || 'DRAFT',
        priority: data.priority || 0,
        general: data.general || {
          name: data.name!,
          description: data.description || '',
          category: data.category || 'General',
          tags: [],
          targetAudience: '',
          restrictions: [],
          compliance: [],
          notes: '',
          isPublic: true,
          requiresApproval: false,
          autoApprove: false
        },
        revenue: data.revenue || {
          type: data.type || 'CPA',
          basePayout: 0,
          currency: 'USD',
          payoutType: 'FIXED',
          payoutSchedule: 'MONTHLY',
          minimumPayout: 0,
          holdPeriod: 30,
          chargebackPeriod: 90,
          refundPolicy: ''
        },
        landingPages: data.landingPages || [],
        creatives: data.creatives || [],
        tracking: data.tracking || {
          clickTracking: true,
          conversionTracking: true,
          postbackTracking: false,
          pixelTracking: false,
          serverToServer: false,
          javascriptTracking: false,
          cookieTracking: true,
          sessionTracking: true,
          crossDomainTracking: false,
          trackingParameters: [],
          customEvents: [],
          attributionWindow: 24,
          conversionWindow: 168,
          duplicateWindow: 30,
          allowDuplicates: false,
          requireValidation: false,
          validationRules: []
        },
        integrations: data.integrations || [],
        settings: data.settings || {
          allowMultipleConversions: false,
          requireApproval: false,
          autoApprove: false,
          allowSubAffiliates: false,
          allowCoupons: false,
          allowDeepLinks: false,
          allowDirectLinking: false,
          requireLandingPage: true,
          allowMobileTraffic: true,
          allowDesktopTraffic: true,
          allowTabletTraffic: true,
          geoRestrictions: [],
          deviceRestrictions: [],
          browserRestrictions: [],
          timeRestrictions: [],
          trafficQuality: {
            minBounceRate: 0,
            maxBounceRate: 1,
            minSessionDuration: 0,
            minPagesPerSession: 1,
            requireEngagement: false,
            qualityScore: 0
          },
          fraudPrevention: {
            enableFraudDetection: false,
            fraudThreshold: 0.7,
            blockSuspiciousTraffic: false,
            requireVerification: false,
            enableAnura: false,
            customRules: []
          },
          compliance: {
            gdprCompliant: false,
            ccpaCompliant: false,
            coppaCompliant: false,
            requireConsent: false,
            consentText: '',
            privacyPolicy: '',
            termsOfService: '',
            disclaimer: ''
          }
        },
        application: data.application || {
          isOpen: true,
          requiresApproval: false,
          autoApprove: false,
          applicationForm: {
            fields: [],
            isCustomizable: false,
            requireDocuments: false,
            documentTypes: []
          },
          requirements: [],
          approvalProcess: {
            steps: [],
            autoApproval: false,
            manualReview: true,
            notificationSettings: {
              emailNotifications: true,
              smsNotifications: false,
              inAppNotifications: true,
              webhookNotifications: false,
              notificationTemplates: {}
            }
          },
          rejectionReasons: [],
          welcomeMessage: '',
          approvalMessage: '',
          rejectionMessage: ''
        },
        smartLink: data.smartLink || {
          enabled: false,
          baseUrl: '',
          trackingParameters: [],
          redirectRules: [],
          sslEnabled: true,
          analyticsEnabled: true,
          aTestingEnabled: false,
          geoRedirects: [],
          deviceRedirects: [],
          timeBasedRedirects: []
        },
        stats: {
          totalClicks: 0,
          uniqueClicks: 0,
          totalConversions: 0,
          uniqueConversions: 0,
          conversionRate: 0,
          totalRevenue: 0,
          totalPayout: 0,
          totalAffiliates: 0,
          activeAffiliates: 0,
          pendingAffiliates: 0,
          rejectedAffiliates: 0,
          byAffiliate: {},
          byCountry: {},
          byDevice: {},
          bySource: {},
          byHour: {},
          byDay: {}
        }
      }
    }) as Offer;
  }

  static async findById(id: string): Promise<Offer | null> {
    return await prisma.offer.findUnique({
      where: { id }
    }) as Offer | null;
  }

  static async update(id: string, data: Partial<Offer>): Promise<Offer> {
    return await prisma.offer.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    }) as Offer;
  }

  static async delete(id: string): Promise<void> {
    await prisma.offer.delete({
      where: { id }
    });
  }

  static async list(accountId: string, filters: any = {}): Promise<Offer[]> {
    const where: any = { accountId };
    
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;
    if (filters.isPublic !== undefined) where.general = { path: ['isPublic'], equals: filters.isPublic };

    return await prisma.offer.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    }) as Offer[];
  }

  static async addLandingPage(offerId: string, landingPage: Partial<OfferLandingPage>): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const newLandingPage: OfferLandingPage = {
      id: `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: landingPage.name!,
      url: landingPage.url!,
      type: landingPage.type || 'PRIMARY',
      isDefault: landingPage.isDefault || false,
      weight: landingPage.weight || 1,
      conditions: landingPage.conditions || [],
      status: 'ACTIVE'
    };

    const updatedLandingPages = [...offer.landingPages, newLandingPage];
    
    return await this.update(offerId, { landingPages: updatedLandingPages });
  }

  static async updateLandingPage(offerId: string, landingPageId: string, data: Partial<OfferLandingPage>): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const updatedLandingPages = offer.landingPages.map(lp => 
      lp.id === landingPageId ? { ...lp, ...data } : lp
    );
    
    return await this.update(offerId, { landingPages: updatedLandingPages });
  }

  static async removeLandingPage(offerId: string, landingPageId: string): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const updatedLandingPages = offer.landingPages.filter(lp => lp.id !== landingPageId);
    
    return await this.update(offerId, { landingPages: updatedLandingPages });
  }

  static async addCreative(offerId: string, creative: Partial<OfferCreative>): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const newCreative: OfferCreative = {
      id: `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: creative.name!,
      type: creative.type!,
      format: creative.format || '',
      size: creative.size || '',
      url: creative.url!,
      thumbnail: creative.thumbnail,
      altText: creative.altText,
      title: creative.title,
      description: creative.description,
      htmlCode: creative.htmlCode,
      javascriptCode: creative.javascriptCode,
      cssCode: creative.cssCode,
      isActive: creative.isActive !== undefined ? creative.isActive : true,
      isDefault: creative.isDefault || false,
      weight: creative.weight || 1,
      restrictions: creative.restrictions || [],
      trackingCode: creative.trackingCode
    };

    const updatedCreatives = [...offer.creatives, newCreative];
    
    return await this.update(offerId, { creatives: updatedCreatives });
  }

  static async updateCreative(offerId: string, creativeId: string, data: Partial<OfferCreative>): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const updatedCreatives = offer.creatives.map(cr => 
      cr.id === creativeId ? { ...cr, ...data } : cr
    );
    
    return await this.update(offerId, { creatives: updatedCreatives });
  }

  static async removeCreative(offerId: string, creativeId: string): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const updatedCreatives = offer.creatives.filter(cr => cr.id !== creativeId);
    
    return await this.update(offerId, { creatives: updatedCreatives });
  }

  static async addIntegration(offerId: string, integration: Partial<OfferIntegration>): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const newIntegration: OfferIntegration = {
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: integration.name!,
      type: integration.type!,
      url: integration.url,
      method: integration.method || 'POST',
      headers: integration.headers || {},
      parameters: integration.parameters || {},
      authentication: integration.authentication || { type: 'NONE' },
      isActive: integration.isActive !== undefined ? integration.isActive : true,
      retryAttempts: integration.retryAttempts || 3,
      retryDelay: integration.retryDelay || 5,
      timeout: integration.timeout || 30,
      events: integration.events || [],
      conditions: integration.conditions || []
    };

    const updatedIntegrations = [...offer.integrations, newIntegration];
    
    return await this.update(offerId, { integrations: updatedIntegrations });
  }

  static async updateIntegration(offerId: string, integrationId: string, data: Partial<OfferIntegration>): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const updatedIntegrations = offer.integrations.map(int => 
      int.id === integrationId ? { ...int, ...data } : int
    );
    
    return await this.update(offerId, { integrations: updatedIntegrations });
  }

  static async removeIntegration(offerId: string, integrationId: string): Promise<Offer> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const updatedIntegrations = offer.integrations.filter(int => int.id !== integrationId);
    
    return await this.update(offerId, { integrations: updatedIntegrations });
  }

  static async generateTrackingCode(offerId: string, type: 'PIXEL' | 'JAVASCRIPT' | 'POSTBACK' | 'SERVER_TO_SERVER'): Promise<string> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const baseUrl = process.env.TRACKING_BASE_URL || 'https://track.example.com';
    const trackingId = `offer_${offerId}_${type.toLowerCase()}`;

    switch (type) {
      case 'PIXEL':
        return `
          <!-- Trackdesk Pixel for ${offer.name} -->
          <img src="${baseUrl}/pixel/${trackingId}" width="1" height="1" style="display:none;" alt="" />
          <!-- End Trackdesk Pixel -->
        `;

      case 'JAVASCRIPT':
        return `
          <!-- Trackdesk JavaScript for ${offer.name} -->
          <script>
            (function() {
              var script = document.createElement('script');
              script.src = '${baseUrl}/js/${trackingId}';
              script.async = true;
              document.head.appendChild(script);
            })();
          </script>
          <!-- End Trackdesk JavaScript -->
        `;

      case 'POSTBACK':
        return `
          <!-- Trackdesk Postback for ${offer.name} -->
          Postback URL: ${baseUrl}/postback/${trackingId}
          Method: POST
          Content-Type: application/json
          
          {
            "click_id": "{{click_id}}",
            "affiliate_id": "{{affiliate_id}}",
            "offer_id": "${offerId}",
            "conversion_id": "{{conversion_id}}",
            "amount": "{{amount}}",
            "currency": "{{currency}}",
            "timestamp": "{{timestamp}}"
          }
          <!-- End Trackdesk Postback -->
        `;

      case 'SERVER_TO_SERVER':
        return `
          <!-- Trackdesk Server-to-Server for ${offer.name} -->
          Endpoint: ${baseUrl}/s2s/${trackingId}
          Method: POST
          Content-Type: application/json
          
          {
            "event": "conversion",
            "click_id": "{{click_id}}",
            "affiliate_id": "{{affiliate_id}}",
            "offer_id": "${offerId}",
            "amount": "{{amount}}",
            "currency": "{{currency}}",
            "timestamp": "{{timestamp}}"
          }
          <!-- End Trackdesk Server-to-Server -->
        `;

      default:
        throw new Error('Invalid tracking code type');
    }
  }

  static async createApplication(offerId: string, affiliateId: string, applicationData: Record<string, any>, documents: ApplicationDocument[] = []): Promise<OfferApplication> {
    const offer = await this.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    if (!offer.application.isOpen) {
      throw new Error('Offer applications are currently closed');
    }

    return await prisma.offerApplication.create({
      data: {
        offerId,
        affiliateId,
        status: offer.application.autoApprove ? 'APPROVED' : 'PENDING',
        applicationData,
        documents,
        submittedAt: new Date()
      }
    }) as OfferApplication;
  }

  static async findApplicationById(id: string): Promise<OfferApplication | null> {
    return await prisma.offerApplication.findUnique({
      where: { id }
    }) as OfferApplication | null;
  }

  static async updateApplicationStatus(id: string, status: string, reviewedBy: string, rejectionReason?: string, notes?: string): Promise<OfferApplication> {
    return await prisma.offerApplication.update({
      where: { id },
      data: {
        status: status as any,
        reviewedAt: new Date(),
        reviewedBy,
        rejectionReason,
        notes
      }
    }) as OfferApplication;
  }

  static async getApplications(offerId: string, filters: any = {}): Promise<OfferApplication[]> {
    const where: any = { offerId };
    
    if (filters.status) where.status = filters.status;
    if (filters.affiliateId) where.affiliateId = filters.affiliateId;

    return await prisma.offerApplication.findMany({
      where,
      orderBy: { submittedAt: 'desc' }
    }) as OfferApplication[];
  }

  static async updateStats(offerId: string): Promise<void> {
    const offer = await this.findById(offerId);
    if (!offer) return;

    // Get click and conversion counts
    const totalClicks = await prisma.click.count({
      where: { offerId }
    });

    const uniqueClicks = await prisma.click.groupBy({
      by: ['ipAddress'],
      where: { offerId }
    }).then(result => result.length);

    const totalConversions = await prisma.conversion.count({
      where: { offerId }
    });

    const uniqueConversions = await prisma.conversion.groupBy({
      by: ['userId'],
      where: { offerId }
    }).then(result => result.length);

    const totalRevenue = await prisma.conversion.aggregate({
      where: { offerId },
      _sum: { orderValue: true }
    });

    const totalPayout = await prisma.conversion.aggregate({
      where: { offerId },
      _sum: { commissionAmount: true }
    });

    const applications = await this.getApplications(offerId);
    const totalAffiliates = applications.length;
    const activeAffiliates = applications.filter(app => app.status === 'APPROVED').length;
    const pendingAffiliates = applications.filter(app => app.status === 'PENDING').length;
    const rejectedAffiliates = applications.filter(app => app.status === 'REJECTED').length;

    // Update stats
    const stats: OfferStats = {
      ...offer.stats,
      totalClicks,
      uniqueClicks,
      totalConversions,
      uniqueConversions,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      totalRevenue: totalRevenue._sum.orderValue || 0,
      totalPayout: totalPayout._sum.commissionAmount || 0,
      totalAffiliates,
      activeAffiliates,
      pendingAffiliates,
      rejectedAffiliates
    };

    await this.update(offerId, { stats });
  }

  static async getOfferStats(accountId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = { accountId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const offers = await this.list(accountId);
    const totalClicks = await prisma.click.count({
      where: { offer: { accountId } }
    });
    const totalConversions = await prisma.conversion.count({
      where: { offer: { accountId } }
    });

    const stats = {
      totalOffers: offers.length,
      activeOffers: offers.filter(o => o.status === 'ACTIVE').length,
      pausedOffers: offers.filter(o => o.status === 'PAUSED').length,
      draftOffers: offers.filter(o => o.status === 'DRAFT').length,
      totalClicks,
      totalConversions,
      totalRevenue: offers.reduce((sum, o) => sum + o.stats.totalRevenue, 0),
      totalPayout: offers.reduce((sum, o) => sum + o.stats.totalPayout, 0),
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>
    };

    // Aggregate by type, status, and category
    offers.forEach(offer => {
      stats.byType[offer.type] = (stats.byType[offer.type] || 0) + 1;
      stats.byStatus[offer.status] = (stats.byStatus[offer.status] || 0) + 1;
      stats.byCategory[offer.category] = (stats.byCategory[offer.category] || 0) + 1;
    });

    return stats;
  }

  static async createDefaultOffers(accountId: string): Promise<Offer[]> {
    const defaultOffers = [
      {
        name: 'E-commerce Sale',
        description: 'Track sales from your e-commerce store',
        category: 'E-commerce',
        type: 'CPS' as const,
        general: {
          name: 'E-commerce Sale',
          description: 'Track sales from your e-commerce store',
          category: 'E-commerce',
          tags: ['ecommerce', 'sales', 'retail'],
          targetAudience: 'Online shoppers',
          restrictions: [],
          compliance: ['GDPR', 'CCPA'],
          notes: 'Standard e-commerce tracking offer',
          isPublic: true,
          requiresApproval: false,
          autoApprove: true
        },
        revenue: {
          type: 'CPS',
          basePayout: 5.0,
          currency: 'USD',
          payoutType: 'PERCENTAGE',
          payoutSchedule: 'MONTHLY',
          minimumPayout: 50,
          holdPeriod: 30,
          chargebackPeriod: 90,
          refundPolicy: 'Standard 30-day refund policy'
        }
      },
      {
        name: 'Lead Generation',
        description: 'Generate high-quality leads for your business',
        category: 'Lead Generation',
        type: 'CPL' as const,
        general: {
          name: 'Lead Generation',
          description: 'Generate high-quality leads for your business',
          category: 'Lead Generation',
          tags: ['leads', 'generation', 'marketing'],
          targetAudience: 'Business professionals',
          restrictions: [],
          compliance: ['GDPR', 'CCPA'],
          notes: 'Lead generation offer with quality requirements',
          isPublic: true,
          requiresApproval: true,
          autoApprove: false
        },
        revenue: {
          type: 'CPL',
          basePayout: 25.0,
          currency: 'USD',
          payoutType: 'FIXED',
          payoutSchedule: 'WEEKLY',
          minimumPayout: 100,
          holdPeriod: 7,
          chargebackPeriod: 30,
          refundPolicy: 'Leads must be validated within 24 hours'
        }
      }
    ];

    const createdOffers: Offer[] = [];
    for (const offerData of defaultOffers) {
      const offer = await this.create({
        accountId,
        ...offerData
      });
      createdOffers.push(offer);
    }

    return createdOffers;
  }

  static async getOffersDashboard(accountId: string): Promise<any> {
    const offers = await this.list(accountId);
    const stats = await this.getOfferStats(accountId);

    return {
      offers,
      stats
    };
  }
}


