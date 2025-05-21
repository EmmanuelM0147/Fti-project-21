import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No code found in URL');
        }

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          throw error;
        }

        // Redirect to the intended destination or home page
        const redirectTo = localStorage.getItem('authRedirectTo') || '/';
        localStorage.removeItem('authRedirectTo');
        
        navigate(redirectTo, { replace: true });
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Authentication Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="lg" message="Completing authentication..." />
    </div>
  );
}