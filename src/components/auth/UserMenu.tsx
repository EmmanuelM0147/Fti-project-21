import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ChevronDown, Bell, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/supabase/auth';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export function UserMenu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
            {firstLetter}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayName}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                    {firstLetter}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Account
                </p>
              </div>

              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                Profile
              </Link>

              <Link
                to="/notifications"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                Notifications
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
              </Link>

              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                Settings
              </Link>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                role="menuitem"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}