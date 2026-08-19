"use client";

import Header from "../header";
import { WindowBorder } from "../window-l2";
import { getBossById } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { cn } from "@/lib/utils";
import { BossPortraitImage } from "./boss-portrait-image";

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="h-3 border border-window-content-border bg-black/40">
        <div className="h-full" style={{ width: "100%", backgroundColor: color }} />
      </div>
      <p className="text-[10px] text-white/50">
        {label}: <span className="text-white/80">{value.toLocaleString()}</span>
      </p>
    </div>
  );
}

export default function BossInfoDisplay() {
  const { selectedBossId, isPlacingLocation, setIsPlacingLocation } =
    useBossSelection();
  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;

  return (
    <div className="w-72">
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

              <button
                onClick={() => setIsPlacingLocation(!isPlacingLocation)}
                className={cn(
                  "border border-window-content-border bg-window-content-bg px-2 py-1 text-[11px] uppercase tracking-wide transition-colors hover:bg-white/5",
                  isPlacingLocation && "window-item-gradient-active bg-white/5 text-system-text",
                )}
              >
                {isPlacingLocation ? "Click the map to place…" : "Set Location"}
              </button>

              <StatBar label="HP" value={boss.hp} color="#8a2b2b" />
              <StatBar label="MP" value={boss.mp} color="#2b5a8a" />

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
              </div>

              {boss.description && (
                <p className="text-[11px] italic leading-snug text-white/50">
                  {boss.description}
                </p>
              )}
            </>
          )}
        </div>
      </WindowBorder>
    </div>
  );
}
