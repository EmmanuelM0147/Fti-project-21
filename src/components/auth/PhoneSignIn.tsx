import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, AlertCircle } from 'lucide-react';
import { auth, initializeRecaptcha } from '../../lib/firebase';
import {
  PhoneAuthProvider,
  signInWithPhoneNumber,
  ApplicationVerifier
} from 'firebase/auth';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface PhoneSignInProps {
  onSuccess: () => void;
}

export function PhoneSignIn({ onSuccess }: PhoneSignInProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<ApplicationVerifier | null>(null);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    const initRecaptcha = async () => {
      try {
        if (recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = await initializeRecaptcha(recaptchaContainerRef.current);
        }
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        setError('Failed to initialize phone authentication. Please try again.');
      }
    };

    initRecaptcha();

    // Cleanup reCAPTCHA when component unmounts
    return () => {
      if (recaptchaVerifierRef.current) {
        (recaptchaVerifierRef.current as any)?.clear?.();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  // Handle reCAPTCHA expiration
  useEffect(() => {
    const handleRecaptchaExpired = () => {
      setError('reCAPTCHA verification expired. Please try again.');
      setIsSubmitting(false);
    };

    window.addEventListener('recaptcha-expired', handleRecaptchaExpired);
    return () => window.removeEventListener('recaptcha-expired', handleRecaptchaExpired);
  }, []);

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    try {
      setError('');
      setIsSubmitting(true);

      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA not initialized');
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        data.phone,
        recaptchaVerifierRef.current
      );

      setVerificationId(confirmation.verificationId);
      setStep('otp');

      // Log successful phone number verification request (in development only)
      if (process.env.NODE_ENV === 'development') {
        console.debug('Phone verification code sent:', {
          phoneNumber: data.phone,
          verificationId: confirmation.verificationId
        });
      }

    } catch (error: any) {
      console.error('Phone verification error:', {
        code: error.code,
        message: error.message
      });

      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/invalid-phone-number':
          setError('Invalid phone number format. Please enter a valid phone number.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        case 'auth/quota-exceeded':
          setError('Service temporarily unavailable. Please try again later.');
          break;
        default:
          setError('Failed to send verification code. Please try again.');
      }

      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        (recaptchaVerifierRef.current as any)?.reset?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (data: OTPFormData) => {
    try {
      setError('');
      setIsSubmitting(true);

      if (!verificationId) {
        throw new Error('Verification session expired');
      }

      const credential = PhoneAuthProvider.credential(verificationId, data.otp);
      await auth.signInWithCredential(credential);

      onSuccess();

    } catch (error: any) {
      console.error('OTP verification error:', {
        code: error.code,
        message: error.message
      });

      switch (error.code) {
        case 'auth/invalid-verification-code':
          setError('Invalid verification code. Please try again.');
          break;
        case 'auth/code-expired':
          setError('Verification code has expired. Please request a new code.');
          setStep('phone');
          break;
        default:
          setError('Failed to verify code. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <div className="mt-1 relative">
              <input
                {...phoneForm.register('phone')}
                type="tel"
                id="phone"
                placeholder="+234..."
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {phoneForm.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Code
            </label>
            <input
              {...otpForm.register('otp')}
              type="text"
              id="otp"
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {otpForm.formState.errors.otp && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}