import type { ReactNode } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function AdminOnly({ children }: { children: ReactNode }) {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || loading) {
    return <div className="p-8 text-sm text-muted-foreground" role="status">Checking access…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="font-chalk text-2xl mb-2 text-foreground">Restricted</h1>
        <p className="text-sm text-muted-foreground">This area is for the site admin only.</p>
      </div>
    );
  }
  return <>{children}</>;
}
