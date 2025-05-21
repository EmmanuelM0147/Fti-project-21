import React from 'react';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import type { Course } from '../../lib/api/types';
import { LoadingSpinner } from '../LoadingSpinner';

interface CourseListProps {
  courses?: Course[];
  isLoading?: boolean;
  onCourseClick?: (courseId: string) => void;
}

// Type guard to validate course data
function isValidCourse(course: any): course is Course {
  return (
    course &&
    typeof course.id === 'string' &&
    typeof course.name === 'string' &&
    typeof course.description === 'string' &&
    typeof course.duration === 'string' &&
    typeof course.credits === 'number'
  );
}

export function CourseList({ courses = [], isLoading = false, onCourseClick }: CourseListProps) {
  // Add debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug('CourseList received courses:', courses);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No courses available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        {courses.map((course) => {
          // Validate course data before rendering
          if (!isValidCourse(course)) {
            console.error('Invalid course data:', course);
            return null;
          }

          return (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span className="text-sm">{course.credits} credits</span>
                    </div>
                  </div>
                </div>
                {onCourseClick && (
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => onCourseClick(course.id)}
                      className="w-full md:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      View Course
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}