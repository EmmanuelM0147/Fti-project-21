import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { AlertCircle } from 'lucide-react';

interface GoogleSignInProps {
  onSuccess: () => void;
}

export function GoogleSignIn({ onSuccess }: GoogleSignInProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Configure additional OAuth 2.0 scopes if needed
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // Log successful authentication details (in development only)
      if (process.env.NODE_ENV === 'development') {
        console.debug('Google Sign In Success:', {
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          },
          credential: credential ? {
            accessToken: credential.accessToken,
            providerId: credential.providerId
          } : null
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Google Sign In Error:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });

      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/popup-blocked':
          setError('Please enable popups for this website to sign in with Google.');
          break;
        case 'auth/popup-closed-by-user':
          setError('Sign in was cancelled. Please try again.');
          break;
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with this email using a different sign-in method.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection and try again.');
          break;
        default:
          setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isLoading ? "Signing in with Google..." : "Sign in with Google"}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="h-5 w-5 mr-2"
        />
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </button>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        By continuing with Google, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}