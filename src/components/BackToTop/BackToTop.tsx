import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useDebounce } from './useDebounce';

interface BackToTopProps {
  threshold?: number;
  bottom?: number;
  right?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  bottom = 127, // Increased to accommodate WhatsApp button
  right = 24,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollListenerRef = useRef<number>();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Enhanced scroll handler with error handling and RAF
  const handleScroll = useDebounce(() => {
    try {
      if (scrollListenerRef.current) {
        cancelAnimationFrame(scrollListenerRef.current);
      }

      scrollListenerRef.current = requestAnimationFrame(() => {
        const shouldShow = window.scrollY > threshold;
        if (shouldShow !== isVisible) {
          setIsVisible(shouldShow);
        }
      });
    } catch (error) {
      console.error('Error handling scroll:', error);
    }
  }, 150);

  useEffect(() => {
    try {
      // Initial check
      handleScroll();

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollListenerRef.current) {
          cancelAnimationFrame(scrollListenerRef.current);
        }
      };
    } catch (error) {
      console.error('Error setting up scroll listener:', error);
    }
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    try {
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    } catch (error) {
      console.error('Error scrolling to top:', error);
      // Fallback to instant scroll
      window.scrollTo(0, 0);
    }
  }, [prefersReducedMotion]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`fixed rounded-full w-12 h-12 bg-gray-900/90 hover:bg-gray-800 
            flex items-center justify-center shadow-lg hover:shadow-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            dark:bg-gray-800/90 dark:hover:bg-gray-700/90 dark:focus:ring-offset-gray-900
            transition-all duration-200 ${className}`}
          style={{ 
            bottom: `${bottom}px`, 
            right: `${right}px`,
            zIndex: 49 // Set below WhatsApp button
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: 'easeOut'
          }}
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          aria-label="Scroll to top of page"
          role="button"
          tabIndex={0}
          data-testid="back-to-top-button"
        >
          <ChevronUp 
            className="w-6 h-6 text-white" 
            aria-hidden="true"
            data-testid="back-to-top-icon"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}