import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../../components/auth/AuthContext';
import type { ApplicationFormData } from '../validation/application';
import { toast } from 'react-hot-toast';

interface SubmissionResult {
  success: boolean;
  message: string;
  applicationId?: string;
}

export function useApplicationSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData: ApplicationFormData): Promise<SubmissionResult> => {
    if (!user) {
      throw new Error('You must be signed in to submit an application');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare application data
      const applicationData = {
        user_id: user.id,
        personal_info: formData.personalInfo,
        academic_background: formData.academicBackground,
        program_selection: formData.programSelection,
        accommodation: formData.accommodation,
        referee: formData.referee,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert application into Supabase
      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Show success notification
      toast.success('Application submitted successfully!');

      // Return success result
      return {
        success: true,
        message: 'Application submitted successfully',
        applicationId: data.id
      };

    } catch (err) {
      // Handle errors
      console.error('Application submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      
      // Show error notification
      toast.error(errorMessage);
      
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      // Return error result
      return {
        success: false,
        message: errorMessage
      };

    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setError(null);
    setIsSubmitting(false);
  }, []);

  return {
    handleSubmit,
    resetForm,
    isSubmitting,
    error
  };
}