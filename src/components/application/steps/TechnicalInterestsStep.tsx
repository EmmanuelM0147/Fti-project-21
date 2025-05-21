import React, { useEffect } from 'react'; // Added useEffect for dynamic date
import { useFormContext } from 'react-hook-form';
import { Briefcase, Calendar } from 'lucide-react';
import type { ApplicationFormData } from '../../../lib/types/application';

const AVAILABLE_SKILLS = [
  'Aluminium Works',
  'Artificial Intelligence',
  'Automobile Maintenance (Mechanical)',
  'Block-Laying and Concrete Works',
  'Carpentry',
  'Computer Appreciation',
  'Computer Graphics',
  'Desktop Application Development',
  'Drone Technology',
  'Electrical Installations & Maintenance',
  'Electronics & Related Equipment Maintenance',
  'Exotic Furniture',
  'Integrated Circuits',
  'Metal Folding Technology',
  'Mobile App Development',
  'Networking',
  'Painting and Decorating',
  'Plumbing-Pipe Fitting',
  'POP (Plaster of Paris) Design',
  'Radio/Router Configuration',
  'Remote Control Systems',
  'Steel Fabrication',
  'Tiling',
  'Visual Arts',
  'Web Development',
  'Welding & Fabrications'
];

export function TechnicalInterestsStep() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>();
  const isEmployed = watch('technicalInterests.employmentStatus');

  // Dynamically set the minimum date to today
  const today = new Date().toISOString().split('T')[0]; // Formats to YYYY-MM-DD

  return (
    <div className="space-y-8">
      {/* Existing Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What technical skills do you already have?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AVAILABLE_SKILLS.map((skill) => (
            <div key={skill} className="flex items-center">
              <input
                type="checkbox"
                value={skill}
                {...register('technicalInterests.existingSkills')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {skill}
              </label>
            </div>
          ))}
        </div>
        {errors.technicalInterests?.existingSkills && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.technicalInterests.existingSkills.message}
          </p>
        )}
      </div>

      {/* Desired Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What skills would you like to learn?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AVAILABLE_SKILLS.map((skill) => (
            <div key={skill} className="flex items-center">
              <input
                type="checkbox"
                value={skill}
                {...register('technicalInterests.desiredSkills')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {skill}
              </label>
            </div>
          ))}
        </div>
        {errors.technicalInterests?.desiredSkills && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.technicalInterests.desiredSkills.message}
          </p>
        )}
      </div>

      {/* Employment Status */}
      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            {...register('technicalInterests.employmentStatus')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Are you currently employed?
          </label>
        </div>

        {isEmployed && (
          <div className="grid gap-4 md:grid-cols-2 pl-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Employer
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  {...register('technicalInterests.employmentDetails.employer')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                />
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Role
              </label>
              <input
                type="text"
                {...register('technicalInterests.employmentDetails.role')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Program Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Program Duration
        </label>
        <select
          {...register('technicalInterests.programDuration')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select duration</option>
          <option value="3_months">3 Months</option>
          <option value="6_months">6 Months</option>
          <option value="1_year">1 Year</option>
          <option value="3_years">3 Years</option>
          <option value="jamb_prep">JAMB Preparation</option>
        </select>
        {errors.technicalInterests?.programDuration && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.technicalInterests.programDuration.message}
          </p>
        )}
      </div>

      {/* Preferred Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          When would you like to start?
        </label>
        <div className="mt-1 relative">
          <input
            type="date"
            {...register('technicalInterests.preferredStartDate', {
              required: 'Please select a start date',
              validate: (value) => {
                return new Date(value) >= new Date(today) || 'Start date cannot be in the past';
              }
            })}
            min={today} // Sets the minimum selectable date to today
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.technicalInterests?.preferredStartDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.technicalInterests.preferredStartDate.message}
          </p>
        )}
      </div>

      {/* Career Interest */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What are your career goals?
        </label>
        <textarea
          {...register('technicalInterests.careerInterest')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe your career aspirations and how this program will help you achieve them..."
        />
        {errors.technicalInterests?.careerInterest && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.technicalInterests.careerInterest.message}
          </p>
        )}
      </div>
    </div>
  );
}
