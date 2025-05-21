import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+[1-9]\d{1,14}$/;
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Partnership Form Schema
export const partnershipSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  organization: z.string()
    .min(2, 'Organization name is required')
    .max(100, 'Organization name must not exceed 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .regex(phoneRegex, 'Please enter a valid phone number (e.g., +234...)'),
  sponsorshipTier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'custom'], {
    errorMap: () => ({ message: 'Please select a sponsorship tier' })
  }),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
  // Honeypot field
  website: z.string().max(0, 'Form submission rejected')
});

// Giving Form Schema
export const givingSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  organization: z.string()
    .min(2, 'Organization name is required')
    .max(100, 'Organization name must not exceed 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .regex(phoneRegex, 'Please enter a valid phone number (e.g., +234...)'),
  preferredContact: z.enum(['email', 'phone', 'either'], {
    errorMap: () => ({ message: 'Please select a preferred contact method' })
  }),
  interestArea: z.enum(['scholarships', 'facilities', 'research', 'general'], {
    errorMap: () => ({ message: 'Please select an area of interest' })
  }),
  givingRange: z.enum(['under_1m', '1m_5m', '5m_10m', 'above_10m', 'custom'], {
    errorMap: () => ({ message: 'Please select a giving range' })
  }),
  bestTimeToContact: z.string()
    .regex(timeRegex, 'Please enter a valid time (HH:MM)'),
  customRequest: z.string()
    .max(5000, 'Custom request must not exceed 5000 characters')
    .optional(),
  privacyPolicy: z.boolean()
    .refine(val => val === true, 'You must accept the privacy policy'),
  // Honeypot field
  website: z.string().max(0, 'Form submission rejected')
});

export type PartnershipFormData = z.infer<typeof partnershipSchema>;
export type GivingFormData = z.infer<typeof givingSchema>;