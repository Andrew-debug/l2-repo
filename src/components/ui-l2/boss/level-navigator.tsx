"use client";

import { useMemo, useState } from "react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { bosses, levelRanges, type LevelRange } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { IconStateButton } from "@/components/ui/icon-state-button";
import { cn } from "@/lib/utils";

export default function BossLevelNavigator() {
  const [selectedRange, setSelectedRange] = useState<LevelRange | null>(null);
  const { selectedBossId, setSelectedBoss } = useBossSelection();

  const bossesInRange = useMemo(() => {
    if (!selectedRange) return [];
    return bosses
      .filter(
        (b) => b.level >= selectedRange.min && b.level <= selectedRange.max,
      )
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }, [selectedRange]);

  return (
    <div className="w-50 shrink-0">
      <Header title="Raid Bosses" canFold canClose />
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2">
          {!selectedRange && (
            <>
              <h3 className="text-[13px] tracking-wide text-white text-center">
                Boss Level
              </h3>
              <div className="flex items-center max-h-96 flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-1">
                {levelRanges.map((range) => (
                  <IconStateButton
                    key={range.label}
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className="w-22 h-5 text-[13px]"
                    fit="fill"
                    text={`Lvl ${range.label}`}
                    onClick={() => setSelectedRange(range)}
                  />
                ))}
              </div>
            </>
          )}

          {selectedRange && (
            <ul className="flex max-h-96 flex-col overflow-y-auto custom-scrollbar pr-1">
              <li className="flex items-center justify-between px-1 py-1">
                <button className="text-[13px] tracking-wide text-button-text underline">
                  Main
                </button>
                <h3 className="text-[13px] tracking-wide">
                  Raid Boss {selectedRange.label}
                </h3>
                <button
                  onClick={() => setSelectedRange(null)}
                  className="text-[13px] tracking-wide text-button-text underline"
                >
                  Back
                </button>
              </li>

              {bossesInRange.map((boss) => (
                <li key={boss.id}>
                  <button
                    onClick={() =>
                      setSelectedBoss(
                        selectedBossId === boss.id ? null : boss.id,
                        "list",
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-center gap-1.5 px-1 py-1",
                      selectedBossId === boss.id && "bg-white/5",
                    )}
                  >
                    <span className="truncate text-[13px] tracking-wide text-button-text underline">
                      {boss.name} ({boss.level})
                    </span>
                  </button>
                </li>
              ))}
              {bossesInRange.length === 0 && (
                <p className="py-6 text-center text-xs text-white/40">
                  No bosses in this range
                </p>
              )}
            </ul>
          )}
        </div>
      </WindowBorder>
    </div>
  );
}
