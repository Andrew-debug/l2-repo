"use client";

import { useEffect } from "react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { FoldIcon } from "../fold-icon";
import { getBossById } from "@/lib/boss-data";
import { formatDuration } from "@/lib/respawn";
import { STATUS_DOT_CLASS } from "@/lib/boss-status";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useUpcomingSpawnsPanel } from "@/components/providers/UpcomingSpawnsPanelProvider";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { cn } from "@/lib/utils";

const HOUR_MS = 60 * 60 * 1000;

export default function UpcomingSpawns() {
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const {
    trackedBossIds,
    getStatus,
    getKilledAt,
    globalRange,
    markAlive,
    soundEnabled,
    setSoundEnabled,
  } = useBossRespawn();
  const { isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen } =
    useUpcomingSpawnsPanel();
  // Shared across the folded-icon and full-window forms below — see
  // BossLevelNavigator for the same pattern (each form mounts only while
  // active; DraggableWindow reads initialOffset fresh at every mount, so
  // switching forms reopens wherever the other form was last dragged to).
  // Persisted to localStorage so a reload reopens it wherever it was last
  // dropped. isHydrated gates visibility below until that persisted value
  // has actually loaded — see usePersistedOffset for why.
  const [offset, setOffset, isOffsetHydrated] = usePersistedOffset("up-next");

  // Alt+N — matches the fold icon's own "Up Next(Alt+N)" tooltip and does
  // the same thing System Menu's Up Next row does (see toggleOpen).
  // `e.code` (not `e.key`) so the physical key is what matters regardless
  // of what character Alt produces on a given OS/layout.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.code !== "KeyN" || e.repeat) return;
      e.preventDefault();
      toggleOpen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOpen]);

  const now = Date.now();

  const rows = trackedBossIds
    .map((bossId) => {
      const boss = getBossById(bossId);
      const status = getStatus(bossId);
      const killedAt = getKilledAt(bossId);
      if (!boss || killedAt == null) return null;

      const minAt = killedAt + globalRange.minHours * HOUR_MS;
      const maxAt = killedAt + globalRange.maxHours * HOUR_MS;
      // Bosses that already respawned sort first and stay put — a
      // notification is easy to miss, so this is the lasting "go get it"
      // record until someone dismisses it. Longest-respawned (oldest
      // maxAt, most overdue to be dealt with) on top. Pending bosses are
      // next (ranked by how soon they're guaranteed alive — last call to
      // check), then dead ones (ranked by how soon they open up).
      const sortGroup = status === "alive" ? 0 : status === "pending" ? 1 : 2;
      const sortAt =
        status === "alive" ? maxAt : status === "pending" ? maxAt : minAt;

      return { boss, status, minAt, maxAt, sortGroup, sortAt };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a.sortGroup - b.sortGroup || a.sortAt - b.sortAt);

  // Stays mounted while closed (invisible, not removed) instead of
  // returning null — this sits in the main flex row alongside Map/Drop
  // List/NPC Info/Raid Bosses, and unmounting dropped its slot from the
  // row, shifting its neighbors over. invisible keeps the slot reserved so
  // closing one window never moves the others.
  if (isFolded) {
    return (
      <DraggableWindow
        id="up-next"
        className={cn(
          "relative size-7.5",
          (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
        )}
        initialOffset={offset}
        onOffsetChange={setOffset}
      >
        <DragHandle>
          <FoldIcon
            icon="/icons/mainwndtabicon4.png"
            label="Up Next(Alt+N)"
            onUnfold={() => setIsFolded(false)}
          />
        </DragHandle>
      </DraggableWindow>
    );
  }

  return (
    <DraggableWindow
      id="up-next"
      className={cn(
        "relative flex h-full min-h-0 w-80 shrink-0 flex-col",
        (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
      )}
      initialOffset={offset}
      onOffsetChange={setOffset}
    >
      <DragHandle>
        <Header
          title="Up Next"
          canFold
          canClose
          onFold={() => setIsFolded(true)}
          onClose={() => setIsOpen(false)}
        />
      </DragHandle>
      <div className="min-h-0 flex-1">
        <WindowBorder>
          <div className="flex h-full flex-col gap-1 p-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                "border border-window-content-border bg-window-content-bg px-2 py-1 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
                soundEnabled &&
                  "window-item-gradient-active bg-white/5 text-system-text",
              )}
            >
              {soundEnabled ? "Alert Sound On" : "Alert Sound Off"}
            </button>

            {rows.length === 0 && (
              <p className="py-6 text-center text-xs text-white/40">
                No bosses being tracked
              </p>
            )}

            {rows.length > 0 && (
              <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
                {rows.map(({ boss, status, minAt, maxAt }) => (
                  <li key={boss.id}>
                    <button
                      onClick={() =>
                        setSelectedBoss(
                          selectedBossId === boss.id ? null : boss.id,
                          "list",
                        )
                      }
                      className={cn(
                        "flex w-full flex-col gap-0.5 border px-2 py-1.5 text-left transition-colors",
                        status === "alive" &&
                          "border-window-content-border border-l-2 border-l-[#7ed957] bg-[#7ed957]/12 hover:bg-[#7ed957]/20",
                        status === "pending" &&
                          "border-[#f5c518]/40 bg-[#f5c518]/7 hover:bg-[#f5c518]/14",
                        status === "dead" &&
                          "border-window-content-border bg-[#c25c5c]/6 hover:bg-[#c25c5c]/12",
                        selectedBossId === boss.id &&
                          "window-item-gradient-active",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            STATUS_DOT_CLASS[status],
                          )}
                        />
                        <span
                          className={cn(
                            "truncate text-[13px]",
                            status === "alive" && "text-[#7ed957]",
                            status === "pending" && "text-[#f5c518]",
                            status === "dead" && "text-button-text",
                          )}
                        >
                          {boss.name}
                        </span>
                        {status === "alive" && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAlive(boss.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                markAlive(boss.id);
                              }
                            }}
                            className="ml-auto shrink-0 px-1 text-[13px] uppercase text-white/40 hover:text-white/70"
                          >
                            Dismiss
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="ml-auto shrink-0 text-[13px] text-[#f5c518]">
                            {formatDuration(maxAt - now)}
                          </span>
                        )}
                        {status === "dead" && (
                          <span className="ml-auto shrink-0 text-[13px] text-white/70">
                            {formatDuration(minAt - now)}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "pl-3 text-[13px]",
                          status === "alive" && "text-[#7ed957]/85",
                          status === "pending" && "text-white/50",
                          status === "dead" && "text-white/45",
                        )}
                      >
                        {status === "alive" &&
                          `respawned ${formatDuration(now - maxAt)} ago · Lv ${boss.level}`}
                        {status === "pending" &&
                          `could be up now — window closes in ${formatDuration(maxAt - now)}`}
                        {status === "dead" &&
                          `opens in ${formatDuration(minAt - now)} · Lv ${boss.level}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </WindowBorder>
      </div>
    </DraggableWindow>
  );
}
