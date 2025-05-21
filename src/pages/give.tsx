import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Heart, Book, GraduationCap, Building2, ArrowRight, CreditCard, Users, Globe, Mail, Phone, Clock } from 'lucide-react';

// Strongly type all data structures
const giveInquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)'),
  preferredContact: z.enum(['email', 'phone', 'either']),
  interestArea: z.enum(['scholarships', 'facilities', 'research', 'general']),
  givingRange: z.enum(['under_1m', '1m_5m', '5m_10m', 'above_10m', 'custom']),
  customRequest: z.string().optional(),
  bestTimeToContact: z.string().min(1, 'Please select a preferred contact time'),
  privacyPolicy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
});

type GiveInquiryFormData = z.infer<typeof giveInquirySchema>;

interface ImpactArea {
  title: string;
  description: string;
  icon: React.ComponentType;
  metric: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization: string;
  image: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Define static data with proper typing
const impactAreas: ImpactArea[] = [
  {
    title: 'Student Scholarships',
    description: 'Enable talented students to access quality education regardless of their financial background.',
    icon: GraduationCap,
    metric: '500+ Students Supported'
  },
  {
    title: 'Learning Resources',
    description: 'Support the acquisition of modern learning tools and resources for our students.',
    icon: Book,
    metric: '20+ Labs Equipped'
  },
  {
    title: 'Campus Development',
    description: 'Contribute to the expansion and improvement of our learning facilities.',
    icon: Building2,
    metric: '3 New Buildings'
  },
  {
    title: 'Community Impact',
    description: 'Support outreach programs that bring technology education to underserved communities.',
    icon: Users,
    metric: '10,000+ Lives Impacted'
  }
];

const testimonials: Testimonial[] = [
  {
    quote: "Supporting FolioTech has been one of our most impactful investments in education. The results speak for themselves.",
    author: "Dr. Sarah Johnson",
    role: "CEO",
    organization: "TechForward Nigeria",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
  },
  {
    quote: "The transparency and dedication to student success make FolioTech an outstanding partner in education.",
    author: "Michael Adebayo",
    role: "Managing Director",
    organization: "Future Africa Ventures",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    quote: "Our scholarship program with FolioTech has created a pipeline of exceptional tech talent.",
    author: "Mrs. Chioma Okonkwo",
    role: "Foundation Director",
    organization: "Nigerian Education Trust",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  }
];

const faqs: FAQ[] = [
  {
    question: "What are the ways to give?",
    answer: "You can contribute through direct donations, scholarships, equipment sponsorship, or endowments. We work with donors to create giving plans that align with their objectives and our needs."
  },
  {
    question: "How are donations utilized?",
    answer: "Donations directly support student scholarships, facility improvements, technology resources, and community outreach programs. We provide detailed impact reports to all major donors."
  },
  {
    question: "Is my donation tax-deductible?",
    answer: "Yes, all donations to FolioTech Institute are tax-deductible. We provide official documentation for tax purposes upon receipt of your donation."
  },
  {
    question: "Can I specify how my donation is used?",
    answer: "Absolutely. You can designate your gift for specific programs, scholarships, or facilities. We work closely with donors to ensure their wishes are honored."
  },
  {
    question: "What recognition do donors receive?",
    answer: "We offer various recognition programs including naming opportunities, donor wall recognition, annual reports mention, and exclusive event invitations."
  },
  {
    question: "How do I set up a recurring donation?",
    answer: "We can establish monthly, quarterly, or annual giving arrangements. Our team will work with you to set up a convenient payment schedule."
  }
];

export default function Give() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GiveInquiryFormData>({
    resolver: zodResolver(giveInquirySchema),
  });

