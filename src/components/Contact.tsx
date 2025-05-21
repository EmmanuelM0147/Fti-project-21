import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle, Loader2, WifiOff } from 'lucide-react';
import { contactFormSchema, submitContactForm, type ContactFormData } from '../lib/api/contact';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
      website: '' // Honeypot field
    }
  });

  useEffect(() => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds
    const HEALTH_CHECK_INTERVAL = 60000; // 60 seconds
    const REQUEST_TIMEOUT = 30000; // 30 seconds

    const checkApiStatus = async () => {
      let controller: AbortController | null = null;
      let timeoutId: number | null = null;

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase configuration is missing');
        }

        controller = new AbortController();
        timeoutId = window.setTimeout(() => {
          if (controller) {
            controller.abort('Request timeout');
          }
        }, REQUEST_TIMEOUT);

        const apiUrl = `${supabaseUrl}/functions/v1/health`;
        
        const response = await fetch(apiUrl, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          mode: 'cors', // Explicitly set CORS mode
          credentials: 'omit' // Don't send credentials
        });

        // Clear timeout as soon as we get a response
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!mountedRef.current) return;

        if (data.status === 'healthy') {
          setApiStatus('online');
          setRetryCount(0);
        } else {
          throw new Error('API reported unhealthy status');
        }
      } catch (error) {
        if (!mountedRef.current) return;

        console.error('API health check error:', error);
        setApiStatus('offline');
        
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            if (mountedRef.current) {
              setRetryCount(prev => prev + 1);
            }
          }, RETRY_DELAY);
        }
      } finally {
        // Clean up timeout if it hasn't been cleared
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        // Clean up controller
        if (controller) {
          try {
            controller.abort();
          } catch (e) {
            // Ignore abort errors
          }
        }
      }
    };

    // Initial check
    checkApiStatus();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkApiStatus, HEALTH_CHECK_INTERVAL);

    // Cleanup
    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [retryCount]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitResult(null);
      
      if (apiStatus === 'offline') {
        throw new Error('Unable to connect to the server. Please try again later.');
      }
      
      const result = await submitContactForm(data);
      setSubmitResult(result);
      
      if (result.success) {
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl transition-colors">
            Contact Us
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 transition-colors">
            Have questions? We're here to help
          </p>
          
          {/* API Status Indicator */}
          {apiStatus === 'offline' && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              <WifiOff className="h-4 w-4 mr-2" />
              <span>Contact service is currently unavailable{retryCount > 0 ? ` (Retry ${retryCount}/3)` : ''}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Get in Touch
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 transition-colors" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium transition-colors">Email</p>
                    <a 
                      href="mailto:info@foliotechinstitute.com" 
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      info@foliotechinstitute.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 transition-colors" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium transition-colors">Phone</p>
                    <a 
                      href="tel:+2347088616350" 
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      +234-708-861-6350
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 transition-colors" />
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white font-medium transition-colors">Address</p>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      1, Sunmonu Animashaun St,<br />
                      Zina Estate, Addo Rd, Ajah, Lagos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all">
            {submitResult && (
              <div 
                className={`mb-6 p-4 rounded-lg flex items-start ${
                  submitResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
                role="alert"
              >
                {submitResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <span className={submitResult.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
                }>
                  {submitResult.message}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors ${
                    errors.phone 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors ${
                    errors.subject 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors ${
                    errors.message 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>
              
              {/* Honeypot field - hidden from users but bots will fill it out */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website (Leave this empty)</label>
                <input type="text" id="website" {...register('website')} tabIndex={-1} autoComplete="off" />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || apiStatus === 'offline'}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent 
                  text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                  dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}