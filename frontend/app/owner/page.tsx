"use client";

import { LogoutButton } from "@/components/logout-button";
import { ProtectedRoute } from "@/components/protected-route";

export default function OwnerDashboard() {
  return (
    <ProtectedRoute requiredRoles={["OWNER"]}>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="text-gray-600 mt-2">Welcome to the Owner Control Panel</p>
        
        {/* TODO: Implement Owner Dashboard Components */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <p className="text-gray-600">Dashboard features coming soon...</p>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
