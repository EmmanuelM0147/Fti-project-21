import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApplicationStore } from '../../lib/store/applicationStore';

interface FormProgressProps {
  steps: Array<{ id: string; title: string }>;
  currentStep: number;
  'aria-label'?: string;
}

export const FormProgress = memo(function FormProgress({ steps, currentStep, 'aria-label': ariaLabel }: FormProgressProps) {
  const { stepCompletion } = useApplicationStore();

  return (
    <nav aria-label={ariaLabel || "Progress"} className="mb-8">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => {
          const status = index === currentStep ? 'current' : index < currentStep ? 'complete' : 'upcoming';
          const isComplete = stepCompletion[index];

          return (
            <li key={step.id} className="md:flex-1">
              <div className="flex flex-col border-l-4 border-blue-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-blue-600">
                  Step {index + 1}
                </span>
                <span className="text-sm font-medium">
                  {step.title}
                </span>
                {isComplete && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-0.5 flex items-center text-sm font-medium text-green-500"
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    Complete
                  </motion.span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export default FormProgress;