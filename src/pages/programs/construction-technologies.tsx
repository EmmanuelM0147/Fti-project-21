import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hammer, Blocks, Construction, Grid, Box, Paintbrush, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  duration: string;
  benefits: string[];
  advantages: string[];
}

const courses: Course[] = [
  {
    id: 'const-1',
    title: 'Carpentry',
    description: 'Learn woodworking techniques and furniture construction.',
    icon: Hammer,
    duration: '6 months',
    benefits: [
      'Mastery of hand and power tools for woodworking',
      'Joinery techniques and structural assembly methods',
      'Blueprint reading and project planning',
      'Finishing techniques for professional results'
    ],
    advantages: [
      'Essential skills for construction and renovation projects',
      'Opportunities in furniture making and custom woodworking',
      'Potential for self-employment and entrepreneurship',
      'Transferable skills applicable to various construction trades'
    ]
  },
  {
    id: 'const-2',
    title: 'Block-Laying and Concrete Works',
    description: 'Master the fundamentals of construction and concrete work.',
    icon: Blocks,
    duration: '6 months',
    benefits: [
      'Proper mixing and pouring of concrete for various applications',
      'Block and brick laying techniques for walls and structures',
      'Foundation construction and reinforcement methods',
      'Concrete finishing and decorative techniques'
    ],
    advantages: [
      'High demand in residential and commercial construction',
      'Essential skills for infrastructure development projects',
      'Opportunities for specialization in decorative concrete',
      'Foundation for advanced construction management roles'
    ]
  },
  {
    id: 'const-3',
    title: 'Steel Fabrication',
    description: 'Learn metal fabrication and welding techniques.',
    icon: Construction,
    duration: '6 months',
    benefits: [
      'Cutting, shaping, and joining steel components',
      'Welding techniques for structural applications',
      'Blueprint reading and fabrication planning',
      'Quality control and safety procedures'
    ],
    advantages: [
      'Critical skills for modern construction projects',
      'Applications in industrial and commercial building',
      'Opportunities in infrastructure and manufacturing sectors',
      'Potential for specialized structural steel work'
    ]
  },
  {
    id: 'const-4',
    title: 'Tiling',
    description: 'Master the art of tile installation and design.',
    icon: Grid,
    duration: '3 months',
    benefits: [
      'Surface preparation and substrate evaluation',
      'Precision cutting and fitting of various tile materials',
      'Pattern layout and design implementation',
      'Grouting, sealing, and finishing techniques'
    ],
    advantages: [
      'High-demand finishing skill in construction and renovation',
      'Opportunities for artistic expression in custom installations',
      'Potential for specialization in luxury and decorative tiling',
      'Applicable to residential, commercial, and hospitality sectors'
    ]
  },
  {
    id: 'const-5',
    title: 'Aluminium Works',
    description: 'Learn aluminum fabrication and installation.',
    icon: Box,
    duration: '3 months',
    benefits: [
      'Cutting, shaping, and joining aluminum profiles',
      'Window, door, and partition system installation',
      'Hardware selection and integration',
      'Weatherproofing and finishing techniques'
    ],
    advantages: [
      'Growing demand in modern architectural applications',
      'Energy-efficient building envelope solutions',
      'Opportunities in residential and commercial construction',
      'Skills applicable to custom architectural elements'
    ]
  },
  {
    id: 'const-6',
    title: 'POP (Plaster of Paris) Design',
    description: 'Create decorative ceiling and wall designs.',
    icon: Construction,
    duration: '3 months',
    benefits: [
      'Material preparation and application techniques',
      'Mold making and casting methods',
      'Design principles for architectural elements',
      'Installation and finishing of decorative features'
    ],
    advantages: [
      'Artistic skills for interior design applications',
      'High-value finishing work for luxury properties',
      'Opportunities for custom residential and commercial projects',
      'Potential for specialization in heritage restoration'
    ]
  },
  {
    id: 'const-7',
    title: 'Painting and Decorating',
    description: 'Learn professional painting and finishing techniques.',
    icon: Paintbrush,
    duration: '3 months',
    benefits: [
      'Surface preparation and problem identification',
      'Paint selection and application methods',
      'Decorative finishing techniques (texturing, faux finishes)',
      'Color theory and scheme development'
    ],
    advantages: [
      'Essential finishing skills for all construction projects',
      'Opportunities in residential and commercial sectors',
      'Potential for specialization in decorative and artistic finishes',
      'Relatively low startup costs for entrepreneurship'
    ]
  }
];

export default function ConstructionTechnologies() {
  const navigate = useNavigate();
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const toggleCourseDetails = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const handleRegisterForCourse = (courseId: string) => {
    navigate('/apply', { state: { programId: 'construction-technologies', courseId } });
  };

  const handleRegisterGeneral = () => {
    navigate('/apply', { state: { programId: 'construction-technologies' } });
  };

  return (
    <>
      <Helmet>
        <title>Construction Technologies Courses | FolioTech Institute</title>
        <meta name="description" content="Practical training in construction trades, helping students build a solid career in the industry." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Construction Technologies Courses
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Practical training in construction trades, helping students build a solid career in the industry.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const Icon = course.icon;
              const isExpanded = expandedCourseId === course.id;
              
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Duration: {course.duration}
                      </span>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                        onClick={() => toggleCourseDetails(course.id)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Show Less' : 'Learn More'}
                        {isExpanded ? (
                          <ChevronUp className="ml-1.5 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1.5 h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Key Benefits
                              </h4>
                              <ul className="space-y-2">
                                {course.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Career Advantages
                              </h4>
                              <ul className="space-y-2">
                                {course.advantages.map((advantage, index) => (
                                  <li key={index} className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                                    <span className="text-gray-600 dark:text-gray-400">{advantage}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <button
                              className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
                              onClick={() => handleRegisterForCourse(course.id)}
                            >
                              Register for this Course
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <button
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              onClick={handleRegisterGeneral}
            >
              Register for a Course
            </button>
          </div>
        </div>
      </div>
    </>
  );
}