import React, { Suspense, lazy, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorBoundary } from '../lib/errors/ErrorBoundary';
import { useAuth } from '../lib/hooks/useAuth';
import { AuthDialog } from '../components/auth/AuthDialog';

// Lazy load the ApplicationForm component
const ApplicationForm = lazy(() => 
  import('../components/application/ApplicationForm')
    .then(module => ({ default: module.default || module.ApplicationForm }))
    .catch(error => {
      console.error('Error loading ApplicationForm:', error);
      throw error;
    })
);

export default function Apply() {
  const { user, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(!user);

  // Close auth dialog when user becomes authenticated
  React.useEffect(() => {
    if (user) {
      setShowAuthDialog(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Apply | FolioTech Institute</title>
        <meta name="description" content="Apply to FolioTech Institute's programs and start your journey in technology education." />
      </Helmet>

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => {
          // Only allow closing if user is authenticated
          if (user) {
            setShowAuthDialog(false);
          }
        }}
        defaultMode="signup"
        nonDismissible={!user}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                Student Application
              </h1>
              
              <ErrorBoundary>
                {user ? (
                  <Suspense fallback={
                    <div className="min-h-[400px] flex items-center justify-center">
                      <LoadingSpinner size="lg" message="Loading application form..." />
                    </div>
                  }>
                    <ApplicationForm />
                  </Suspense>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Authentication Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please sign in or create an account to access the application form.
                    </p>
                    <button
                      onClick={() => setShowAuthDialog(true)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                )}
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}