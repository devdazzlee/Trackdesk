export declare class EmailService {
    private transporter;
    sendWelcomeEmail(email: string, firstName: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendCommissionNotification(email: string, amount: number): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendPayoutNotification(email: string, amount: number, method: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
//# sourceMappingURL=EmailService.d.ts.map