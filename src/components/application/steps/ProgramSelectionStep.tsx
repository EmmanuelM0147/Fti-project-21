import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar, BookOpen, Clock } from 'lucide-react';
import type { ApplicationFormData } from '../../../lib/validation/application';

export function ProgramSelectionStep() {
  const { register, formState: { errors } } = useFormContext<ApplicationFormData>();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Program
        </label>
        <select
          {...register('programSelection.program')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select a program</option>
          <option value="computer-technology">Computer Technology</option>
          <option value="vocational-studies">Vocational Studies</option>
          <option value="construction-technologies">Construction Technologies</option>
        </select>
        {errors.programSelection?.program && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.program.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Course
        </label>
        <select
          {...register('programSelection.course')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select a course</option>
          <optgroup label="Computer Technology">
            <option value="comp-1">Computer Appreciation</option>
            <option value="comp-2">Computer Graphics</option>
            <option value="comp-3">Networking</option>
            <option value="comp-4">Web Development</option>
            <option value="comp-5">Mobile App Development</option>
          </optgroup>
          <optgroup label="Vocational Studies">
            <option value="voc-1">Plumbing-Pipe Fitting</option>
            <option value="voc-2">Welding & Fabrications</option>
            <option value="voc-3">Metal Folding Technology</option>
            <option value="voc-4">Electrical Installations</option>
          </optgroup>
          <optgroup label="Construction Technologies">
            <option value="const-1">Carpentry</option>
            <option value="const-2">Block-Laying and Concrete Works</option>
            <option value="const-3">Steel Fabrication</option>
            <option value="const-4">Tiling</option>
          </optgroup>
        </select>
        {errors.programSelection?.course && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.course.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Start Date
        </label>
        <div className="mt-1 relative">
          <input
            type="date"
            {...register('programSelection.startDate')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.programSelection?.startDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.startDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Study Mode
        </label>
        <select
          {...register('programSelection.studyMode')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select study mode</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="weekend">Weekend</option>
        </select>
        {errors.programSelection?.studyMode && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.studyMode.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Previous Experience (Optional)
        </label>
        <textarea
          {...register('programSelection.previousExperience')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe any relevant experience you have in this field..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Career Goals
        </label>
        <textarea
          {...register('programSelection.careerGoals')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="What are your career aspirations and how will this program help you achieve them?"
        />
        {errors.programSelection?.careerGoals && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.careerGoals.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProgramSelectionStep;