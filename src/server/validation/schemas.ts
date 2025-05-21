import { z } from 'zod';

// Partnership form validation schema
export const partnershipSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  
  organization: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must not exceed 100 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
  
  // Optional fields
  phone: z.string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)')
    .optional(),
  
  sponsorshipTier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'custom'])
    .optional(),
  
  // Honeypot field
  website: z.string().max(0, 'Form submission rejected').optional()
});

// Give form validation schema
export const giveSchema = z.object({
  amount: z.number()
    .min(1000, 'Minimum donation amount is ₦1,000')
    .max(100000000, 'Maximum donation amount is ₦100,000,000'),
  
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'annually']),
  
  designation: z.enum(['scholarships', 'facilities', 'research', 'general']),
  
  donor: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),
    
    email: z.string()
      .email('Invalid email address')
      .max(255, 'Email must not exceed 255 characters'),
    
    phone: z.string()
      .regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)'),
    
    organization: z.string()
      .min(2, 'Organization name must be at least 2 characters')
      .max(100, 'Organization name must not exceed 100 characters')
      .optional(),
    
    address: z.object({
      street: z.string().min(5, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      country: z.string().min(2, 'Country is required')
    })
  }),
  
  // Optional fields
  comments: z.string().max(1000, 'Comments must not exceed 1000 characters').optional(),
  anonymous: z.boolean().optional(),
  
  // Honeypot field
  website: z.string().max(0, 'Form submission rejected').optional()
});

export type PartnershipFormData = z.infer<typeof partnershipSchema>;
export type GiveFormData = z.infer<typeof giveSchema>;