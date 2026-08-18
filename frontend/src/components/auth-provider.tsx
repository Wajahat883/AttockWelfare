"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setToken, setHasHydrated } = useAuthStore();

  useEffect(() => {
    // Load auth state from localStorage on app startup
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setToken(token);
        setUser(user);
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setHasHydrated(true);
  }, [setHasHydrated, setToken, setUser]);

  return <>{children}</>;
}
