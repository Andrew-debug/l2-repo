"use client";

import { useHeaderVisibility } from "@/components/providers/HeaderVisibilityProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { bosses } from "@/lib/boss-data";

// Full-width top bar — gold pennant shape (wide sides, a taller notch over
// the centered title) clipped out of a two-layer gradient (gold outer,
// near-black inner), plus real tracked-boss counts on either side of the
// title. Toggled from Options' Display section (the "Header" checkbox) —
// MainWindowsRow reads the same flag to reclaim/give back the reserved top
// space, so hiding this never leaves a dead gap or an overlap.
const OUTER_CLIP =
  "polygon(0 0, 100% 0, 100% 42px, 62% 42px, 60% 80px, 40% 80px, 38% 42px, 0 42px)";
const INNER_CLIP =
  "polygon(1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) 41px, calc(62% - 1px) 41px, calc(60% - 1px) 79px, calc(40% + 1px) 79px, calc(38% + 1px) 41px, 1px 41px)";

export function PageTitleBanner() {
  const { isHeaderVisible, isHeaderVisibleHydrated } = useHeaderVisibility();
  const { trackedBossIds, getStatus } = useBossRespawn();
  // Renders nothing at all until the real persisted value has loaded —
  // isHeaderVisible defaults to true (matching SSR, which has no
  // localStorage), so rendering based on that default would flash the
  // banner on screen for a moment for a player who'd actually turned it
  // off, before snapping away once hydrated. See usePersistedBoolean's own
  // isHydrated comment.
  if (!isHeaderVisibleHydrated || !isHeaderVisible) return null;

  const upNowCount = trackedBossIds.filter(
    (id) => getStatus(id) === "alive",
  ).length;
  const couldBeUpCount = trackedBossIds.filter(
    (id) => getStatus(id) === "pending",
  ).length;

  return (
    // pointer-events-none — purely decorative (no interactive descendants),
    // so it shouldn't block clicks on the epic-boss background art it sits
    // over (see Background's return-to-game panels).
    <div className="pointer-events-none absolute top-0 right-0 left-0 h-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #735929 0%, #bdae84 50%, #735929 100%)",
          clipPath: OUTER_CLIP,
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.9))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #1c2127 0%, #0c0f13 62%, #05070a 100%)",
          clipPath: INNER_CLIP,
        }}
      />
      <div
        className="absolute top-10.25 right-0 left-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(189,174,132,0) 0%, rgba(189,174,132,0.55) 20%, rgba(189,174,132,0.1) 38%, rgba(189,174,132,0) 50%, rgba(189,174,132,0.1) 62%, rgba(189,174,132,0.55) 80%, rgba(189,174,132,0) 100%)",
        }}
      />

      <div className="pointer-events-auto absolute top-0 left-0 box-border flex h-10.5 w-[38%] items-center gap-3.5 pl-5.5">
        <span className="text-[11px] tracking-[0.3em] text-system-text">
          CHRONICLE: INTERLUDE
        </span>
        <span className="size-1 rotate-45 bg-[#8d7c50]" />
        <span className="text-[11px] tracking-[0.12em] text-white/42">
          {bosses.length} BOSSES TRACKED
        </span>
      </div>

      <div className="pointer-events-auto absolute top-0 right-0 box-border flex h-10.5 w-[38%] items-center justify-end gap-3.5 pr-5.5">
        {upNowCount > 0 && (
          <span className="flex items-center gap-1.25 text-[11px] tracking-[0.12em] text-[#7ed957]">
            <span className="size-1.5 rounded-full bg-[#7ed957] shadow-[0_0_6px_#7ed957]" />
            {upNowCount} UP NOW
          </span>
        )}
        {couldBeUpCount > 0 && (
          <span className="flex items-center gap-1.25 text-[11px] tracking-[0.12em] text-[#f5c518]">
            <span className="size-1.5 rounded-full bg-[#f5c518] shadow-[0_0_6px_#f5c518]" />
            {couldBeUpCount} COULD BE UP
          </span>
        )}
        <span className="size-1 rotate-45 bg-[#8d7c50]" />
        <span className="text-[11px] tracking-[0.22em] text-system-text">
          l2bosstracker.com
        </span>
      </div>

      <div className="pointer-events-auto absolute top-1/2 left-1/2 w-[22%] -translate-x-1/2 -translate-y-1/2  text-center">
        <div
          className="font-marcellus text-[25px] leading-[1.05] tracking-[0.17em] text-[#e8dcc0]"
          style={{
            textShadow: "0 0 14px rgba(189,174,132,0.4), 1px 1px 0 #000",
          }}
        >
          LINEAGE 2
        </div>
        <div className="mt-0.75 flex items-center justify-center gap-2">
          <div className="h-px w-8.5 bg-linear-to-r from-[#bdae84]/0 to-[#bdae84]/70" />
          <span className="font-marcellus text-[14px] tracking-[0.26em] text-system-text">
            BOSS TRACKER
          </span>
          <div className="h-px w-8.5 bg-linear-to-r from-[#bdae84]/70 to-[#bdae84]/0" />
        </div>
      </div>
    </div>
  );
}
