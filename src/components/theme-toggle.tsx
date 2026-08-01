"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, SunMoon } from "lucide-react";

type Choice = "light" | "dark" | "auto";

const OPTIONS: { value: Choice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "auto", label: "Auto", icon: SunMoon },
  { value: "dark", label: "Sombre", icon: Moon },
];

function apply(choice: Choice) {
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = choice === "dark" || (choice === "auto" && sysDark);
  document.documentElement.classList.toggle("theme-dark", dark);
  if (choice === "auto") localStorage.removeItem("ancrage-theme");
  else localStorage.setItem("ancrage-theme", choice);
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>("auto");

  useEffect(() => {
    const stored = localStorage.getItem("ancrage-theme");
    setChoice(stored === "light" || stored === "dark" ? stored : "auto");
  }, []);

  function select(value: Choice) {
    setChoice(value);
    apply(value);
  }

  return (
    <div className="inline-flex rounded-full bg-cream-100 border border-cream-200 p-1">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => select(value)}
          aria-pressed={choice === value}
          className={
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
            (choice === value
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-700")
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
