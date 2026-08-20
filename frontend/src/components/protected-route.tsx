"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  requiredRoles = ["OWNER", "ADMIN", "USER"],
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && (!isAuthenticated() || !user)) {
      if (isAuthenticated() && !user) { useAuthStore.getState().logout(); }
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    if (hasHydrated && isAuthenticated() && user) {
      // Check if user has required role
      if (!requiredRoles.includes(user.role)) {
        router.replace(`/${user.role.toLowerCase()}`);
        return;
      }
    }
  }, [hasHydrated, user, requiredRoles, router, isAuthenticated]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !user) return null;
  return <>{children}</>;
}
