"use client";

import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { getBossById } from "@/lib/boss-data";
import { formatDuration } from "@/lib/respawn";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossPositions } from "@/components/providers/BossPositionsProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { cn } from "@/lib/utils";
import { BossPortraitImage } from "./boss-portrait-image";

const STATUS_LABEL = {
  dead: "Killed",
  pending: "Could be up",
  alive: "Currently visible",
} as const;

const STATUS_TEXT_CLASS = {
  dead: "text-[#c25c5c]",
  pending: "text-[#f5c518]",
  alive: "text-[#7ed957]",
} as const;

export default function BossInfoDisplay() {
  const { selectedBossId } = useBossSelection();
  const { positions } = useBossPositions();
  const { globalRange, getKilledAt, markKilled, markAlive, getStatus } =
    useBossRespawn();

  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  const hasMapPosition = boss
    ? positions.some((p) => p.bossId === boss.id)
    : false;

  const status = boss ? getStatus(boss.id) : "alive";
  const killedAt = boss ? getKilledAt(boss.id) : null;
  const elapsed = killedAt != null ? Date.now() - killedAt : null;

  return (
    <DraggableWindow className="w-50 shrink-0">
      <DragHandle>
        <Header title="NPC Info" canClose />
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

              <h3 className="text-sm font-bold text-system-text">
                {boss.name}
              </h3>
              <p className="text-[11px] text-white/50">
                {boss.title} · Lv. {boss.level}
              </p>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 border border-window-content-border bg-window-content-bg p-2 text-[11px]">
                <span className="text-white/40">Race</span>
                <span className="text-right">{boss.race}</span>
                {boss.weakness && (
                  <>
                    <span className="text-white/40">Weakness</span>
                    <span className="text-right text-system-text">
                      {boss.weakness}
                    </span>
                  </>
                )}
                {hasMapPosition && (
                  <>
                    <span className="text-white/40">Current State</span>
                    <span
                      className={cn(
                        "text-right",
                        STATUS_TEXT_CLASS[status],
                      )}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                    {killedAt != null && elapsed != null && (
                      <>
                        <span className="text-white/40">
                          {status === "dead" ? "Respawns in" : "Killed"}
                        </span>
                        <span className="text-right text-white/70">
                          {status === "dead"
                            ? formatDuration(
                                globalRange.minHours * 60 * 60 * 1000 -
                                  elapsed,
                              )
                            : `${formatDuration(elapsed)} ago`}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {hasMapPosition && (
                <button
                  onClick={() =>
                    status === "alive"
                      ? markKilled(boss.id)
                      : markAlive(boss.id)
                  }
                  className={cn(
                    "border border-window-content-border bg-window-content-bg px-2 py-1 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
                    status !== "alive" &&
                      "window-item-gradient-active bg-white/5 text-system-text",
                  )}
                >
                  {status === "alive" ? "Mark as Killed" : "Mark as Alive"}
                </button>
              )}
            </>
          )}
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}
