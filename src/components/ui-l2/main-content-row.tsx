"use client";

import BossLevelNavigator from "./boss/level-navigator";
import Map from "../map/Map";
import { BossLootDisplay } from "./boss/loot-display";
import BossInfoDisplay from "./boss/info-display";
import UpcomingSpawns from "./boss/upcoming-spawns";
import { useHeaderVisibility } from "@/components/providers/HeaderVisibilityProvider";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";

// Fixed pixel footprints of the page's other chrome, measured directly off
// the rendered PageTitleBanner/EpicBossStatusRail/MenuSection dock (via a
// Playwright render, not guessed) — all three are static decorative
// elements with no user-resizable content, so these stay accurate unless
// their own markup changes.
const HEADER_HEIGHT_PX = 80; // PageTitleBanner's own height (it's a flush top-0 h-20 bar)
const EPIC_RAIL_AND_DOCK_PX = 101; // epic rail + gap + dock, when the rail is shown (it sits bottom-16)
const DOCK_ONLY_PX = 48; // just the dock (+ a little breathing room), when the rail is hidden
// Extra breathing room so this row never sits flush against the header
// above or the epic rail/dock below.
const ROW_GAP_PX = 16;
// Matches this row's own gap-4/px-4 classes — pulled out as constants
// because IDEAL_ROW_WIDTH_PX below has to add them up by hand (see there
// for why).
const COLUMN_GAP_PX = 16;
const ROW_PADDING_PX = 16;
// Raid Bosses' own fixed width (level-navigator.tsx's w-74).
const RAID_BOSSES_WIDTH_PX = 296;

// The Up Next / Drop List / NPC Info group's own column: never narrower
// than one stacked window (320px, matching their own w-80), and visually
// capped a small margin past what its 2-column layout actually needs (2 ×
// 320px + one gap-4 = 656px, +24px margin). That margin matters: the inner
// grid's @2xl container query fires at 672px (Tailwind's fixed breakpoint
// scale, not something this constant can hit exactly), so capping at
// exactly 656px would make the column permanently 16px too narrow to ever
// cross its own trigger.
const GROUP_MIN_PX = 320;
const GROUP_MAX_PX = 320 + 16 + 320 + 24;
// Matches Map's own max-w-[800px] (Map.tsx) — see below for why the grid
// track needs this value too, not just the element's own CSS max-width.
const MAP_MAX_PX = 800;

// The row's width when every column gets exactly what it wants: Raid
// Bosses' fixed width, Map at its cap, the group at its cap, the two gaps
// between them, and the row's own left/right padding. Deliberately a hand
// -computed number rather than letting the browser infer it (e.g. via
// width:fit-content) — an element's own intrinsic/max-content size is
// resolved as if no container query could ever match (avoids a genuine
// circularity: the query result depends on final layout size, which can't
// depend on an intrinsic-size pass that hasn't produced one yet), so
// fit-content only ever "sees" the group in its narrow, 1-column state
// (320px) and never discovers the wider 4-column layout exists at all —
// confirmed by an actual browser render defaulting to 3 visible columns
// (Raid Bosses / Map / stacked group) at a width that should easily fit 4.
const IDEAL_ROW_WIDTH_PX =
  RAID_BOSSES_WIDTH_PX +
  COLUMN_GAP_PX +
  MAP_MAX_PX +
  COLUMN_GAP_PX +
  GROUP_MAX_PX +
  ROW_PADDING_PX * 2;

