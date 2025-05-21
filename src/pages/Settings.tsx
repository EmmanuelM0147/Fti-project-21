import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { updatePassword } from '../lib/supabase/auth';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { toast } from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await updatePassword(data.newPassword);
      setSuccess(true);
      reset();
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Account Settings | FolioTech Institute</title>
        <meta name="description" content="Manage your FolioTech Institute account settings" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Account Settings
              </h1>

              <div className="space-y-8">
                {/* Account Information */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Account Information
                  </h2>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Account Created
                      </p>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h2>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-400 flex items-start">
                      <ShieldCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Password updated successfully</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...register('currentPassword')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...register('newPassword')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...register('confirmPassword')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        id="show-password"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="show-password" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Show password
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}