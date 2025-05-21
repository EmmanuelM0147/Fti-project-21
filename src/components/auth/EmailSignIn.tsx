import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailSignInProps {
  onSuccess: () => void;
}

export function EmailSignIn({ onSuccess }: EmailSignInProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      setError('');
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        onSuccess();
      } else if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        onSuccess();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, data.email);
        setResetSent(true);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {resetSent ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded">
          Password reset email sent! Please check your inbox.
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1 relative">
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isSubmitting ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
          </button>
        </>
      )}

      <div className="flex flex-col space-y-2 text-sm text-center">
        {mode === 'signin' && (
          <>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Don't have an account? Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode('reset')}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </button>
          </>
        )}
        {(mode === 'signup' || mode === 'reset') && (
          <button
            type="button"
            onClick={() => setMode('signin')}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
    </form>
  );
}

function getAuthErrorMessage(error: any): string {
  const errorCode = error.code;
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Invalid password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    default:
      return 'An error occurred. Please try again';
  }
}