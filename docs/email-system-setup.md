# Email Response System Setup Guide

This guide explains how to set up the automated email response system for contact form submissions.

## Overview

When a user submits a contact form on the website:

1. The form data is saved to the `contact_messages` table in Supabase
2. A database webhook triggers the `contact-email` Edge Function
3. The Edge Function sends two emails:
   - A confirmation email to the user who submitted the form
   - A notification email to the admin with the form details

## Prerequisites

- A Gmail account for sending emails
- A Gmail app password (not your regular password)
- Supabase project with Edge Functions enabled

## Setup Instructions

### 1. Create Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Create a new app password for "Mail" and "Other (Custom name)"
5. Name it "FolioTech Contact Form"
6. Copy the generated password (you'll need it for the next step)

### 2. Set Environment Variables

In your Supabase project:

1. Go to Settings > API > Edge Functions
2. Add the following environment variables:
   - `GMAIL_USER`: Your Gmail address (e.g., `your-email@gmail.com`)
   - `GMAIL_APP_PASSWORD`: The app password you generated

### 3. Deploy the Edge Function

The Edge Function is located at `supabase/functions/contact-email/index.ts`. Deploy it using the Supabase CLI or through the dashboard.

### 4. Set Up the Database Webhook

1. Go to Database > Webhooks in your Supabase dashboard
2. Create a new webhook with these settings:
   - Name: `contact_form_emails`
   - HTTP Method: `POST`
   - URL: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/contact-email`
   - Schema: `public`
   - Table: `contact_messages`
   - Events: Select only `INSERT`
   - HTTP Headers:
     - Key: `Authorization`
     - Value: `Bearer [YOUR_SUPABASE_SERVICE_KEY]`

### 5. Test the System

1. Submit a contact form on your website
2. Check your email to verify you received the confirmation
3. Check the admin email to verify the notification was sent
4. Review the Edge Function logs in the Supabase dashboard for any errors

## Troubleshooting

If emails are not being sent:

- Check the Edge Function logs for error messages
- Verify your Gmail app password is correct
- Ensure the webhook is properly configured
- Test the Edge Function directly with sample data
- Verify that your Gmail account doesn't have additional security restrictions

## Maintenance

- Regularly check the Edge Function logs for errors
- Update the email templates as needed
- Monitor for any changes in Gmail's security policies
- Consider implementing a monitoring system for failed email sends