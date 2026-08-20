"use client";
import { MemberManager } from "@/components/member-manager";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardShell } from "@/components/dashboard-shell";
export default function AdminMembersPage() { return <ProtectedRoute requiredRoles={["ADMIN"]}><DashboardShell role="ADMIN"><header className="page-header"><div><p className="page-eyebrow">Admin workspace</p><h1 className="page-title">Members</h1><p className="mt-2 text-sm text-slate-500">Find a member quickly or update their contribution details.</p></div></header><MemberManager canDelete={false} /></DashboardShell></ProtectedRoute>; }
