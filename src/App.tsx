
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNavigation from "./components/Layout/BottomNavigation";
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
  const { checkAuth } = useStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  useEffect(() => {
    // Only check auth once when app loads
    if (!hasCheckedAuth) {
      checkAuth().finally(() => setHasCheckedAuth(true));
    }
  }, [checkAuth, hasCheckedAuth]);

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
              <Route path="/" element={<Home />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/device" element={<Device />} />
              <Route path="/settings" element={<Settings />} />
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
