
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const useAuth = (requireAuth = true) => {
  const { isAuthenticated, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only handle navigation - don't trigger auth checks
    if (requireAuth && !isAuthenticated && user === null) {
      navigate('/login');
    }
  }, [isAuthenticated, user, requireAuth, navigate]);

  return { isAuthenticated };
};
