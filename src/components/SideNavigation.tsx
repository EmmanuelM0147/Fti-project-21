import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, User, Settings, Bell, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { ThemeToggle } from './ThemeProvider';
import { signOut } from '../lib/supabase/auth';
import { AuthDialog } from './auth/AuthDialog';
import { toast } from 'react-hot-toast';

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Programs', href: '/programs', icon: BookOpen },
  { title: 'About', href: '/about', icon: User },
  { title: 'Admissions', href: '#admissions', icon: ChevronRight },
  {
    title: 'Support',
    href: '#',
    icon: Bell,
    children: [
      { title: 'Sponsorships', href: '/sponsorships', icon: Shield },
      { title: 'Give', href: '/give', icon: ChevronRight }
    ]
  },
  { title: 'Contact', href: '#contact', icon: Mail }
];

export function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Focus first element
      firstFocusableRef.current?.focus();
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

  const handleSignInClick = () => {
    setAuthMode('signin');
    setShowAuthDialog(true);
    onClose();
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setShowAuthDialog(true);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      navigate('/');
      toast.success('You have been signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              aria-hidden="true"
              onClick={onClose}
            />

            {/* Side Menu */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <button
                    ref={firstFocusableRef}
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* User Profile Section (if logged in) */}
              {user && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                        {firstLetter}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {displayName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/applications"
                      onClick={onClose}
                      className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Applications
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.title}>
                        {item.children ? (
                          <div className="mb-4">
                            <div className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300">
                              <Icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                              <span className="font-medium">{item.title}</span>
                              <ChevronRight className="ml-auto h-4 w-4" />
                            </div>
                            <ul className="mt-2 ml-6 space-y-1">
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                return (
                                  <li key={child.title}>
                                    <Link
                                      to={child.href}
                                      onClick={onClose}
                                      className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg transition-colors"
                                      ref={index === menuItems.length - 1 ? lastFocusableRef : undefined}
                                    >
                                      <ChildIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                                      {child.title}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={onClose}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                              location.pathname === item.href
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                            }`}
                            ref={index === menuItems.length - 1 ? lastFocusableRef : undefined}
                          >
                            <Icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                            {item.title}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/settings"
                      onClick={onClose}
                      className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleSignInClick}
                      className="w-full py-2 px-4 text-center font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleSignUpClick}
                      className="w-full py-2 px-4 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
        defaultMode={authMode}
      />
    </>
  );
}