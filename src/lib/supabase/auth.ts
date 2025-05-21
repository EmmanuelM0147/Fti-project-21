import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { Provider } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign up with email and password
export async function signUp(email: string, password: string, fullName?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;

    // Don't try to create profile here - it will be created after email verification
    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Error signing up:', error);
    if (error instanceof Error) {
      if (error.message.includes('User already registered')) {
        throw new Error('This email is already registered. Please sign in instead.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please try again later.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during sign up');
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        persistSession: localStorage.getItem('rememberMe') !== 'false'
      }
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        // Handle unconfirmed email specifically
        throw new Error('Please check your email to verify your account before signing in. Need a new verification email? Click "Resend confirmation".');
      }
      throw error;
    }

    // Show welcome toast with user's first name
    const firstName = data.user.user_metadata?.full_name?.split(' ')[0] || data.user.email?.split('@')[0] || 'User';
    toast.success(`Welcome back, ${firstName}! 👋`, {
      duration: 5000
    });

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Error signing in:', error);
    if (error instanceof Error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please try again later.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during sign in');
  }
}

// Resend confirmation email
export async function resendConfirmation(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error resending confirmation:', error);
    throw error;
  }
}

// Sign in with social provider
export async function signInWithSocial(provider: Provider) {
  try {
    // Store the current URL to redirect back after auth
    localStorage.setItem('authRedirectTo', window.location.pathname);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // Set session persistence based on remember me preference
        // Default to true if not specified
        persistSession: localStorage.getItem('rememberMe') !== 'false'
      }
    });

    if (error) throw error;
    return { url: data.url };
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please try again later.');
      }
      throw error;
    }
    throw new Error(`An unexpected error occurred during ${provider} sign in`);
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Successfully signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out');
    throw error;
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    if (error) throw error;
    toast.success('Password reset email sent');
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

// Update password
export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    if (error) throw error;
    toast.success('Password updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

// Update user profile
export async function updateProfile(profile: {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Update auth metadata
    if (profile.full_name) {
      await supabase.auth.updateUser({
        data: { full_name: profile.full_name }
      });
    }

    // Update profile table
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString(),
        ...profile
      });

    if (error) throw error;
    toast.success('Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Upload avatar
export async function uploadAvatar(file: File) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Validate file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!fileExt || !allowedExts.includes(fileExt)) {
      throw new Error('Invalid file type. Please upload an image file.');
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 2MB.');
    }

    const filePath = `${user.id}/avatar.${fileExt}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile
    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

// Get user profile
export async function getProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}