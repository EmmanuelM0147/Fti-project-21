import axios from 'axios';
import type { PaymentDetails, FlutterwaveResponse } from '../../types';

const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

interface PaymentError extends Error {
  response?: {
    status: number;
    data?: any;
  };
}

const getErrorMessage = (error: PaymentError): string => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return 'Invalid API key. Please contact support.';
      case 400:
        return error.response.data?.message || 'Invalid payment details. Please check and try again.';
      case 503:
        return 'Payment gateway is temporarily down. Please try again in a few moments.';
      default:
        return 'An error occurred while processing your payment. Please try again.';
    }
  }
  return 'Network error. Please check your connection and try again.';
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initializePayment = async (paymentDetails: PaymentDetails, retryCount = 0): Promise<FlutterwaveResponse> => {
  try {
    const payload = {
      tx_ref: `FTI-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      amount: paymentDetails.totalAmount,
      currency: 'NGN',
      redirect_url: `${window.location.origin}/apply/confirmation`,
      customer: {
        email: paymentDetails.email,
        name: paymentDetails.fullName,
        phonenumber: paymentDetails.phone
      },
      meta: {
        accommodation: paymentDetails.accommodation ? "Yes" : "No",
        address: `${paymentDetails.address.street}, ${paymentDetails.address.city}, ${paymentDetails.address.state}, ${paymentDetails.address.country}`
      },
      customizations: {
        title: 'FolioTech Institute',
        description: `Tuition${paymentDetails.accommodation ? ' and Accommodation' : ''} Payment`,
        logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg'
      }
    };

    console.log('Initializing payment with payload:', payload);

    const response = await axios.post(`${FLUTTERWAVE_BASE_URL}/payments`, payload, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Payment initialization response:', response.data);
    return response.data;

  } catch (error) {
    console.error('Payment initialization error:', error);
    
    const paymentError = error as PaymentError;
    
    // Retry on network errors or 503
    if (retryCount < MAX_RETRIES && 
        (!paymentError.response || paymentError.response.status === 503)) {
      console.log(`Retrying payment initialization (attempt ${retryCount + 1})`);
      await delay(RETRY_DELAY);
      return initializePayment(paymentDetails, retryCount + 1);
    }

    throw new Error(getErrorMessage(paymentError));
  }
};

export const verifyPayment = async (transactionId: string): Promise<FlutterwaveResponse> => {
  try {
    const response = await axios.get(
      `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Payment verification response:', response.data);
    return response.data;

  } catch (error) {
    console.error('Payment verification error:', error);
    const paymentError = error as PaymentError;
    throw new Error(getErrorMessage(paymentError));
  }
};