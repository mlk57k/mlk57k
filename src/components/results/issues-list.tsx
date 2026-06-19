"use client";

import { useEffect, useState } from "react";
import type { Issue } from "@/lib/scan-schema";

/** Couleur de la barre selon la sévérité (vert = top, corail = à chouchouter). */
function severityColor(severity: number): string {
  if (severity <= 30) return "from-green-400 to-green-500";
  if (severity <= 60) return "from-amber-400 to-amber-500";
  return "from-coral-400 to-coral-500";
}

function severityTag(severity: number): string {
  if (severity <= 30) return "Au top";
  if (severity <= 60) return "Correct";
  return "À chouchouter";
}

function SeverityBar({ severity, delay }: { severity: number; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(severity), delay);
    return () => clearTimeout(t);
  }, [severity, delay]);

  return (
    <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${severityColor(
          severity
        )} transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function IssuesList({ issues }: { issues: Issue[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-4">Ce que l&apos;IA a remarqué</h2>
      <div className="space-y-4">
        {issues.map((issue, i) => (
          <div
            key={issue.name}
            className="rounded-2xl bg-white border border-cream-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{issue.name}</span>
              <span className="text-xs font-medium text-stone-400">
                {severityTag(issue.severity)}
              </span>
            </div>
            <SeverityBar severity={issue.severity} delay={200 + i * 120} />
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              {issue.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
