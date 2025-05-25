
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useStore();

  // If not authenticated and no user data, redirect to login
  if (!isAuthenticated && user === null) {
    console.log('ProtectedRoute: Redirecting to login - no authentication');
    return <Navigate to="/login" replace />;
  }

  // If authenticated or still checking, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
