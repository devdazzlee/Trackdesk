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
exports.EnterpriseController = void 0;
var EnterpriseController = /** @class */ (function () {
    function EnterpriseController() {
    }
    EnterpriseController.prototype.getWhiteLabelSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ settings: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.updateWhiteLabelSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.previewWhiteLabel = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ preview: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getTenants = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ tenants: [] });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getTenantById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ tenant: null });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.createTenant = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(201).json({ tenant: null });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.updateTenant = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ tenant: null });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.deleteTenant = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ message: 'Tenant deleted successfully' });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getTenantSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ settings: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.updateTenantSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getTenantAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ analytics: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getTenantUsage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ usage: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getEnterpriseFeatures = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ features: [] });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.updateEnterpriseFeatures = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getAPILimits = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ limits: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.updateAPILimits = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getCustomDomains = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ domains: [] });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.addCustomDomain = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(201).json({ domain: null });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.removeCustomDomain = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ message: 'Domain removed successfully' });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.getSSOSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ settings: {} });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.updateSSOSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    EnterpriseController.prototype.testSSO = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    return EnterpriseController;
}());
exports.EnterpriseController = EnterpriseController;
