"use client";

import { cn } from "@/lib/utils";
import { levelRanges } from "@/lib/boss-data";

export interface LevelFilterProps {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
  total: number;
}

export function LevelFilter({
  active,
  onChange,
  counts,
  total,
}: LevelFilterProps) {
  const items = [
    { id: "all", label: "All", count: total },
    ...levelRanges.map((r) => ({
      id: `${r.min}-${r.max}`,
      label: r.label.replace("Level ", ""),
      count: counts[`${r.min}-${r.max}`] ?? 0,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            className={cn(
              "flex h-7 items-center gap-1.5 border border-window-content-border bg-window-content-bg px-2.5 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
              isActive && "window-item-gradient-active bg-white/5 text-system-text",
            )}
          >
            {item.label}
            <span
              className={cn(
                "text-[10px] tabular-nums",
                isActive ? "text-system-text/80" : "text-white/30",
              )}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
