"use client";
import { MemberManager } from "@/components/member-manager";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardShell } from "@/components/dashboard-shell";
export default function OwnerMembersPage() { return <ProtectedRoute requiredRoles={["OWNER"]}><DashboardShell role="OWNER"><header className="page-header"><div><p className="page-eyebrow">Owner workspace</p><h1 className="page-title">Members</h1><p className="mt-2 text-sm text-slate-500">Search, update, and manage active welfare members.</p></div></header><MemberManager canDelete /></DashboardShell></ProtectedRoute>; }
