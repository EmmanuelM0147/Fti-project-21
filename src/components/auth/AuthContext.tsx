import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/client';
import { LoadingSpinner } from '../LoadingSpinner';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('Error getting auth session:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Show welcome toast on sign in
        if (event === 'SIGNED_IN' && session?.user) {
          const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
          toast.success(`Welcome back, ${name}!`, {
            icon: '👋',
            duration: 5000
          });
          
          // Redirect to dashboard if coming from auth callback
          if (window.location.pathname.includes('/auth/callback')) {
            window.location.href = '/dashboard';
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Provide a loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);