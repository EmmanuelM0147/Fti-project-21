import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormData } from '../../../lib/validation/application';

export function EducationStep() {
  const { register, formState: { errors } } = useFormContext<ApplicationFormData>();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Education Level
        </label>
        <select
          {...register('academicBackground.educationLevel')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select education level</option>
          <option value="none">None</option>
          <option value="primary">Primary School</option>
          <option value="js">Junior Secondary</option>
          <option value="jsse">JSSE</option>
          <option value="ssce">SSCE</option>
          <option value="tertiary">Tertiary</option>
        </select>
        {errors.academicBackground?.educationLevel && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.academicBackground.educationLevel.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tertiary Education
        </label>
        <select
          {...register('academicBackground.tertiaryEducation')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="none">None</option>
          <option value="certificate">Certificate</option>
          <option value="national_diploma">National Diploma</option>
          <option value="degree">Degree (B.Sc/HND/BA/B.E)</option>
          <option value="other">Other</option>
        </select>
        {errors.academicBackground?.tertiaryEducation && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.academicBackground.tertiaryEducation.message}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Certificates
        </h3>
        {/* Certificate fields will be dynamically added here */}
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Certificate Type
                </label>
                <input
                  type="text"
                  {...register(`academicBackground.certificates.${index}.type`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade
                </label>
                <input
                  type="text"
                  {...register(`academicBackground.certificates.${index}.grade`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <input
                  type="text"
                  {...register(`academicBackground.certificates.${index}.year`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { EducationStep };