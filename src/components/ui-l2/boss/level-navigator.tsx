"use client";

import { useMemo, useRef, useState } from "react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { FoldIcon } from "../fold-icon";
import { TabButton } from "../tab-button";
import { IconStateButton } from "../../ui/icon-state-button";
import { bosses, levelRanges } from "@/lib/boss-data";
import Image from "next/image";
import { STATUS_ICON, STATUS_TEXT_CLASS } from "@/lib/boss-status";
import { MARKER_ICON_EPIC_SRC } from "@/components/map/markerIcon";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useRaidBossesPanel } from "@/components/providers/RaidBossesPanelProvider";
import { useBossLevelFilter } from "@/components/providers/BossLevelFilterProvider";
import { formatDuration } from "@/lib/respawn";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { useAppShortcut, formatShortcutLabel } from "@/hooks/use-app-shortcut";
import { useEnterChat } from "@/components/providers/EnterChatProvider";
import { cn } from "@/lib/utils";

const HOUR_MS = 60 * 60 * 1000;

// The row's right-aligned column: a short, unambiguous headline (primary)
// plus a caption underneath (secondary). Alive gets a flat "UP" headline —
// a duration alone doesn't say which direction it's counting, and once a
// boss is confirmed up, the exact number matters less than the fact of it
// — with the "how long ago" detail demoted to the caption. Pending/dead
// keep the countdown as the headline, since there the number *is* the
// useful part, captioned with which direction it's counting.
function timerParts(
  status: "alive" | "pending" | "dead",
  killedAt: number | null,
  minAt: number | null,
  maxAt: number | null,
  now: number,
): { primary: string; secondary: string } {
  if (killedAt == null) return { primary: "", secondary: "" };
  if (status === "alive")
    return {
      primary: "UP",
      secondary: `${formatDuration(now - (maxAt ?? now))} ago`,
    };
  if (status === "pending")
    return {
      primary: formatDuration((maxAt ?? now) - now),
      secondary: "window closes",
    };
  return {
    primary: formatDuration((minAt ?? now) - now),
    secondary: "opens in",
  };
}

