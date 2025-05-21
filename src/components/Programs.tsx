import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Code, Briefcase, Building, ArrowRight } from 'lucide-react';
import type { Course } from '../types';

const courses: Course[] = [
  {
    id: '1',
    title: 'Computer Technology',
    description: 'Master modern computer technology practices and principles with hands-on projects.',
    duration: '2 years',
    level: "Advanced Diploma",
    image: 'https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746299927/Computer_h9ofeq.jpg'
  },
  {
    id: '2',
    title: 'Vocational Studies',
    description: 'Hands-on training for practical skills, preparing individuals for career-focused industries.',
    duration: '2 years',
    level: "Advanced Diploma",
    image: 'https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302162/Knitting_udffuy.jpg'
  },
  {
    id: '3',
    title: 'Construction Technologies',
    description: 'Construction Technologies enhance efficiency and safety in construction through innovative digital solutions.',
    duration: '2 years',
    level: "Advanced Diploma",
    image: 'https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302102/Fur_bldbyp.jpg'
  }
];

const programIcons = {
  'Computer Technology': Code,
  'Vocational Studies': Briefcase,
  'Construction Technologies': Building
};

const getUrlSlug = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

export function Programs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      // Make the section focusable for accessibility
      sectionRef.current.tabIndex = -1;
      
      // Handle focus when scrolled into view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              sectionRef.current?.focus({ preventScroll: true });
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="featured-programs" 
      className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors scroll-mt-20"
      aria-label="Featured Programs"
      role="region"
      tabIndex={-1}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Featured Programs
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Choose from our industry-aligned programs designed to launch your career and get paid while learning at
FolioTech Institute
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const Icon = programIcons[course.title as keyof typeof programIcons];
            const programUrl = `/programs/${getUrlSlug(course.title)}`;

            return (
              <div
                key={course.id}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 bg-white dark:bg-gray-900"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {course.level}
                    </p>
                    <div className="mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                        {course.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Duration: {course.duration}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={programUrl}
                    className="mt-4 w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    aria-label={`View ${course.title} program details`}
                  >
                    View Program
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
