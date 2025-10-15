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
exports.SecurityController = void 0;
var SecurityController = /** @class */ (function () {
    function SecurityController() {
    }
    SecurityController.prototype.setup2FA = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ secret: 'mock-secret' });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.verify2FA = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.disable2FA = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.generateBackupCodes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ codes: ['123456', '789012', '345678'] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getSecurityLogs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ logs: [] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getSecurityLogById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ log: null });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getLoginAttempts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ attempts: [] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getUserLoginAttempts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ attempts: [] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getIPBlocks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ blocks: [] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.createIPBlock = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(201).json({ block: null });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.deleteIPBlock = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ message: 'IP block deleted successfully' });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getUserDevices = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ devices: [] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.revokeDevice = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.revokeAllDevices = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getSecuritySettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ settings: {} });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.updateSecuritySettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ success: true });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getAuditTrail = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ trail: [] });
                return [2 /*return*/];
            });
        });
    };
    SecurityController.prototype.getUserAuditTrail = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.json({ trail: [] });
                return [2 /*return*/];
            });
        });
    };
    return SecurityController;
}());
exports.SecurityController = SecurityController;
