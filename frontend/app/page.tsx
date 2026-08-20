"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      let user: { role?: string } = {};
      try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch { localStorage.removeItem("token"); localStorage.removeItem("user"); router.replace("/login"); return; }
      // Redirect to appropriate dashboard
      if (user.role === "OWNER") {
        router.push("/owner");
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "USER") {
        router.push("/user");
      } else {
        localStorage.removeItem("token"); localStorage.removeItem("user"); router.replace("/login");
      }
    } else {
      // Redirect to login
      router.push("/login");
    }
  }, [router]);

  return <main className="grid min-h-screen place-items-center bg-[#f6f3eb]"><p className="text-sm text-slate-500">Loading...</p></main>;
}
