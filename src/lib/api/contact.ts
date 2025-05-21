import { z } from 'zod';
import { supabase } from '../supabase/client';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
  phone: z.string().optional(),
  // Honeypot field
  website: z.string().max(0, 'Form submission rejected')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Send contact form data to Supabase
 * @param formData Contact form data
 * @returns Promise with the submission response
 */
export const submitContactForm = async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
  try {
    // Check honeypot field
    if (formData.website) {
      throw new Error('Form submission rejected');
    }

    // Remove the honeypot field before submission
    const { website, ...contactData } = formData;

    // Insert the contact message into Supabase
    const { error } = await supabase
      .from('contact_messages')
      .insert([contactData]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to send message. Please try again later.');
    }

    return {
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};