"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bosses, levelRanges, type LevelRange } from "@/lib/boss-data";

const LEVEL_FILTER_STORAGE_KEY = "l2-boss-level-filter";

// Stores just the range's label (e.g. "20-29"), not the whole object — the
// range itself always comes from the current levelRanges array, so this
// only has to be a lookup key, and stays valid even if the ranges'
// min/max ever change.
function readSelectedRangeLabel(): string | null {
  try {
    return window.localStorage.getItem(LEVEL_FILTER_STORAGE_KEY);
  } catch {
    return null;
  }
}

interface BossLevelFilterContextType {
  // The level range currently selected in Raid Bosses' filter row, or null
  // for "All" — shared (not local to BossLevelNavigator) so the map can
  // dim markers outside it the same way BossItemFilterProvider dims
  // markers that don't drop the active item. Persisted to localStorage so
  // a reload or revisit restores the same tab.
  selectedRange: LevelRange | null;
  setSelectedRange: (range: LevelRange | null) => void;
  // Bosses within selectedRange — null (not empty) when no filter is
  // active, matching BossItemFilterProvider's own null-vs-empty
  // convention, so callers can tell "no filter" from "filter matches
  // nothing" the same way for both.
  matchingBossIds: Set<string> | null;
}

const BossLevelFilterContext = createContext<
  BossLevelFilterContextType | undefined
>(undefined);

export function BossLevelFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedRange, setSelectedRangeState] = useState<LevelRange | null>(
    null,
  );

  // Hydrate from localStorage after mount (avoids SSR/client mismatch) —
  // restores whichever level tab (e.g. "20-29") was selected last time, so
  // reloading or revisiting the site lands back on it instead of resetting
  // to "All".
  useEffect(() => {
    const label = readSelectedRangeLabel();
    if (label == null) return;
    const match = levelRanges.find((range) => range.label === label);
    if (match) setSelectedRangeState(match);
  }, []);

  const setSelectedRange = useCallback((range: LevelRange | null) => {
    setSelectedRangeState(range);
    try {
      if (range) {
        window.localStorage.setItem(LEVEL_FILTER_STORAGE_KEY, range.label);
      } else {
        window.localStorage.removeItem(LEVEL_FILTER_STORAGE_KEY);
      }
    } catch {
      // Private browsing / quota exceeded — in-memory state still works for
      // the current session, just won't survive a reload.
    }
  }, []);

  const matchingBossIds = useMemo(() => {
    if (!selectedRange) return null;
    const ids = new Set<string>();
    for (const boss of bosses) {
      if (boss.level >= selectedRange.min && boss.level <= selectedRange.max) {
        ids.add(boss.id);
      }
    }
    return ids;
  }, [selectedRange]);

  return (
    <BossLevelFilterContext.Provider
      value={{ selectedRange, setSelectedRange, matchingBossIds }}
    >
      {children}
    </BossLevelFilterContext.Provider>
  );
}

export function useBossLevelFilter(): BossLevelFilterContextType {
  const context = useContext(BossLevelFilterContext);
  if (context === undefined) {
    throw new Error(
      "useBossLevelFilter must be used within a BossLevelFilterProvider",
    );
  }
  return context;
}
