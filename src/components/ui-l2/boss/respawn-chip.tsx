"use client";

import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { cn } from "@/lib/utils";

// Small persistent reminder of the current respawn range — dashed and
// unlabeled reads as an invitation ("nothing's wrong, just unset yet"), not
// an error, since the map is fully usable before it's configured. "change"
// just points at the always-visible Respawn Settings window rather than
// opening/focusing it — that window has no open/closed toggle today.
export function RespawnChip() {
  const { globalRange, hasCustomRange } = useBossRespawn();

  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 flex items-center gap-2 border bg-black/85 px-2.5 py-1.25 text-[11px]",
        hasCustomRange
          ? "border-window-content-border"
          : "border-dashed border-system-text/60",
      )}
    >
      <span className="text-system-text">Respawn</span>
      {hasCustomRange ? (
        <>
          <span className="text-white/80">
            {globalRange.minHours} – {globalRange.maxHours} h
          </span>
          <span className="text-white/30">· change</span>
        </>
      ) : (
        <span className="text-white/50">not set</span>
      )}
    </div>
  );
}
