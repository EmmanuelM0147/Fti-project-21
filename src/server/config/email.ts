import nodemailer from 'nodemailer';

// Configure email transport
export const emailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
export const createConfirmationEmail = (name: string) => ({
  text: `Dear ${name},\n\nThank you for contacting FolioTech Institute. We have received your message and will respond shortly.\n\nBest regards,\nFolioTech Institute Team`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank You for Contacting Us</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to FolioTech Institute. We have received your message and will get back to you as soon as possible.</p>
      <p>Best regards,<br>FolioTech Institute Team</p>
    </div>
  `
});