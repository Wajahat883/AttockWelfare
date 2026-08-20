"use client";
import { PaymentRecorder } from "@/components/payment-recorder";
import { ProtectedRoute } from "@/components/protected-route";
import { PaymentBrowser } from "@/components/payment-browser";
import { DashboardShell } from "@/components/dashboard-shell";
export default function OwnerPaymentsPage() { return <ProtectedRoute requiredRoles={["OWNER"]}><DashboardShell role="OWNER"><div className="mx-auto w-full max-w-5xl space-y-6"><header className="page-header"><div><p className="page-eyebrow">Owner workspace</p><h1 className="page-title">Payments</h1><p className="mt-2 text-sm text-slate-500">Record a contribution and review any month in the ledger.</p></div></header><PaymentRecorder /><PaymentBrowser /></div></DashboardShell></ProtectedRoute>; }
