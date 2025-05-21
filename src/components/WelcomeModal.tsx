import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Info, BookOpen, GraduationCap } from 'lucide-react';
import { useTour } from '../hooks/useTour';

interface WelcomeModalProps {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour } = useTour();
  
  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('fti_has_visited');
    
    if (!hasVisited) {
      setIsOpen(true);
    }
    
    // Set visited flag
    localStorage.setItem('fti_has_visited', 'true');
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };
  
  const handleStartTour = () => {
    handleClose();
    // Start the tour after modal closes
    setTimeout(() => {
      startTour();
    }, 500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Circles */}
              <motion.div
                className="absolute w-32 h-32 rounded-full bg-[#1E3A8A]/10"
                initial={{ x: '10%', y: '10%' }}
                animate={{ 
                  x: ['10%', '15%', '10%'], 
                  y: ['10%', '15%', '10%'] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              <motion.div
                className="absolute w-48 h-48 rounded-full bg-[#FFD700]/10"
                initial={{ x: '70%', y: '20%' }}
                animate={{ 
                  x: ['70%', '65%', '70%'], 
                  y: ['20%', '25%', '20%'] 
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              <motion.div
                className="absolute w-24 h-24 rounded-full bg-[#1E3A8A]/10"
                initial={{ x: '30%', y: '70%' }}
                animate={{ 
                  x: ['30%', '35%', '30%'], 
                  y: ['70%', '65%', '70%'] 
                }}
                transition={{ 
                  duration: 9, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              
              {/* Rectangles */}
              <motion.div
                className="absolute w-40 h-20 rounded-lg bg-[#FFD700]/10 rotate-12"
                initial={{ x: '60%', y: '60%' }}
                animate={{ 
                  x: ['60%', '55%', '60%'], 
                  y: ['60%', '65%', '60%'],
                  rotate: [12, 15, 12]
                }}
                transition={{ 
                  duration: 12, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              <motion.div
                className="absolute w-32 h-16 rounded-lg bg-[#1E3A8A]/10 -rotate-12"
                initial={{ x: '20%', y: '40%' }}
                animate={{ 
                  x: ['20%', '25%', '20%'], 
                  y: ['40%', '35%', '40%'],
                  rotate: [-12, -15, -12]
                }}
                transition={{ 
                  duration: 11, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            </div>
            
            {/* Modal */}
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300 z-10"
                aria-label="Close welcome modal"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Header */}
              <div className="bg-[#1E3A8A] text-white p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold">Welcome to FolioTech Institute</h2>
                <p className="mt-2 text-blue-100">Empowering the next generation of tech leaders</p>
              </div>
              
              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Thank you for visiting FolioTech Institute! We're dedicated to providing cutting-edge education in technology and vocational skills.
                  </p>
                  
                  <div className="my-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-[#1E3A8A]">
                    <h3 className="text-[#1E3A8A] dark:text-blue-300 font-semibold flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      What makes us unique
                    </h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start">
                        <BookOpen className="h-5 w-5 text-[#1E3A8A] dark:text-blue-300 mr-2 mt-0.5" />
                        <span>Industry-led curriculum designed for real-world application</span>
                      </li>
                      <li className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-[#1E3A8A] dark:text-blue-300 mr-2 mt-0.5" />
                        <span>Expert instructors with proven industry experience</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-[#1E3A8A] dark:text-blue-300 mr-2 mt-0.5" />
                        <span>Strong partnerships with leading tech companies</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Would you like a quick tour of our website to learn more about what we offer?
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-end">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={handleStartTour}
                    className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 transition-colors duration-300 flex items-center justify-center"
                  >
                    Yes, Show Me Around
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default WelcomeModal;