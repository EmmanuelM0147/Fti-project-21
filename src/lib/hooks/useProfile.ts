import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from './useAuth';
import type { Profile } from '../types';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user) {
          setProfile(null);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}