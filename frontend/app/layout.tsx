import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { LanguageProvider } from "@/components/language-provider";

export const metadata: Metadata = {
  title: "Attock Welfare",
  description: "Monthly Contribution Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider><AuthProvider><ServiceWorkerRegister />{children}</AuthProvider></LanguageProvider>
      </body>
    </html>
  );
}
