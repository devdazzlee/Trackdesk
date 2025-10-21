import nodemailer from "nodemailer";
import crypto from "crypto";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    // For development, you can use a service like Mailtrap, SendGrid, or Gmail
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"Trackdesk" <noreply@trackdesk.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Trackdesk</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #3b82f6;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              padding: 14px 28px;
              background-color: #3b82f6;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #2563eb;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 Trackdesk</div>
            </div>
            
            <div class="content">
              <h2>Welcome to Trackdesk, ${firstName}!</h2>
              
              <p>Thank you for signing up. To complete your registration and start using Trackdesk, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This verification link will expire in 24 hours. If you didn't create an account with Trackdesk, please ignore this email.
              </div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Trackdesk. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Welcome to Trackdesk, ${firstName}!

Thank you for signing up. To complete your registration and start using Trackdesk, please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire in 24 hours. If you didn't create an account with Trackdesk, please ignore this email.

© ${new Date().getFullYear()} Trackdesk. All rights reserved.
    `.trim();

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email - Trackdesk",
      html,
      text,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Trackdesk!</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #3b82f6;
              margin-bottom: 10px;
            }
            h1 {
              color: #1e40af;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .features {
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .feature-item {
              margin: 10px 0;
              padding-left: 25px;
              position: relative;
            }
            .feature-item:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #10b981;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 14px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Trackdesk</div>
              <h1>Welcome to Trackdesk, ${firstName}! 🎉</h1>
            </div>
            
            <p>We're excited to have you on board! Your affiliate account has been successfully created and verified.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/login" class="button">
                Get Started
              </a>
            </div>
            
            <div class="features">
              <h3 style="margin-top: 0;">What you can do with Trackdesk:</h3>
              <div class="feature-item">Generate unique affiliate links</div>
              <div class="feature-item">Track clicks and conversions in real-time</div>
              <div class="feature-item">Monitor your earnings and commissions</div>
              <div class="feature-item">Access detailed analytics and reports</div>
              <div class="feature-item">Manage your referrals efficiently</div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Log in to your dashboard</li>
              <li>Complete your profile information</li>
              <li>Create your first affiliate link</li>
              <li>Start promoting and earning!</li>
            </ol>
            
            <p>If you have any questions or need assistance, our support team is here to help.</p>
            
            <div class="footer">
              <p>Happy tracking! 🚀</p>
              <p>The Trackdesk Team</p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                This email was sent to ${email}. If you didn't create this account, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to Trackdesk, ${firstName}!
      
      We're excited to have you on board! Your affiliate account has been successfully created and verified.
      
      What you can do with Trackdesk:
      - Generate unique affiliate links
      - Track clicks and conversions in real-time
      - Monitor your earnings and commissions
      - Access detailed analytics and reports
      - Manage your referrals efficiently
      
      Next Steps:
      1. Log in to your dashboard
      2. Complete your profile information
      3. Create your first affiliate link
      4. Start promoting and earning!
      
      Get Started: ${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/login
      
      Happy tracking!
      The Trackdesk Team
    `.trim();

    await this.sendEmail({
      to: email,
      subject: "Welcome to Trackdesk - Let's Get Started! 🚀",
      html,
      text,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password - Trackdesk</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset Request</h2>
            <p>Hi ${firstName},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <p><a href="${resetUrl}" class="button">Reset Password</a></p>
            <p>Or copy this link: ${resetUrl}</p>
            <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Reset Your Password - Trackdesk",
      html,
    });
  }

  // Generate a secure random token
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Generate token expiry (24 hours from now)
  static generateTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry;
  }
}

const emailService = new EmailService();
export { EmailService };
export default emailService;
