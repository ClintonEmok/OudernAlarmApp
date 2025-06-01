
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { capacitorService } from "./services/capacitor-service";
import { pushNotificationService } from "./services/push-notifications";
import { pwaNavigationService } from "./services/pwa-navigation-service";
import { logger } from "./utils/logger";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import BottomNavigation from "./components/Layout/BottomNavigation";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import Contacts from "./pages/Contacts";
import Device from "./pages/Device";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import PasswordSettings from "./pages/PasswordSettings";
import DevicePairing from "./pages/DevicePairing";
import Invitations from "./pages/Invitations";
import SupportTicket from "./pages/SupportTicket";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize platform detection and log info
    capacitorService.logPlatformInfo();
    
    // Log PWA status
    const pwaInfo = pwaNavigationService.getPlatformInfo();
    logger.debug('PWA Navigation Service initialized', pwaInfo);
    
    // Initialize native features on app start
    const initializeNativeFeatures = async () => {
      try {
        await pushNotificationService.initialize();
        logger.info('Native features initialized in App.tsx');
      } catch (error) {
        logger.error('Failed to initialize native features in App.tsx', error);
      }
    };

    initializeNativeFeatures();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col h-screen h-dvh bg-blue-50 overflow-hidden">
              <main className="flex-1 min-h-0 overflow-hidden">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/alerts" element={
                    <ProtectedRoute>
                      <Alerts />
                    </ProtectedRoute>
                  } />
                  <Route path="/alerts/:alertId" element={
                    <ProtectedRoute>
                      <AlertDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/contacts" element={
                    <ProtectedRoute>
                      <Contacts />
                    </ProtectedRoute>
                  } />
                  <Route path="/device" element={
                    <ProtectedRoute>
                      <Device />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected settings sub-pages */}
                  <Route path="/settings/profile" element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/password" element={
                    <ProtectedRoute>
                      <PasswordSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/device-pairing" element={
                    <ProtectedRoute>
                      <DevicePairing />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/invitations" element={
                    <ProtectedRoute>
                      <Invitations />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/support" element={
                    <ProtectedRoute>
                      <SupportTicket />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/privacy" element={
                    <ProtectedRoute>
                      <PrivacyPolicy />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <BottomNavigation />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
