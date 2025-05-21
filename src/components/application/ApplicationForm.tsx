import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock } from 'lucide-react';
import { applicationSchema, type ApplicationFormData } from '../../lib/validation/application';
import { useApplicationStore } from '../../lib/store/applicationStore';
import { submitApplication, saveDraft } from '../../lib/api/applications';
import { FormProgress } from './FormProgress';
import { FormNavigation } from './FormNavigation';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';

// Lazy load form steps
const PersonalInfoStep = lazy(() => import('./steps/PersonalInfoStep').then(module => ({ default: module.PersonalInfoStep })));
const AcademicBackgroundStep = lazy(() => import('./steps/EducationStep').then(module => ({ default: module.EducationStep })));
const ProgramSelectionStep = lazy(() => import('./steps/ProgramSelectionStep').then(module => ({ default: module.ProgramSelectionStep })));
const AccommodationStep = lazy(() => import('./steps/AccommodationStep').then(module => ({ default: module.AccommodationStep })));
const RefereeStep = lazy(() => import('./steps/RefereeStep').then(module => ({ default: module.RefereeStep })));

const StepLoadingFallback = () => (
  <div className="min-h-[300px] flex items-center justify-center">
    <LoadingSpinner size="md" message="Loading form..." />
  </div>
);

const formSteps = [
  { id: 'personal', title: 'Personal Information', component: PersonalInfoStep },
  { id: 'academic', title: 'Academic Background', component: AcademicBackgroundStep },
  { id: 'program', title: 'Program Selection', component: ProgramSelectionStep },
  { id: 'accommodation', title: 'Accommodation', component: AccommodationStep },
  { id: 'referee', title: 'Referee', component: RefereeStep },
];

interface ApplicationFormProps {
  onSubmit?: (data: ApplicationFormData) => void;
  programId?: string;
  courseId?: string;
  draftId?: string;
}

export function ApplicationForm({ onSubmit, programId, courseId, draftId }: ApplicationFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const { 
    currentStep, 
    setCurrentStep, 
    formData, 
    updateFormData, 
    resetForm, 
    setStepCompletion 
  } = useApplicationStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);
  
  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: formData,
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors }, trigger, getValues, reset } = methods;

  const validateStep = useCallback(async () => {
    const fields = Object.keys(getValues());
    const currentStepId = formSteps[currentStep].id;
    const currentStepFields = fields.filter(field => 
      field.startsWith(currentStepId)
    );
    
    return await trigger(currentStepFields as any);
  }, [currentStep, trigger, getValues]);

  useEffect(() => {
    const validateCurrentStep = async () => {
      const isStepValid = await validateStep();
      setStepCompletion(currentStep, isStepValid);
    };
    
    validateCurrentStep();
  }, [currentStep, validateStep, setStepCompletion]);

  const handleFormChange = useCallback(() => {
    const currentValues = getValues();
    updateFormData(currentValues);
  }, [getValues, updateFormData]);

  useEffect(() => {
    const subscription = methods.watch(handleFormChange);
    return () => subscription.unsubscribe();
  }, [methods, handleFormChange]);

  // Auto-save draft when form data changes
  useEffect(() => {
    const autoSaveDraft = async () => {
      if (!user || Object.keys(formData).length === 0) return;
      
      try {
        setDraftSaving(true);
        const result = await saveDraft(formData, currentDraftId);
        if (result.success) {
          setCurrentDraftId(result.draftId);
          setDraftSaved(true);
          // Hide the "Draft saved" message after 3 seconds
          setTimeout(() => setDraftSaved(false), 3000);
        }
      } catch (error) {
        console.error('Error auto-saving draft:', error);
      } finally {
        setDraftSaving(false);
      }
    };

    // Use debounce to avoid too many saves
    const debounceTimer = setTimeout(autoSaveDraft, 2000);
    return () => clearTimeout(debounceTimer);
  }, [formData, currentDraftId, user]);

  const handleFormSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Add program and course IDs if provided
      const submissionData = {
        ...data,
        programId,
        courseId
      };
      
      // If custom onSubmit is provided, use it
      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Submit to Supabase
        const result = await submitApplication(submissionData);
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        toast.success('Application submitted successfully!');
      }
      
      setSubmissionSuccess(true);
      resetForm();
      reset();
      
      setTimeout(() => {
        navigate('/applications');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      reset(formData);
    }
  }, []);

  if (submissionSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted Successfully</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your application. We will review your information and contact you soon.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Redirecting to applications page...
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="space-y-8"
        noValidate
        aria-label="Student Application Form"
      >
        {/* Fee Waiver Banner */}
        <div className="bg-[#34A853] text-white p-4 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5" />
            <div className="text-center">
              <h3 className="font-bold text-lg">LIMITED TIME OFFER: Application Fee Waived!</h3>
              <p className="text-sm opacity-90">Start your academic journey at FolioTech Institute with no application fees</p>
            </div>
          </div>
        </div>

        <FormProgress 
          steps={formSteps} 
          currentStep={currentStep} 
          aria-label="Form Progress"
        />

        {/* Draft saved indicator */}
        {draftSaved && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Draft saved
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 px-4 py-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            role="group"
            aria-label={formSteps[currentStep].title}
          >
            <Suspense fallback={<StepLoadingFallback />}>
              {React.createElement(formSteps[currentStep].component)}
            </Suspense>
          </motion.div>
        </AnimatePresence>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={formSteps.length}
          onPrevious={() => setCurrentStep(currentStep - 1)}
          onNext={() => setCurrentStep(currentStep + 1)}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(handleFormSubmit)}
        />

        {isSubmitting && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="alert"
            aria-busy="true"
          >
            <LoadingSpinner size="lg" message="Submitting application..." />
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default ApplicationForm;