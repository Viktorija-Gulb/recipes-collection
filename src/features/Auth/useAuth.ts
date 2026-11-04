import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../config/supabase';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current session when the app loads
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Could not get session:', error);
      }

      setSession(data.session);
      setLoading(false);
    };

    getInitialSession();

    // Listen for login and logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    loading,
  };
};
