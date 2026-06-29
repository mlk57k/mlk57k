"use client";

import { useEffect, useState } from "react";
import type { Issue } from "@/lib/scan-schema";

function severityMeta(severity: number) {
  if (severity <= 30)
    return {
      border: "border-l-emerald-400",
      bar: "bg-emerald-400",
      label: "Au top",
      labelClass: "text-emerald-700 bg-emerald-50",
    };
  if (severity <= 60)
    return {
      border: "border-l-amber-400",
      bar: "bg-amber-400",
      label: "Correct",
      labelClass: "text-amber-700 bg-amber-50",
    };
  return {
    border: "border-l-coral-400",
    bar: "bg-coral-400",
    label: "À chouchouter",
    labelClass: "text-coral-700 bg-coral-50",
  };
}

function SeverityBar({ severity, delay }: { severity: number; delay: number }) {
  const [width, setWidth] = useState(0);
  const meta = severityMeta(severity);

  useEffect(() => {
    const t = setTimeout(() => setWidth(severity), delay);
    return () => clearTimeout(t);
  }, [severity, delay]);

  return (
    <div className="h-1.5 rounded-full bg-cream-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${meta.bar} transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function IssuesList({ issues }: { issues: Issue[] }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-stone-900 mb-4">
        Ce que l&apos;IA a remarqué
      </h2>
      <div className="space-y-3">
        {issues.map((issue, i) => {
          const meta = severityMeta(issue.severity);
          return (
            <div
              key={issue.name}
              className={`rounded-2xl bg-white border border-cream-200 border-l-4 ${meta.border} p-4 shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-semibold text-sm text-stone-900">
                  {issue.name}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${meta.labelClass}`}
                >
                  {meta.label}
                </span>
              </div>
              <SeverityBar severity={issue.severity} delay={250 + i * 120} />
              <p className="text-sm text-stone-500 mt-2.5 leading-relaxed">
                {issue.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
