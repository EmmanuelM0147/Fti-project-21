import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PaystackButton } from './PaystackButton';
import { AlertCircle, CreditCard, Building2 } from 'lucide-react';
import type { PaymentDetails, PaymentBreakdown } from '../../types';
import { useAuth } from '../auth/AuthContext';

const TUITION_FEE = 40000; // ₦40,000/month
const ACCOMMODATION_FEE = 30000; // ₦30,000/month

const paymentSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in international format (e.g., +234...)'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  accommodation: z.boolean(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentForm() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown>({
    tuition: TUITION_FEE,
    total: TUITION_FEE
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
      accommodation: false
    }
  });

  const watchAccommodation = watch('accommodation');

  // Update payment breakdown when accommodation option changes
  React.useEffect(() => {
    const total = TUITION_FEE + (watchAccommodation ? ACCOMMODATION_FEE : 0);
    setPaymentBreakdown({
      tuition: TUITION_FEE,
      ...(watchAccommodation && { accommodation: ACCOMMODATION_FEE }),
      total
    });
  }, [watchAccommodation]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setError('');
      setIsProcessing(true);

      const paymentDetails: PaymentDetails = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country
        },
        accommodation: data.accommodation,
        totalAmount: paymentBreakdown.total
      };

      // Store payment details in session storage for recovery if needed
      sessionStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

    } catch (err) {
      setError('An error occurred while processing your payment. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Payment Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Information</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name (as shown on card)
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+234..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Address</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                {...register('street')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register('city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                {...register('state')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register('country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Accommodation Option */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Student Accommodation</h3>
                <p className="text-sm text-gray-500">Optional on-campus accommodation</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('accommodation')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Add accommodation (₦30,000/month)
              </label>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Tuition Fee (per month)</span>
              <span>₦{paymentBreakdown.tuition.toLocaleString()}</span>
            </div>
            
            {watchAccommodation && (
              <div className="flex justify-between text-gray-600">
                <span>Accommodation Fee (per month)</span>
                <span>₦{ACCOMMODATION_FEE.toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₦{paymentBreakdown.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <PaystackButton
            amount={paymentBreakdown.total}
            disabled={isProcessing}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </PaystackButton>
        </div>
      </form>
    </div>
  );
}