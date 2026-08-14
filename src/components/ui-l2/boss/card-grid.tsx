"use client";

import { Gem, MapPin, Skull } from "lucide-react";
import { type Boss } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { cn } from "@/lib/utils";
import { BossActionButton } from "./action-button";
import { LevelBadge, TypeDot } from "./level-badge";

export function BossCardGrid({ bosses }: { bosses: Boss[] }) {
  const { selectedBossId, setSelectedBoss } = useBossSelection();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {bosses.map((boss) => (
        <article
          key={boss.id}
          onClick={() =>
            setSelectedBoss(selectedBossId === boss.id ? null : boss.id, "list")
          }
          className={cn(
            "flex cursor-pointer flex-col border border-window-content-border bg-window-content-bg transition-colors hover:bg-white/5",
            selectedBossId === boss.id && "window-item-gradient-active bg-white/5",
          )}
        >
          <div className="relative aspect-[4/5] overflow-hidden border-b border-window-content-border bg-black/40">
            <Skull className="absolute inset-0 m-auto size-10 text-white/10" />
            <div className="absolute left-1.5 top-1.5">
              <LevelBadge level={boss.level} className="h-9 w-8" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-6">
              <div className="flex items-center gap-1.5">
                <TypeDot type={boss.type} />
                <h3 className="truncate text-sm font-bold">{boss.name}</h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-2">
            <p className="flex items-center gap-1 truncate text-[11px] text-white/50">
              <MapPin className="size-3 shrink-0 text-system-text/70" />
              <span className="truncate">{boss.location}</span>
            </p>
            <div className="flex gap-1.5">
              <BossActionButton icon={Gem} variant="gold">
                Drop
              </BossActionButton>
              <BossActionButton icon={MapPin}>Location</BossActionButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
