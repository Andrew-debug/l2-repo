"use client";

import Image from "next/image";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { FoldIcon } from "../fold-icon";
import { IconStateButton } from "../../ui/icon-state-button";
import { getBossById } from "@/lib/boss-data";
import { formatDuration, type RespawnStatus } from "@/lib/respawn";
import { STATUS_DOT_CLASS } from "@/lib/boss-status";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useOptionsPanel } from "@/components/providers/OptionsPanelProvider";
import { useUpcomingSpawnsPanel } from "@/components/providers/UpcomingSpawnsPanelProvider";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { useAppShortcut, formatShortcutLabel } from "@/hooks/use-app-shortcut";
import { useEnterChat } from "@/components/providers/EnterChatProvider";
import { cn } from "@/lib/utils";

const HOUR_MS = 60 * 60 * 1000;

// The filled portion of each row's respawn-window bar — a gradient per
// status, matching STATUS_COLOR's own alive/pending/dead palette.
const PROGRESS_FILL: Record<RespawnStatus, string> = {
  alive: "linear-gradient(to bottom, #a8f07f, #5fae3f)",
  pending: "linear-gradient(to bottom, #ffe07a, #c79a10)",
  dead: "linear-gradient(to bottom, #6b7480, #3a4149)",
};

export default function UpcomingSpawns() {
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const {
    trackedBossIds,
    getStatus,
    getKilledAt,
    globalRange,
    markAlive,
    markKilled,
    soundEnabled,
    setSoundEnabled,
    testAlertSound,
    isAlertButtonVisible,
    setIsAlertButtonVisible,
    hasCustomRange,
  } = useBossRespawn();
  const { requestFocusRespawnTime } = useOptionsPanel();
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

  const { enterChat } = useEnterChat();
  const upNextShortcutLabel = formatShortcutLabel("Up Next", "N", enterChat);

  // Matches the fold icon's own tooltip below and does the same thing
  // System Menu's Up Next row does (see toggleOpen). See useAppShortcut
  // for the Alt-vs-bare-key branching (Options > Game tab's "Enter Chat"
  // checkbox).
  useAppShortcut("KeyN", toggleOpen);

  const now = Date.now();
  // Where the earliest possible spawn sits on the kill→latest-spawn bar
  // below — the same one respawn window applies to every boss, so this is
  // a single percentage shared by every row, not computed per-boss.
  const windowStartPct = (globalRange.minHours / globalRange.maxHours) * 100;

  const rows = trackedBossIds
    .map((bossId) => {
      const boss = getBossById(bossId);
      const status = getStatus(bossId);
      const killedAt = getKilledAt(bossId);
      if (!boss || killedAt == null) return null;

      const minAt = killedAt + globalRange.minHours * HOUR_MS;
      const maxAt = killedAt + globalRange.maxHours * HOUR_MS;
      // How far through the kill→latest-spawn span "now" is — 100% once
      // the window has fully elapsed (status "alive"), since there's
      // nothing left on the clock to show at that point.
      const pct = Math.min(
        100,
        Math.max(0, ((now - killedAt) / (maxAt - killedAt)) * 100),
      );
      // Bosses that already respawned sort first and stay put — a
      // notification is easy to miss, so this is the lasting "go get it"
      // record until someone dismisses it. Longest-respawned (oldest
      // maxAt, most overdue to be dealt with) on top. Pending bosses are
      // next (ranked by how soon they're guaranteed alive — last call to
      // check), then dead ones (ranked by how soon they open up).
      const sortGroup = status === "alive" ? 0 : status === "pending" ? 1 : 2;
      const sortAt =
        status === "alive" ? maxAt : status === "pending" ? maxAt : minAt;

      return { boss, status, minAt, maxAt, pct, sortGroup, sortAt };
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
            label={upNextShortcutLabel}
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
            {isAlertButtonVisible && (
              <div className="title-banner-frame relative flex flex-col items-center gap-0.5 px-4 pt-1.5 pb-1">
                <div className="absolute top-0.5 right-0.5 flex items-center gap-1">
                  {/* Previews the alert sound at the current volume,
                      regardless of the Alert on/off toggle right below —
                      the point of a test button is to be audible even
                      while muted. testAlertSound itself no-ops while a
                      previous play (test or real) is still going, so
                      spamming this just does nothing rather than
                      overlapping/restarting the clip. */}
                  <IconStateButton
                    defaultIcon="/icons/aboutotpicon.png"
                    hoverIcon="/icons/aboutotpicon_over.png"
                    clickIcon="/icons/aboutotpicon_down.png"
                    className="size-3"
                    onClick={testAlertSound}
                  />
                  <Header.Close
                    onClick={() => setIsAlertButtonVisible(false)}
                  />
                </div>
                {/* pointer-events-none: purely decorative, but its `fill`
                    box was overlapping the close/test buttons above it
                    (transparent regions still count for hit-testing) and
                    silently swallowing clicks meant for them. */}
                <div className="relative h-5 w-full -top-1 pointer-events-none">
                  <Image
                    src="/icons/onscrmsg_pattern01_1.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className="h-4.5 w-16 text-[13px]"
                  text={
                    <span>
                      Alert:{" "}
                      <span
                        className={
                          soundEnabled ? "text-[#7ed957]" : "text-[#c25c5c]"
                        }
                      >
                        {soundEnabled ? "on" : "off"}
                      </span>
                    </span>
                  }
                  onClick={() => setSoundEnabled(!soundEnabled)}
                />
                {/* pointer-events-none: same reason as the pattern above
                    the Alert button — decorative, shouldn't be able to
                    swallow clicks meant for it. */}
                <div className="relative h-5 w-full -bottom-1 pointer-events-none">
                  <Image
                    src="/icons/onscrmsg_pattern01_2.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {!hasCustomRange && (
              <div className="title-banner-frame flex items-center justify-between gap-2 px-2.5 py-1.5">
                <span className="text-[13px] text-system-text">
                  Boss respawn timer is not set
                </span>
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className="h-4.5 w-16 shrink-0 text-[13px]"
                  text="Set Time"
                  onClick={requestFocusRespawnTime}
                />
              </div>
            )}

            {rows.length === 0 && (
              <p className="py-6 text-center text-xs text-white/40">
                No bosses being tracked
              </p>
            )}

            {rows.length > 0 && (
              <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-scroll custom-scrollbar pr-1">
                {rows.map(({ boss, status, minAt, maxAt, pct }) => (
                  <li key={boss.id}>
                    {/* A plain div, not a <button> — the "alive" row nests
                        two real IconStateButtons (rotate/close) inside it,
                        and interactive content nested in a <button> is
                        invalid HTML with unpredictable click behavior
                        across browsers. role="button" + tabIndex + this
                        onKeyDown restore the same keyboard activation a
                        real button would give for free. */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setSelectedBoss(
                          selectedBossId === boss.id ? null : boss.id,
                          "list",
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedBoss(
                            selectedBossId === boss.id ? null : boss.id,
                            "list",
                          );
                        }
                      }}
                      className={cn(
                        "relative flex w-full flex-col gap-0.5 border px-2 py-1.5 text-left transition-colors cursor-pointer",
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
                      <div className="relative flex items-center gap-1.5">
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
                      <div
                        className="relative h-1.75 border border-black"
                        style={{
                          boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.9)",
                          background:
                            "linear-gradient(to bottom, #05070a, #0d1116)",
                        }}
                      >
                        <div
                          className="absolute top-0 bottom-0 left-0"
                          style={{
                            width: `${pct}%`,
                            background: PROGRESS_FILL[status],
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
                          }}
                        />
                        <div
                          className="absolute -top-0.5 -bottom-0.5 w-px bg-[#f5c518]/80"
                          style={{ left: `${windowStartPct}%` }}
                        />
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

                      {status === "alive" && (
                        // Wrapped in a span that swallows the click/keydown
                        // before it reaches the row's own handler above —
                        // same reason the old single "Dismiss" span called
                        // stopPropagation itself, just pulled out a level
                        // since there are two real buttons here now instead
                        // of one pseudo-button.
                        <span
                          className="absolute top-0.5 right-0.25 flex shrink-0 items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {/* Re-kills the boss right from here, resetting
                                its tracked kill time to now — the same
                                result as dismissing (below) and then
                                hunting the boss down again elsewhere just to
                                re-mark it killed, in one click instead of
                                two round trips. */}
                          <IconStateButton
                            defaultIcon="/icons/shortcut_rotate.png"
                            hoverIcon="/icons/shortcut_rotate_over.png"
                            clickIcon="/icons/shortcut_rotate_down.png"
                            className="w-3.5 3.5"
                            onClick={() => markKilled(boss.id)}
                          />
                          {/* Dismiss — stops tracking without re-killing. */}
                          <IconStateButton
                            defaultIcon="/icons/FrameCloseBtn.png"
                            hoverIcon="/icons/frameclosebtn_over.png"
                            clickIcon="/icons/FrameCloseOnBtn.png"
                            className="w-3.5 3.5"
                            onClick={() => markAlive(boss.id)}
                          />
                        </span>
                      )}
                    </div>
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
