# Contact Email Edge Function

This Edge Function sends automated email responses when a new contact form submission is received.

## Functionality

When triggered by a database webhook, this function:

1. Receives the webhook payload containing contact form data
2. Sends a confirmation email to the user who submitted the form
3. Sends a notification email to the admin with the form details
4. Implements retry logic for reliability
5. Returns appropriate success/error responses

## Environment Variables

The following environment variables must be set in your Supabase project:

- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: Your Gmail app password (not your regular password)
- `SUPABASE_URL`: Automatically set by Supabase
- `SUPABASE_SERVICE_KEY`: Automatically set by Supabase

## Webhook Configuration

This function is designed to be triggered by a database webhook when a new record is inserted into the `contact_messages` table.

Webhook settings:
- Name: `contact_form_emails`
- HTTP Method: `POST`
- URL: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/contact-email`
- Schema: `public`
- Table: `contact_messages`
- Events: `INSERT`
- HTTP Headers:
  - Key: `Authorization`
  - Value: `Bearer [YOUR_SUPABASE_SERVICE_KEY]`

## Error Handling

The function includes:
- Comprehensive error logging
- Retry mechanism (3 attempts with exponential backoff)
- Proper CORS headers for browser compatibility
- Graceful handling of SMTP connection issues

## Testing

You can test this function by:
1. Making a direct HTTP request with sample data
2. Inserting a test record into the `contact_messages` table
3. Checking the function logs for execution details

## Security Considerations

- The function uses SMTP over TLS for secure email transmission
- Authentication is handled via app password, not your main Gmail password
- The webhook is secured with your Supabase service key