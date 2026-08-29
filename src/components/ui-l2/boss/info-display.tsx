"use client";

import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { GoldButton } from "../gold-button";
import { getBossById } from "@/lib/boss-data";
import { formatDuration } from "@/lib/respawn";
import { STATUS_LABEL, STATUS_TEXT_CLASS } from "@/lib/boss-status";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossPositions } from "@/components/providers/BossPositionsProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useNpcInfoPanel } from "@/components/providers/NpcInfoPanelProvider";
import { BossPortraitImage } from "./boss-portrait-image";
import { cn } from "@/lib/utils";

export default function BossInfoDisplay() {
  const { selectedBossId } = useBossSelection();
  const { positions } = useBossPositions();
  const { globalRange, getKilledAt, markKilled, markAlive, getStatus } =
    useBossRespawn();
  const { isOpen, setIsOpen } = useNpcInfoPanel();

  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  const hasMapPosition = boss
    ? positions.some((p) => p.bossId === boss.id)
    : false;

  const status = boss ? getStatus(boss.id) : "alive";
  const killedAt = boss ? getKilledAt(boss.id) : null;
  const elapsed = killedAt != null ? Date.now() - killedAt : null;

  return (
    // Stays mounted while closed (invisible, not removed) instead of
    // returning null — this sits in a flex row with Raid Boss Drop
    // List/Respawn Settings, and unmounting dropped its slot from the row,
    // shifting its neighbors over. invisible keeps the slot reserved so
    // closing one window never moves the others.
    <DraggableWindow
      className={cn("w-50 shrink-0", !isOpen && "invisible pointer-events-none")}
    >
      <DragHandle>
        <Header title="NPC Info" canClose onClose={() => setIsOpen(false)} />
      </DragHandle>
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2">
          {!boss && (
            <p className="py-6 text-center text-xs text-white/40">
              Select a boss to see its info
            </p>
          )}

          {boss && (
            <>
              <BossPortraitImage
                boss={boss}
                className="aspect-4/3 w-full border border-window-content-border"
                sizes="288px"
              />

              <h3 className="text-[13px]">{boss.name}</h3>
              <p className="text-[13px] text-white/50">
                {boss.title} · Lv. {boss.level}
              </p>

              {hasMapPosition && status === "pending" && (
                <div className="flex items-center gap-2 border border-[#f5c518]/45 bg-[#f5c518]/10 px-2 py-1.5">
                  <span className="size-2 shrink-0 rounded-full border border-[#f5c518]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#f5c518]">Window open</p>
                    {killedAt != null && elapsed != null && (
                      <p className="text-[10px] text-white/50">
                        since {formatDuration(elapsed)} · closes in{" "}
                        {formatDuration(
                          globalRange.maxHours * 60 * 60 * 1000 - elapsed,
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col border border-window-content-border bg-window-content-bg px-2 text-[11px]">
                <div className="flex items-center justify-between border-b border-window-content-border py-1.5">
                  <span className="text-white/40">Race</span>
                  <span>{boss.race}</span>
                </div>
                {boss.weakness && (
                  <div className="flex items-center justify-between border-b border-window-content-border py-1.5">
                    <span className="text-white/40">Weakness</span>
                    <span className="text-system-text">{boss.weakness}</span>
                  </div>
                )}
                {hasMapPosition && (
                  <div className="flex items-center justify-between border-b border-window-content-border py-1.5">
                    <span className="text-white/40">Current State</span>
                    <span className={STATUS_TEXT_CLASS[status]}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                )}
                {hasMapPosition && killedAt != null && elapsed != null && (
                  <div className="flex items-center justify-between border-b border-window-content-border py-1.5">
                    <span className="text-white/40">
                      {status === "dead" ? "Respawns in" : "Killed"}
                    </span>
                    <span className="text-white/70">
                      {status === "dead"
                        ? formatDuration(
                            globalRange.minHours * 60 * 60 * 1000 - elapsed,
                          )
                        : `${formatDuration(elapsed)} ago`}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-white/40">Respawn</span>
                  <span>
                    {globalRange.minHours} – {globalRange.maxHours} h{" "}
                    <span className="text-white/30">(server)</span>
                  </span>
                </div>
              </div>

              {hasMapPosition && (
                <GoldButton
                  onClick={() =>
                    status === "alive"
                      ? markKilled(boss.id)
                      : markAlive(boss.id)
                  }
                >
                  {status === "alive" ? "Mark as Killed" : "Mark as Alive"}
                </GoldButton>
              )}
            </>
          )}
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}
