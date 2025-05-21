import nodemailer from 'nodemailer';

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

export const sendContactEmail = async ({ name, email, subject, message, phone }) => {
  try {
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
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p>A new contact form submission has been received:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Phone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Subject:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${subject}</td>
            </tr>
          </table>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-line; margin-bottom: 0;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">Submitted on: ${formattedDate}</p>
        </div>
      `
    };

    // Send confirmation to sender
    const senderMailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Thank You for Contacting FolioTech Institute',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Thank You for Your Message</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting FolioTech Institute. We have received your message and will get back to you as soon as possible.</p>
          <p>For your reference, here is a copy of your message:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="white-space: pre-line; margin-bottom: 0;">${message}</p>
          </div>
          <p>Best regards,<br>FolioTech Institute Team</p>
        </div>
      `
    };

    const [adminInfo, senderInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(senderMailOptions)
    ]);

    console.log('Contact emails sent:', {
      admin: adminInfo.messageId,
      sender: senderInfo.messageId
    });

    return { adminInfo, senderInfo };
  } catch (error) {
    console.error('Error sending contact emails:', error);
    throw error;
  }
};