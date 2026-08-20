"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesCombined, CreditCard, LayoutDashboard, UsersRound } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function BottomNav({ role }: { role: "OWNER" | "ADMIN" | "USER" }) { const { t } = useLanguage(); const base = role === "OWNER" ? "/owner" : role === "ADMIN" ? "/admin" : "/user"; const pathname = usePathname(); const items = [["home", base, LayoutDashboard], ["members", role === "USER" ? base : `${base}/members`, UsersRound], ["payments", role === "USER" ? base : `${base}/payments`, CreditCard], ["reports", role === "USER" ? base : `${base}/reports`, ChartNoAxesCombined]] as const; return <nav className="bottom-nav fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border bg-white/95 px-2 pb-[calc(0.35rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_15px_40px_-18px_rgba(15,23,42,0.5)] backdrop-blur md:hidden">{items.map(([key, href, Icon]) => { const active = pathname === href; return <Link className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "text-slate-500"}`} href={href} key={`${key}-${href}`}><Icon size={18} strokeWidth={active ? 2.5 : 1.8} /><span>{t(key)}</span></Link>; })}</nav>; }
