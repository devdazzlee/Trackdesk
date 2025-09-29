import { Request, Response } from 'express';
import { AlertsModel } from '../models/Alerts';

export class AlertsController {
  // CRUD Operations
  static async createAlert(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const alertData = req.body;
      
      const alert = await AlertsModel.create({
        accountId,
        ...alertData
      });
      
      res.status(201).json({
        success: true,
        data: alert,
        message: 'Alert created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getAlert(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const alert = await AlertsModel.findById(id);
      if (!alert) {
        return res.status(404).json({
          success: false,
          error: 'Alert not found'
        });
      }
      
      res.json({
        success: true,
        data: alert
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateAlert(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const alert = await AlertsModel.update(id, updateData);
      
      res.json({
        success: true,
        data: alert,
        message: 'Alert updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async deleteAlert(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await AlertsModel.delete(id);
      
      res.json({
        success: true,
        message: 'Alert deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async listAlerts(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const filters = req.query;
      
      const alerts = await AlertsModel.list(accountId, filters);
      
      res.json({
        success: true,
        data: alerts,
        count: alerts.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Alert Rules Management
  static async addRule(req: Request, res: Response) {
    try {
      const { alertId } = req.params;
      const ruleData = req.body;
      
      const alert = await AlertsModel.addRule(alertId, ruleData);
      
      res.json({
        success: true,
        data: alert,
        message: 'Rule added successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateRule(req: Request, res: Response) {
    try {
      const { alertId, ruleId } = req.params;
      const updateData = req.body;
      
      const alert = await AlertsModel.updateRule(alertId, ruleId, updateData);
      
      res.json({
        success: true,
        data: alert,
        message: 'Rule updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async removeRule(req: Request, res: Response) {
    try {
      const { alertId, ruleId } = req.params;
      
      const alert = await AlertsModel.removeRule(alertId, ruleId);
      
      res.json({
        success: true,
        data: alert,
        message: 'Rule removed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Alert Actions Management
  static async addAction(req: Request, res: Response) {
    try {
      const { alertId } = req.params;
      const actionData = req.body;
      
      const alert = await AlertsModel.addAction(alertId, actionData);
      
      res.json({
        success: true,
        data: alert,
        message: 'Action added successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateAction(req: Request, res: Response) {
    try {
      const { alertId, actionId } = req.params;
      const updateData = req.body;
      
      const alert = await AlertsModel.updateAction(alertId, actionId, updateData);
      
      res.json({
        success: true,
        data: alert,
        message: 'Action updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async removeAction(req: Request, res: Response) {
    try {
      const { alertId, actionId } = req.params;
      
      const alert = await AlertsModel.removeAction(alertId, actionId);
      
      res.json({
        success: true,
        data: alert,
        message: 'Action removed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Alert Triggers
  static async triggerAlert(req: Request, res: Response) {
    try {
      const { alertId } = req.params;
      const triggerData = req.body;
      
      const result = await AlertsModel.triggerAlert(alertId, triggerData);
      
      res.json({
        success: true,
        data: result,
        message: 'Alert triggered successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async testAlert(req: Request, res: Response) {
    try {
      const { alertId } = req.params;
      const testData = req.body;
      
      const result = await AlertsModel.testAlert(alertId, testData);
      
      res.json({
        success: true,
        data: result,
        message: 'Alert test completed'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Alert History
  static async getAlertHistory(req: Request, res: Response) {
    try {
      const { alertId } = req.params;
      const filters = req.query;
      
      const history = await AlertsModel.getAlertHistory(alertId, filters);
      
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

  // Statistics
  static async getAlertStats(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      const { startDate, endDate } = req.query;
      
      const stats = await AlertsModel.getAlertStats(accountId, startDate ? new Date(startDate as string) : undefined, endDate ? new Date(endDate as string) : undefined);
      
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

  // Dashboard
  static async getAlertsDashboard(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      
      const dashboard = await AlertsModel.getAlertsDashboard(accountId);
      
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

  // Default Alerts
  static async createDefaultAlerts(req: Request, res: Response) {
    try {
      const { accountId } = req.user!;
      
      const alerts = await AlertsModel.createDefaultAlerts(accountId);
      
      res.status(201).json({
        success: true,
        data: alerts,
        message: 'Default alerts created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}


