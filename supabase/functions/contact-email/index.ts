import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Configure Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure email client
const emailClient = new SmtpClient();

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  created_at: string;
}

interface WebhookPayload {
  type: string;
  table: string;
  record: ContactMessage;
  schema: string;
  old_record: null | Record<string, unknown>;
}

async function sendEmail(contactData: ContactMessage) {
  try {
    // Connect to SMTP server
    await emailClient.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("GMAIL_USER") || "",
      password: Deno.env.get("GMAIL_APP_PASSWORD") || "",
    });

    const { name, email, subject, message, phone } = contactData;
    
    // Format date for email
    const formattedDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Create HTML email template for user confirmation
    const userHtmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Us</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px; }
          .message-box { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .footer { margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to FolioTech Institute. We have received your message and will get back to you as soon as possible.</p>
          <p>For your reference, here is a copy of your message:</p>
          <div class="message-box">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>If you have any additional questions or information to provide, please feel free to reply to this email.</p>
          <p>Best regards,<br>The FolioTech Institute Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} FolioTech Institute. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Create plain text version for user
    const userTextBody = `
Thank You for Contacting Us

Dear ${name},

Thank you for reaching out to FolioTech Institute. We have received your message and will get back to you as soon as possible.

For your reference, here is a copy of your message:

${message}

If you have any additional questions or information to provide, please feel free to reply to this email.

Best regards,
The FolioTech Institute Team

© ${new Date().getFullYear()} FolioTech Institute. All rights reserved.
    `;

    // Create HTML email template for admin notification
    const adminHtmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px; }
          .message-box { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .footer { margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <p>A new contact form submission has been received:</p>
          
          <table>
            <tr>
              <th>Name</th>
              <td>${name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <th>Phone</th>
              <td>${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <th>Subject</th>
              <td>${subject}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>${formattedDate}</td>
            </tr>
          </table>
          
          <h3>Message:</h3>
          <div class="message-box">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} FolioTech Institute. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to user
    await emailClient.send({
      from: Deno.env.get("GMAIL_USER") || "",
      to: email,
      subject: "Thank You for Contacting FolioTech Institute",
      content: userTextBody,
      html: userHtmlBody,
    });

    // Send notification email to admin
    await emailClient.send({
      from: Deno.env.get("GMAIL_USER") || "",
      to: Deno.env.get("GMAIL_USER") || "", // Send to admin email
      subject: `New Contact Form Submission: ${subject}`,
      content: `New contact form submission from ${name} (${email})\n\nSubject: ${subject}\n${phone ? `Phone: ${phone}\n` : ''}Message:\n${message}`,
      html: adminHtmlBody,
    });

    // Close connection
    await emailClient.close();
    
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    
    // Attempt to close connection even if there was an error
    try {
      await emailClient.close();
    } catch (closeError) {
      console.error("Error closing SMTP connection:", closeError);
    }
    
    throw error;
  }
}

// Implement retry logic
async function sendWithRetry(contactData: ContactMessage, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendEmail(contactData);
    } catch (error) {
      lastError = error;
      console.error(`Email sending attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2^attempt * 1000ms (2s, 4s, 8s)
        const delay = Math.min(2 ** attempt * 1000, 10000);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Parse webhook payload
    const payload = await req.json() as WebhookPayload;
    
    // Validate payload
    if (
      payload.type !== "INSERT" || 
      payload.table !== "contact_messages" || 
      !payload.record
    ) {
      throw new Error("Invalid webhook payload");
    }
    
    // Process email sending with retry logic
    await sendWithRetry(payload.record);
    
    // Log success
    console.log(`Email sent successfully for contact submission ID: ${payload.record.id}`);
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    // Log error details for monitoring
    const errorDetails = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };
    
    console.error("Error details:", JSON.stringify(errorDetails));
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to process contact submission",
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});