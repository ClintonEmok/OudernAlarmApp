
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const useAuth = (requireAuth = true) => {
  const { isAuthenticated, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only handle navigation - don't trigger auth checks
    if (requireAuth && !isAuthenticated && user === null) {
      console.log('useAuth: Redirecting to login due to no authentication');
      navigate('/login');
    }
    
    // Cleanup function to prevent any lingering effects
    return () => {
      console.log('useAuth: Cleaning up auth check effect');
    };
  }, [isAuthenticated, user, requireAuth, navigate]);

  return { isAuthenticated };
};
