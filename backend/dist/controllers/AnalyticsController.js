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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
var AnalyticsService_1 = require("../services/AnalyticsService");
var zod_1 = require("zod");
var analyticsService = new AnalyticsService_1.AnalyticsService();
var getRealTimeAnalyticsSchema = zod_1.z.object({
    timeRange: zod_1.z.enum(['1h', '24h', '7d']).optional()
});
var getFunnelAnalysisSchema = zod_1.z.object({
    offerId: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional()
});
var getCohortAnalysisSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime()
});
var getPerformanceAnalyticsSchema = zod_1.z.object({
    timeRange: zod_1.z.enum(['7d', '30d', '90d', '1y']).optional(),
    metric: zod_1.z.enum(['clicks', 'conversions', 'revenue', 'commission']).optional(),
    groupBy: zod_1.z.enum(['day', 'week', 'month']).optional()
});
var getGeographicAnalyticsSchema = zod_1.z.object({
    timeRange: zod_1.z.enum(['7d', '30d', '90d', '1y']).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional()
});
var getDeviceAnalyticsSchema = zod_1.z.object({
    timeRange: zod_1.z.enum(['7d', '30d', '90d', '1y']).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional()
});
var createCustomReportSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    metrics: zod_1.z.array(zod_1.z.string()),
    filters: zod_1.z.record(zod_1.z.any()),
    schedule: zod_1.z.string().optional()
});
var updateCustomReportSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    metrics: zod_1.z.array(zod_1.z.string()).optional(),
    filters: zod_1.z.record(zod_1.z.any()).optional(),
    schedule: zod_1.z.string().optional()
});
var AnalyticsController = /** @class */ (function () {
    function AnalyticsController() {
    }
    AnalyticsController.prototype.getRealTimeAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, analytics, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = getRealTimeAnalyticsSchema.parse(req.query);
                        return [4 /*yield*/, analyticsService.getRealTimeAnalytics(params)];
                    case 1:
                        analytics = _a.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid query parameters', details: error_1.errors })];
                        }
                        res.status(500).json({ error: error_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getRealTimeActivity = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, limit, activity, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query.limit, limit = _a === void 0 ? 20 : _a;
                        return [4 /*yield*/, analyticsService.getRealTimeActivity(parseInt(limit))];
                    case 1:
                        activity = _b.sent();
                        res.json(activity);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        res.status(500).json({ error: error_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getRealTimeMetrics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var metrics, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, analyticsService.getRealTimeMetrics()];
                    case 1:
                        metrics = _a.sent();
                        res.json(metrics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({ error: error_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getFunnelAnalysis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, analysis, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = getFunnelAnalysisSchema.parse(req.query);
                        return [4 /*yield*/, analyticsService.getFunnelAnalysis(params)];
                    case 1:
                        analysis = _a.sent();
                        res.json(analysis);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid query parameters', details: error_4.errors })];
                        }
                        res.status(500).json({ error: error_4.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getCohortAnalysis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, analysis, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = getCohortAnalysisSchema.parse(req.query);
                        return [4 /*yield*/, analyticsService.getCohortAnalysis(params)];
                    case 1:
                        analysis = _a.sent();
                        res.json(analysis);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid query parameters', details: error_5.errors })];
                        }
                        res.status(500).json({ error: error_5.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getAttributionData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var conversionId, data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        conversionId = req.params.conversionId;
                        return [4 /*yield*/, analyticsService.getAttributionData(conversionId)];
                    case 1:
                        data = _a.sent();
                        res.json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(500).json({ error: error_6.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getAttributionModels = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var models, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, analyticsService.getAttributionModels()];
                    case 1:
                        models = _a.sent();
                        res.json(models);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(500).json({ error: error_7.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getPerformanceAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, analytics, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = getPerformanceAnalyticsSchema.parse(req.query);
                        return [4 /*yield*/, analyticsService.getPerformanceAnalytics(params)];
                    case 1:
                        analytics = _a.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        if (error_8.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid query parameters', details: error_8.errors })];
                        }
                        res.status(500).json({ error: error_8.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getPerformanceTrends = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, timeRange, _c, metric, trends, error_9;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, _c = _a.metric, metric = _c === void 0 ? 'clicks' : _c;
                        return [4 /*yield*/, analyticsService.getPerformanceTrends(timeRange, metric)];
                    case 1:
                        trends = _d.sent();
                        res.json(trends);
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _d.sent();
                        res.status(500).json({ error: error_9.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getPerformanceComparison = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, period1, period2, _b, metric, comparison, error_10;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, period1 = _a.period1, period2 = _a.period2, _b = _a.metric, metric = _b === void 0 ? 'clicks' : _b;
                        return [4 /*yield*/, analyticsService.getPerformanceComparison(period1, period2, metric)];
                    case 1:
                        comparison = _c.sent();
                        res.json(comparison);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _c.sent();
                        res.status(500).json({ error: error_10.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getGeographicAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, analytics, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = getGeographicAnalyticsSchema.parse(req.query);
                        return [4 /*yield*/, analyticsService.getGeographicAnalytics(params)];
                    case 1:
                        analytics = _a.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        if (error_11.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid query parameters', details: error_11.errors })];
                        }
                        res.status(500).json({ error: error_11.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getCountryAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, timeRange, _c, limit, analytics, error_12;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                        return [4 /*yield*/, analyticsService.getCountryAnalytics(timeRange, parseInt(limit))];
                    case 1:
                        analytics = _d.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _d.sent();
                        res.status(500).json({ error: error_12.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getCityAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, timeRange, _c, limit, analytics, error_13;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                        return [4 /*yield*/, analyticsService.getCityAnalytics(timeRange, parseInt(limit))];
                    case 1:
                        analytics = _d.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _d.sent();
                        res.status(500).json({ error: error_13.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getDeviceAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, analytics, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = getDeviceAnalyticsSchema.parse(req.query);
                        return [4 /*yield*/, analyticsService.getDeviceAnalytics(params)];
                    case 1:
                        analytics = _a.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        if (error_14.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid query parameters', details: error_14.errors })];
                        }
                        res.status(500).json({ error: error_14.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getDeviceTypeAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, timeRange, analytics, error_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query.timeRange, timeRange = _a === void 0 ? '30d' : _a;
                        return [4 /*yield*/, analyticsService.getDeviceTypeAnalytics(timeRange)];
                    case 1:
                        analytics = _b.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _b.sent();
                        res.status(500).json({ error: error_15.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getBrowserAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, timeRange, _c, limit, analytics, error_16;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.timeRange, timeRange = _b === void 0 ? '30d' : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                        return [4 /*yield*/, analyticsService.getBrowserAnalytics(timeRange, parseInt(limit))];
                    case 1:
                        analytics = _d.sent();
                        res.json(analytics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _d.sent();
                        res.status(500).json({ error: error_16.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.getCustomReports = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, reports, error_17;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                        return [4 /*yield*/, analyticsService.getCustomReports(parseInt(page), parseInt(limit))];
                    case 1:
                        reports = _d.sent();
                        res.json(reports);
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _d.sent();
                        res.status(500).json({ error: error_17.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.createCustomReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, report, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = createCustomReportSchema.parse(req.body);
                        return [4 /*yield*/, analyticsService.createCustomReport(req.user.id, data)];
                    case 1:
                        report = _a.sent();
                        res.status(201).json(report);
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
                        if (error_18.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_18.errors })];
                        }
                        res.status(400).json({ error: error_18.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.updateCustomReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reportId, data, report, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        reportId = req.params.reportId;
                        data = updateCustomReportSchema.parse(req.body);
                        return [4 /*yield*/, analyticsService.updateCustomReport(reportId, data)];
                    case 1:
                        report = _a.sent();
                        res.json(report);
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        if (error_19.name === 'ZodError') {
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid input data', details: error_19.errors })];
                        }
                        res.status(404).json({ error: error_19.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.deleteCustomReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reportId, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        reportId = req.params.reportId;
                        return [4 /*yield*/, analyticsService.deleteCustomReport(reportId)];
                    case 1:
                        _a.sent();
                        res.json({ message: 'Report deleted successfully' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        res.status(404).json({ error: error_20.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticsController.prototype.exportReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reportId, _a, format, exportData, error_21;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        reportId = req.params.reportId;
                        _a = req.query.format, format = _a === void 0 ? 'csv' : _a;
                        return [4 /*yield*/, analyticsService.exportReport(reportId, format)];
                    case 1:
                        exportData = _b.sent();
                        res.json(exportData);
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _b.sent();
                        res.status(500).json({ error: error_21.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AnalyticsController;
}());
exports.AnalyticsController = AnalyticsController;
