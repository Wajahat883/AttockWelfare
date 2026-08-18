"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      // Redirect to appropriate dashboard
      if (user.role === "OWNER") {
        router.push("/owner");
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } else {
      // Redirect to login
      router.push("/login");
    }
  }, [router]);

  return <main className="grid min-h-screen place-items-center">Loading…</main>;
}
