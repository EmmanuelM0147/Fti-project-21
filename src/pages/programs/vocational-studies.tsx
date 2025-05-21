import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wrench, Flame, Hammer, Zap, BrainCircuit as Circuit, Sofa, PenTool as Tool, Car, Palette, ChevronDown, ChevronUp, Check } from 'lucide-react';
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
    id: 'voc-1',
    title: 'Plumbing-Pipe Fitting',
    description: 'Learn professional plumbing techniques and pipe system installation.',
    icon: Wrench,
    duration: '6 months',
    benefits: [
      'Hands-on training with industry-standard tools and materials',
      'Installation and repair of water supply and drainage systems',
      'Blueprint reading and system design skills',
      'Troubleshooting and maintenance techniques'
    ],
    advantages: [
      'High demand for skilled plumbers in residential and commercial sectors',
      'Potential for self-employment and entrepreneurship',
      'Consistent work opportunities in construction and maintenance',
      'Skills applicable to industrial and specialized plumbing fields'
    ]
  },
  {
    id: 'voc-2',
    title: 'Welding & Fabrications',
    description: 'Master various welding techniques and metal fabrication.',
    icon: Flame,
    duration: '6 months',
    benefits: [
      'Proficiency in MIG, TIG, and stick welding processes',
      'Metal cutting, bending, and shaping techniques',
      'Blueprint reading and fabrication planning',
      'Safety protocols and equipment operation'
    ],
    advantages: [
      'Versatile skills applicable across manufacturing and construction',
      'Opportunities in automotive, aerospace, and energy sectors',
      'Potential for specialized certification and higher earnings',
      'Foundation for artistic metalwork and custom fabrication'
    ]
  },
  {
    id: 'voc-3',
    title: 'Metal Folding Technology',
    description: 'Learn precision metal folding and forming techniques.',
    icon: Hammer,
    duration: '3 months',
    benefits: [
      'Operation of press brakes and folding machines',
      'Sheet metal layout and pattern development',
      'Precision measurement and quality control',
      'Production of complex metal components'
    ],
    advantages: [
      'Specialized skills in high demand in manufacturing',
      'Applications in HVAC, automotive, and construction industries',
      'Complement to welding and fabrication skills',
      'Potential for custom metalwork and specialized production'
    ]
  },
  {
    id: 'voc-4',
    title: 'Electrical Installations & Maintenance',
    description: 'Install and maintain electrical systems safely and efficiently.',
    icon: Zap,
    duration: '6 months',
    benefits: [
      'Wiring installation for residential and commercial buildings',
      'Electrical panel and circuit breaker installation',
      'Troubleshooting electrical problems and safety hazards',
      'Understanding of electrical codes and regulations'
    ],
    advantages: [
      'Essential skills for construction and building maintenance',
      'Opportunities in renewable energy installation',
      'Pathway to specialized electrical work (industrial, marine)',
      'Foundation for advanced study in electrical engineering'
    ]
  },
  {
    id: 'voc-5',
    title: 'Integrated Circuits',
    description: 'Design and build electronic circuits and systems.',
    icon: Circuit,
    duration: '6 months',
    benefits: [
      'Circuit design and prototyping skills',
      'Component selection and system integration',
      'PCB layout and fabrication techniques',
      'Testing and troubleshooting electronic systems'
    ],
    advantages: [
      'Applications in consumer electronics and industrial automation',
      'Foundation for embedded systems development',
      'Skills transferable to IoT and smart device creation',
      'Preparation for careers in electronics manufacturing'
    ]
  },
  {
    id: 'voc-6',
    title: 'Exotic Furniture',
    description: 'Create unique, high-quality furniture pieces.',
    icon: Sofa,
    duration: '6 months',
    benefits: [
      'Woodworking techniques and joinery methods',
      'Material selection and preparation',
      'Furniture design principles and ergonomics',
      'Finishing and upholstery skills'
    ],
    advantages: [
      'Artisanal skills for custom furniture creation',
      'Potential for entrepreneurship in furniture design',
      'Preservation of traditional craftsmanship',
      'Combination of artistic expression and practical skills'
    ]
  },
  {
    id: 'voc-7',
    title: 'Electronics & Related Equipment Maintenance',
    description: 'Maintain and repair various electronic equipment.',
    icon: Tool,
    duration: '6 months',
    benefits: [
      'Diagnostic and troubleshooting methodologies',
      'Component-level repair techniques',
      'Preventive maintenance procedures',
      'Equipment calibration and testing'
    ],
    advantages: [
      'Applicable to consumer electronics, office equipment, and industrial systems',
      'Opportunities in service centers and maintenance departments',
      'Potential for specialized equipment repair (medical, scientific)',
      'Skills for extending the lifespan of electronic devices'
    ]
  },
  {
    id: 'voc-8',
    title: 'Automobile Maintenance (Mechanical)',
    description: 'Service and repair various types of vehicles.',
    icon: Car,
    duration: '6 months',
    benefits: [
      'Engine diagnostics and repair procedures',
      'Brake, suspension, and steering system maintenance',
      'Electrical system troubleshooting',
      'Preventive maintenance scheduling'
    ],
    advantages: [
      'Essential skills for automotive service industry',
      'Potential for specialization (diesel, hybrid, electric vehicles)',
      'Opportunities in fleet maintenance and transportation',
      'Foundation for automotive engineering studies'
    ]
  },
  {
    id: 'voc-9',
    title: 'Visual Arts',
    description: 'Develop artistic skills and creative techniques.',
    icon: Palette,
    duration: '3 months',
    benefits: [
      'Drawing, painting, and composition skills',
      'Color theory and visual communication principles',
      'Traditional and digital art techniques',
      'Portfolio development and presentation'
    ],
    advantages: [
      'Creative expression and personal artistic development',
      'Foundation for careers in illustration and fine arts',
      'Complementary skills for design and media production',
      'Opportunities in art education and community programs'
    ]
  }
];

export default function VocationalStudies() {
  const navigate = useNavigate();
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const toggleCourseDetails = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const handleRegisterForCourse = (courseId: string) => {
    navigate('/apply', { state: { programId: 'vocational-studies', courseId } });
  };

  const handleRegisterGeneral = () => {
    navigate('/apply', { state: { programId: 'vocational-studies' } });
  };

  return (
    <>
      <Helmet>
        <title>Vocational Studies Courses | FolioTech Institute</title>
        <meta name="description" content="Hands-on training in essential trades, preparing students for real-world careers in various industries." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Vocational Studies Courses
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hands-on training in essential trades, preparing students for real-world careers in various industries.
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