import React, { useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useApplicationStore } from '../../lib/store/applicationStore';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

export const FormNavigation = memo(function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
  onSubmit,
}: FormNavigationProps) {
  const { canProceedToNextStep } = useApplicationStore();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onPrevious();
  }, [onPrevious]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      onNext();
    }
  }, [isLastStep, onNext]);

  const handleSubmit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t 
        border-gray-200 dark:border-gray-700 px-4 py-4 md:py-6 z-40
        safe-area-bottom backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95
        shadow-lg dark:shadow-gray-900/20"
      role="group"
      aria-label="Form navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-6">
        <AnimatePresence mode="wait">
          {!isFirstStep && (
            <motion.button
              type="button"
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="min-w-[48px] md:min-w-[120px] h-12 inline-flex items-center justify-center
                px-3 md:px-6 border border-gray-300 dark:border-gray-600 rounded-lg 
                text-base font-medium text-gray-700 dark:text-gray-300 
                bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                dark:focus:ring-offset-gray-900 disabled:opacity-50 
                disabled:cursor-not-allowed transition-all duration-200
                active:scale-95 transform-gpu touch-manipulation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              aria-label="Go to previous step"
              aria-disabled={isSubmitting}
              data-testid="prev-button"
            >
              <ArrowLeft className="h-5 w-5 md:mr-2" aria-hidden="true" />
              <span className="hidden md:inline">Previous</span>
            </motion.button>
          )}
        </AnimatePresence>

        {isLastStep ? (
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceedToNextStep() || isSubmitting}
            className="flex-1 md:flex-none min-w-[48px] md:min-w-[120px] h-12 
              inline-flex items-center justify-center px-3 md:px-6
              border border-transparent rounded-lg text-base font-medium text-white
              bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              dark:focus:ring-offset-gray-900 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all duration-200
              active:scale-95 transform-gpu touch-manipulation"
            whileTap={{ scale: 0.95 }}
            aria-label="Submit application"
            aria-disabled={!canProceedToNextStep() || isSubmitting}
            data-testid="submit-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 
                  className="h-5 w-5 md:mr-2 animate-spin" 
                  aria-hidden="true"
                />
                <span className="hidden md:inline">Submitting...</span>
                <span className="md:hidden">Submitting...</span>
              </>
            ) : (
              <>
                <span className="hidden md:inline">Submit Application</span>
                <span className="md:hidden">Submit</span>
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={!canProceedToNextStep() || isSubmitting}
            className="flex-1 md:flex-none min-w-[48px] md:min-w-[120px] h-12 
              inline-flex items-center justify-center px-3 md:px-6
              border border-transparent rounded-lg text-base font-medium text-white
              bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              dark:focus:ring-offset-gray-900 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all duration-200
              active:scale-95 transform-gpu touch-manipulation"
            whileTap={{ scale: 0.95 }}
            aria-label="Go to next step"
            aria-disabled={!canProceedToNextStep() || isSubmitting}
            data-testid="next-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 
                  className="h-5 w-5 md:mr-2 animate-spin" 
                  aria-hidden="true"
                />
                <span className="hidden md:inline">Processing...</span>
                <span className="md:hidden">Processing...</span>
              </>
            ) : (
              <>
                <span className="hidden md:inline">Next</span>
                <span className="md:hidden">Next</span>
                <ArrowRight className="h-5 w-5 md:ml-2" aria-hidden="true" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
});

export default FormNavigation;