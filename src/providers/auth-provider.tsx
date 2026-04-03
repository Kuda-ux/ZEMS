"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { UserProfile, UserRole } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { demoUsers } from "@/lib/mock-data";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
      if (!error && data) {
        setUser(data as UserProfile);
        setIsLoading(false);
        return true;
      }
    } catch {
      // Supabase unavailable — fall through to demo users
    }
    // Fallback to local demo users
    const demo = demoUsers.find((u) => u.email === email);
    if (demo) {
      setUser(demo);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback(async (role: UserRole) => {
    const { data } = await supabase.from("users").select("*").eq("role", role).limit(1).single();
    if (data) setUser(data as UserProfile);
    else if (user) setUser({ ...user, role });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
