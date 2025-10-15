"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Get notifications for a user (admin or affiliate)
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, type, _b, status_1, _c, page, _d, limit, userRole, filters, notifications, total, unreadCount, error_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                _a = req.query, userId = _a.userId, type = _a.type, _b = _a.status, status_1 = _b === void 0 ? 'all' : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.limit, limit = _d === void 0 ? 20 : _d, userRole = _a.userRole;
                filters = {};
                if (userId) {
                    filters.userId = userId;
                }
                if (userRole) {
                    filters.userRole = userRole;
                }
                if (type && type !== 'all') {
                    filters.type = type;
                }
                if (status_1 && status_1 !== 'all') {
                    filters.read = status_1 === 'read';
                }
                return [4 /*yield*/, prisma.notification.findMany({
                        where: filters,
                        orderBy: {
                            createdAt: 'desc'
                        },
                        skip: (Number(page) - 1) * Number(limit),
                        take: Number(limit),
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true
                                }
                            }
                        }
                    })];
            case 1:
                notifications = _e.sent();
                return [4 /*yield*/, prisma.notification.count({ where: filters })];
            case 2:
                total = _e.sent();
                return [4 /*yield*/, prisma.notification.count({
                        where: __assign(__assign({}, filters), { read: false })
                    })];
            case 3:
                unreadCount = _e.sent();
                res.json({
                    notifications: notifications,
                    pagination: {
                        total: total,
                        page: Number(page),
                        limit: Number(limit),
                        pages: Math.ceil(total / Number(limit))
                    },
                    unreadCount: unreadCount
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _e.sent();
                console.error('Error fetching notifications:', error_1);
                res.status(500).json({ error: 'Failed to fetch notifications' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Get notification counts by type
router.get('/counts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, userRole, filters, _b, totalCount, unreadCount, systemCount, paymentCount, affiliateCount, conversionCount, alertCount, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, userId = _a.userId, userRole = _a.userRole;
                filters = {};
                if (userId)
                    filters.userId = userId;
                if (userRole)
                    filters.userRole = userRole;
                return [4 /*yield*/, Promise.all([
                        prisma.notification.count({ where: filters }),
                        prisma.notification.count({ where: __assign(__assign({}, filters), { isRead: false }) }),
                        prisma.notification.count({ where: __assign(__assign({}, filters), { type: 'system' }) }),
                        prisma.notification.count({ where: __assign(__assign({}, filters), { type: 'payment' }) }),
                        prisma.notification.count({ where: __assign(__assign({}, filters), { type: 'affiliate' }) }),
                        prisma.notification.count({ where: __assign(__assign({}, filters), { type: 'conversion' }) }),
                        prisma.notification.count({ where: __assign(__assign({}, filters), { type: 'alert' }) })
                    ])];
            case 1:
                _b = _c.sent(), totalCount = _b[0], unreadCount = _b[1], systemCount = _b[2], paymentCount = _b[3], affiliateCount = _b[4], conversionCount = _b[5], alertCount = _b[6];
                res.json({
                    total: totalCount,
                    unread: unreadCount,
                    byType: {
                        system: systemCount,
                        payment: paymentCount,
                        affiliate: affiliateCount,
                        conversion: conversionCount,
                        alert: alertCount
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                console.error('Error fetching notification counts:', error_2);
                res.status(500).json({ error: 'Failed to fetch notification counts' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create a new notification
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notificationSchema, data_1, users, notifications, notification, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                notificationSchema = zod_1.z.object({
                    userId: zod_1.z.string().optional(),
                    userRole: zod_1.z.enum(['ADMIN', 'AFFILIATE']).optional(),
                    type: zod_1.z.enum(['SYSTEM', 'SUCCESS', 'WARNING', 'ERROR', 'INFO']),
                    title: zod_1.z.string(),
                    message: zod_1.z.string(),
                    priority: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
                    data: zod_1.z.any().optional(),
                    actionUrl: zod_1.z.string().optional(),
                    expiresAt: zod_1.z.string().optional()
                });
                data_1 = notificationSchema.parse(req.body);
                if (!(!data_1.userId && data_1.userRole)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.user.findMany({
                        where: { role: data_1.userRole },
                        select: { id: true }
                    })];
            case 1:
                users = _a.sent();
                return [4 /*yield*/, Promise.all(users.map(function (user) {
                        return prisma.notification.create({
                            data: {
                                userId: user.id,
                                title: data_1.title,
                                message: data_1.message,
                                type: data_1.type,
                                data: data_1.data
                            }
                        });
                    }))];
            case 2:
                notifications = _a.sent();
                res.status(201).json({
                    message: "Created ".concat(notifications.length, " notifications"),
                    notifications: notifications.slice(0, 5) // Return first 5 for reference
                });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.notification.create({
                    data: {
                        userId: data_1.userId,
                        title: data_1.title,
                        message: data_1.message,
                        type: data_1.type,
                        data: data_1.data
                    },
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                })];
            case 4:
                notification = _a.sent();
                res.status(201).json(notification);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                console.error('Error creating notification:', error_3);
                res.status(400).json({ error: 'Failed to create notification' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Mark notification as read
router.put('/:id/read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, notification, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.notification.update({
                        where: { id: id },
                        data: {
                            read: true
                        }
                    })];
            case 1:
                notification = _a.sent();
                res.json(notification);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error marking notification as read:', error_4);
                res.status(500).json({ error: 'Failed to mark notification as read' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Mark all notifications as read for a user
router.put('/mark-all-read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, userRole, filters, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, userRole = _a.userRole;
                filters = { isRead: false };
                if (userId)
                    filters.userId = userId;
                if (userRole)
                    filters.userRole = userRole;
                return [4 /*yield*/, prisma.notification.updateMany({
                        where: filters,
                        data: {
                            read: true
                        }
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    message: "Marked ".concat(result.count, " notifications as read"),
                    updatedCount: result.count
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error('Error marking all notifications as read:', error_5);
                res.status(500).json({ error: 'Failed to mark all notifications as read' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete notification
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.notification.delete({
                        where: { id: id }
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'Notification deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error deleting notification:', error_6);
                res.status(500).json({ error: 'Failed to delete notification' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete all notifications for a user
router.delete('/clear-all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, userRole, olderThan, filters, cutoffDate, result, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, userId = _a.userId, userRole = _a.userRole, olderThan = _a.olderThan;
                filters = {};
                if (userId)
                    filters.userId = userId;
                if (userRole)
                    filters.userRole = userRole;
                if (olderThan) {
                    cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - Number(olderThan));
                    filters.createdAt = { lt: cutoffDate };
                }
                return [4 /*yield*/, prisma.notification.deleteMany({
                        where: filters
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    message: "Deleted ".concat(result.count, " notifications"),
                    deletedCount: result.count
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                console.error('Error clearing notifications:', error_7);
                res.status(500).json({ error: 'Failed to clear notifications' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get notification preferences for a user
router.get('/preferences/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, preferences;
    return __generator(this, function (_a) {
        try {
            userId = req.params.userId;
            preferences = {
                userId: userId,
                email: {
                    system: true,
                    payment: true,
                    affiliate: true,
                    conversion: true,
                    alert: true,
                    announcement: true
                },
                push: {
                    system: false,
                    payment: true,
                    affiliate: false,
                    conversion: true,
                    alert: true,
                    announcement: false
                },
                frequency: 'immediate' // immediate, daily, weekly
            };
            res.json(preferences);
        }
        catch (error) {
            console.error('Error fetching notification preferences:', error);
            res.status(500).json({ error: 'Failed to fetch notification preferences' });
        }
        return [2 /*return*/];
    });
}); });
// Update notification preferences
router.put('/preferences/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, preferencesSchema, preferences;
    return __generator(this, function (_a) {
        try {
            userId = req.params.userId;
            preferencesSchema = zod_1.z.object({
                email: zod_1.z.object({
                    system: zod_1.z.boolean(),
                    payment: zod_1.z.boolean(),
                    affiliate: zod_1.z.boolean(),
                    conversion: zod_1.z.boolean(),
                    alert: zod_1.z.boolean(),
                    announcement: zod_1.z.boolean()
                }),
                push: zod_1.z.object({
                    system: zod_1.z.boolean(),
                    payment: zod_1.z.boolean(),
                    affiliate: zod_1.z.boolean(),
                    conversion: zod_1.z.boolean(),
                    alert: zod_1.z.boolean(),
                    announcement: zod_1.z.boolean()
                }),
                frequency: zod_1.z.enum(['immediate', 'daily', 'weekly'])
            });
            preferences = preferencesSchema.parse(req.body);
            // In a real implementation, you would save these to the database
            res.json(__assign(__assign({ userId: userId }, preferences), { updatedAt: new Date() }));
        }
        catch (error) {
            console.error('Error updating notification preferences:', error);
            res.status(400).json({ error: 'Failed to update notification preferences' });
        }
        return [2 /*return*/];
    });
}); });
// Send bulk notifications
router.post('/bulk', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bulkSchema, data_2, targetUsers, users, notifications, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                bulkSchema = zod_1.z.object({
                    userIds: zod_1.z.array(zod_1.z.string()).optional(),
                    userRole: zod_1.z.enum(['ADMIN', 'AFFILIATE']).optional(),
                    type: zod_1.z.enum(['SYSTEM', 'SUCCESS', 'WARNING', 'ERROR', 'INFO']),
                    title: zod_1.z.string(),
                    message: zod_1.z.string(),
                    priority: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
                    data: zod_1.z.any().optional(),
                    actionUrl: zod_1.z.string().optional(),
                    expiresAt: zod_1.z.string().optional()
                });
                data_2 = bulkSchema.parse(req.body);
                targetUsers = [];
                if (!data_2.userIds) return [3 /*break*/, 1];
                targetUsers = data_2.userIds;
                return [3 /*break*/, 3];
            case 1:
                if (!data_2.userRole) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.user.findMany({
                        where: { role: data_2.userRole },
                        select: { id: true }
                    })];
            case 2:
                users = _a.sent();
                targetUsers = users.map(function (user) { return user.id; });
                _a.label = 3;
            case 3:
                if (targetUsers.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'No target users specified' })];
                }
                return [4 /*yield*/, Promise.all(targetUsers.map(function (userId) {
                        return prisma.notification.create({
                            data: {
                                userId: userId,
                                type: data_2.type,
                                title: data_2.title,
                                message: data_2.message,
                                // priority field not in schema
                                data: data_2.data,
                                // actionUrl and expiresAt not in schema
                            }
                        });
                    }))];
            case 4:
                notifications = _a.sent();
                res.status(201).json({
                    message: "Created ".concat(notifications.length, " bulk notifications"),
                    count: notifications.length,
                    notifications: notifications.slice(0, 5) // Return first 5 for reference
                });
                return [3 /*break*/, 6];
            case 5:
                error_8 = _a.sent();
                console.error('Error sending bulk notifications:', error_8);
                res.status(400).json({ error: 'Failed to send bulk notifications' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get notification templates
router.get('/templates', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var templates;
    return __generator(this, function (_a) {
        try {
            templates = [
                {
                    id: 'welcome_affiliate',
                    name: 'Welcome New Affiliate',
                    type: 'affiliate',
                    title: 'Welcome to {{programName}}!',
                    message: 'Welcome {{affiliateName}}! Your affiliate account has been approved. You can now start promoting our offers and earning commissions.',
                    variables: ['programName', 'affiliateName']
                },
                {
                    id: 'conversion_approved',
                    name: 'Conversion Approved',
                    type: 'conversion',
                    title: 'Conversion Approved - ${{amount}}',
                    message: 'Great news! Your conversion for ${{amount}} has been approved. Commission: ${{commission}}',
                    variables: ['amount', 'commission']
                },
                {
                    id: 'payout_processed',
                    name: 'Payout Processed',
                    type: 'payment',
                    title: 'Payout Processed - ${{amount}}',
                    message: 'Your payout of ${{amount}} has been processed and will arrive in {{timeframe}}.',
                    variables: ['amount', 'timeframe']
                },
                {
                    id: 'system_maintenance',
                    name: 'System Maintenance',
                    type: 'system',
                    title: 'Scheduled Maintenance',
                    message: 'System maintenance is scheduled for {{date}} at {{time}}. Expected downtime: {{duration}}',
                    variables: ['date', 'time', 'duration']
                },
                {
                    id: 'performance_alert',
                    name: 'Performance Alert',
                    type: 'alert',
                    title: 'Performance Alert: {{metric}}',
                    message: 'Your {{metric}} has {{change}} by {{percentage}}% in the last {{period}}.',
                    variables: ['metric', 'change', 'percentage', 'period']
                }
            ];
            res.json({ templates: templates });
        }
        catch (error) {
            console.error('Error fetching notification templates:', error);
            res.status(500).json({ error: 'Failed to fetch notification templates' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
