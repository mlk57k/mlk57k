import type { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar";

export const metadata: Metadata = {
  title: "Mon plan",
  robots: { index: false, follow: false },
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  );
}
