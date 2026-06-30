"use client";

import { cn } from "@/lib/utils";

export function AppLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: { icon: 16, text: "text-lg" },
    md: { icon: 20, text: "text-xl" },
    lg: { icon: 24, text: "text-2xl" },
  };
  const { icon, text } = dims[size];

  return (
    <span className={cn("inline-flex items-center gap-1.5 select-none", className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        {/* Anchor mark — ancrage / stabilité */}
        <circle cx="10" cy="4" r="2" stroke="#c4523a" strokeWidth="1.4" />
        <path
          d="M10 6V16M5 11C5 14 7.5 16 10 16C12.5 16 15 14 15 11"
          stroke="#c4523a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path d="M6 9H14" stroke="#c4523a" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span
        className={cn(
          "font-display font-semibold tracking-tight text-stone-900 leading-none",
          text
        )}
      >
        Ancrage
      </span>
    </span>
  );
}
