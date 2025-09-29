"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
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
    async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to Trackdesk!',
            html: `
        <h1>Welcome to Trackdesk, ${firstName}!</h1>
        <p>Your account has been successfully created.</p>
        <p>You can now start tracking your affiliate links and earning commissions.</p>
        <p>Best regards,<br>The Trackdesk Team</p>
      `
        };
        return this.transporter.sendMail(mailOptions);
    }
    async sendCommissionNotification(email, amount) {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'New Commission Earned!',
            html: `
        <h1>Congratulations!</h1>
        <p>You've earned a new commission of $${amount.toFixed(2)}!</p>
        <p>Check your dashboard for more details.</p>
        <p>Best regards,<br>The Trackdesk Team</p>
      `
        };
        return this.transporter.sendMail(mailOptions);
    }
    async sendPayoutNotification(email, amount, method) {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Payout Processed',
            html: `
        <h1>Payout Processed</h1>
        <p>Your payout of $${amount.toFixed(2)} has been processed via ${method}.</p>
        <p>You should receive the funds within 1-3 business days.</p>
        <p>Best regards,<br>The Trackdesk Team</p>
      `
        };
        return this.transporter.sendMail(mailOptions);
    }
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your Trackdesk account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Trackdesk Team</p>
      `
        };
        return this.transporter.sendMail(mailOptions);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map