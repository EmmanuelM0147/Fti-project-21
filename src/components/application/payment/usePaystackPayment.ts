import { useCallback } from 'react';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../auth/AuthContext';
import { handleError } from '../../../lib/errors/ErrorHandler';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_PUBLIC_KEY) {
  console.warn('VITE_PAYSTACK_PUBLIC_KEY is not set. Payment functionality will be disabled.');
}

export interface PaystackProps {
  email: string;
  amount: number;
  name: string;
  phone: string;
  metadata: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export function usePaystackPayment() {
  const { user } = useAuth();

  const handleSuccess = async (response: any) => {
    try {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Store transaction details in Firestore
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        reference: response.reference,
        amount: response.amount / 100, // Convert back from kobo
        status: 'success',
        metadata: response.metadata,
        createdAt: new Date(),
      });

      // Clear stored payment details
      sessionStorage.removeItem('paymentDetails');

    } catch (error) {
      handleError(error, 'PaystackPayment.handleSuccess');
    }
  };

  const handleClose = () => {
    console.log('Payment modal closed');
  };

  return useCallback((config: PaystackProps) => {
    try {
      if (!PAYSTACK_PUBLIC_KEY) {
        throw new Error('Paystack public key not configured');
      }

      // Load Paystack inline script dynamically
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;

      script.onload = () => {
        const handler = (window as any).PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: config.email,
          amount: config.amount,
          currency: 'NGN',
          ref: `FTI_${Math.floor(Math.random() * 1000000000)}`,
          firstname: config.name.split(' ')[0],
          lastname: config.name.split(' ').slice(1).join(' '),
          phone: config.phone,
          metadata: config.metadata,
          callback: handleSuccess,
          onClose: handleClose,
          channels: ['card', 'bank', 'ussd', 'bank_transfer'],
        });

        handler.openIframe();
      };

      document.body.appendChild(script);

    } catch (error) {
      handleError(error, 'PaystackPayment.initializePayment');
    }
  }, [user]);
}