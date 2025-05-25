
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const useAuth = (requireAuth = true) => {
  const { isAuthenticated, user, checkAuth } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check auth if we don't already have a user and haven't checked recently
    if (!user && !isAuthenticated) {
      checkAuth();
    }
  }, []); // Remove dependencies to prevent infinite loop

  useEffect(() => {
    if (requireAuth && !isAuthenticated && user === null) {
      navigate('/login');
    }
  }, [isAuthenticated, user, requireAuth, navigate]);

  return { isAuthenticated };
};
