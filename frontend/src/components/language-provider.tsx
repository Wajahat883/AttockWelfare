"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Language, translations } from "@/lib/translations";

const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void; t: (key: string) => string }>({ language: "en", toggleLanguage: () => undefined, t: (key) => key });
export function LanguageProvider({ children }: { children: ReactNode }) { const [language, setLanguage] = useState<Language>("en"); useEffect(() => { const timer = window.setTimeout(() => { const saved = localStorage.getItem("language"); if (saved === "en" || saved === "ur") setLanguage(saved); }, 0); return () => window.clearTimeout(timer); }, []); const toggleLanguage = () => { const next = language === "en" ? "ur" : "en"; setLanguage(next); localStorage.setItem("language", next); document.documentElement.lang = next; document.documentElement.dir = next === "ur" ? "rtl" : "ltr"; }; const t = (key: string) => translations[language][key] ?? translations.en[key] ?? key; return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>; }
export const useLanguage = () => useContext(LanguageContext);
