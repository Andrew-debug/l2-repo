"use client";

import { Clock, Gem, MapPin, Skull } from "lucide-react";
import { type Boss } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { cn } from "@/lib/utils";
import { BossActionButton } from "./action-button";
import { LevelBadge, TypeDot } from "./level-badge";

export function BossRosterList({ bosses }: { bosses: Boss[] }) {
  const { selectedBossId, setSelectedBoss } = useBossSelection();

  return (
    <ul className="flex flex-col gap-1.5">
      {bosses.map((boss) => (
        <li
          key={boss.id}
          onClick={() =>
            setSelectedBoss(selectedBossId === boss.id ? null : boss.id, "list")
          }
          className={cn(
            "flex cursor-pointer flex-col gap-2 border border-window-content-border bg-window-content-bg p-2 transition-colors hover:bg-white/5 sm:flex-row sm:items-center",
            selectedBossId === boss.id && "window-item-gradient-active bg-white/5",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="relative flex size-12 shrink-0 items-center justify-center border border-window-content-border bg-black/40">
              <Skull className="size-5 text-white/15" />
            </div>
            <LevelBadge level={boss.level} className="h-12 w-10" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <TypeDot type={boss.type} />
              <h3 className="truncate text-sm font-bold">{boss.name}</h3>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50">
              <span className="flex items-center gap-1">
                <MapPin className="size-3 text-system-text/70" />
                {boss.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-system-text/70" />
                {boss.respawnTime}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-1.5">
            <BossActionButton icon={Gem} variant="gold" className="sm:w-24">
              Drop
            </BossActionButton>
            <BossActionButton icon={MapPin} className="sm:w-24">
              Location
            </BossActionButton>
          </div>
        </li>
      ))}
    </ul>
  );
}
