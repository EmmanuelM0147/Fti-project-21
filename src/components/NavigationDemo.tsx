import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, NavigateFunction, Link, Navigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

// Main component that sets up the Router
export function NavigationDemo() {
  return (
    // Step 1: Set up the Router as the parent wrapper
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            useNavigate() Hook Demo
          </h1>
          
          {/* Define routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/protected" element={<ProtectedRoute><ProtectedPage /></ProtectedRoute>} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Component that uses useNavigate for programmatic navigation
function HomePage() {
  // Step 2: Use the useNavigate hook within a component that's a child of Router
  const navigate = useNavigate();
  const location = useLocation();
  const [destination, setDestination] = useState('about');
  const [error, setError] = useState<string | null>(null);

  // Step 4: Add error handling for navigation
  const handleNavigation = useCallback(() => {
    try {
      // Clear any previous errors
      setError(null);
      
      // Validate the destination
      if (!destination.trim()) {
        throw new Error('Destination cannot be empty');
      }
      
      // Navigate to the specified route
      navigate(`/${destination}`);
    } catch (err) {
      // Handle navigation errors
      setError(err instanceof Error ? err.message : 'Navigation failed');
      console.error('Navigation error:', err);
    }
  }, [navigate, destination]);

  // Navigate with state data
  const navigateWithState = useCallback(() => {
    try {
      navigate('/dashboard', { 
        state: { 
          from: location.pathname,
          timestamp: new Date().toISOString()
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation with state failed');
      console.error('Navigation error:', err);
    }
  }, [navigate, location]);

  // Navigate with replace option (replaces current history entry)
  const navigateAndReplace = useCallback(() => {
    try {
      navigate('/about', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation with replace failed');
      console.error('Navigation error:', err);
    }
  }, [navigate]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Home Page</h2>
      
      {/* Display current location */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">
          Current location: <code className="font-mono bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">{location.pathname}</code>
        </p>
        {location.state && (
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Location state: <code className="font-mono bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">
              {JSON.stringify(location.state)}
            </code>
          </p>
        )}
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Navigation controls */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter destination"
          />
          <button
            onClick={handleNavigation}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
          >
            Navigate <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={navigateWithState}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center"
          >
            Navigate with State <ExternalLink className="ml-2 h-4 w-4" />
          </button>
          
          <button
            onClick={navigateAndReplace}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center"
          >
            Navigate & Replace <RefreshCw className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Navigation links */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Navigation Links</h3>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/about"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200"
          >
            About
          </Link>
          <Link 
            to="/dashboard"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/protected"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200"
          >
            Protected Route
          </Link>
          <Link 
            to="/error"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200"
          >
            Error Page
          </Link>
          <Link 
            to="/nonexistent"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200"
          >
            Not Found
          </Link>
        </div>
      </div>
      
      {/* Code example */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Code Example</h3>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm">
          <code className="text-gray-800 dark:text-gray-200">
{`// Step 1: Import the necessary hooks
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  // Step 2: Initialize the navigate function
  const navigate = useNavigate();
  const location = useLocation();
  
  // Step 3: Create a navigation handler with error handling
  const handleNavigation = () => {
    try {
      // Basic navigation
      navigate('/destination');
      
      // Navigation with state
      navigate('/destination', { 
        state: { from: location.pathname } 
      });
      
      // Replace current history entry
      navigate('/destination', { replace: true });
      
      // Go back in history
      navigate(-1);
      
      // Go forward in history
      navigate(1);
    } catch (error) {
      console.error('Navigation error:', error);
      // Handle the error appropriately
    }
  };
  
  return (
    <button onClick={handleNavigation}>
      Navigate
    </button>
  );
}`}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Example pages for navigation
function AboutPage() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About Page</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">This is the about page. You navigated here successfully!</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
      >
        <Home className="mr-2 h-4 w-4" /> Go Home
      </button>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard Page</h2>
      
      {state && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Navigation State Data</h3>
          <pre className="bg-white dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      )}
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This page demonstrates receiving state data through navigation.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
      >
        <Home className="mr-2 h-4 w-4" /> Go Home
      </button>
    </div>
  );
}

// Example of a protected route using useNavigate
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Simulate authentication check
  const isAuthenticated = false;
  const location = useLocation();
  
  // If not authenticated, redirect to home with the current location in state
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, message: "Authentication required" }} replace />;
  }
  
  return <>{children}</>;
}

function ProtectedPage() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Protected Page</h2>
      <p className="text-gray-700 dark:text-gray-300">
        This is a protected page. You should only see this if you're authenticated.
      </p>
    </div>
  );
}

function ErrorPage() {
  // Simulate an error in navigation
  const navigate = useNavigate();
  
  const causeError = () => {
    try {
      // @ts-ignore - Intentionally causing an error
      navigate(undefined);
    } catch (error) {
      console.error("Navigation error:", error);
      // Display error to user
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Error Page</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This page demonstrates error handling with useNavigate.
      </p>
      <button
        onClick={causeError}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Trigger Navigation Error
      </button>
    </div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">404 - Page Not Found</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md inline-flex items-center"
      >
        <Home className="mr-2 h-4 w-4" /> Return Home
      </button>
    </div>
  );
}

// Custom hook that wraps useNavigate with error handling
export function useNavigateWithErrorHandling(): [NavigateFunction, string | null] {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const navigateWithErrorHandling: NavigateFunction = useCallback(
    (to, options) => {
      try {
        setError(null);
        return navigate(to, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Navigation failed';
        setError(errorMessage);
        console.error('Navigation error:', err);
        throw err;
      }
    },
    [navigate]
  );
  
  return [navigateWithErrorHandling, error];
}

export default NavigationDemo;