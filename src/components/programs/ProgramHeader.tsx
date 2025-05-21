import React from 'react';
import { Clock, Users, BookOpen, ChevronRight } from 'lucide-react';
import type { Program } from '../../lib/api/types';
import { LoadingSpinner } from '../LoadingSpinner';

interface ProgramHeaderProps {
  program?: Program;
  isLoading?: boolean;
}

export function ProgramHeader({ program, isLoading = false }: ProgramHeaderProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!program) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="h-64 sm:h-72 md:h-96 w-full">
          <img
            src={program.metadata.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
            alt={program.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {program.name}
            </h1>
            <p className="text-lg text-white/90 max-w-3xl">
              {program.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {program.metadata.duration || 'Flexible'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {program.capacity} students
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {program.metadata.level || 'All Levels'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
            Apply Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}