// Owns both the vertical AND horizontal budget for the main windows row.
//
// Grid, not flex, is what makes the horizontal split precise: flex's
// grow/shrink negotiation between an unbounded flex-1 item and Map's own
// width:100%-driven sizing produced a huge, unpredictable leftover gap
// between the Up Next and Drop List/NPC Info columns (confirmed visually —
// devtools showed the group growing to 845px just to spread two 320px
// columns across it with justify-between).
//
// Grid's track-sizing algorithm still needs the *bounded* track (Map,
// minmax(0, 800px)) and the *flexible* track (the group, minmax(320px,
// 1fr)) assigned this specific way round, not the reverse — an earlier
// version gave the group the bounded minmax() and Map the 1fr, on the
// assumption that a bounded track just "caps out" while 1fr "soaks up the
// rest." That's backwards: the spec's track-sizing algorithm runs a
// "maximize tracks" pass for tracks with a finite max *before* it expands
// any fr tracks, so the bounded track always wins first claim on leftover
// space regardless of which one intuitively "sounds" more space-hungry.
// Confirmed with an actual browser render: Map was squeezed to ~74px wide
// at a 1100px viewport because the group's bounded track greedily
// maximized toward its own cap first. Swapping them so Map holds the
// bounded track (maximized first, exactly like Map's own longstanding
// max-w-[800px] behavior) and the group holds the flexible track (only
// ever receiving what's left after Map is satisfied, then capped by its
// own max-w-170 class so leftover fr-space beyond that just becomes
// margin at the row's edge) fixed it — re-verified with the same render.
//
// width: min(100%, IDEAL_ROW_WIDTH_PX) + mx-auto is what centers the whole
// four-column block on wide screens instead of pinning it to the left edge
// with all the slack dumped after the group's column: on a screen wider
// than the ideal, the row simply stops growing at that fixed number, and
// the leftover becomes equal margin on both sides via mx-auto — not extra
// width handed to the group's already-capped 1fr track. On a narrower
// screen, min() falls back to 100% (i.e. plain w-full) and the same
// track-sizing/collapse behavior above still applies unchanged.
//
// A client component specifically so it can read the header/background
// toggles to compute the vertical budget; page.tsx itself stays a server
// component composing everything else.
export function MainContentRow() {
  const { isHeaderVisible } = useHeaderVisibility();
  const { isBackgroundVisible } = useBackgroundDim();

  const topReserved = (isHeaderVisible ? HEADER_HEIGHT_PX : 0) + ROW_GAP_PX;
  const bottomReserved =
    (isBackgroundVisible ? EPIC_RAIL_AND_DOCK_PX : DOCK_ONLY_PX) + ROW_GAP_PX;

  return (
    <div
      // pointer-events-none so the empty space around/between windows
      // (this row spans nearly the full viewport regardless of which
      // windows are actually open) doesn't swallow clicks meant for the
      // epic-boss background art beneath it (see Background's return-to-
      // game panels) — every window below explicitly restores its own
      // pointer-events-auto (see DraggableWindow's root and Map's own
      // wrapper), so this doesn't affect any of them while open.
      className="pointer-events-none grid mx-auto gap-4 px-4"
      style={{
        gridTemplateColumns: `auto minmax(0, ${MAP_MAX_PX}px) minmax(${GROUP_MIN_PX}px, 1fr)`,
        width: `min(100%, ${IDEAL_ROW_WIDTH_PX}px)`,
        marginTop: topReserved,
        height: `calc(100dvh - ${topReserved + bottomReserved}px)`,
      }}
    >
      <BossLevelNavigator />
      <Map />
      {/* Up Next + Drop List + NPC Info as a group: Up Next spans the full
          height in its own column, Drop List over NPC Info beside it, once
          there's room; below that it falls back to a plain top-to-bottom
          stack (still in that same Up Next / Drop List / NPC Info order).

          Split across two nested divs on purpose: an element can't
          @container-query its own size — a query only ever looks at the
          *nearest ancestor* container, never itself. The outer div
          (min-w-0, sized by this row's own grid track above) declares the
          container; the inner div (the actual grid) queries it.

          grid-rows-3/@2xl:grid-rows-2 (both minmax(0,1fr) tracks) are what
          make "1/3 each" and "1/2 each + Up Next full height" a real
          proportional split rather than each window's own coincidental
          content height — that only works because this whole chain has a
          genuine definite height, flowing down from this row's own
          explicit height above through flex/grid stretch at every level.

          Every flex/grid item along that chain (this div, the row-span-2
          wrapper below, Map's own wrapper, and each window's own root —
          see their own min-h-0) also needs an explicit min-h-0: a flex or
          grid item's default min-height is "auto", which means "don't
          shrink below your own content's natural height" — not 0. With
          the header on and the row's budget tighter, that default refused
          to compress, so the actual rendered height exceeded the row's
          own calc()'d height and spilled past the epic-boss rail below;
          with the header off there was enough slack that the mismatch
          never became visible. min-h-0 overrides that default so the
          intended height (from stretch, not content) always wins. */}
      <div className="@container min-w-0 min-h-0 max-w-170">
        <div className="grid h-full grid-flow-row grid-cols-1 grid-rows-3 justify-start gap-4 @2xl:grid-flow-col @2xl:grid-cols-none @2xl:grid-rows-2">
          <div className="min-h-0 @2xl:row-span-2">
            <UpcomingSpawns />
          </div>
          <BossLootDisplay />
          <BossInfoDisplay />
        </div>
      </div>
    </div>
  );
}
