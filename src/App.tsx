import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const VideoPage = lazy(() => import('./pages/VideoPage'));
const AuthPage = lazy(() => import('./pages/Auth'));
const AdminPage = lazy(() => import('./pages/Admin'));
const OAuthConsentPage = lazy(() => import('./pages/OAuthConsent'));
const queryClient = new QueryClient();

function LoadingRoute() {
  return <div className="flex min-h-dvh items-center justify-center"><span className="text-sm text-muted-foreground">Loading…</span></div>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Suspense fallback={<LoadingRoute />}><AuthPage /></Suspense>} />
          <Route path="/video" element={<Suspense fallback={<LoadingRoute />}><VideoPage /></Suspense>} />
          <Route path="/video/:exerciseId" element={<Suspense fallback={<LoadingRoute />}><VideoPage /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<LoadingRoute />}><AdminPage /></Suspense>} />
          <Route path="/.lovable/oauth/consent" element={<Suspense fallback={<LoadingRoute />}><OAuthConsentPage /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
