"use client";

import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { getBossById } from "@/lib/boss-data";
import { formatDuration } from "@/lib/respawn";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { cn } from "@/lib/utils";

const HOUR_MS = 60 * 60 * 1000;

const STATUS_DOT_CLASS = {
  alive: "bg-[#7ed957]",
  dead: "bg-[#c25c5c]",
  pending: "bg-[#f5c518]",
} as const;

export default function UpcomingSpawns() {
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const {
    trackedBossIds,
    getStatus,
    getKilledAt,
    globalRange,
    markAlive,
    notificationsEnabled,
    setNotificationsEnabled,
    notificationPermission,
    requestNotificationPermission,
  } = useBossRespawn();

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
      // record until someone dismisses it. Newest respawn on top. Pending
      // bosses are next (ranked by how soon they're guaranteed alive — last
      // call to check), then dead ones (ranked by how soon they open up).
      const sortGroup = status === "alive" ? 0 : status === "pending" ? 1 : 2;
      const sortAt = status === "alive" ? -maxAt : status === "pending" ? maxAt : minAt;

      return { boss, status, minAt, maxAt, sortGroup, sortAt };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a.sortGroup - b.sortGroup || a.sortAt - b.sortAt);

  return (
    <DraggableWindow className="w-56 shrink-0">
      <DragHandle>
        <Header title="Upcoming Spawns" canClose />
      </DragHandle>
      <WindowBorder>
        <div className="flex flex-col gap-1 p-2">
          {notificationPermission === "denied" && (
            <p className="border border-window-content-border bg-window-content-bg px-2 py-1 text-[10px] text-white/40">
              Notifications are blocked in your browser settings.
            </p>
          )}

          {notificationPermission === "default" && (
            <button
              onClick={requestNotificationPermission}
              className="border border-window-content-border bg-window-content-bg px-2 py-1 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5"
            >
              Enable Notifications
            </button>
          )}

          {notificationPermission === "granted" && (
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={cn(
                "border border-window-content-border bg-window-content-bg px-2 py-1 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
                notificationsEnabled &&
                  "window-item-gradient-active bg-white/5 text-system-text",
              )}
            >
              {notificationsEnabled
                ? "Notifications On"
                : "Notifications Off"}
            </button>
          )}

          {rows.length === 0 && (
            <p className="py-6 text-center text-xs text-white/40">
              No bosses being tracked
            </p>
          )}

          {rows.length > 0 && (
            <ul className="flex max-h-96 flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
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
                      "flex w-full flex-col gap-0.5 border px-2 py-1 text-left transition-colors hover:bg-white/5",
                      status === "alive"
                        ? "border-[#7ed957]/60 bg-[#7ed957]/10"
                        : "border-window-content-border bg-window-content-bg",
                      selectedBossId === boss.id && "bg-white/5",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          STATUS_DOT_CLASS[status],
                        )}
                      />
                      <span
                        className={cn(
                          "truncate text-[11px]",
                          status === "alive"
                            ? "font-bold text-[#7ed957]"
                            : "text-button-text",
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
                          className="ml-auto shrink-0 px-1 text-[10px] uppercase text-white/40 hover:text-white/70"
                        >
                          Dismiss
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "pl-3 text-[10px]",
                        status === "alive" ? "text-[#7ed957]/80" : "text-white/50",
                      )}
                    >
                      {status === "alive" &&
                        `respawned ${formatDuration(now - maxAt)} ago`}
                      {status === "pending" &&
                        `could be up now — confirmed in ${formatDuration(maxAt - now)}`}
                      {status === "dead" && `opens in ${formatDuration(minAt - now)}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}
