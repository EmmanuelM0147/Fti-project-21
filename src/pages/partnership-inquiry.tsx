import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Phone, Users, Briefcase, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)'),
  sponsorshipTier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'custom']),
  customRequest: z.string().optional(),
  message: z.string().min(10, 'Please provide more details about your partnership interests'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function PartnershipInquiry() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const selectedTier = watch('sponsorshipTier');

  const onSubmit = async (data: InquiryFormData) => {
    try {
      // TODO: Implement form submission
      console.log('Form data:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partnership Inquiry | FolioTech Institute</title>
        <meta name="description" content="Partner with FolioTech Institute to shape the future of technology education in Nigeria" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative py-24 bg-blue-600 dark:bg-blue-800">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
              alt="Partnership background"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Partner With Us
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
              Join us in shaping the future of technology education and empowering the next generation of tech leaders in Nigeria.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Partnership Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Why Partner With Us?
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Impact',
                    description: 'Transform lives through education and create lasting change in Nigeria tech landscape.',
                    icon: Users
                  },
                  {
                    title: 'Recognition',
                    description: 'Gain visibility as a leader in tech education and social impact.',
                    icon: Building2
                  },
                  {
                    title: 'Access',
                    description: 'Connect with top tech talent and industry leaders.',
                    icon: Briefcase
                  }
                ].map(({ title, description, icon: Icon }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success Stories */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Partner Success Stories
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <blockquote className="text-lg text-gray-600 dark:text-gray-400">
                    "Our partnership with FolioTech Institute has been transformative. We've seen incredible talent emerge from their programs, and our investment in education has yielded remarkable returns for both our organization and the community."
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
                    <p className="text-gray-600 dark:text-gray-400">CEO, TechForward Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Partnership Inquiry Form
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      {...register('organization')}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.organization && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organization.message}</p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="+234..."
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sponsorship Tier Interest
                    </label>
                    <select
                      {...register('sponsorshipTier')}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a tier</option>
                      <option value="bronze">Bronze Partner (₦500,000)</option>
                      <option value="silver">Silver Partner (₦1,000,000)</option>
                      <option value="gold">Gold Partner (₦2,000,000)</option>
                      <option value="platinum">Platinum Partner (₦5,000,000)</option>
                      <option value="custom">Custom Partnership</option>
                    </select>
                    {errors.sponsorshipTier && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sponsorshipTier.message}</p>
                    )}
                  </div>

                  {selectedTier === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Custom Partnership Request
                      </label>
                      <textarea
                        {...register('customRequest')}
                        rows={3}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please describe your custom partnership interests..."
                      />
                      {errors.customRequest && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customRequest.message}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Message
                    </label>
                    <div className="relative">
                      <textarea
                        {...register('message')}
                        rows={4}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us more about your partnership goals..."
                      />
                      <MessageSquare className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}