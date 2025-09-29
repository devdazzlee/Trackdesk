import { Request, Response } from 'express';
import { WebhookModel } from '../models/Webhooks';

export class WebhooksController {
  // CRUD Operations
  static async createWebhook(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const webhookData = req.body;
      
      const webhook = await WebhookModel.create({
        accountId,
        ...webhookData
      });
      
      res.status(201).json({
        success: true,
        data: webhook,
        message: 'Webhook created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getWebhook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const webhook = await WebhookModel.findById(id);
      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }
      
      res.json({
        success: true,
        data: webhook
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateWebhook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const webhook = await WebhookModel.update(id, updateData);
      
      res.json({
        success: true,
        data: webhook,
        message: 'Webhook updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async deleteWebhook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await WebhookModel.delete(id);
      
      res.json({
        success: true,
        message: 'Webhook deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async listWebhooks(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const filters = req.query;
      
      const webhooks = await WebhookModel.list(accountId, filters);
      
      res.json({
        success: true,
        data: webhooks,
        count: webhooks.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Events Management
  static async addEvent(req: Request, res: Response) {
    try {
      const { webhookId } = req.params;
      const eventData = req.body;
      
      const webhook = await WebhookModel.addEvent(webhookId, eventData);
      
      res.json({
        success: true,
        data: webhook,
        message: 'Event added successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const { webhookId, eventId } = req.params;
      const updateData = req.body;
      
      const webhook = await WebhookModel.updateEvent(webhookId, eventId, updateData);
      
      res.json({
        success: true,
        data: webhook,
        message: 'Event updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async removeEvent(req: Request, res: Response) {
    try {
      const { webhookId, eventId } = req.params;
      
      const webhook = await WebhookModel.removeEvent(webhookId, eventId);
      
      res.json({
        success: true,
        data: webhook,
        message: 'Event removed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Testing
  static async testWebhook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const testData = req.body;
      
      const result = await WebhookModel.testWebhook(id, testData);
      
      res.json({
        success: true,
        data: result,
        message: 'Webhook test completed'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async triggerWebhook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      
      const result = await WebhookModel.triggerWebhook(id, eventData);
      
      res.json({
        success: true,
        data: result,
        message: 'Webhook triggered successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook History
  static async getWebhookHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const filters = req.query;
      
      const history = await WebhookModel.getWebhookHistory(id, filters);
      
      res.json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Logs
  static async getWebhookLogs(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;
      
      const logs = await WebhookModel.getWebhookLogs(id, Number(page), Number(limit));
      
      res.json({
        success: true,
        data: logs,
        count: logs.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Statistics
  static async getWebhookStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      const stats = await WebhookModel.getWebhookStats(
        id,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Templates
  static async getWebhookTemplates(req: Request, res: Response) {
    try {
      const templates = await WebhookModel.getWebhookTemplates();
      
      res.json({
        success: true,
        data: templates,
        count: templates.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async createWebhookFromTemplate(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const { templateId, customizations } = req.body;
      
      const webhook = await WebhookModel.createFromTemplate(accountId, templateId, customizations);
      
      res.status(201).json({
        success: true,
        data: webhook,
        message: 'Webhook created from template successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Security
  static async generateSecret(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const secret = await WebhookModel.generateSecret(id);
      
      res.json({
        success: true,
        data: { secret },
        message: 'Webhook secret generated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async validateSignature(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { signature, payload } = req.body;
      
      const isValid = await WebhookModel.validateSignature(id, signature, payload);
      
      res.json({
        success: true,
        data: { isValid },
        message: 'Signature validation completed'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Retry
  static async retryWebhook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { logId } = req.body;
      
      const result = await WebhookModel.retryWebhook(id, logId);
      
      res.json({
        success: true,
        data: result,
        message: 'Webhook retry initiated'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Dashboard
  static async getWebhooksDashboard(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      
      const dashboard = await WebhookModel.getWebhooksDashboard(accountId);
      
      res.json({
        success: true,
        data: dashboard
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Default Webhooks
  static async createDefaultWebhooks(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      
      const webhooks = await WebhookModel.createDefaultWebhooks(accountId);
      
      res.status(201).json({
        success: true,
        data: webhooks,
        message: 'Default webhooks created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook Endpoint (for receiving webhooks)
  static async receiveWebhook(req: Request, res: Response) {
    try {
      const { webhookId } = req.params;
      const payload = req.body;
      const headers = req.headers;
      
      const result = await WebhookModel.receiveWebhook(webhookId, payload, headers);
      
      res.json({
        success: true,
        data: result,
        message: 'Webhook received successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Export/Import
  static async exportWebhooks(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const { format = 'json' } = req.query;
      
      const exportData = await WebhookModel.exportWebhooks(accountId, format as string);
      
      res.json({
        success: true,
        data: exportData,
        message: 'Webhooks exported successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async importWebhooks(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const { webhooks, overwrite = false } = req.body;
      
      const result = await WebhookModel.importWebhooks(accountId, webhooks, overwrite);
      
      res.json({
        success: true,
        data: result,
        message: 'Webhooks imported successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}


