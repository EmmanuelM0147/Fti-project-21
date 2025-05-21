import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormData } from '../../../lib/validation/application';

export const PersonalInfoStep = memo(function PersonalInfoStep() {
  const { register, formState: { errors } } = useFormContext<ApplicationFormData>();

  // Calculate minimum date of birth for 18+ by February 27, 2025
  const minBirthDate = new Date('2025-02-27');
  minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);
  const maxDateString = minBirthDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Surname
          </label>
          <input
            type="text"
            {...register('personalInfo.surname')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.surname && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.surname.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            {...register('personalInfo.firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Middle Name (Optional)
          </label>
          <input
            type="text"
            {...register('personalInfo.middleName')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            {...register('personalInfo.email')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('personalInfo.phoneNumber')}
            placeholder="+234..."
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.phoneNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>
          <input
            type="date"
            max={maxDateString}
            {...register('personalInfo.dateOfBirth')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender
          </label>
          <select
            {...register('personalInfo.gender')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.personalInfo?.gender && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.gender.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Marital Status
          </label>
          <select
            {...register('personalInfo.maritalStatus')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
          </select>
          {errors.personalInfo?.maritalStatus && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.maritalStatus.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Contact Address
        </label>
        <textarea
          {...register('personalInfo.contactAddress')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        {errors.personalInfo?.contactAddress && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.personalInfo.contactAddress.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nationality
          </label>
          <input
            type="text"
            {...register('personalInfo.nationality')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.nationality && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.nationality.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            State of Origin
          </label>
          <input
            type="text"
            {...register('personalInfo.stateOfOrigin')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.personalInfo?.stateOfOrigin && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.personalInfo.stateOfOrigin.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Religion (Optional)
        </label>
        <input
          type="text"
          {...register('personalInfo.religion')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            {...register('personalInfo.disability.hasDisability')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Do you have any disability?
          </label>
        </div>

        {/* Show disability details field if hasDisability is checked */}
        {errors.personalInfo?.disability?.hasDisability && (
          <textarea
            {...register('personalInfo.disability.details')}
            placeholder="Please provide details about your disability..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        )}
      </div>
    </div>
  );
});

export default { PersonalInfoStep };