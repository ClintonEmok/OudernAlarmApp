
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNavigation from "./components/Layout/BottomNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import Contacts from "./pages/Contacts";
import Device from "./pages/Device";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { useStore } from "./store/useStore";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  useEffect(() => {
    // Only check auth once when app loads
    if (!hasCheckedAuth) {
      console.log('App: Performing ONE-TIME auth check...');
      // Access checkAuth directly from store to avoid re-renders
      useStore.getState().checkAuth().finally(() => {
        console.log('App: ONE-TIME auth check completed');
        setHasCheckedAuth(true);
      });
    }
  }, [hasCheckedAuth]); // Only depend on hasCheckedAuth state

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-purple-50 w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <Alerts />
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
