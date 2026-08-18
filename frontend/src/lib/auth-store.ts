import { create } from "zustand";
import { AuthenticatedUser, UserRole } from "@/types";

interface AuthStore {
  user: AuthenticatedUser | null;
  token: string | null;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: AuthenticatedUser | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  
  // Helpers
  isAuthenticated: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccess: (allowedRoles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  hasHydrated: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
  setError: (error) => set({ error }),

  logout: () => {
    set({ user: null, token: null, error: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  isAuthenticated: () => {
    const { token } = get();
    return token !== null && token !== undefined && token.length > 0;
  },

  hasRole: (roles) => {
    const { user } = get();
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  },

  canAccess: (allowedRoles) => {
    return get().hasRole(allowedRoles);
  },
}));
