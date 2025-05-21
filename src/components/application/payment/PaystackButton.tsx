import React from 'react';
import { usePaystackPayment } from './usePaystackPayment';
import type { PaymentDetails } from '../../../types';

interface PaystackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  amount: number;
}

export function PaystackButton({ amount, children, ...props }: PaystackButtonProps) {
  const initializePayment = usePaystackPayment();

  const handlePayment = async () => {
    try {
      // Retrieve stored payment details
      const storedDetails = sessionStorage.getItem('paymentDetails');
      if (!storedDetails) {
        throw new Error('Payment details not found');
      }

      const paymentDetails: PaymentDetails = JSON.parse(storedDetails);

      // Initialize payment with Paystack
      await initializePayment({
        email: paymentDetails.email,
        amount: amount * 100, // Convert to kobo
        name: paymentDetails.fullName,
        phone: paymentDetails.phone,
        metadata: {
          custom_fields: [
            {
              display_name: "Accommodation",
              variable_name: "accommodation",
              value: paymentDetails.accommodation ? "Yes" : "No"
            }
          ]
        }
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      {...props}
    >
      {children}
    </button>
  );
}