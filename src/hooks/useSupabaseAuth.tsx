
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface UseSupabaseAuthResult {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const SupabaseAuthContext = createContext<UseSupabaseAuthResult | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // استمع لتغييرات المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    // احصل على الجلسة الحالية عند التحميل
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const value: UseSupabaseAuthResult = {
    user,
    session,
    isLoading,
    logout: async () => {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    },
    login: async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } finally {
        setIsLoading(false);
      }
    },
    register: async (email: string, password: string, name?: string) => {
      setIsLoading(true);
      try {
        const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "/";
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: name ? { full_name: name } : {},
          },
        });
        if (error) throw error;
      } finally {
        setIsLoading(false);
      }
    },
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
};
