import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown, User } from "lucide-react";
import { NavItem } from "../types";
import { useAuth } from "./auth/AuthProvider";
import { ThemeToggle, useTheme } from "./ThemeProvider";
import { MenuToggle } from './Navigation/MenuToggle';
import { MobileMenu } from './Navigation/MobileMenu';
import { AuthDialog } from './auth/AuthDialog';
import { toast } from 'react-hot-toast';
import { signOut } from '../lib/supabase/auth';
import { useTourContext } from '../context/TourContext';

const navItems: NavItem[] = [
  { title: "Programs", href: "/#featured-programs" },
  { title: "About", href: "/about" },
  { title: "Admissions", href: "#admissions" },
  {
    title: "Support",
    href: "#",
    children: [
      { title: "Sponsorships", href: "/sponsorships" },
      { title: "Give", href: "/give" }
    ]
  },
  { title: "DevCareer", href: "/career-development" },
  { title: "Contact", href: "#contact" },
];

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { startTour } = useTourContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('Failed to sign out');
    }
  };

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    setActiveDropdown(null);

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
  }, [location.pathname, navigate]);

  const handleStartTour = () => {
    startTour();
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "h-16 bg-white/98 dark:bg-gray-900/98 shadow-lg" 
            : "h-20 bg-white/95 dark:bg-gray-900/95"
        } backdrop-blur-[10px] border-b border-gray-200/15 dark:border-gray-700/15`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg"
              aria-label="FolioTech Institute home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-17 w-14 transition-transform duration-300 hover:scale-110"
                viewBox="0 0 300 300"
                aria-hidden="true"
              >
                <path d="M60 250 Q20 200 40 120 Q50 80 90 70 Q120 60 160 70 Q100 80 110 140 Q120 180 160 190 Q100 190 100 250 Z" fill="#894876" stroke="none"/>
                <path d="M200 250 Q140 250 160 180 Q180 120 120 120 Q160 100 200 100 Q260 100 240 120 Q220 140 220 180 Q220 250 200 250 Z" fill={theme === 'dark' ? '#66b3ff' : '#0066cc'} stroke="none"/>
                <text x="220" y="190" fontSize="70" fill={theme === 'dark' ? '#cccccc' : '#555555'}>⚙️</text>
              </svg>
              <span 
                className={`text-xl font-bold transition-all duration-300 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                } text-gray-900 dark:text-gray-100 hover:text-shadow-glow`}
              >
                FolioTech Institute
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  ref={item.children ? dropdownRef : null}
                  id={item.title === 'Support' ? 'support-nav-item' : undefined}
                >
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        aria-expanded={activeDropdown === item.title}
                        aria-haspopup="true"
                      >
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300" />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-48 py-2 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-[10px]"
                            role="menu"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                to={child.href}
                                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400"
                                role="menuitem"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
              
              <ThemeToggle />
              
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    {user.user_metadata.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4 flex-nowrap">
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setShowAuthDialog(true);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthDialog(true);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button
                onClick={handleStartTour}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                aria-label="Start website tour"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <MenuToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={navItems}
          onSignIn={() => {
            setIsOpen(false);
            setAuthMode('signin');
            setShowAuthDialog(true);
          }}
          onSignUp={() => {
            setIsOpen(false);
            setAuthMode('signup');
            setShowAuthDialog(true);
          }}
          user={user}
          onSignOut={handleSignOut}
          onStartTour={() => {
            setIsOpen(false);
            startTour();
          }}
        />
      </nav>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultMode={authMode}
      />
    </>
  );
}
