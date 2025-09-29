"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsController = void 0;
const Alerts_1 = require("../models/Alerts");
class AlertsController {
    static async createAlert(req, res) {
        try {
            const { accountId } = req.user;
            const alertData = req.body;
            const alert = await Alerts_1.AlertsModel.create({
                accountId,
                ...alertData
            });
            res.status(201).json({
                success: true,
                data: alert,
                message: 'Alert created successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async getAlert(req, res) {
        try {
            const { id } = req.params;
            const alert = await Alerts_1.AlertsModel.findById(id);
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async updateAlert(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const alert = await Alerts_1.AlertsModel.update(id, updateData);
            res.json({
                success: true,
                data: alert,
                message: 'Alert updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async deleteAlert(req, res) {
        try {
            const { id } = req.params;
            await Alerts_1.AlertsModel.delete(id);
            res.json({
                success: true,
                message: 'Alert deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async listAlerts(req, res) {
        try {
            const { accountId } = req.user;
            const filters = req.query;
            const alerts = await Alerts_1.AlertsModel.list(accountId, filters);
            res.json({
                success: true,
                data: alerts,
                count: alerts.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async addRule(req, res) {
        try {
            const { alertId } = req.params;
            const ruleData = req.body;
            const alert = await Alerts_1.AlertsModel.addRule(alertId, ruleData);
            res.json({
                success: true,
                data: alert,
                message: 'Rule added successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async updateRule(req, res) {
        try {
            const { alertId, ruleId } = req.params;
            const updateData = req.body;
            const alert = await Alerts_1.AlertsModel.updateRule(alertId, ruleId, updateData);
            res.json({
                success: true,
                data: alert,
                message: 'Rule updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async removeRule(req, res) {
        try {
            const { alertId, ruleId } = req.params;
            const alert = await Alerts_1.AlertsModel.removeRule(alertId, ruleId);
            res.json({
                success: true,
                data: alert,
                message: 'Rule removed successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async addAction(req, res) {
        try {
            const { alertId } = req.params;
            const actionData = req.body;
            const alert = await Alerts_1.AlertsModel.addAction(alertId, actionData);
            res.json({
                success: true,
                data: alert,
                message: 'Action added successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async updateAction(req, res) {
        try {
            const { alertId, actionId } = req.params;
            const updateData = req.body;
            const alert = await Alerts_1.AlertsModel.updateAction(alertId, actionId, updateData);
            res.json({
                success: true,
                data: alert,
                message: 'Action updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async removeAction(req, res) {
        try {
            const { alertId, actionId } = req.params;
            const alert = await Alerts_1.AlertsModel.removeAction(alertId, actionId);
            res.json({
                success: true,
                data: alert,
                message: 'Action removed successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async triggerAlert(req, res) {
        try {
            const { alertId } = req.params;
            const triggerData = req.body;
            const result = await Alerts_1.AlertsModel.triggerAlert(alertId, triggerData);
            res.json({
                success: true,
                data: result,
                message: 'Alert triggered successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async testAlert(req, res) {
        try {
            const { alertId } = req.params;
            const testData = req.body;
            const result = await Alerts_1.AlertsModel.testAlert(alertId, testData);
            res.json({
                success: true,
                data: result,
                message: 'Alert test completed'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async getAlertHistory(req, res) {
        try {
            const { alertId } = req.params;
            const filters = req.query;
            const history = await Alerts_1.AlertsModel.getAlertHistory(alertId, filters);
            res.json({
                success: true,
                data: history,
                count: history.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async getAlertStats(req, res) {
        try {
            const { accountId } = req.user;
            const { startDate, endDate } = req.query;
            const stats = await Alerts_1.AlertsModel.getAlertStats(accountId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async getAlertsDashboard(req, res) {
        try {
            const { accountId } = req.user;
            const dashboard = await Alerts_1.AlertsModel.getAlertsDashboard(accountId);
            res.json({
                success: true,
                data: dashboard
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async createDefaultAlerts(req, res) {
        try {
            const { accountId } = req.user;
            const alerts = await Alerts_1.AlertsModel.createDefaultAlerts(accountId);
            res.status(201).json({
                success: true,
                data: alerts,
                message: 'Default alerts created successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.AlertsController = AlertsController;
//# sourceMappingURL=AlertsController.js.map