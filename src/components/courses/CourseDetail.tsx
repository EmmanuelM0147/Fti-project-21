import React from 'react';
import { Clock, BookOpen, Users, Calendar, CheckCircle } from 'lucide-react';
import type { Course } from '../../lib/api/types';
import { LoadingSpinner } from '../LoadingSpinner';

interface CourseDetailProps {
  course?: Course;
  isLoading?: boolean;
}

export function CourseDetail({ course, isLoading = false }: CourseDetailProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {course.name}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {course.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {course.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Credits</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {course.credits} credits
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Flexible
                </p>
              </div>
            </div>
          </div>

          {course.prerequisites.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Prerequisites
              </h2>
              <ul className="space-y-3">
                {course.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {prerequisite}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <button
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              Enroll in Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}