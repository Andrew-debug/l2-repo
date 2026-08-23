"use client";

import Header from "../header";
import { WindowBorder } from "../window-l2";
import { getBossById } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossPositions } from "@/components/providers/BossPositionsProvider";
import { cn } from "@/lib/utils";
import { BossPortraitImage } from "./boss-portrait-image";

export default function BossInfoDisplay() {
  const { selectedBossId } = useBossSelection();
  const { positions, isKilled, setKilled } = useBossPositions();
  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  const killed = boss ? isKilled(boss.id) : false;
  const hasMapPosition = boss
    ? positions.some((p) => p.bossId === boss.id)
    : false;

  return (
    <div className="w-50 shrink-0">
      <Header title="NPC Info" canClose />
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
                        killed ? "text-[#c25c5c]" : "text-[#7ed957]",
                      )}
                    >
                      {killed ? "Killed" : "Currently visible"}
                    </span>
                  </>
                )}
              </div>

              {hasMapPosition && (
                <button
                  onClick={() => setKilled(boss.id, !killed)}
                  className={cn(
                    "border border-window-content-border bg-window-content-bg px-2 py-1 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
                    killed &&
                      "window-item-gradient-active bg-white/5 text-system-text",
                  )}
                >
                  {killed ? "Mark as Alive" : "Mark as Killed"}
                </button>
              )}
            </>
          )}
        </div>
      </WindowBorder>
    </div>
  );
}
