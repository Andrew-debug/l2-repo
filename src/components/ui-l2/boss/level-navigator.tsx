"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { FoldIcon } from "../fold-icon";
import { GoldButton } from "../gold-button";
import { bosses, levelRanges, type LevelRange } from "@/lib/boss-data";
import { STATUS_DOT_CLASS } from "@/lib/boss-status";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useRaidBossesPanel } from "@/components/providers/RaidBossesPanelProvider";
import { formatDuration } from "@/lib/respawn";
import { cn } from "@/lib/utils";

const HOUR_MS = 60 * 60 * 1000;

// Short duration + a 2-3 word phrase for the row's right-aligned column —
// the duration alone doesn't say which direction it's counting, so each
// status gets its own phrase rather than reusing the STATUS_LABEL sentence
// (too long to sit under a number in this narrow a column).
function timerParts(
  status: "alive" | "pending" | "dead",
  killedAt: number | null,
  minAt: number | null,
  maxAt: number | null,
  now: number,
): { duration: string; phrase: string } {
  if (killedAt == null) return { duration: "—", phrase: "unknown" };
  if (status === "alive")
    return { duration: formatDuration(now - (maxAt ?? now)), phrase: "respawned" };
  if (status === "pending")
    return { duration: formatDuration((maxAt ?? now) - now), phrase: "window closes" };
  return { duration: formatDuration((minAt ?? now) - now), phrase: "opens in" };
}

// Flat, always-visible list filtered by level tabs + a name search, sorted
// by how soon each boss needs attention — replaces the old two-screen
// drill-down (pick a range, then a separate list) with the design's single
// screen, since the range picker no longer needs its own step once every
// row already shows level and status at a glance.
export default function BossLevelNavigator() {
  const [selectedRange, setSelectedRange] = useState<LevelRange | null>(null);
  const [query, setQuery] = useState("");
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const { getStatus, getKilledAt, globalRange } = useBossRespawn();
  const { isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen } =
    useRaidBossesPanel();
  // Shared across the folded-icon and full-window forms below — each is a
  // separate DraggableWindow that mounts only while its own form is active
  // (unlike Map's fold, nothing expensive lives underneath this panel, so
  // there's no need to keep both mounted simultaneously), and DraggableWindow
  // reads initialOffset fresh at every mount, so switching forms reopens
  // wherever the other form was last dragged to.
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Alt+I — matches the fold icon's own "Raid Bosses(Alt+I)" tooltip and
  // does the same thing MenuSection's raid-bosses toolbar button does (see
  // toggleOpen). `e.code` (not `e.key`) so the physical key is what matters
  // regardless of what character Alt produces on a given OS/layout.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.code !== "KeyI" || e.repeat) return;
      e.preventDefault();
      toggleOpen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOpen]);

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
        const minAt = killedAt != null ? killedAt + globalRange.minHours * HOUR_MS : null;
        const maxAt = killedAt != null ? killedAt + globalRange.maxHours * HOUR_MS : null;
        const sortGroup = status === "alive" ? 0 : status === "pending" ? 1 : 2;
        const sortAt =
          status === "alive"
            ? -(maxAt ?? 0)
            : status === "pending"
              ? (maxAt ?? Infinity)
              : (minAt ?? Infinity);
        return { boss, status, killedAt, minAt, maxAt, sortGroup, sortAt };
      })
      .sort(
        (a, b) =>
          a.sortGroup - b.sortGroup ||
          a.sortAt - b.sortAt ||
          a.boss.level - b.boss.level,
      );
  }, [selectedRange, query, getStatus, getKilledAt, globalRange]);

  // Stays mounted while closed (invisible, not removed) instead of
  // returning null — this sits in the main flex row alongside Map/Drop
  // List/NPC Info/Upcoming Spawns, and unmounting dropped its slot from the
  // row, shifting its neighbors over. invisible keeps the slot reserved so
  // closing one window never moves the others.
  if (isFolded) {
    return (
      <DraggableWindow
        className={cn("size-7.5", !isOpen && "invisible pointer-events-none")}
        initialOffset={offset}
        onOffsetChange={setOffset}
      >
        <DragHandle>
          <FoldIcon
            icon="/icons/menuicon1.png"
            label="Raid Bosses(Alt+I)"
            onUnfold={() => setIsFolded(false)}
          />
        </DragHandle>
      </DraggableWindow>
    );
  }

  return (
    <DraggableWindow
      className={cn("w-74 shrink-0", !isOpen && "invisible pointer-events-none")}
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
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2">
          <div className="grid grid-cols-4 gap-1">
            <GoldButton
              active={selectedRange === null}
              onClick={() => setSelectedRange(null)}
              className="text-[11px]"
            >
              All
            </GoldButton>
            {levelRanges.map((range) => (
              <GoldButton
                key={range.label}
                active={selectedRange?.label === range.label}
                onClick={() => setSelectedRange(range)}
                className="text-[11px]"
              >
                {range.label}
              </GoldButton>
            ))}
          </div>

          <div className="flex items-center gap-1.5 border border-window-content-border bg-window-content-bg px-2 py-1">
            <span className="text-xs text-white/30">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name"
              className="w-full bg-transparent text-[11px] text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          <ul className="flex max-h-96 flex-col overflow-y-auto custom-scrollbar pr-1">
            {rows.map(({ boss, status, killedAt, minAt, maxAt }) => {
              const { duration, phrase } = timerParts(
                status,
                killedAt,
                minAt,
                maxAt,
                now,
              );
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
                      "flex w-full items-center gap-2 border-b border-window-content-border px-1.5 py-1.5 text-left transition-colors hover:bg-white/5",
                      selectedBossId === boss.id && "bg-white/5",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        STATUS_DOT_CLASS[status],
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px]">{boss.name}</p>
                      <p className="text-[10px] text-white/40">Lv {boss.level}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] text-white/70">{duration}</p>
                      <p className="text-[10px] text-white/40">{phrase}</p>
                    </div>
                  </button>
                </li>
              );
            })}
            {rows.length === 0 && (
              <p className="py-6 text-center text-xs text-white/40">
                No bosses match
              </p>
            )}
          </ul>

          <div className="flex items-center justify-between border-t border-window-content-border pt-1.5 text-[10px] text-white/40">
            <span>{bosses.length} bosses tracked</span>
          </div>
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}
