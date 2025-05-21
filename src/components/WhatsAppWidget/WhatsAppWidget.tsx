import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../BackToTop/useDebounce';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  threshold?: number;
}

export function WhatsAppWidget({
  phoneNumber = '+2347088616350',
  message = "Hi, I'd like to learn more about FolioTech Institute",
  className = '',
  threshold = 300,
}: WhatsAppWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollListenerRef = useRef<number>();

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
    const checkWhatsAppApp = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsNativeApp(isMobile);
    };

    try {
      checkWhatsAppApp();
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

  const handleClick = useCallback(() => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const url = isNativeApp
        ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
        : `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  }, [phoneNumber, message, isNativeApp]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`fixed z-50 flex items-center gap-3 px-4 py-3 rounded-full 
            bg-[#25D366] dark:bg-blue-600 hover:bg-[#22c15e] dark:hover:bg-blue-700 
            shadow-lg hover:shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90
            focus-within:ring-2 focus-within:ring-[#25D366] dark:focus-within:ring-blue-400 
            focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 
            cursor-pointer group transition-all duration-200 ${className}`}
          style={{
            bottom: '77px',
            right: '24px',
            touchAction: 'manipulation',
          }}
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.8 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          transition={{
            duration: 0.3,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
          role="button"
          tabIndex={0}
          aria-label="Chat with our tutors on WhatsApp"
          data-whatsapp-number={phoneNumber}
          data-message={message}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-white font-medium text-sm whitespace-nowrap"
          >
            Need Help?
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}