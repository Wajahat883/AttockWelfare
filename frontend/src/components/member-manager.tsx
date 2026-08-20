"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { membersApi } from "@/lib/api";
import { CreateMemberFormData, User } from "@/types";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

const emptyForm: CreateMemberFormData = { name: "", fatherName: "", address: "", phone: "", monthlyAmount: 0 };

export function MemberManager({ canDelete }: { canDelete: boolean }) {
  const { t } = useLanguage();
  const [members, setMembers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<CreateMemberFormData>(emptyForm);
  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try { const response = await membersApi.getAll(); setMembers(response.data.data ?? []); }
    catch { setError("Unable to load members. Please try again."); }
  };
  useEffect(() => { const timer = window.setTimeout(() => void loadMembers(), 0); return () => window.clearTimeout(timer); }, []);

  const visibleMembers = useMemo(() => {
    const text = query.toLowerCase();
    return members.filter((member) => [member.name, member.fatherName, member.phone].some((value) => value?.toLowerCase().includes(text)));
  }, [members, query]);

  const edit = (member: User) => { setEditing(member); setForm({ name: member.name, fatherName: member.fatherName ?? "", address: member.address ?? "", phone: member.phone, monthlyAmount: Number(member.monthlyAmount) }); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setForm(emptyForm); setError(""); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    try {
      if (editing) await membersApi.update(editing.id, form); else await membersApi.create(form);
      close(); await loadMembers();
    } catch (err) { const apiError = err as AxiosError<{ message?: string }>; setError(apiError.response?.data?.message ?? "Could not save the member."); }
  };
  const remove = async (member: User) => {
    if (!window.confirm(`Remove ${member.name}? Their account will be deactivated.`)) return;
    try { await membersApi.delete(member.id); await loadMembers(); } catch { setError("Could not remove this member."); }
  };

  return <section className="space-y-5">
    <div className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{t("memberDirectory")}</p><p className="text-sm text-slate-500">{visibleMembers.length} / {members.length} {t("members")}</p></div><div className="flex flex-col gap-2 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchMembers")} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 sm:w-72" /><Button className="min-h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800" onClick={() => { setOpen(true); setEditing(null); setForm(emptyForm); }}>{t("addMember")}</Button></div></div>
    {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <div className="desktop-table surface overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">{t("name")}</th><th className="p-4">{t("fatherName")}</th><th className="p-4">{t("phone")}</th><th className="p-4">{t("monthlyAmount")}</th><th className="p-4">{t("joinedDate")}</th><th className="p-4">{t("status")}</th><th className="p-4">{t("actions")}</th></tr></thead><tbody>{visibleMembers.map((member) => <tr className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/30" key={member.id}><td className="p-4 font-semibold text-slate-900">{member.name}</td><td className="p-4 text-slate-600">{member.fatherName || "—"}</td><td className="p-4 text-slate-600">{member.phone}</td><td className="p-4 font-medium">Rs. {Number(member.monthlyAmount).toLocaleString()}</td><td className="p-4 text-xs text-slate-500">{new Date(member.createdAt).toLocaleDateString()}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{member.isActive ? t("active") : t("inactive")}</span></td><td className="p-4"><Button variant="outline" size="sm" className="rounded-lg" onClick={() => edit(member)}>{t("edit")}</Button>{canDelete && member.isActive && <Button variant="destructive" size="sm" className="ml-2 rounded-lg" onClick={() => void remove(member)}>{t("remove")}</Button>}</td></tr>)}</tbody></table></div>
    <div className="mobile-card-list gap-3">{visibleMembers.map((member) => <article className="surface p-4" key={`mobile-${member.id}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{member.name}</p><p className="mt-1 text-sm text-slate-500">{member.fatherName || "—"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{member.isActive ? t("active") : t("inactive")}</span></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm"><div><dt className="text-xs text-slate-500">{t("phone")}</dt><dd className="mt-1 font-medium">{member.phone}</dd></div><div><dt className="text-xs text-slate-500">{t("monthlyAmount")}</dt><dd className="mt-1 font-medium">Rs. {Number(member.monthlyAmount).toLocaleString()}</dd></div><div><dt className="text-xs text-slate-500">{t("joinedDate")}</dt><dd className="mt-1 font-medium">{new Date(member.createdAt).toLocaleDateString()}</dd></div></dl><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" className="min-h-10 flex-1 rounded-lg" onClick={() => edit(member)}>{t("edit")}</Button>{canDelete && member.isActive && <Button variant="destructive" size="sm" className="min-h-10 flex-1 rounded-lg" onClick={() => void remove(member)}>{t("remove")}</Button>}</div></article>)}</div>
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"><form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="page-eyebrow">{t("memberDirectory")}</p><h2 className="mt-1 text-xl font-semibold">{editing ? t("editMember") : t("addMember")}</h2></div><Button type="button" variant="ghost" className="min-h-11 rounded-xl" onClick={close}>{t("close")}</Button></div>{([['name',t("name")],['fatherName',t("fatherName")],['address',t("address")],['phone',t("phone")]] as const).map(([key,label]) => <label className="block text-sm font-medium text-slate-700" key={key}>{label}<input required={key === 'name' || key === 'phone'} value={form[key] ?? ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3" /></label>)}<label className="block text-sm font-medium text-slate-700">{t("monthlyAmount")}<input required min="0" type="number" value={form.monthlyAmount} onChange={(event) => setForm({ ...form, monthlyAmount: Number(event.target.value) })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3" /></label><Button type="submit" className="min-h-11 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">{t("saveMember")}</Button></form></div>}
  </section>;
}
