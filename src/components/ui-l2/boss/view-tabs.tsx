"use client";

import { LayoutGrid, List, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type BossView = "cards" | "roster" | "board";

const views: { id: BossView; label: string; icon: typeof LayoutGrid }[] = [
  { id: "cards", label: "Cards", icon: LayoutGrid },
  { id: "roster", label: "Roster", icon: List },
  { id: "board", label: "Board", icon: Table2 },
];

export function ViewTabs({
  active,
  onChange,
}: {
  active: BossView;
  onChange: (view: BossView) => void;
}) {
  return (
    <div className="flex border border-window-content-border bg-window-content-bg">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = active === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
              isActive && "window-item-gradient-active bg-white/5 text-system-text",
            )}
          >
            <Icon className="size-3.5" />
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
