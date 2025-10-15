"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
var prisma = new client_1.PrismaClient();
// Get system logs with filtering and pagination
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, level, source, search, startDate, endDate, filters, logs, total, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 50 : _c, level = _a.level, source = _a.source, search = _a.search, startDate = _a.startDate, endDate = _a.endDate;
                filters = {};
                if (level && level !== 'all') {
                    filters.level = level;
                }
                if (source && source !== 'all') {
                    filters.source = source;
                }
                if (search) {
                    filters.OR = [
                        { message: { contains: search, mode: 'insensitive' } },
                        { userId: { contains: search, mode: 'insensitive' } },
                        { source: { contains: search, mode: 'insensitive' } }
                    ];
                }
                if (startDate || endDate) {
                    filters.timestamp = {};
                    if (startDate)
                        filters.timestamp.gte = new Date(startDate);
                    if (endDate)
                        filters.timestamp.lte = new Date(endDate);
                }
                return [4 /*yield*/, prisma.activity.findMany({
                        where: filters,
                        orderBy: { createdAt: 'desc' },
                        skip: (Number(page) - 1) * Number(limit),
                        take: Number(limit),
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    })];
            case 1:
                logs = _d.sent();
                return [4 /*yield*/, prisma.activity.count({ where: filters })];
            case 2:
                total = _d.sent();
                res.json({
                    logs: logs,
                    pagination: {
                        total: total,
                        page: Number(page),
                        limit: Number(limit),
                        pages: Math.ceil(total / Number(limit))
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                console.error('Error fetching logs:', error_1);
                res.status(500).json({ error: 'Failed to fetch logs' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get log statistics
router.get('/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var today, _a, totalLogs, errorCount, warningCount, infoCount, successCount, todayLogs, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                today = new Date();
                today.setHours(0, 0, 0, 0);
                return [4 /*yield*/, Promise.all([
                        prisma.activity.count(),
                        prisma.activity.count({ where: { action: { contains: 'error' } } }),
                        prisma.activity.count({ where: { action: { contains: 'warning' } } }),
                        prisma.activity.count({ where: { action: { contains: 'info' } } }),
                        prisma.activity.count({ where: { action: { contains: 'success' } } }),
                        prisma.activity.count({ where: { createdAt: { gte: today } } })
                    ])];
            case 1:
                _a = _b.sent(), totalLogs = _a[0], errorCount = _a[1], warningCount = _a[2], infoCount = _a[3], successCount = _a[4], todayLogs = _a[5];
                res.json({
                    totalLogs: totalLogs,
                    errorCount: errorCount,
                    warningCount: warningCount,
                    infoCount: infoCount,
                    successCount: successCount,
                    todayLogs: todayLogs
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error fetching log stats:', error_2);
                res.status(500).json({ error: 'Failed to fetch log statistics' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create a new log entry
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var logSchema, data, activity, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                logSchema = zod_1.z.object({
                    level: zod_1.z.enum(['error', 'warning', 'info', 'success']),
                    message: zod_1.z.string(),
                    source: zod_1.z.string(),
                    userId: zod_1.z.string().optional(),
                    ipAddress: zod_1.z.string().optional(),
                    userAgent: zod_1.z.string().optional(),
                    details: zod_1.z.any().optional()
                });
                data = logSchema.parse(req.body);
                return [4 /*yield*/, prisma.activity.create({
                        data: {
                            userId: data.userId || 'system',
                            action: data.level || 'info',
                            resource: data.source || 'system',
                            details: data.details,
                            ipAddress: data.ipAddress,
                            userAgent: data.userAgent
                        }
                    })];
            case 1:
                activity = _a.sent();
                res.status(201).json(activity);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error creating log:', error_3);
                res.status(400).json({ error: 'Failed to create log entry' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Export logs
router.get('/export', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, format, level, source, startDate, endDate, filters, logs, csv, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.format, format = _b === void 0 ? 'csv' : _b, level = _a.level, source = _a.source, startDate = _a.startDate, endDate = _a.endDate;
                filters = {};
                if (level && level !== 'all') {
                    filters.level = level;
                }
                if (source && source !== 'all') {
                    filters.source = source;
                }
                if (startDate || endDate) {
                    filters.timestamp = {};
                    if (startDate)
                        filters.timestamp.gte = new Date(startDate);
                    if (endDate)
                        filters.timestamp.lte = new Date(endDate);
                }
                return [4 /*yield*/, prisma.activity.findMany({
                        where: filters,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            user: {
                                select: {
                                    email: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    })];
            case 1:
                logs = _c.sent();
                if (format === 'csv') {
                    csv = __spreadArray([
                        'Timestamp,Level,Message,Source,User,IP Address,User Agent'
                    ], logs.map(function (log) { return [
                        log.createdAt.toISOString(),
                        log.action,
                        "\"".concat(log.resource.replace(/"/g, '""'), "\""),
                        log.resource,
                        log.user ? "".concat(log.user.firstName, " ").concat(log.user.lastName, " (").concat(log.user.email, ")") : '',
                        log.ipAddress || '',
                        "\"".concat((log.userAgent || '').replace(/"/g, '""'), "\"")
                    ].join(','); }), true).join('\n');
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename="system-logs.csv"');
                    res.send(csv);
                }
                else {
                    res.json(logs);
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                console.error('Error exporting logs:', error_4);
                res.status(500).json({ error: 'Failed to export logs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete old logs
router.delete('/cleanup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, olderThan, cutoffDate, deletedCount, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query.olderThan, olderThan = _a === void 0 ? 90 : _a;
                cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - Number(olderThan));
                return [4 /*yield*/, prisma.activity.deleteMany({
                        where: {
                            createdAt: {
                                lt: cutoffDate
                            }
                        }
                    })];
            case 1:
                deletedCount = _b.sent();
                res.json({
                    message: "Deleted ".concat(deletedCount.count, " log entries older than ").concat(olderThan, " days"),
                    deletedCount: deletedCount.count
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error('Error cleaning up logs:', error_5);
                res.status(500).json({ error: 'Failed to cleanup logs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
