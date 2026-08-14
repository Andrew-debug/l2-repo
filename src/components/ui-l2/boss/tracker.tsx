"use client";

import { useMemo, useState } from "react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { bosses, levelRanges } from "@/lib/boss-data";
import { LevelFilter } from "./level-filter";
import { ViewTabs, type BossView } from "./view-tabs";
import { BossCardGrid } from "./card-grid";
import { BossRosterList } from "./roster-list";
import { BossBoardTable } from "./board-table";

export default function BossTracker() {
  const [band, setBand] = useState("all");
  const [view, setView] = useState<BossView>("cards");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of levelRanges) {
      c[`${r.min}-${r.max}`] = bosses.filter(
        (b) => b.level >= r.min && b.level <= r.max,
      ).length;
    }
    return c;
  }, []);

  const filtered = useMemo(() => {
    const list =
      band === "all"
        ? bosses
        : bosses.filter((b) => {
            const [min, max] = band.split("-").map(Number);
            return b.level >= min && b.level <= max;
          });
    return [...list].sort((a, b) => a.level - b.level);
  }, [band]);

  return (
    <div className="w-full max-w-3xl">
      <Header title="Boss List" canFold canClose />
      <WindowBorder>
        <div className="flex flex-col gap-3 p-2.5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <LevelFilter
              active={band}
              onChange={setBand}
              counts={counts}
              total={bosses.length}
            />
            <ViewTabs active={view} onChange={setView} />
          </div>

          <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {view === "cards" && <BossCardGrid bosses={filtered} />}
            {view === "roster" && <BossRosterList bosses={filtered} />}
            {view === "board" && <BossBoardTable bosses={filtered} />}

            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-white/40">
                No bosses in this range
              </p>
            )}
          </div>

          <p className="text-[11px] uppercase tracking-widest text-white/30">
            {filtered.length} {filtered.length === 1 ? "Boss" : "Bosses"}
          </p>
        </div>
      </WindowBorder>
    </div>
  );
}
