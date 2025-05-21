import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Define types for exam board data
interface ExamBoard {
  id: string;
  name: string;
  logoPath: string;
  altText: string;
}

interface ExamLogosProps {
  className?: string;
}

const ExamLogos: React.FC<ExamLogosProps> = ({ className = '' }) => {
  // Define exam boards with their details
  const examBoards: ExamBoard[] = [
    {
      id: 'jamb',
      name: 'JAMB',
      logoPath: './images/utme-logo.png',
      altText: 'Joint Admissions and Matriculation Board (JAMB) logo'
    },
    {
      id: 'neco',
      name: 'NECO',
      logoPath: './images/neco-logo.png',
      altText: 'National Examinations Council (NECO) logo'
    },
    {
      id: 'waec',
      name: 'WAEC',
      logoPath: './images/wassce.png',
      altText: 'West African Examinations Council (WAEC) logo'
    },
    {
      id: 'nabteb',
      name: 'NABTEB',
      logoPath: './images/nabteb.png',
      altText: 'National Business and Technical Examinations Board (NABTEB) logo'
    }
  ];

  // Track loading state for each image
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    examBoards.reduce((acc, board) => ({ ...acc, [board.id]: true }), {})
  );
  
  // Track error state for each image
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>(
    examBoards.reduce((acc, board) => ({ ...acc, [board.id]: false }), {})
  );

  // Handle successful image load
  const handleImageLoad = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    
    // Log successful load in development environment
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Successfully loaded ${id} logo`);
    }
  };

  // Handle image load error
  const handleImageError = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    setErrorStates(prev => ({ ...prev, [id]: true }));
    
    // Log error for monitoring
    console.error(`Failed to load ${id} logo`);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {examBoards.map((board) => (
        <motion.div
          key={board.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
          data-testid={`exam-logo-${board.id}`}
        >
          {/* Loading state */}
          {loadingStates[board.id] && (
            <div className="h-24 w-full flex items-center justify-center" aria-hidden="true">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error state */}
          {errorStates[board.id] && (
            <div className="h-24 w-full flex flex-col items-center justify-center text-red-500 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="mt-2 text-sm">Image unavailable</span>
            </div>
          )}

          {/* Image */}
          <img
            src={board.logoPath}
            alt={board.altText}
            className={`h-24 w-auto mx-auto mb-4 object-contain transition-opacity duration-300 ${
              loadingStates[board.id] || errorStates[board.id] ? 'hidden' : 'block'
            }`}
            onLoad={() => handleImageLoad(board.id)}
            onError={() => handleImageError(board.id)}
            loading="lazy"
            style={{ maxHeight: '96px' }}
          />

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center uppercase">
            {board.name}
          </h3>
        </motion.div>
      ))}
    </div>
  );
};

export default ExamLogos;