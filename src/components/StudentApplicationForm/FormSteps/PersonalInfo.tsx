import React from 'react';
import { useFormikContext } from 'formik';
import { StudentFormData } from '../../../types/student';

export const PersonalInfo: React.FC = () => {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<StudentFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="personalInfo.firstName"
            value={values.personalInfo.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {touched.personalInfo?.firstName && errors.personalInfo?.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="personalInfo.lastName"
            value={values.personalInfo.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {touched.personalInfo?.lastName && errors.personalInfo?.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName}</p>
          )}
        </div>

        {/* Add other personal info fields similarly */}
      </div>
    </div>
  );
};