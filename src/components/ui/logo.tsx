"use client";

import { cn } from "@/lib/utils";

export function GlowyLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: { icon: 14, text: "text-lg" },
    md: { icon: 18, text: "text-xl" },
    lg: { icon: 22, text: "text-2xl" },
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
        {/* 4-pointed sparkle */}
        <path
          d="M10 1L12 8L19 10L12 12L10 19L8 12L1 10L8 8Z"
          fill="#e8826a"
        />
        {/* Small accent dot */}
        <circle cx="15.5" cy="4.5" r="1.2" fill="#eea593" opacity="0.7" />
      </svg>
      <span
        className={cn(
          "font-display font-bold italic tracking-tight text-stone-900 leading-none",
          text
        )}
      >
        glowy
      </span>
    </span>
  );
}
