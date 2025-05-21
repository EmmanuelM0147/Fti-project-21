import nodemailer from 'nodemailer';
import { createConfirmationEmail, createPartnershipEmail, createGivingEmail } from '../config/email.js';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if required environment variables are set
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });
};

export const sendPartnershipEmail = async (partnershipData) => {
  try {
    const { name, organization, email, phone, sponsorshipTier, message } = partnershipData;
    
    const transporter = createTransporter();
    
    const formattedDate = new Date().toLocaleString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `Partnership Inquiry: ${organization} - ${sponsorshipTier} tier`,
      html: createPartnershipEmail.admin({ name, organization, email, phone, sponsorshipTier, message, formattedDate })
    };

    // Send confirmation to partner
    const partnerMailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Thank You for Your Partnership Interest - FolioTech Institute',
      html: createPartnershipEmail.partner({ name, organization, sponsorshipTier })
    };

    const [adminInfo, partnerInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(partnerMailOptions)
    ]);

    console.log('Partnership emails sent:', {
      admin: adminInfo.messageId,
      partner: partnerInfo.messageId
    });

    return { adminInfo, partnerInfo };
  } catch (error) {
    console.error('Error sending partnership emails:', error);
    throw error;
  }
};

export const sendGivingEmail = async (givingData) => {
  try {
    const { fullName, organization, email } = givingData;
    
    const transporter = createTransporter();
    
    const formattedDate = new Date().toLocaleString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `Giving Inquiry: ${organization}`,
      html: createGivingEmail.admin({ ...givingData, formattedDate })
    };

    // Send confirmation to donor
    const donorMailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Thank You for Your Interest in Supporting FolioTech Institute',
      html: createGivingEmail.donor({ fullName, organization })
    };

    const [adminInfo, donorInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(donorMailOptions)
    ]);

    console.log('Giving emails sent:', {
      admin: adminInfo.messageId,
      donor: donorInfo.messageId
    });

    return { adminInfo, donorInfo };
  } catch (error) {
    console.error('Error sending giving emails:', error);
    throw error;
  }
};

export { sendContactEmail } from './contactEmail.js';