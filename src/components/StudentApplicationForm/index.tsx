import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { StudentFormData } from '../../types/student';
import { applicationFormSchema } from './ValidationSchema';
import { PersonalInfo } from './FormSteps/PersonalInfo';
import { motion, AnimatePresence } from 'framer-motion';

const initialValues: StudentFormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    nationality: '',
    stateOfOrigin: '',
  },
  academicBackground: {
    highestQualification: '',
    institution: '',
    graduationYear: '',
    grade: '',
    otherCertifications: [],
  },
  programSelection: {
    program: '',
    course: '',
    startDate: '',
    studyMode: 'full-time',
  },
  accommodation: {
    required: false,
  },
  referee: {
    name: '',
    relationship: '',
    organization: '',
    email: '',
    phone: '',
  },
};

export const StudentApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: StudentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const studentData = {
        ...values,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'students'), studentData);
      console.log('Application submitted with ID:', docRef.id);

      // Handle success (e.g., show success message, redirect)

    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Formik
        initialValues={initialValues}
        validationSchema={applicationFormSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <PersonalInfo />}
                {/* Add other steps */}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0 || isSubmitting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                Previous
              </button>

              {currentStep === 4 ? (
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!isValid || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};