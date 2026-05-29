import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const VideoPage = lazy(() => import("./pages/VideoPage"));
const AuthPage = lazy(() => import("./pages/Auth"));
const AdminPage = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Suspense fallback={<div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>}><AuthPage /></Suspense>} />
          <Route path="/video" element={<Suspense fallback={<div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>}><VideoPage /></Suspense>} />
          <Route path="/video/:exerciseId" element={<Suspense fallback={<div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>}><VideoPage /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>}><AdminPage /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
