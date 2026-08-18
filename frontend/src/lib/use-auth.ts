import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/types";

export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: store.isAuthenticated(),
    hasRole: (roles: UserRole | UserRole[]) => store.hasRole(roles),
    canAccess: (roles: UserRole[]) => store.canAccess(roles),
    logout: store.logout,
    setUser: store.setUser,
    setToken: store.setToken,
    setError: store.setError,
  };
}
