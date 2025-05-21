// Email templates for various form submissions

export const createPartnershipEmail = {
  admin: ({ name, organization, email, phone, sponsorshipTier, message, formattedDate }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">New Partnership Inquiry</h2>
      <p>A new partnership inquiry has been received from the FolioTech Institute website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Organization:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${organization}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Phone:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Sponsorship Tier:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${sponsorshipTier}</td>
        </tr>
      </table>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Message:</h3>
        <p style="white-space: pre-line; margin-bottom: 0;">${message}</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">Submitted on: ${formattedDate}</p>
    </div>
  `,
  
  partner: ({ name, organization, sponsorshipTier }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Thank You for Your Interest in Partnership</h2>
      <p>Dear ${name},</p>
      <p>Thank you for expressing interest in partnering with FolioTech Institute. We have received your inquiry regarding the ${sponsorshipTier} partnership tier for ${organization}.</p>
      <p>Our partnership team will review your submission and contact you within 2 business days to discuss the next steps.</p>
      <p>If you have any immediate questions, please don't hesitate to reach out to us at ${process.env.ADMIN_EMAIL}.</p>
      <p>Best regards,<br>FolioTech Institute Partnership Team</p>
    </div>
  `
};

export const createGivingEmail = {
  admin: ({ fullName, organization, email, phone, preferredContact, interestArea, givingRange, bestTimeToContact, formattedDate }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">New Giving Inquiry</h2>
      <p>A new giving inquiry has been received from the FolioTech Institute website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Organization:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${organization}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Phone:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Preferred Contact:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${preferredContact}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Interest Area:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${interestArea}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Giving Range:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${givingRange}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold;">Best Time to Contact:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eaeaea;">${bestTimeToContact}</td>
        </tr>
      </table>
      
      <p style="color: #6b7280; font-size: 14px;">Submitted on: ${formattedDate}</p>
    </div>
  `,
  
  donor: ({ fullName, organization }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Thank You for Your Support</h2>
      <p>Dear ${fullName},</p>
      <p>Thank you for your interest in supporting FolioTech Institute. We are grateful for your consideration and commitment to advancing technology education in Nigeria.</p>
      <p>Our development team will review your inquiry and contact you shortly to discuss how we can best align your giving goals with our mission.</p>
      <p>If you have any immediate questions, please don't hesitate to reach out to us at ${process.env.ADMIN_EMAIL}.</p>
      <p>Best regards,<br>FolioTech Institute Development Team</p>
    </div>
  `
};

export { createConfirmationEmail } from './contactEmail.js';