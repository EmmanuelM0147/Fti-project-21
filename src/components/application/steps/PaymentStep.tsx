import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FlutterwaveButton } from '../payment/FlutterwaveButton';
import { AlertCircle } from 'lucide-react';
import type { PaymentDetails, FlutterwaveResponse } from '../../../types';

export function PaymentStep() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { getValues } = useFormContext();

  const handlePaymentSuccess = async (response: FlutterwaveResponse) => {
    try {
      console.log('Payment successful:', response);
      
      // Store transaction details for verification
      sessionStorage.setItem('payment_pending', JSON.stringify({
        transactionId: response.transaction_id || response.tx_ref,
        amount: response.amount,
        status: response.status,
        customer: response.customer,
        tx_ref: response.tx_ref
      }));

      // Redirect to confirmation page
      navigate('/apply/confirmation');
    } catch (err) {
      console.error('Error handling payment success:', err);
      setError('Failed to process successful payment. Please contact support.');
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setError(error.message || 'Payment failed. Please try again.');
    setIsProcessing(false);
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
  };

  const getPaymentDetails = (): PaymentDetails => {
    const formData = getValues();
    return {
      fullName: formData.personalInfo.firstName + ' ' + formData.personalInfo.surname,
      email: formData.personalInfo.email,
      phone: formData.personalInfo.phoneNumber,
      address: {
        street: formData.personalInfo.contactAddress,
        city: '',
        state: formData.personalInfo.stateOfOrigin,
        country: formData.personalInfo.nationality
      },
      accommodation: formData.accommodation?.needsAccommodation || false,
      totalAmount: formData.accommodation?.needsAccommodation ? 100000 : 70000 // ₦100k with accommodation, ₦70k without
    };
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Summary
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tuition Fee</span>
            <span>₦40,000</span>
          </div>
          
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Student Allowance</span>
            <span>₦30,000</span>
          </div>
          
          {getPaymentDetails().accommodation && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Accommodation</span>
              <span>₦30,000</span>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
              <span>Total Amount</span>
              <span>₦{getPaymentDetails().totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <FlutterwaveButton
        paymentDetails={getPaymentDetails()}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onClose={handlePaymentClose}
        disabled={isProcessing}
      />
    </div>
  );
}