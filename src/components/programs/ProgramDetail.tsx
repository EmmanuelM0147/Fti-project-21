import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, BookOpen, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';
import { useProgram, useProgramCourses } from '../../lib/api/hooks';

export function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: program, isLoading: programLoading } = useProgram(id!);
  const { data: courses, isLoading: coursesLoading } = useProgramCourses(id!);

  if (programLoading || coursesLoading) {
    return <ProgramDetailSkeleton />;
  }

  if (!program) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Program not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={program.metadata.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
          alt={program.name}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {program.name}
          </h1>
          <p className="text-lg text-white/90 max-w-3xl">
            {program.description}
          </p>
        </div>
      </div>

      {/* Program Info */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Clock, label: 'Duration', value: program.metadata.duration },
          { icon: BookOpen, label: 'Level', value: program.metadata.level },
          { icon: Users, label: 'Capacity', value: `${program.capacity} students` },
          { icon: DollarSign, label: 'Tuition', value: `₦${program.metadata.price?.toLocaleString() ?? 'Free'}` }
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Curriculum */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Curriculum
        </h2>
        <div className="space-y-4">
          {courses?.map((course, index) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                  {course.prerequisites.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prerequisites:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {course.prerequisites.map((prereq, i) => (
                          <li key={i} className="flex items-center text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span className="text-sm">{course.credits} credits</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment CTA */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join our program and take the first step towards your future in technology.
          Limited spots available for the upcoming session.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 transition-colors"
            onClick={() => {/* Handle enrollment */}}
          >
            Enroll Now
          </button>
          <button
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => {/* Handle download */}}
          >
            Download Curriculum
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgramDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="mt-12 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}