"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { PaymentGrid } from "@/components/payment-grid";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuthStore } from "@/lib/auth-store";
import { useLanguage } from "@/components/language-provider";

export default function UserDashboard() { const user = useAuthStore((state) => state.user); const { t } = useLanguage(); return <ProtectedRoute requiredRoles={["USER"]}><DashboardShell role="USER"><div className="mb-8 flex flex-col gap-2"><p className="page-eyebrow">Attock Welfare</p><h1 className="page-title">{t("myContributions")}</h1><p className="text-sm text-slate-500">{t("paymentHistory")}</p></div>{user && <PaymentGrid userId={user.id} />}</DashboardShell></ProtectedRoute>; }
