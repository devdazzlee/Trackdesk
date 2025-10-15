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
exports.TrafficControlController = void 0;
var TrafficControl_1 = require("../models/TrafficControl");
var TrafficControlController = /** @class */ (function () {
    function TrafficControlController() {
    }
    // CRUD Operations
    TrafficControlController.createRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleData, rule, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleData = req.body;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.createRule(ruleData)];
                    case 1:
                        rule = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: rule,
                            message: 'Traffic rule created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.getRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, rule, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.findRuleById(id)];
                    case 1:
                        rule = _a.sent();
                        if (!rule) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Traffic rule not found'
                                })];
                        }
                        res.json({
                            success: true,
                            data: rule
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.updateRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateData, rule, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        updateData = req.body;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.updateRule(id, updateData)];
                    case 1:
                        rule = _a.sent();
                        res.json({
                            success: true,
                            data: rule,
                            message: 'Traffic rule updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.deleteRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.deleteRule(id)];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Traffic rule deleted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.listRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, rules, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filters = req.query;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.listRules(filters)];
                    case 1:
                        rules = _a.sent();
                        res.json({
                            success: true,
                            data: rules,
                            count: rules.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Traffic Processing
    TrafficControlController.processTraffic = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, ipAddress, userAgent, affiliateId, clickId, result, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, data = _a.data, ipAddress = _a.ipAddress, userAgent = _a.userAgent, affiliateId = _a.affiliateId, clickId = _a.clickId;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.processTraffic(data, ipAddress, userAgent, affiliateId, clickId)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Traffic processed successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Traffic Events
    TrafficControlController.getTrafficEvents = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, _a, _b, page, _c, limit, events, error_7;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        filters = req.query;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 50 : _c;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.getTrafficEvents(filters, Number(page), Number(limit))];
                    case 1:
                        events = _d.sent();
                        res.json({
                            success: true,
                            data: events,
                            count: events.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _d.sent();
                        res.status(500).json({
                            success: false,
                            error: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Statistics
    TrafficControlController.getTrafficStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, startDate, endDate, stats, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.getTrafficStats(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)];
                    case 1:
                        stats = _b.sent();
                        res.json({
                            success: true,
                            data: stats
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_8.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Rule Testing
    TrafficControlController.testRule = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, testData, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        testData = req.body;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.testRule(id, testData)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rule test completed'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_9.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Default Rules
    TrafficControlController.createDefaultRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var rules, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.createDefaultRules()];
                    case 1:
                        rules = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: rules,
                            message: 'Default traffic rules created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_10.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // IP Management
    TrafficControlController.blockIP = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ipAddress, reason, duration, result, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, ipAddress = _a.ipAddress, reason = _a.reason, duration = _a.duration;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.blockIP(ipAddress, reason, duration)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'IP blocked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_11.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.unblockIP = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ipAddress, result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ipAddress = req.params.ipAddress;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.unblockIP(ipAddress)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'IP unblocked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_12.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.getBlockedIPs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, blockedIPs, error_13;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 50 : _c;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.getBlockedIPs(Number(page), Number(limit))];
                    case 1:
                        blockedIPs = _d.sent();
                        res.json({
                            success: true,
                            data: blockedIPs,
                            count: blockedIPs.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _d.sent();
                        res.status(500).json({
                            success: false,
                            error: error_13.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Country Management
    TrafficControlController.blockCountry = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, countryCode, reason, result, error_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, countryCode = _a.countryCode, reason = _a.reason;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.blockCountry(countryCode, reason)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Country blocked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_14.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.unblockCountry = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var countryCode, result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        countryCode = req.params.countryCode;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.unblockCountry(countryCode)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Country unblocked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_15.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.getBlockedCountries = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var blockedCountries, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.getBlockedCountries()];
                    case 1:
                        blockedCountries = _a.sent();
                        res.json({
                            success: true,
                            data: blockedCountries,
                            count: blockedCountries.length
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_16.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Rate Limiting
    TrafficControlController.updateRateLimit = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleId, _a, requestsPerMinute, requestsPerHour, requestsPerDay, result, error_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        ruleId = req.params.ruleId;
                        _a = req.body, requestsPerMinute = _a.requestsPerMinute, requestsPerHour = _a.requestsPerHour, requestsPerDay = _a.requestsPerDay;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.updateRateLimit(ruleId, requestsPerMinute, requestsPerHour, requestsPerDay)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rate limit updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_17.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Device Management
    TrafficControlController.blockDevice = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, deviceType, reason, result, error_18;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, deviceType = _a.deviceType, reason = _a.reason;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.blockDevice(deviceType, reason)];
                    case 1:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Device blocked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_18.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.unblockDevice = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceType, result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        deviceType = req.params.deviceType;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.unblockDevice(deviceType)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Device unblocked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_19.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Dashboard
    TrafficControlController.getTrafficControlDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var dashboard, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.getTrafficControlDashboard()];
                    case 1:
                        dashboard = _a.sent();
                        res.json({
                            success: true,
                            data: dashboard
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        res.status(500).json({
                            success: false,
                            error: error_20.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Export/Import
    TrafficControlController.exportRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, format, exportData, error_21;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query.format, format = _a === void 0 ? 'json' : _a;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.exportRules(format)];
                    case 1:
                        exportData = _b.sent();
                        res.json({
                            success: true,
                            data: exportData,
                            message: 'Rules exported successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _b.sent();
                        res.status(500).json({
                            success: false,
                            error: error_21.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrafficControlController.importRules = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, rules, _b, overwrite, result, error_22;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.body, rules = _a.rules, _b = _a.overwrite, overwrite = _b === void 0 ? false : _b;
                        return [4 /*yield*/, TrafficControl_1.TrafficControlModel.importRules(rules, overwrite)];
                    case 1:
                        result = _c.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Rules imported successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _c.sent();
                        res.status(500).json({
                            success: false,
                            error: error_22.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TrafficControlController;
}());
exports.TrafficControlController = TrafficControlController;
