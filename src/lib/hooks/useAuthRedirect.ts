import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useAuthRedirect(redirectTo: string = '/') {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Get the intended destination from location state, or use default redirect
      const from = (location.state as any)?.from?.pathname || redirectTo;
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location, redirectTo]);

  return { user, loading };
}