/*
  # Add webhook for contact form email notifications

  1. Changes
    - Create a webhook to trigger email notifications when new contact messages are submitted
    - Set up webhook to call the contact-email edge function
    - Configure webhook to only trigger on INSERT events

  2. Security
    - Webhook uses service role for authentication
    - Only triggers for new contact submissions
*/

-- This migration doesn't modify the database schema
-- It's a documentation of the webhook that needs to be set up manually
-- through the Supabase dashboard or API

-- The webhook should be configured with the following settings:
-- Name: contact_form_emails
-- Table: public.contact_messages
-- Events: INSERT
-- Method: POST
-- URL: https://[YOUR_PROJECT_REF].supabase.co/functions/v1/contact-email
-- Headers:
--   Authorization: Bearer [YOUR_SUPABASE_SERVICE_KEY]

-- Note: Replace [YOUR_PROJECT_REF] with your Supabase project reference
-- and [YOUR_SUPABASE_SERVICE_KEY] with your service role API key

-- This is a documentation-only migration, no SQL commands are executed
SELECT 'Webhook configuration documented. Please set up the webhook manually.' as message;