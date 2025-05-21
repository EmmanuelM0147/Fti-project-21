import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Globe, Camera, Loader2, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { updateProfile, uploadAvatar, getProfile } from '../lib/supabase/auth';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional().or(z.literal('')),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      full_name: '',
      website: ''
    }
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const profile = await getProfile();
        reset({
          username: profile.username || '',
          full_name: profile.full_name || user.user_metadata?.full_name || '',
          website: profile.website || ''
        });
        setAvatarUrl(profile.avatar_url || null);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      await updateProfile({
        username: data.username || undefined,
        full_name: data.full_name || undefined,
        website: data.website || undefined
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Your Profile | FolioTech Institute</title>
        <meta name="description" content="Manage your FolioTech Institute profile" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Profile
              </h1>

              {isLoading ? (
                <div className="py-12">
                  <LoadingSpinner size="md" message="Loading profile..." />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div 
                        className={`h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 ${uploadingAvatar ? 'opacity-50' : ''}`}
                        onClick={handleAvatarClick}
                        role="button"
                        tabIndex={0}
                        aria-label="Change profile picture"
                      >
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                          </div>
                        )}
                        {uploadingAvatar && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Click to change your profile picture
                    </p>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        />
                        <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          {...register('username')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="johndoe"
                        />
                        <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          {...register('full_name')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="John Doe"
                        />
                        <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Website
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="url"
                          {...register('website')}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com"
                        />
                        <Globe className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.website && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.website.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}