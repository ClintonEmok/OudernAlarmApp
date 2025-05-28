import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { capacitorService } from "./services/capacitor-service";
import { pushNotificationService } from "./services/push-notification-service";
import BottomNavigation from "./components/Layout/BottomNavigation";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import Contacts from "./pages/Contacts";
import Device from "./pages/Device";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import PasswordSettings from "./pages/PasswordSettings";
import DevicePairing from "./pages/DevicePairing";
import Invitations from "./pages/Invitations";
import SupportTicket from "./pages/SupportTicket";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize platform detection and log info
    capacitorService.logPlatformInfo();
    
    // Initialize native features on app start
    const initializeNativeFeatures = async () => {
      try {
        await pushNotificationService.initialize();
        console.log('Native features initialized in App.tsx');
      } catch (error) {
        console.error('Failed to initialize native features in App.tsx:', error);
      }
    };

    initializeNativeFeatures();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-blue-50 w-full">
            <Routes>
              {/* Default route redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected pages - each will handle their own auth check */}
              <Route path="/dashboard" element={<Home />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/device" element={<Device />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Settings sub-pages */}
              <Route path="/settings/profile" element={<ProfileSettings />} />
              <Route path="/settings/password" element={<PasswordSettings />} />
              <Route path="/settings/device-pairing" element={<DevicePairing />} />
              <Route path="/settings/invitations" element={<Invitations />} />
              <Route path="/settings/support" element={<SupportTicket />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
