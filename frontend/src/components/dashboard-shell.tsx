"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, ChartNoAxesCombined, CircleUserRound, CreditCard, LayoutDashboard, Menu, ShieldCheck, UsersRound, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useLanguage } from "@/components/language-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { Preferences } from "@/components/preferences";
import { ProfileMenu } from "@/components/profile-menu";
import { BottomNav } from "@/components/bottom-nav";

type Role = "OWNER" | "ADMIN" | "USER";
const icons = { overview: LayoutDashboard, members: UsersRound, payments: CreditCard, reports: ChartNoAxesCombined, admins: ShieldCheck, profile: CircleUserRound };

export function DashboardShell({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname(); const { t } = useLanguage(); const user = useAuthStore((state) => state.user); const [menuOpen, setMenuOpen] = useState(false);
  const base = role === "OWNER" ? "/owner" : role === "ADMIN" ? "/admin" : "/user";
  const links = role === "USER" ? [{ key: "profile", href: base }, { key: "payments", href: base }] : [{ key: "overview", href: base }, { key: "members", href: `${base}/members` }, { key: "payments", href: `${base}/payments` }, { key: "reports", href: `${base}/reports` }, ...(role === "OWNER" ? [{ key: "admins", href: `${base}/admins` }] : [])];
  const navigation = (mobile = false) => <nav className={`${mobile ? "mt-8" : "mt-4"} space-y-2`}>{links.map(({ key, href }) => { const Icon = icons[key as keyof typeof icons]; const active = pathname === href; return <Link onClick={() => setMenuOpen(false)} className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-[#fbfaf5] text-[#245f4d] shadow-sm" : "text-[#70827a] hover:bg-white/60 hover:text-[#245f4d]"}`} href={href} key={`${key}-${href}`}><Icon size={18} strokeWidth={1.8} />{t(key)}{active && <span className="ml-auto size-1.5 rounded-full bg-[#d69b35]" />}</Link>; })}</nav>;
  return <div className="theme-bg min-h-screen bg-[#f6f3eb] text-slate-800">
    <aside className="theme-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-emerald-950/10 bg-[#e5efe4] px-5 py-7 lg:block"><Brand /><p className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#84988d]">{role === "USER" ? t("member") : "Workspace"}</p>{navigation()}<AccessCard role={role} name={user?.name} /></aside>
    {menuOpen && <><button aria-label="Close menu" className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} /><aside className="theme-sidebar fixed inset-y-0 left-0 z-50 w-[min(84vw,20rem)] border-r border-emerald-950/10 bg-[#e5efe4] px-5 py-7 shadow-2xl lg:hidden"><div className="flex items-center justify-between"><Brand /><button aria-label="Close menu" className="grid size-10 place-items-center rounded-xl border border-emerald-950/10" onClick={() => setMenuOpen(false)}><X size={18} /></button></div><p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#84988d]">{role === "USER" ? t("member") : "Workspace"}</p>{navigation(true)}<AccessCard role={role} name={user?.name} /></aside></>}
    <div className="lg:pl-64"><header className="theme-header sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-3 border-b border-[#ddd9cf] bg-[#f6f3eb]/90 px-3 backdrop-blur sm:px-8"><div className="flex min-w-0 items-center gap-2"><button aria-label="Open menu" className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#ddd9cf] bg-white/70 lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={19} /></button><div className="mobile-header-brand flex items-center gap-2 lg:hidden"><Image src="/logo.jpg" alt="Attock Welfare logo" width={38} height={38} className="size-9 shrink-0 rounded-xl object-cover" /><span className="hidden font-serif text-base font-bold text-[#233d37] sm:inline">Attock Welfare</span></div><div className="desktop-workspace min-w-0 hidden lg:block"><p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-[#87978e]">{role === "OWNER" ? "Owner workspace" : role === "ADMIN" ? "Admin workspace" : "Member space"}</p><p className="mt-1 truncate text-sm text-[#65766e]">Attock, Punjab · {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p></div></div><div className="dashboard-top-controls flex shrink-0 items-center gap-1.5 sm:gap-2"><InstallPrompt /><Preferences /><button aria-label="Notifications" className="notification-button hidden size-10 shrink-0 place-items-center rounded-xl border border-[#ddd9cf] bg-white/70 text-[#71847a] sm:grid"><Bell size={17} /></button><ProfileMenu /></div></header><main className="app-page"><div className="app-container">{children}</div></main></div><BottomNav role={role} />
  </div>;
}

function Brand() { return <div className="flex items-center gap-3 px-2"><div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-emerald-950/15"><Image src="/logo.jpg" alt="Attock Welfare logo" width={44} height={44} className="size-full object-cover object-center" /></div><div><p className="font-serif text-lg font-bold text-[#233d37]">Attock Welfare</p><p className="text-[10px] uppercase tracking-[0.2em] text-[#6c8178]">Aapas ka sahara</p></div></div>; }
function AccessCard({ role, name }: { role: Role; name?: string }) { return <div className="absolute bottom-7 left-5 right-5 rounded-2xl bg-[#cfe4d5] p-4 text-sm text-[#245f4d]"><p className="font-semibold">{role === "OWNER" ? "Owner access" : role === "ADMIN" ? "Daily operations" : "Your welfare space"}</p><p className="mt-1 text-xs text-[#54766a]">{name ?? "Attock Welfare"}</p></div>; }
