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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var EmailService = /** @class */ (function () {
    function EmailService() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    EmailService.prototype.sendWelcomeEmail = function (email, firstName) {
        return __awaiter(this, void 0, void 0, function () {
            var mailOptions;
            return __generator(this, function (_a) {
                mailOptions = {
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'Welcome to Trackdesk!',
                    html: "\n        <h1>Welcome to Trackdesk, ".concat(firstName, "!</h1>\n        <p>Your account has been successfully created.</p>\n        <p>You can now start tracking your affiliate links and earning commissions.</p>\n        <p>Best regards,<br>The Trackdesk Team</p>\n      ")
                };
                return [2 /*return*/, this.transporter.sendMail(mailOptions)];
            });
        });
    };
    EmailService.prototype.sendCommissionNotification = function (email, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var mailOptions;
            return __generator(this, function (_a) {
                mailOptions = {
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'New Commission Earned!',
                    html: "\n        <h1>Congratulations!</h1>\n        <p>You've earned a new commission of $".concat(amount.toFixed(2), "!</p>\n        <p>Check your dashboard for more details.</p>\n        <p>Best regards,<br>The Trackdesk Team</p>\n      ")
                };
                return [2 /*return*/, this.transporter.sendMail(mailOptions)];
            });
        });
    };
    EmailService.prototype.sendPayoutNotification = function (email, amount, method) {
        return __awaiter(this, void 0, void 0, function () {
            var mailOptions;
            return __generator(this, function (_a) {
                mailOptions = {
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'Payout Processed',
                    html: "\n        <h1>Payout Processed</h1>\n        <p>Your payout of $".concat(amount.toFixed(2), " has been processed via ").concat(method, ".</p>\n        <p>You should receive the funds within 1-3 business days.</p>\n        <p>Best regards,<br>The Trackdesk Team</p>\n      ")
                };
                return [2 /*return*/, this.transporter.sendMail(mailOptions)];
            });
        });
    };
    EmailService.prototype.sendPasswordResetEmail = function (email, resetToken) {
        return __awaiter(this, void 0, void 0, function () {
            var resetUrl, mailOptions;
            return __generator(this, function (_a) {
                resetUrl = "".concat(process.env.FRONTEND_URL, "/reset-password?token=").concat(resetToken);
                mailOptions = {
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: 'Password Reset Request',
                    html: "\n        <h1>Password Reset Request</h1>\n        <p>You requested a password reset for your Trackdesk account.</p>\n        <p>Click the link below to reset your password:</p>\n        <a href=\"".concat(resetUrl, "\">Reset Password</a>\n        <p>This link will expire in 1 hour.</p>\n        <p>If you didn't request this, please ignore this email.</p>\n        <p>Best regards,<br>The Trackdesk Team</p>\n      ")
                };
                return [2 /*return*/, this.transporter.sendMail(mailOptions)];
            });
        });
    };
    return EmailService;
}());
exports.EmailService = EmailService;