  const onSubmit = async (data: GiveInquiryFormData) => {
    try {
      // Log form data for debugging
      console.log('Form submission:', JSON.stringify(data, null, 2));
      
      // TODO: Implement form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Clear form or show success message
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Give to FolioTech Institute | Support Technology Education</title>
        <meta name="description" content="Make a lasting impact on technology education in Nigeria. Support FolioTech Institute's mission to empower the next generation of tech leaders." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DonateAction",
            "name": "Give to FolioTech Institute",
            "description": "Support technology education in Nigeria",
            "provider": {
              "@type": "EducationalOrganization",
              "name": "FolioTech Institute",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Nigeria"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        {/* Hero Section */}
        <section className="relative py-24 bg-[#2A3855] dark:bg-gray-800">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
              alt="Students collaborating in a tech lab"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl font-montserrat">
              Make a Difference Today
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100 dark:text-blue-50">
              Your support empowers the next generation of tech leaders in Nigeria. Join us in building a brighter future through education.
            </p>
            <div className="mt-10">
              <button
                onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Start Your Giving Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800/50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-montserrat transition-colors">
                Your Impact at FolioTech
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 transition-colors">
                See how your support transforms lives and builds futures
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {impactAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.title}
                    className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg hover:shadow-xl dark:shadow-dark transition-all"
                  >
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg transition-colors">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white transition-colors">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors">
                      {area.description}
                    </p>
                    <p className="mt-4 text-lg font-semibold text-blue-600 dark:text-blue-400 transition-colors">
                      {area.metric}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#2A3855] dark:text-white font-montserrat">
                Donor Stories
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 font-opensans">
                Hear from those who are making a difference
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-lg"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-lg font-semibold text-[#2A3855] dark:text-white font-montserrat">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 font-opensans">
                        {testimonial.role}, {testimonial.organization}
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 font-opensans">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#2A3855] dark:text-white font-montserrat">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 font-opensans">
                Everything you need to know about giving to FolioTech
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center"
                    aria-expanded={expandedFaq === index}
                  >
                    <span className="text-lg font-semibold text-[#2A3855] dark:text-white font-montserrat">
                      {faq.question}
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 text-[#1E88E5] transform transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 dark:text-gray-300 font-opensans">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="inquiry-form" className="py-24 bg-white dark:bg-gray-900 transition-colors">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                Start Your Giving Journey
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 transition-colors">
                Complete the form below and our team will contact you to discuss your giving goals
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Organization
                  </label>
                  <input
                    type="text"
                    {...register('organization')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                  />
                  {errors.organization && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organization.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      {...register('email')}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white pl-10 transition-colors"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Phone
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+234..."
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white pl-10 transition-colors"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Preferred Contact Method
                </label>
                <select
                  {...register('preferredContact')}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="either">Either</option>
                </select>
                {errors.preferredContact && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredContact.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Area of Interest
                </label>
                <select
                  {...register('interestArea')}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                >
                  <option value="scholarships">Student Scholarships</option>
                  <option value="facilities">Campus Facilities</option>
                  <option value="research">Research & Innovation</option>
                  <option value="general">General Support</option>
                </select>
                {errors.interestArea && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.interestArea.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Preferred Giving Range (NGN)
                </label>
                <select
                  {...register('givingRange')}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                >
                  <option value="under_1m">Under ₦1,000,000</option>
                  <option value="1m_5m">₦1,000,000 - ₦5,000,000</option>
                  <option value="5m_10m">₦5,000,000 - ₦10,000,000</option>
                  <option value="above_10m">Above ₦10,000,000</option>
                  <option value="custom">Custom Amount</option>
                </select>
                {errors.givingRange && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.givingRange.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Custom Request or Message
                </label>
                <textarea
                  {...register('customRequest')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                  placeholder="Tell us more about your giving goals..."
                />
                {errors.customRequest && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customRequest.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Best Time to Contact
                </label>
                <div className="mt-1 relative">
                  <input
                    type="time"
                    {...register('bestTimeToContact')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white pl-10 transition-colors"
                  />
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.bestTimeToContact && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bestTimeToContact.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('privacyPolicy')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 transition-colors"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  I agree to the privacy policy and terms of service
                </label>
              </div>
              {errors.privacyPolicy && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.privacyPolicy.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </section>

        <section
          aria-labelledby="thank-you-title"
          className="mt-16 bg-blue-50 dark:bg-blue-900/50 rounded-xl p-8 text-center"
        >
          <Heart className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 id="thank-you-title" className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Thank You for Your Support
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your generosity helps us continue our mission of providing quality technology education.
          </p>
        </section>
      </div>
    </>
  );
}