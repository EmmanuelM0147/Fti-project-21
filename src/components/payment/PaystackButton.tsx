import React from 'react';
import type { PaymentDetails } from '../../types';

interface PaystackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  amount: number;
}

export function PaystackButton({ amount, children, ...props }: PaystackButtonProps) {
  const handlePayment = async () => {
    try {
      // Retrieve stored payment details
      const storedDetails = sessionStorage.getItem('paymentDetails');
      if (!storedDetails) {
        throw new Error('Payment details not found');
      }

      const paymentDetails: PaymentDetails = JSON.parse(storedDetails);

      // Load Paystack inline script dynamically
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;

      script.onload = () => {
        const handler = (window as any).PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: paymentDetails.email,
          amount: amount * 100, // Convert to kobo
          currency: 'NGN',
          ref: `FTI_${Math.floor(Math.random() * 1000000000)}`,
          firstname: paymentDetails.fullName.split(' ')[0],
          lastname: paymentDetails.fullName.split(' ').slice(1).join(' '),
          phone: paymentDetails.phone,
          metadata: {
            custom_fields: [
              {
                display_name: "Accommodation",
                variable_name: "accommodation",
                value: paymentDetails.accommodation ? "Yes" : "No"
              }
            ]
          },
          callback: function(response: any) {
            console.log('Payment successful:', response);
            sessionStorage.removeItem('paymentDetails');
          },
          onClose: function() {
            console.log('Payment modal closed');
          }
        });
        handler.openIframe();
      };

      document.body.appendChild(script);
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