// Flat, always-visible list filtered by level tabs + a name search, sorted
// by how soon each boss needs attention — replaces the old two-screen
// drill-down (pick a range, then a separate list) with the design's single
// screen, since the range picker no longer needs its own step once every
// row already shows level and status at a glance.
export default function BossLevelNavigator() {
  // Shared (not local) — the map dims markers outside selectedRange the
  // same way it dims markers that don't drop the active item filter (see
  // BossLevelFilterProvider).
  const { selectedRange, setSelectedRange } = useBossLevelFilter();
  const [query, setQuery] = useState("");
  const filterInputRef = useRef<HTMLInputElement>(null);
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const { getStatus, getKilledAt, globalRange, isHidden } = useBossRespawn();
  const { isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen } =
    useRaidBossesPanel();
  // Shared across the folded-icon and full-window forms below — each is a
  // separate DraggableWindow that mounts only while its own form is active
  // (unlike Map's fold, nothing expensive lives underneath this panel, so
  // there's no need to keep both mounted simultaneously), and DraggableWindow
  // reads initialOffset fresh at every mount, so switching forms reopens
  // wherever the other form was last dragged to. Persisted to localStorage
  // so a reload reopens it wherever it was last dropped, same as the other
  // windows. isHydrated gates visibility below until that persisted value
  // has actually loaded — see usePersistedOffset for why that's needed on
  // top of the layout-effect timing.
  const [offset, setOffset, isOffsetHydrated] =
    usePersistedOffset("raid-bosses");
  const { enterChat } = useEnterChat();
  const raidBossesShortcutLabel = formatShortcutLabel(
    "Raid Bosses",
    "I",
    enterChat,
  );

  // Matches the fold icon's own tooltip below and does the same thing
  // MenuSection's raid-bosses toolbar button does (see toggleOpen). See
  // useAppShortcut for the Alt-vs-bare-key branching (Options > Game tab's
  // "Enter Chat" checkbox).
  useAppShortcut("KeyI", toggleOpen);

  const now = Date.now();

  const rows = useMemo(() => {
    const inRange = bosses.filter(
      (b) =>
        (!selectedRange ||
          (b.level >= selectedRange.min && b.level <= selectedRange.max)) &&
        (query.trim() === "" ||
          b.name.toLowerCase().includes(query.trim().toLowerCase())),
    );

    return inRange
      .map((boss) => {
        const status = getStatus(boss.id);
        const killedAt = getKilledAt(boss.id);
        const minAt =
          killedAt != null ? killedAt + globalRange.minHours * HOUR_MS : null;
        const maxAt =
          killedAt != null ? killedAt + globalRange.maxHours * HOUR_MS : null;
        const hidden = isHidden(boss.id);
        const sortGroup = hidden
          ? 4 // dismissed as "not interested" — absolutely last
          : status === "alive"
            ? killedAt == null
              ? 2 // never tracked — after pending, before dead
              : 0 // confirmed up
            : status === "pending"
              ? 1
              : 3; // dead
        const sortAt =
          status === "alive"
            ? -(maxAt ?? 0)
            : status === "pending"
              ? (maxAt ?? Infinity)
              : (minAt ?? Infinity);
        return {
          boss,
          status,
          killedAt,
          minAt,
          maxAt,
          hidden,
          sortGroup,
          sortAt,
        };
      })
      .sort(
        (a, b) =>
          a.sortGroup - b.sortGroup ||
          a.sortAt - b.sortAt ||
          a.boss.level - b.boss.level,
      );
  }, [selectedRange, query, getStatus, getKilledAt, globalRange, isHidden]);

  // The soonest-to-open dead boss (first "dead" row once alive/pending sort
  // ahead of it) reads as "up next" — a quieter highlight than alive/
  // pending, but still lifted off the rest of the on-cooldown pack,
  // matching the mockup's single full-opacity/gold-left-border cooldown row.
  // Hidden bosses are excluded — they're dismissed and sorted last, so they
  // shouldn't steal the "up next" highlight from a real dead boss.
  const firstDeadIndex = rows.findIndex(
    (r) => r.status === "dead" && !r.hidden,
  );

  // Stays mounted while closed (invisible, not removed) instead of
  // returning null — this sits in the main flex row alongside Map/Drop
  // List/NPC Info/Upcoming Spawns, and unmounting dropped its slot from the
  // row, shifting its neighbors over. invisible keeps the slot reserved so
  // closing one window never moves the others.
  if (isFolded) {
    return (
      <DraggableWindow
        id="raid-bosses"
        className={cn(
          "relative size-7.5",
          (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
        )}
        initialOffset={offset}
        onOffsetChange={setOffset}
      >
        <DragHandle>
          <FoldIcon
            icon="/icons/menuicon1.png"
            label={raidBossesShortcutLabel}
            onUnfold={() => setIsFolded(false)}
          />
        </DragHandle>
      </DraggableWindow>
    );
  }

  return (
    <DraggableWindow
      id="raid-bosses"
      className={cn(
        "relative flex h-full min-h-0 w-74 shrink-0 flex-col",
        (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
      )}
      initialOffset={offset}
      onOffsetChange={setOffset}
    >
      <DragHandle>
        <Header
          title="Raid Bosses"
          canFold
          canClose
          onFold={() => setIsFolded(true)}
          onClose={() => setIsOpen(false)}
        />
      </DragHandle>
      <div className="min-h-0 flex-1">
        <WindowBorder>
          <div className="flex h-full min-h-0 flex-col">
            <div className="relative grid grid-cols-4 px-2.5 pt-0.75">
              <Image
                src="/icons/siege_back1.png"
                alt=""
                fill
                className="object-fill z-0"
              />
              <Image
                fill
                src="/icons/ssq_lvlback1.png"
                alt="absolute top-0 left-0"
              />
              <TabButton
                label="All"
                active={selectedRange === null}
                onClick={() => setSelectedRange(null)}
              />
              {levelRanges.map((range) => (
                <TabButton
                  key={range.label}
                  label={range.label}
                  active={selectedRange?.label === range.label}
                  onClick={() => setSelectedRange(range)}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 border border-window-content-border bg-window-content-bg px-2 py-1">
              <IconStateButton
                defaultIcon="/icons/search_button.png"
                hoverIcon="/icons/search_button_over.png"
                clickIcon="/icons/search_button_down.png"
                className="w-2.75 h-3.25 shrink-0"
                onClick={() => filterInputRef.current?.focus()}
              />
              <input
                ref={filterInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name"
                className="w-full bg-transparent text-[13px] text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <ul className="flex min-h-0 flex-1 flex-col overflow-y-scroll custom-scrollbar">
              {rows.map(
                ({ boss, status, killedAt, minAt, maxAt, hidden }, index) => {
                  const { primary, secondary } = timerParts(
                    status,
                    killedAt,
                    minAt,
                    maxAt,
                    now,
                  );
                  const isNextDead =
                    status === "dead" && index === firstDeadIndex;
                  return (
                    <li key={boss.id}>
                      <button
                        onClick={() =>
                          setSelectedBoss(
                            selectedBossId === boss.id ? null : boss.id,
                            "list",
                          )
                        }
                        className={cn(
                          "flex w-full items-center gap-2 border-b border-window-content-border px-1.5 py-1.5 text-left transition-colors hover:bg-white/10",
                          selectedBossId === boss.id && "bg-white/5",
                          hidden && "opacity-45",
                        )}
                      >
                        <Image
                          src={
                            hidden
                              ? STATUS_ICON.dead
                              : status === "alive" &&
                                  boss.npcType === "EpicBoss"
                                ? MARKER_ICON_EPIC_SRC
                                : STATUS_ICON[status]
                          }
                          alt=""
                          width={18}
                          height={18}
                          className={cn(
                            "shrink-0",
                            !hidden &&
                              status === "dead" &&
                              !isNextDead &&
                              "opacity-55",
                          )}
                        />
                        <div className="min-w-0 flex-1 leading-tight">
                          <p
                            className={cn(
                              "truncate text-[13px]",
                              killedAt == null
                                ? "text-white"
                                : status !== "dead" &&
                                    STATUS_TEXT_CLASS[status],
                              isNextDead && "text-[#e8dcc0]",
                            )}
                          >
                            {boss.name}
                          </p>
                          <p className="text-[13px] text-white/40">
                            Lv {boss.level}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className={cn(
                              "text-[11px]",
                              status !== "dead"
                                ? STATUS_TEXT_CLASS[status]
                                : isNextDead
                                  ? "text-white/80"
                                  : "text-white/70",
                            )}
                          >
                            {primary}
                          </p>
                          <p className="text-[13px] text-white/40">
                            {secondary}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                },
              )}
              {rows.length === 0 && (
                <p className="py-6 text-center text-xs text-white/40">
                  No bosses match
                </p>
              )}
            </ul>
          </div>
        </WindowBorder>
      </div>
    </DraggableWindow>
  );
}
