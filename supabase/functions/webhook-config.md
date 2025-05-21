# Supabase Webhook Configuration Guide

## Setting Up Database Webhook for Contact Form Emails

To enable automatic email responses when a new contact form submission is received, you need to set up a database webhook in your Supabase project.

### Step 1: Deploy the Edge Function

First, ensure the `contact-email` edge function is deployed to your Supabase project.

### Step 2: Create the Database Webhook

1. Go to your Supabase dashboard
2. Navigate to **Database** > **Webhooks**
3. Click **Create a new webhook**
4. Configure the webhook with the following settings:

   **Basic Information:**
   - Name: `contact_form_emails`
   - HTTP Method: `POST`
   - URL: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/contact-email`
   
   **Conditions:**
   - Schema: `public`
   - Table: `contact_messages`
   - Events: Select only `INSERT`
   
   **Security:**
   - HTTP Headers:
     - Key: `Authorization`
     - Value: `Bearer [YOUR_SUPABASE_SERVICE_KEY]`

5. Click **Save** to create the webhook

### Step 3: Configure Environment Variables

In your Supabase project, add the following environment variables:

1. Go to **Settings** > **API** > **Edge Functions**
2. Add the following environment variables:
   - `GMAIL_USER`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: Your Gmail app password (create one at https://myaccount.google.com/apppasswords)
   - `SUPABASE_URL`: This should already be set
   - `SUPABASE_SERVICE_KEY`: This should already be set

### Step 4: Test the Webhook

1. Submit a contact form on your website
2. Check the logs of your `contact-email` function in the Supabase dashboard
3. Verify that the email was sent to both the user and admin

## Troubleshooting

If emails are not being sent:

1. Check the Edge Function logs for errors
2. Verify that your Gmail app password is correct
3. Ensure the webhook is properly configured and active
4. Check that the `contact_messages` table structure matches the expected format