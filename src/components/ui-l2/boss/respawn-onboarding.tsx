"use client";

import { useState } from "react";
import { GoldButton } from "../gold-button";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { findRespawnPreset } from "@/lib/respawn-presets";

// Three representative picks for the strip — not the full 8-preset list
// (that's what the Respawn Settings window is for), just enough to answer
// the question in one tap for most servers.
const QUICK_PRESET_IDS = ["static-12h", "12-16h", "24-48h"];

// Shown once, over the map, after the player marks their first kill —
// asking about respawn timing before there's a single timer to apply it to
// would just be noise on an empty map — until the respawn range is
// explicitly set (or skipped). The map itself works fine before that, only
// timers read "window unknown" in the meantime, so this never blocks
// anything.
export function RespawnOnboarding() {
  const {
    hasCustomRange,
    hasEverMarkedKilled,
    setGlobalRange,
    dismissRespawnOnboarding,
  } = useBossRespawn();
  // null = no flash. A number = the flash overlay's key, bumped on every
  // click that lands on the backdrop (not the box itself) so remounting it
  // replays the CSS animation from scratch even on rapid repeat clicks.
  // Reset back to null on the animation's own end event — without that,
  // the div stayed mounted after the animation finished and (since CSS
  // animations revert to their base style once done, not the final
  // keyframe, absent animation-fill-mode) snapped back to opacity:1 —
  // solid white, stuck over the popup forever.
  const [flashKey, setFlashKey] = useState<number | null>(null);

  if (hasCustomRange || !hasEverMarkedKilled) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setFlashKey((k) => (k ?? 0) + 1);
      }}
    >
      <div className="relative w-100 border border-window-content-border bg-black/85 p-3">
        {flashKey !== null && (
          <div
            key={flashKey}
            aria-hidden
            className="attention-flash pointer-events-none absolute inset-0"
            onAnimationEnd={() => setFlashKey(null)}
          />
        )}
        <p className="text-[15px] text-system-text">
          How long does your server take to respawn a boss?
        </p>
        <p className="mt-1 text-[13px] text-white/50">
          Asked once. It sets every timer on this map. Change it any time from
          the Respawn Settings window.
        </p>
        <div className="mt-2.5 flex gap-1.5">
          {QUICK_PRESET_IDS.map((id) => {
            const preset = findRespawnPreset(id);
            if (!preset) return null;
            return (
              <GoldButton
                key={id}
                active={id === "12-16h"}
                className="flex-1"
                onClick={() =>
                  setGlobalRange({
                    minHours: preset.minHours,
                    maxHours: preset.maxHours,
                  })
                }
              >
                {preset.label}
              </GoldButton>
            );
          })}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[13px]">
          <span className="text-button-text">Other / custom…</span>
          <button
            onClick={dismissRespawnOnboarding}
            className="text-white/40 transition-colors hover:text-white/70"
          >
            Skip — I&rsquo;ll set it later
          </button>
        </div>
      </div>
    </div>
  );
}
