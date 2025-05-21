// Email template for contact form submissions
export const createConfirmationEmail = (name) => ({
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