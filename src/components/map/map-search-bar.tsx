"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { bosses, type Boss } from "@/lib/boss-data";
import { compareDrops } from "@/lib/item-icons";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossItemFilter } from "@/components/providers/BossItemFilterProvider";
import {
  DropIcon,
  GRADE_ICON,
  dropLabel,
  gradeForDisplay,
} from "@/components/ui-l2/boss/drop-icon";
import { BossStatusSquare } from "@/components/ui-l2/boss/status-square";
import { cn } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const MAX_BOSS_RESULTS = 6;
const MAX_ITEM_RESULTS = 10;

interface MapSearchBarProps {
  onClose: () => void;
}

// Opened from Map's "Find" button. Sits in the same row, taking over the
// space left of Find/World info., and searches boss names first, then item
// drops — a search for "queen ant" surfaces the raid boss itself before
// "Queen Ant Ring", not interleaved, since the two rarely share words. An
// item can drop from several bosses (a jewelry set, say), so clicking one
// doesn't jump to an arbitrary single boss — it filters the map down to
// every boss that drops it (see BossItemFilterProvider), same idea as a
// wiki's "used by" list rather than a single pick.
export function MapSearchBar({ onClose }: MapSearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setSelectedBoss } = useBossSelection();
  const { setItemFilter } = useBossItemFilter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose]);

  const trimmedQuery = query.trim().toLowerCase();

  const bossMatches = useMemo(() => {
    if (trimmedQuery.length < MIN_QUERY_LENGTH) return [];
    return bosses
      .filter((b) => b.name.toLowerCase().includes(trimmedQuery))
      .slice(0, MAX_BOSS_RESULTS);
  }, [trimmedQuery]);

  const itemMatches = useMemo(() => {
    if (trimmedQuery.length < MIN_QUERY_LENGTH) return [];
    // One row per unique item name — an item can drop from several bosses,
    // so this isn't item+boss pairs (a jewelry set alone drops from half a
    // dozen bosses, which let a handful of items eat the whole cap and
    // crowd out others sharing the query).
    const seen = new Set<string>();
    for (const boss of bosses) {
      for (const drop of boss.drops) {
        if (drop.item.toLowerCase().includes(trimmedQuery)) seen.add(drop.item);
      }
    }
    // Same ordering as the NPC Drop List's list view — equipment grouped by
    // type/grade before scrolls/consumables — so an item's rank here isn't
    // just whichever boss happened to come first in the data.
    return Array.from(seen, (item) => ({ item }))
      .sort(compareDrops)
      .map(({ item }) => item)
      .slice(0, MAX_ITEM_RESULTS);
  }, [trimmedQuery]);

  const selectBoss = (boss: Boss) => {
    setSelectedBoss(boss.id, "list");
    onClose();
  };

  const selectItem = (item: string) => {
    setSelectedBoss(null, "list");
    setItemFilter(item);
    onClose();
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* h-4.5 matches Find/World info.'s own height (Map.tsx's
          BUTTON_CLASS) exactly — this sits in the same items-center row as
          those buttons, and a mismatched height here changed the row's own
          cross-axis size the instant this mounted, visibly shifting the
          buttons by the difference (was h-5, 2px taller). */}
      <div className="flex h-4.5 items-center gap-1.5 border border-window-content-border bg-window-content-bg px-1.5">
        <span className="text-xs text-white/30">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          placeholder="Search a boss or an item"
          className="w-full bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>

      <div className="custom-scrollbar absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto border border-window-content-border bg-window-content-bg text-[13px] text-white shadow-lg">
        {trimmedQuery.length < MIN_QUERY_LENGTH ? (
          <p className="px-2 py-2 text-white">Search a boss or an item</p>
        ) : bossMatches.length === 0 && itemMatches.length === 0 ? (
          <p className="px-2 py-2 text-white/50">No results</p>
        ) : (
          <>
            {bossMatches.map((boss) => (
              <button
                key={`boss-${boss.id}`}
                onClick={() => selectBoss(boss)}
                className={cn(
                  "flex w-full items-center border-b border-window-content-border text-left text-white transition-colors hover:bg-white/10",
                )}
              >
                <span className="flex items-center justify-center py-1 pl-2 pr-2.75">
                  <BossStatusSquare bossId={boss.id} className="size-7.5" />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2 py-1.5 pr-2">
                  <span className="truncate">{boss.name}</span>
                  <span className="shrink-0 text-[11px] text-white/40">
                    Lv {boss.level}
                  </span>
                </span>
              </button>
            ))}
            {itemMatches.map((item) => {
              const grade = gradeForDisplay(item);
              return (
                <button
                  key={`item-${item}`}
                  onClick={() => selectItem(item)}
                  className="flex w-full items-center gap-2 border-b border-window-content-border px-2 py-1.5 text-left text-white transition-colors last:border-b-0 hover:bg-white/10"
                >
                  <DropIcon item={item} className="size-8.5" />
                  <p className="flex min-w-0 flex-1 items-center gap-1 truncate text-[13px] text-white">
                    <span className="truncate">{dropLabel(item)}</span>
                    {grade !== "none" && (
                      <span className="relative size-3.25 shrink-0">
                        <Image
                          src={GRADE_ICON[grade]}
                          alt={grade}
                          fill
                          sizes="13px"
                          className="object-contain"
                        />
                      </span>
                    )}
                  </p>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
