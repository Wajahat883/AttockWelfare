"use client";
import { useEffect, useState } from "react";
export function InstallPrompt() { const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null); useEffect(() => { const handler = (value: Event) => { value.preventDefault(); setEvent(value as BeforeInstallPromptEvent); }; window.addEventListener("beforeinstallprompt", handler); return () => window.removeEventListener("beforeinstallprompt", handler); }, []); if (!event) return null; return <button className="install-prompt min-h-11 rounded-lg bg-amber-500 px-3 text-sm font-semibold text-white" onClick={() => { void event.prompt(); setEvent(null); }}>Install app</button>; }
interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; }
