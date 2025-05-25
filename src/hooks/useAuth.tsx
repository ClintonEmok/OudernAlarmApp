
import { useStore } from '../store/useStore';

export const useAuth = () => {
  const { isAuthenticated, user } = useStore();
  
  return { 
    isAuthenticated,
    user 
  };
};
