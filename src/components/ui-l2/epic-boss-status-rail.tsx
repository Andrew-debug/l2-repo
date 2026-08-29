"use client";

import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";

// Same eight epic bosses, in the same order, as background.tsx's image
// grid — so each column of this rail lines up under the boss pictured
// above it.
const EPIC_BOSS_NAMES = [
  "Queen Ant",
  "Baium",
  "Core",
  "Orfen",
  "Frintezza",
  "Antharas",
  "Valakas",
  "Zaken",
];

// Decorative shell only, by design — no live status/countdown wiring yet.
// Every entry shows the same neutral placeholder rather than fabricated
// colors/timers that could be mistaken for real tracked data; wiring this
// up to useBossRespawn is a separate follow-up. Only shown alongside the
// epic-boss background images themselves (same isBackgroundVisible flag
// Background/Options read), since it's meant to read as part of that
// backdrop, not a standalone widget.
export function EpicBossStatusRail() {
  const { isBackgroundVisible } = useBackgroundDim();
  if (!isBackgroundVisible) return null;

  return (
    <div className="absolute right-0 bottom-16 left-0 grid grid-cols-8 border-y border-[#bdae84]/28 bg-gradient-to-b from-black/20 to-black/72">
      {EPIC_BOSS_NAMES.map((name) => (
        <div
          key={name}
          className="flex items-center justify-center gap-1.75 border-r border-[#bdae84]/16 py-2 last:border-r-0"
        >
          <span className="size-1.5 rounded-full bg-white/30" />
          <span className="text-[12px] tracking-[0.14em] text-system-text">
            {name.toUpperCase()}
          </span>
          <span className="text-[11px] text-white/45">—</span>
        </div>
      ))}
    </div>
  );
}
