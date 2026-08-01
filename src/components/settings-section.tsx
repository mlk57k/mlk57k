"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

/* Bloc de paramètre repliable : on ne voit que le titre, on tape pour déplier
   tout le détail. Le parent gère `openId` pour n'ouvrir qu'un bloc à la fois
   (accordéon). Réutilisé sur Paramètres et Mes données & export. */
export function SettingsSection({
  id,
  title,
  icon,
  openId,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  openId: string | null;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-stone-500/[0.08]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-coral-400">
          {icon}
        </span>
        <span className="font-display text-lg font-bold text-stone-900 flex-1">{title}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-cream-200">{children}</div>
        </div>
      </div>
    </Card>
  );
}

/* Même apparence qu'un bloc de paramètre, mais renvoie vers une autre page au
   lieu de se déplier (flèche → au lieu du chevron ↓). */
export function SettingsLink({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <Link
        href={href}
        className="w-full flex items-center gap-3 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-stone-500/[0.08]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-coral-400">
          {icon}
        </span>
        <span className="font-display text-lg font-bold text-stone-900 flex-1">{title}</span>
        <ChevronRight className="h-5 w-5 shrink-0 text-stone-400" />
      </Link>
    </Card>
  );
}
