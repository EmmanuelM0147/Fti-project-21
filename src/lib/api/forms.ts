import axios from 'axios';
import type { PartnershipFormData, GivingFormData } from '../validation/forms';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const submitPartnershipForm = async (data: PartnershipFormData) => {
  try {
    const response = await axios.post(`${API_URL}/api/partnership-inquiry`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit partnership inquiry');
    }
    throw error;
  }
};

export const submitGivingForm = async (data: GivingFormData) => {
  try {
    const response = await axios.post(`${API_URL}/api/give-form`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit giving inquiry');
    }
    throw error;
  }
};