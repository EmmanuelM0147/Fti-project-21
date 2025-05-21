export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface AdmissionStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType;
}

export interface PaymentDetails {
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  accommodation: boolean;
  totalAmount: number;
}

export interface PaymentBreakdown {
  tuition: number;
  accommodation?: number;
  total: number;
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
    meta?: {
      accommodation: string;
      address: string;
    };
  };
  transaction_id?: string;
  tx_ref: string;
  flw_ref: string;
  currency: string;
  amount: number;
  charged_amount?: number;
  customer: {
    name: string;
    email: string;
    phone_number: string;
  };
  payment_type?: string;
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}