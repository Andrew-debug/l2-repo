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
    // pointer-events-none — purely decorative (no interactive descendants),
    // so it shouldn't block clicks on the epic-boss background art it sits
    // over (see Background's return-to-game panels).
    <div className="pointer-events-none absolute right-0 bottom-16 left-0 border-t border-black">
      <div
        className="border-t border-b border-t-window-inner-gray border-b-black"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,8,10,0.62) 0%, rgba(3,4,6,0.9) 100%)",
        }}
      >
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(189,174,132,0) 0%, rgba(189,174,132,0.45) 12%, rgba(189,174,132,0.45) 88%, rgba(189,174,132,0) 100%)",
          }}
        />
        <div className="grid grid-cols-8">
          {EPIC_BOSS_NAMES.map((name, i) => (
            <div
              key={name}
              className="relative flex items-center justify-center gap-2.25 py-2.25"
            >
              <span
                className="size-1.25 rotate-45"
                style={{
                  background: "linear-gradient(135deg, #bdae84, #735929)",
                }}
              />
              <span className="text-[12px] tracking-[0.16em] text-system-text">
                {name.toUpperCase()}
              </span>
              <span className="text-[11px] text-white/38">—</span>
              {i < EPIC_BOSS_NAMES.length - 1 && (
                <>
                  <div
                    className="absolute top-1 right-0 bottom-1 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 50%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                  <div
                    className="absolute top-1 -right-px bottom-1 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
