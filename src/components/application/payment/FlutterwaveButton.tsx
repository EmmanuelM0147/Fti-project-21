import React, { useState, useCallback } from 'react';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import type { PaymentDetails, FlutterwaveResponse } from '../../../types';
import { useAuth } from '../../auth/AuthContext';
import { initializePayment } from '../../../lib/api/payment';

interface FlutterwaveButtonProps {
  paymentDetails: PaymentDetails;
  onSuccess: (response: FlutterwaveResponse) => void;
  onClose: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

export function FlutterwaveButton({ 
  paymentDetails, 
  onSuccess, 
  onClose, 
  onError,
  disabled = false 
}: FlutterwaveButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePayment = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Use user data with fallbacks
      const customerName = user?.displayName || paymentDetails.fullName || 'Anonymous Student';
      const customerEmail = user?.email || paymentDetails.email;
      
      if (!customerEmail) {
        throw new Error('Email is required for payment processing');
      }

      // Initialize payment
      const response = await initializePayment({
        ...paymentDetails,
        fullName: customerName,
        email: customerEmail
      });

      if (response.status === 'success' && response.data?.link) {
        // Redirect to Flutterwave checkout
        window.location.href = response.data.link;
      } else {
        throw new Error('Failed to initialize payment. Please try again.');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [paymentDetails, user, onError]);

  const retryPayment = () => {
    setError(null);
    handlePayment();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={retryPayment}
              className="text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ₦{paymentDetails.totalAmount.toLocaleString()} with Flutterwave
          </>
        )}
      </button>
    </div>
  );
}