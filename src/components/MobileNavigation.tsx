import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Home, Briefcase, Mail, Shield, GraduationCap, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "./auth/AuthContext";
import { ThemeToggle } from "./ThemeProvider";
import { NavItem } from "../types";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileNavigation({ isOpen, onClose, navItems }: MobileNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setExpandedItem(null);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        if (!document.activeElement) return;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            event.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            event.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        navigate('/', { state: { scrollTo: targetId } });
      }
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (location.pathname === path || (path === '/' && location.pathname === '')) {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  const toggleExpandItem = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  const drawerVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const backdropVariants = {
    closed: { opacity: 0, transition: { duration: 0.2 } },
    open: { opacity: 1, transition: { duration: 0.3 } }
  };

  const submenuVariants = {
    closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
    open: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }
  };

  const getNavIcon = (title: string) => {
    switch (title) {
      case 'Home':
        return Home;
      case 'Programs':
        return BookOpen;
      case 'About':
        return User;
      case 'Admissions':
        return GraduationCap;
      case 'Support':
        return HelpCircle;
      case 'Contact':
        return Mail;
      default:
        return ChevronDown;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            aria-hidden="true"
            onClick={onClose}
          />

          <motion.div
            ref={drawerRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1a2a44] shadow-xl z-50 flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            {/* Header - Sticky */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-600 bg-[#1a2a44] shadow-sm">
              <h2 id="mobile-menu-title" className="text-xl font-semibold text-white">FolioTech Institute</h2>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button
                  ref={firstFocusableRef}
                  onClick={onClose}
                  className="p-2 text-gray-300 hover:text-white rounded-lg transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* User Profile Section (if logged in) */}
            {user && (
              <div className="p-4 border-b border-gray-600">
                <div className="flex items-center space-x-3">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || 'User'}
                      className="h-12 w-12 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                      {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-sm text-gray-300 truncate max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    to="/dashboard"
                    onClick={onClose}
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links - Scrollable */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon ? item.icon : getNavIcon(item.title);
                  const isActive = location.pathname === item.href;
                  const isExpanded = expandedItem === item.title;
                  
                  return (
                    <li key={item.title}>
                      {item.children ? (
                        <div className="mb-3">
                          <button
                            onClick={() => toggleExpandItem(item.title)}
                            className={`flex items-center justify-between w-full px-5 py-3 text-left text-white hover:bg-[#2a3b5b] rounded-lg transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isExpanded ? 'bg-[#2a3b5b]' : ''
                            }`}
                            aria-expanded={isExpanded}
                            aria-controls={`submenu-${item.title}`}
                          >
                            <div className="flex items-center">
                              <Icon className="h-5 w-5 mr-3 text-gray-400" />
                              <span className="font-medium text-base">{item.title}</span>
                            </div>
                            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.ul
                                id={`submenu-${item.title}`}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={submenuVariants}
                                className="mt-2 ml-7 overflow-hidden"
                              >
                                {item.children.map((child) => {
                                  const ChildIcon = child.icon ? child.icon : Shield;
                                  const isChildActive = location.pathname === child.href;
                                  
                                  return (
                                    <li key={child.title} className="mb-2">
                                      <Link
                                        to={child.href}
                                        onClick={(e) => handleNavClick(e, child.href)}
                                        className={`flex items-center px-4 py-3 text-white hover:bg-[#2a3b5b] rounded-lg transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                          isChildActive ? 'bg-blue-900/50 text-blue-400' : ''
                                        }`}
                                        aria-current={isChildActive ? 'page' : undefined}
                                        ref={child.title === item.children[item.children.length - 1].title ? lastFocusableRef as React.RefObject<HTMLAnchorElement> : null}
                                      >
                                        <ChildIcon className="h-5 w-5 mr-3 text-gray-400" />
                                        <span className="text-base">{child.title}</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className={`flex items-center px-5 py-3 rounded-lg transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-white hover:bg-[#2a3b5b] ${
                            isActive ? 'bg-blue-900/50 text-blue-400' : ''
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                          ref={item.title === navItems[navItems.length - 1].title && !user ? lastFocusableRef as React.RefObject<HTMLAnchorElement> : null}
                        >
                          <Icon className="h-5 w-5 mr-3 text-gray-400" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}

                {user && (
                  <li>
                    <Link
                      to="/applications"
                      onClick={(e) => handleNavClick(e, "/applications")}
                      className={`flex items-center px-5 py-3 rounded-lg transition-colors min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-white hover:bg-[#2a3b5b] ${
                        location.pathname === "/applications" ? 'bg-blue-900/50 text-blue-400' : ''
                      }`}
                      aria-current={location.pathname === "/applications" ? 'page' : undefined}
                    >
                      <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium">My Applications</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Bottom Actions */}
            {!user && (
              <div className="p-4 border-t border-gray-600">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/signin');
                    }}
                    className="w-full py-3 px-4 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                    ref={lastFocusableRef as React.RefObject<HTMLButtonElement>}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/signup');
                    }}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {user && (
              <div className="p-4 border-t border-gray-600">
                <button
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="flex items-center w-full px-5 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  ref={lastFocusableRef as React.RefObject<HTMLButtonElement>}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}