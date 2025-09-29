import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Postback {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  events: string[];
  parameters: PostbackParameter[];
  headers: Record<string, string>;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastTriggered?: Date;
  successCount: number;
  failureCount: number;
  affiliateId?: string;
  offerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostbackParameter {
  name: string;
  value: string;
  type: 'STATIC' | 'DYNAMIC' | 'CUSTOM';
  required: boolean;
}

export interface PostbackLog {
  id: string;
  postbackId: string;
  event: string;
  url: string;
  method: string;
  payload: any;
  response?: any;
  statusCode?: number;
  success: boolean;
  error?: string;
  triggeredAt: Date;
  responseTime: number;
}

export class PostbackModel {
  static async create(data: Partial<Postback>): Promise<Postback> {
    return await prisma.postback.create({
      data: {
        name: data.name!,
        url: data.url!,
        method: data.method || 'POST',
        events: data.events || [],
        parameters: data.parameters || [],
        headers: data.headers || {},
        timeout: data.timeout || 30,
        retryAttempts: data.retryAttempts || 3,
        retryDelay: data.retryDelay || 5,
        status: data.status || 'ACTIVE',
        successCount: 0,
        failureCount: 0,
        affiliateId: data.affiliateId,
        offerId: data.offerId,
      }
    }) as Postback;
  }

  static async findById(id: string): Promise<Postback | null> {
    return await prisma.postback.findUnique({
      where: { id }
    }) as Postback | null;
  }

  static async update(id: string, data: Partial<Postback>): Promise<Postback> {
    return await prisma.postback.update({
      where: { id },
      data
    }) as Postback;
  }

  static async delete(id: string): Promise<void> {
    await prisma.postback.delete({
      where: { id }
    });
  }

  static async list(filters: any = {}, page: number = 1, limit: number = 10): Promise<Postback[]> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.affiliateId) where.affiliateId = filters.affiliateId;
    if (filters.offerId) where.offerId = filters.offerId;
    if (filters.event) where.events = { has: filters.event };

    return await prisma.postback.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }) as Postback[];
  }

  static async triggerPostback(postbackId: string, event: string, data: any): Promise<PostbackLog> {
    const postback = await this.findById(postbackId);
    if (!postback) {
      throw new Error('Postback not found');
    }

    if (!postback.events.includes(event)) {
      throw new Error('Event not configured for this postback');
    }

    const startTime = Date.now();
    let success = false;
    let response: any = null;
    let statusCode: number = 0;
    let error: string | undefined;

    try {
      // Build URL with parameters
      let url = postback.url;
      const urlParams = new URLSearchParams();

      // Add dynamic parameters
      for (const param of postback.parameters) {
        if (param.type === 'STATIC') {
          urlParams.append(param.name, param.value);
        } else if (param.type === 'DYNAMIC') {
          const value = this.getDynamicValue(param.value, data);
          if (value) {
            urlParams.append(param.name, value);
          }
        } else if (param.type === 'CUSTOM') {
          const value = this.getCustomValue(param.value, data);
          if (value) {
            urlParams.append(param.name, value);
          }
        }
      }

      if (postback.method === 'GET') {
        url += (url.includes('?') ? '&' : '?') + urlParams.toString();
      }

      // Make HTTP request
      const fetchOptions: any = {
        method: postback.method,
        headers: {
          'Content-Type': 'application/json',
          ...postback.headers
        },
        timeout: postback.timeout * 1000
      };

      if (postback.method === 'POST') {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      statusCode = response.status;
      success = response.ok;

      if (success) {
        response = await response.json();
      } else {
        error = `HTTP ${statusCode}: ${response.statusText}`;
      }

    } catch (err: any) {
      error = err.message;
      success = false;
    }

    const responseTime = Date.now() - startTime;

    // Log the postback attempt
    const log = await prisma.postbackLog.create({
      data: {
        postbackId,
        event,
        url: postback.url,
        method: postback.method,
        payload: data,
        response,
        statusCode,
        success,
        error,
        triggeredAt: new Date(),
        responseTime
      }
    }) as PostbackLog;

    // Update postback statistics
    await prisma.postback.update({
      where: { id: postbackId },
      data: {
        lastTriggered: new Date(),
        successCount: success ? { increment: 1 } : undefined,
        failureCount: success ? undefined : { increment: 1 },
        status: success ? 'ACTIVE' : 'ERROR'
      }
    });

    return log;
  }

  private static getDynamicValue(param: string, data: any): string | null {
    const mappings: Record<string, string> = {
      'click_id': data.clickId || '',
      'affiliate_id': data.affiliateId || '',
      'offer_id': data.offerId || '',
      'conversion_id': data.conversionId || '',
      'order_id': data.orderId || '',
      'customer_id': data.customerId || '',
      'amount': data.amount?.toString() || '',
      'currency': data.currency || '',
      'timestamp': new Date().toISOString(),
      'ip_address': data.ipAddress || '',
      'user_agent': data.userAgent || '',
      'country': data.country || '',
      'device': data.device || '',
      'browser': data.browser || '',
      'os': data.os || ''
    };

    return mappings[param] || null;
  }

  private static getCustomValue(param: string, data: any): string | null {
    // Custom parameter logic
    try {
      const value = eval(`data.${param}`);
      return value ? value.toString() : null;
    } catch {
      return null;
    }
  }

  static async getLogs(postbackId: string, page: number = 1, limit: number = 50): Promise<PostbackLog[]> {
    const skip = (page - 1) * limit;
    return await prisma.postbackLog.findMany({
      where: { postbackId },
      skip,
      take: limit,
      orderBy: { triggeredAt: 'desc' }
    }) as PostbackLog[];
  }

  static async testPostback(postbackId: string, testData: any): Promise<PostbackLog> {
    return await this.triggerPostback(postbackId, 'test', testData);
  }
}


