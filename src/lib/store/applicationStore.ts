import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { ApplicationFormData } from '../validation/application';

interface ApplicationState {
  // Form data
  formData: Partial<ApplicationFormData>;
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
  
  // Step completion status
  stepCompletion: Record<number, boolean>;
  
  // Actions
  setFormData: (data: Partial<ApplicationFormData>) => void;
  updateFormData: (data: Partial<ApplicationFormData>) => void;
  setCurrentStep: (step: number) => void;
  setStepCompletion: (step: number, isComplete: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setErrors: (errors: Record<string, string[]>) => void;
  resetForm: () => void;
  
  // Computed
  isCurrentStepValid: () => boolean;
  canProceedToNextStep: () => boolean;
}

const initialState = {
  formData: {},
  currentStep: 0,
  isSubmitting: false,
  errors: {},
  stepCompletion: {},
};

export const useApplicationStore = create<ApplicationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFormData: (data) =>
          set(() => ({
            formData: { ...data },
          })),

        updateFormData: (data) =>
          set((state) => ({
            formData: { ...state.formData, ...data },
          })),

        setCurrentStep: (step) =>
          set(() => ({ currentStep: step })),

        setStepCompletion: (step, isComplete) =>
          set((state) => ({
            stepCompletion: {
              ...state.stepCompletion,
              [step]: isComplete,
            },
          })),

        setIsSubmitting: (isSubmitting) =>
          set(() => ({ isSubmitting })),

        setErrors: (errors) =>
          set(() => ({ errors })),

        resetForm: () =>
          set(() => initialState),

        isCurrentStepValid: () => {
          const state = get();
          return state.stepCompletion[state.currentStep] || false;
        },

        canProceedToNextStep: () => {
          const state = get();
          return (
            state.stepCompletion[state.currentStep] &&
            !state.isSubmitting &&
            state.currentStep < 5 // Total number of steps - 1
          );
        },
      }),
      {
        name: 'application-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          formData: state.formData,
          currentStep: state.currentStep,
          stepCompletion: state.stepCompletion,
        }),
      }
    )
  )
);