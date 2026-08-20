"use client";
import { DashboardHome } from "@/components/dashboard-home";
import { DashboardShell } from "@/components/dashboard-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { useLanguage } from "@/components/language-provider";

export default function AdminDashboard() { const { t } = useLanguage(); return <ProtectedRoute requiredRoles={["ADMIN"]}><DashboardShell role="ADMIN"><div className="mb-8 flex flex-col gap-2"><p className="page-eyebrow">Attock Welfare</p><h1 className="page-title">{t("dailyOperations")}</h1><p className="text-sm text-slate-500">{t("members")} · {t("payments")} · {t("reports")}</p></div><DashboardHome role="ADMIN" /></DashboardShell></ProtectedRoute>; }
