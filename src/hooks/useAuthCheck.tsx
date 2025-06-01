
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { logger } from '../utils/logger';

export const useAuthCheck = () => {
  const { isAuthenticated, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Simple check: if no user and not authenticated, redirect to login
    if (!isAuthenticated && !user) {
      logger.debug('Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return { isAuthenticated, user };
};
