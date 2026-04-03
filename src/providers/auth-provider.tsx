"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { UserProfile, UserRole } from "@/lib/types";
import { mockData } from "@/lib/mock-data";

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
    await new Promise((r) => setTimeout(r, 800));
    const found = mockData.users.find((u) => u.email === email);
    if (found) {
      setUser(found);
      setIsLoading(false);
      return true;
    }
    setUser(mockData.currentUser);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const found = mockData.users.find((u) => u.role === role);
    if (found) setUser(found);
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
