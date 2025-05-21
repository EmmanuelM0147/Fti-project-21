import React from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function MenuToggle({ isOpen, onClick, className = '' }: MenuToggleProps) {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:ring-offset-2
        ${theme === 'dark'
          ? 'text-white hover:bg-white/10 focus:ring-offset-gray-900'
          : 'text-gray-900 hover:bg-gray-100'
        }
        ${className}`}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );
}