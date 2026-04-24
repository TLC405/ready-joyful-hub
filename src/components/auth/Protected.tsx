import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedProps {
  children: React.ReactNode;
  fallbackSection?: string;
}

/**
 * Wraps a section that requires authentication.
 * If unauthenticated, redirects to /auth?next=/...
 */
export function Protected({ children }: ProtectedProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(`/auth?next=${encodeURIComponent(window.location.pathname)}`, { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
