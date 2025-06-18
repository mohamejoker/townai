import React, { ReactNode, createContext, useContext } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useDevAuth } from "@/hooks/useDevAuth";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  user: SupabaseUser | any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  switchToAdmin?: () => void;
  switchToUser?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// تحديد ما إذا كنا في وضع التطوير
const isDevelopment =
  import.meta.env.DEV || import.meta.env.VITE_USE_DEV_AUTH === "true";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // استخدام نظام مختلف حسب البيئة
  const supabaseAuth = useSupabaseAuth();
  const devAuth = useDevAuth();

  // اختيار النظام المناسب
  const authSystem = isDevelopment ? devAuth : supabaseAuth;

  const value: AuthContextType = {
    user: authSystem.user,
    isLoading: authSystem.isLoading,
    isAuthenticated: authSystem.isAuthenticated,
    logout: authSystem.logout,
    login: authSystem.login,
    register: authSystem.register,
    // إضافة وظائف التطوير إذا كانت متاحة
    ...(isDevelopment &&
      "switchToAdmin" in authSystem && {
        switchToAdmin: authSystem.switchToAdmin,
        switchToUser: authSystem.switchToUser,
      }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
