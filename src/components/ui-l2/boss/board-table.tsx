"use client";

import { Gem, MapPin } from "lucide-react";
import { getBossDrops, type Boss } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { cn } from "@/lib/utils";
import { BossActionButton } from "./action-button";
import { LevelBadge, TypeDot } from "./level-badge";

export function BossBoardTable({ bosses }: { bosses: Boss[] }) {
  const { selectedBossId, setSelectedBoss } = useBossSelection();

  return (
    <div className="border border-window-content-border bg-window-content-bg">
      <div className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 border-b border-window-content-border bg-black/30 px-2 py-1.5 text-[10px] uppercase tracking-widest text-white/40">
        <span>Lv</span>
        <span>Boss</span>
        <span>Location</span>
        <span className="text-right">Actions</span>
      </div>
      <ul>
        {bosses.map((boss, i) => {
          const topDrop = getBossDrops(boss)[0];
          return (
            <li
              key={boss.id}
              onClick={() =>
                setSelectedBoss(selectedBossId === boss.id ? null : boss.id, "list")
              }
              className={cn(
                "grid cursor-pointer grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 border-b border-window-content-border/60 px-2 py-1.5 last:border-b-0 transition-colors hover:bg-white/5",
                i % 2 === 1 && "bg-black/20",
                selectedBossId === boss.id && "window-item-gradient-active bg-white/5",
              )}
            >
              <LevelBadge level={boss.level} className="h-8 w-8" />

              <div className="min-w-0 flex items-center gap-1.5">
                <TypeDot type={boss.type} />
                <p className="truncate text-xs font-bold">{boss.name}</p>
              </div>

              <div className="min-w-0 text-[11px] text-white/50">
                <p className="truncate">{boss.location}</p>
                {topDrop && (
                  <p className="truncate text-system-text/80">
                    {topDrop.icon} {topDrop.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-1">
                <BossActionButton icon={Gem} variant="gold" iconOnly />
                <BossActionButton icon={MapPin} iconOnly />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
