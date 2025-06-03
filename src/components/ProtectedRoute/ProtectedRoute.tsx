
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/auth-service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback = null }) => {
  const { isAuthenticated, user, fetchUserData, initialDataLoad } = useStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated && authService.hasValidToken()) {
          console.log('Token found, fetching user data...');
          await fetchUserData();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, fetchUserData]);

  // Load initial data when user becomes authenticated
  useEffect(() => {
    const loadInitialData = async () => {
      if (isAuthenticated && user && !hasLoadedInitialData && !isChecking) {
        console.log('Loading initial app data...');
        try {
          await initialDataLoad();
          setHasLoadedInitialData(true);
        } catch (error) {
          console.error('Failed to load initial data:', error);
          // Still mark as loaded to prevent infinite retries
          setHasLoadedInitialData(true);
        }
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, hasLoadedInitialData, isChecking, initialDataLoad]);

  // Still checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading while initial data is being loaded
  if (!hasLoadedInitialData) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">App gegevens laden...</p>
        </div>
      </div>
    );
  }

  // Authenticated and data loaded - render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
