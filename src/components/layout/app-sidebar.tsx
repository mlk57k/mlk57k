"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  BookOpen,
  Map,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/coach", icon: MessageCircle, label: "Mon coach" },
  { href: "/journal", icon: BookOpen, label: "Journal" },
  { href: "/plan", icon: Map, label: "Mon plan" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold text-foreground">Libero</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
