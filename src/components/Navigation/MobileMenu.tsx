import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Info } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useTourContext } from '../../context/TourContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onStartTour: () => void;
  user: any; // Adjust type based on your auth implementation
  onSignOut: () => void;
  items: Array<{
    title: string;
    href: string;
    children?: Array<{
      title: string;
      href: string;
    }>;
  }>;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  onSignIn, 
  onSignUp, 
  onStartTour,
  user, 
  onSignOut,
  items 
}: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);
  const { theme } = useTheme();
  const { startTour } = useTourContext();
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Focus first element
      firstFocusableRef.current?.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Handle tab key for focus trap
      if (event.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || [];
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      height: 0 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Navigation Menu */}
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-0 w-screen h-screen z-[9999] ${
              theme === 'dark' ? 'bg-[#1A2A44]' : 'bg-white'
            } transition-colors duration-300`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close Button */}
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className={`fixed top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full 
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 ${
                  theme === 'dark' 
                    ? 'text-white hover:bg-white/10 focus:ring-offset-[#1A2A44]' 
                    : 'text-[#1A2A44] hover:bg-black/10 focus:ring-offset-white'
                }`}
              aria-label="Close Navigation Menu"
            >
              <X className="w-6 h-6 transition-opacity duration-200 hover:opacity-80" />
            </button>

            {/* Navigation Items */}
            <nav className="h-full flex flex-col items-center justify-center">
              <ul className="space-y-10 text-center">
                {items.map((item, index) => (
                  <li key={item.title}>
                    {item.children ? (
                      <div className="space-y-4">
                        <button
                          onClick={() => setExpandedItem(
                            expandedItem === item.title ? null : item.title
                          )}
                          className={`group inline-flex items-center gap-2 
                            text-[clamp(18px,4vw,24px)] font-medium min-h-[44px] px-6 py-3 
                            rounded-lg transition-all duration-300 focus:outline-none 
                            focus:ring-2 focus:ring-blue-500 ${
                              expandedItem === item.title
                                ? 'bg-[#3B82F6] text-white'
                                : `${theme === 'dark' ? 'text-white' : 'text-[#1A2A44]'} 
                                   hover:bg-black/10 dark:hover:bg-white/10`
                            }`}
                          aria-expanded={expandedItem === item.title}
                          aria-controls={`${item.title}-dropdown`}
                        >
                          {item.title}
                          <ChevronDown 
                            className={`w-5 h-5 transition-transform duration-300 ${
                              expandedItem === item.title ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        <AnimatePresence>
                          {expandedItem === item.title && (
                            <motion.ul
                              id={`${item.title}-dropdown`}
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="space-y-4 overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <motion.li
                                  key={child.title}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    to={child.href}
                                    onClick={onClose}
                                    className={`inline-block text-[clamp(16px,3vw,20px)] 
                                      font-medium min-h-[44px] px-6 py-3 rounded-lg 
                                      transition-colors ${
                                        theme === 'dark' 
                                          ? 'text-white/90 hover:text-white' 
                                          : 'text-[#1A2A44]/90 hover:text-[#1A2A44]'
                                      } hover:bg-black/10 dark:hover:bg-white/10
                                      focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  >
                                    {child.title}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={`inline-block text-[clamp(18px,4vw,24px)] font-medium 
                          min-h-[44px] px-6 py-3 rounded-lg transition-colors ${
                            theme === 'dark' ? 'text-white' : 'text-[#1A2A44]'
                          } hover:bg-black/10 dark:hover:bg-white/10
                          focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
                
                {/* Tour Button */}
                <li>
                  <button
                    onClick={() => {
                      onClose();
                      onStartTour();
                    }}
                    className={`inline-flex items-center text-[clamp(18px,4vw,24px)] font-medium 
                      min-h-[44px] px-6 py-3 rounded-lg transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-[#1A2A44]'
                      } hover:bg-black/10 dark:hover:bg-white/10
                      focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Website Tour
                  </button>
                </li>
                
                {/* Add Sign In/Sign Out Button */}
                <li>
                  {user ? (
                    <button
                      onClick={() => {
                        onSignOut();
                        onClose();
                      }}
                      className={`inline-block text-[clamp(18px,4vw,24px)] font-medium 
                        min-h-[44px] px-6 py-3 rounded-lg transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-[#1A2A44]'
                        } hover:bg-black/10 dark:hover:bg-white/10
                        focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onSignIn();
                        onClose();
                      }}
                      className={`inline-block text-[clamp(18px,4vw,24px)] font-medium 
                        min-h-[44px] px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 
                        dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors
                        focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      ref={lastFocusableRef as React.RefObject<HTMLButtonElement>}
                    >
                      Sign In
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}