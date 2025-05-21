import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Monitor, Network, Globe, File as Mobile, LampDesk as Desktop, Radio, Bone as Drone, Cpu, Notebook as Robot, BookOpen, ChevronDown, ChevronUp, Check } from 'lucide-react';
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
    id: 'comp-1',
    title: 'Computer Appreciation',
    description: 'Master the fundamentals of computing and essential software applications.',
    icon: Monitor,
    duration: '3 months',
    benefits: [
      'Comprehensive understanding of computer hardware and software',
      'Proficiency in Microsoft Office Suite (Word, Excel, PowerPoint)',
      'File management and organization skills',
      'Internet research and online communication skills'
    ],
    advantages: [
      'Foundation for all other technology courses',
      'Improved productivity in academic and professional settings',
      'Essential skills for modern workplace environments',
      'Increased confidence in using technology'
    ]
  },
  {
    id: 'comp-2',
    title: 'Computer Graphics',
    description: 'Learn digital design principles and industry-standard graphic design tools.',
    icon: BookOpen,
    duration: '6 months',
    benefits: [
      'Mastery of Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
      'Understanding of design principles and color theory',
      'Digital illustration and photo manipulation skills',
      'Creation of print and digital marketing materials'
    ],
    advantages: [
      'Portfolio development for design careers',
      'Freelance opportunities in graphic design',
      'Skills applicable to marketing, advertising, and publishing industries',
      'Creative expression and artistic development'
    ]
  },
  {
    id: 'comp-3',
    title: 'Networking',
    description: 'Understand computer networks, protocols, and network security fundamentals.',
    icon: Network,
    duration: '6 months',
    benefits: [
      'Configuration of routers, switches, and network devices',
      'Implementation of network security measures',
      'Troubleshooting network issues and optimizing performance',
      'Understanding of TCP/IP, DNS, DHCP, and other protocols'
    ],
    advantages: [
      'High demand for network professionals in all industries',
      'Preparation for industry certifications (CompTIA Network+, Cisco CCNA)',
      'Essential skills for IT infrastructure roles',
      'Foundation for cybersecurity specialization'
    ]
  },
  {
    id: 'comp-4',
    title: 'Web Development',
    description: 'Build modern, responsive websites using latest web technologies.',
    icon: Globe,
    duration: '6 months',
    benefits: [
      'Front-end development with HTML, CSS, and JavaScript',
      'Back-end programming with Node.js and databases',
      'Responsive design for mobile and desktop platforms',
      'Deployment and hosting of web applications'
    ],
    advantages: [
      'High-demand skills in the job market',
      'Ability to create personal and professional websites',
      'Freelance opportunities in web development',
      'Foundation for specialized web technologies (React, Angular, Vue)'
    ]
  },
  {
    id: 'comp-5',
    title: 'Mobile App Development',
    description: 'Create native and cross-platform mobile applications.',
    icon: Mobile,
    duration: '6 months',
    benefits: [
      'Development for Android and iOS platforms',
      'Cross-platform development with React Native or Flutter',
      'UI/UX design for mobile interfaces',
      'App deployment to Google Play and App Store'
    ],
    advantages: [
      'Growing market for mobile applications',
      'Opportunity to create innovative solutions',
      'Potential for passive income through app monetization',
      'Skills applicable to entrepreneurial ventures'
    ]
  },
  {
    id: 'comp-6',
    title: 'Desktop Application Development',
    description: 'Develop powerful desktop applications using modern frameworks.',
    icon: Desktop,
    duration: '6 months',
    benefits: [
      'Programming with C#, Java, or Python',
      'GUI development with modern frameworks',
      'Database integration and data management',
      'Application packaging and distribution'
    ],
    advantages: [
      'Creation of business solutions and productivity tools',
      'Skills applicable to enterprise software development',
      'Foundation for systems programming',
      'Versatile programming knowledge transferable to other domains'
    ]
  },
  {
    id: 'comp-7',
    title: 'Radio/Router Configuration',
    description: 'Configure and manage network infrastructure equipment.',
    icon: Radio,
    duration: '3 months',
    benefits: [
      'Setup and configuration of wireless networks',
      'Implementation of network security protocols',
      'Optimization of signal strength and coverage',
      'Troubleshooting connectivity issues'
    ],
    advantages: [
      'Essential skills for network administration roles',
      'Applicable to home, business, and enterprise environments',
      'Foundation for telecommunications careers',
      'Preparation for wireless networking certifications'
    ]
  },
  {
    id: 'comp-8',
    title: 'Drone Technology',
    description: 'Learn drone operations, maintenance, and programming.',
    icon: Drone,
    duration: '3 months',
    benefits: [
      'Drone piloting and flight operations',
      'Aerial photography and videography',
      'Drone maintenance and repair',
      'Programming automated flight paths'
    ],
    advantages: [
      'Growing industry with diverse applications',
      'Skills applicable to surveying, agriculture, and media production',
      'Potential for specialized services in various industries',
      'Preparation for drone pilot certification'
    ]
  },
  {
    id: 'comp-9',
    title: 'Remote Control Systems',
    description: 'Design and implement remote control and automation systems.',
    icon: Cpu,
    duration: '3 months',
    benefits: [
      'Programming microcontrollers (Arduino, Raspberry Pi)',
      'Sensor integration and data collection',
      'Wireless communication protocols',
      'IoT device development'
    ],
    advantages: [
      'Skills applicable to home automation and smart systems',
      'Foundation for industrial automation careers',
      'Opportunity for innovative product development',
      'Practical application of electronics and programming'
    ]
  },
  {
    id: 'comp-10',
    title: 'Artificial Intelligence',
    description: 'Explore AI concepts, machine learning, and practical applications.',
    icon: Robot,
    duration: '6 months',
    benefits: [
      'Understanding of machine learning algorithms',
      'Data preprocessing and feature engineering',
      'Model training and evaluation',
      'Implementation of AI solutions for real-world problems'
    ],
    advantages: [
      'Cutting-edge skills in high demand across industries',
      'Ability to develop intelligent systems and automation',
      'Foundation for specialized AI roles (NLP, computer vision)',
      'Preparation for advanced study in AI and data science'
    ]
  }
];

export default function ComputerTechnology() {
  const navigate = useNavigate();
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const toggleCourseDetails = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const handleRegisterForCourse = (courseId: string) => {
    navigate('/apply', { state: { programId: 'computer-technology', courseId } });
  };

  const handleRegisterGeneral = () => {
    navigate('/apply', { state: { programId: 'computer-technology' } });
  };

  return (
    <>
      <Helmet>
        <title>Computer Technology Courses | FolioTech Institute</title>
        <meta name="description" content="Cutting-edge courses in computing, networking, and AI to prepare students for careers in the tech industry." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Computer Technology Courses
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Cutting-edge courses in computing, networking, and AI to prepare students for careers in the tech industry.
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