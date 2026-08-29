"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bosses, type LevelRange } from "@/lib/boss-data";

interface BossLevelFilterContextType {
  // The level range currently selected in Raid Bosses' filter row, or null
  // for "All" — shared (not local to BossLevelNavigator) so the map can
  // dim markers outside it the same way BossItemFilterProvider dims
  // markers that don't drop the active item.
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
  const [selectedRange, setSelectedRange] = useState<LevelRange | null>(null);

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
