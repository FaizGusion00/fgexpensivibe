
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  
  const finishLoading = () => {
    setLoading(false);
  };
  
  // Show splash screen on initial load and when page refreshes
  useEffect(() => {
    // Check if this is initial load or a refresh
    const isInitialLoad = sessionStorage.getItem('hasLoaded') !== 'true';
    
    if (isInitialLoad) {
      setLoading(true);
      sessionStorage.setItem('hasLoaded', 'true');
    } else {
      setLoading(false);
    }
    
    // Also show splash on page refresh
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('hasLoaded');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {loading ? (
            <SplashScreen finishLoading={finishLoading} />
          ) : (
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
