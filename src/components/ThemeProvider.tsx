import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// Theme CSS variables
const themeVariables = {
  light: {
    primary: '#2A3855',
    accent: '#FF6B35',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: {
      primary: '#1a1a1a',
      secondary: '#4a5568',
    },
    border: '#e2e8f0',
  },
  dark: {
    primary: '#3B4D6B',
    accent: '#FF8B55',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: {
      primary: '#ffffff',
      secondary: '#a0aec0',
    },
    border: '#4a5568',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme-preference') as Theme;
    if (savedTheme) return savedTheme;
    
    // Then check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Keep track of media query listener cleanup
  const mediaQueryCleanup = useRef<() => void>();

  // Apply theme variables
  useEffect(() => {
    const root = document.documentElement;
    const variables = themeVariables[theme];

    Object.entries(variables).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }, [theme]);

  // Prevent FOUC by setting initial theme class immediately
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add(theme);
    root.style.setProperty('--theme-transition-duration', '200ms');
    
    return () => root.classList.remove(theme);
  }, []);

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      
      root.classList.add('theme-transitioning');
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      localStorage.setItem('theme-preference', theme);
      
      const timeout = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 200);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme-preference')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        mediaQueryCleanup.current = () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
        mediaQueryCleanup.current = () => mediaQuery.removeListener(handleChange);
      }

      return () => {
        if (mediaQueryCleanup.current) {
          mediaQueryCleanup.current();
        }
      };
    } catch (error) {
      console.error('Error setting up media query listener:', error);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        dark:focus:ring-offset-gray-900"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}

export const useTheme = () => useContext(ThemeContext);