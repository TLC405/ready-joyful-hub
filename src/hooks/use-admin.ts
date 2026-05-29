import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    setLoading(true);
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data }) => {
        if (!cancel) { setIsAdmin(!!data); setLoading(false); }
      });
    return () => { cancel = true; };
  }, [user]);

  return { isAdmin, loading };
}
