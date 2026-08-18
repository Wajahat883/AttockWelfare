"use client";

import { LogoutButton } from "@/components/logout-button";
import { ProtectedRoute } from "@/components/protected-route";

export default function UserDashboard() {
  return (
    <ProtectedRoute requiredRoles={["USER"]}>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Profile & Payments</h1>
          <LogoutButton />
        </div>
        <p className="text-gray-600 mt-2">View your payment history and contribution status</p>
        
        {/* TODO: Implement User Dashboard Components */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <p className="text-gray-600">User dashboard features coming soon...</p>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
