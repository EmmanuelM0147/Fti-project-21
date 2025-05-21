import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTourContext } from '../context/TourContext';

interface HeroProps {
  onApplyClick: () => void;
}

export default function Hero({ onApplyClick }: HeroProps) {
  const navigate = useNavigate();
  const { startTour } = useTourContext();

  const handleExplorePrograms = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const programsSection = document.getElementById('featured-programs');
    if (programsSection) {
      const headerOffset = 80;
      const elementPosition = programsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      programsSection.focus();
    }
  };

  const handleApplyNow = () => {
    navigate('/apply');
  };

  const handleStartTour = () => {
    startTour();
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden min-h-screen">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="tracking-tight font-extrabold text-gray-900 dark:text-white">
                <span className="block text-4xl sm:text-5xl md:text-6xl text-blue-600 dark:text-blue-400 mt-2">
                  FolioTech Institute
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg md:mt-5 md:text-xl leading-relaxed max-w-xl">
                Empowering the next generation of tech leaders through cutting-edge education, 
                industry partnerships, and hands-on learning experiences.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyNow}
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg text-white 
                    bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                    transition-colors md:py-4 md:text-lg md:px-10 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    dark:focus:ring-offset-gray-900 shadow-md"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExplorePrograms}
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg 
                    text-blue-600 dark:text-blue-400 bg-transparent 
                    border-2 border-blue-600 dark:border-blue-400 
                    hover:bg-blue-50 dark:hover:bg-blue-900/20 
                    transition-colors md:py-4 md:text-lg md:px-10
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    dark:focus:ring-offset-gray-900"
                >
                  Explore Programs
                </motion.button>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleStartTour}
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Take a website tour
                </button>
              </div>
            </motion.div>
            <div className="mt-8 lg:mt-0">
              <img 
                src="https://res.cloudinary.com/dtzv2ckwm/image/upload/v1747841581/ae174457-7bf4-4911-b9a3-1cce89b1bcf5_x3zyz3.jpg"
                alt="Students collaborating in a modern tech environment with hands-on circuit board work"
                className="w-full h-48 sm:h-72 md:h-96 object-cover rounded-lg lg:h-full"
                loading="lazy"
                srcSet="
                  https://res.cloudinary.com/dtzv2ckwm/image/upload/v1747841581/ae174457-7bf4-4911-b9a3-1cce89b1bcf5_x3zyz3.jpg 800w,
                  https://res.cloudinary.com/dtzv2ckwm/image/upload/v1747841581/ae174457-7bf4-4911-b9a3-1cce89b1bcf5_x3zyz3.jpg 1200w,
                  https://res.cloudinary.com/dtzv2ckwm/image/upload/v1747841581/ae174457-7bf4-4911-b9a3-1cce89b1bcf5_x3zyz3.jpg 2070w
                "
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };