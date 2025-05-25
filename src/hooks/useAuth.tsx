
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const useAuth = (requireAuth = true) => {
  const { isAuthenticated, checkAuth, fetchUserData } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, requireAuth, navigate, checkAuth, fetchUserData]);

  return { isAuthenticated };
};
