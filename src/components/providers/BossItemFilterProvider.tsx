"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bosses } from "@/lib/boss-data";

interface BossItemFilterContextType {
  // The item name currently filtering the map, or null when nothing's
  // filtered — distinct from BossRespawnProvider's per-boss `isHidden`,
  // which is a permanent "I don't care about this one" the player sets for
  // themselves. This is a transient view: which bosses drop one item,
  // cleared by the corner chip's × or picking a different item/boss.
  activeItem: string | null;
  // Bosses that drop activeItem — null (not empty) when no filter is
  // active, so callers can tell "no filter" from "filter matches nothing".
  matchingBossIds: Set<string> | null;
  setItemFilter: (item: string) => void;
  clearItemFilter: () => void;
}

const BossItemFilterContext = createContext<
  BossItemFilterContextType | undefined
>(undefined);

export function BossItemFilterProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const matchingBossIds = useMemo(() => {
    if (!activeItem) return null;
    const ids = new Set<string>();
    for (const boss of bosses) {
      if (boss.drops.some((drop) => drop.item === activeItem)) {
        ids.add(boss.id);
      }
    }
    return ids;
  }, [activeItem]);

  const setItemFilter = useCallback((item: string) => setActiveItem(item), []);
  const clearItemFilter = useCallback(() => setActiveItem(null), []);

  return (
    <BossItemFilterContext.Provider
      value={{ activeItem, matchingBossIds, setItemFilter, clearItemFilter }}
    >
      {children}
    </BossItemFilterContext.Provider>
  );
}

export function useBossItemFilter(): BossItemFilterContextType {
  const context = useContext(BossItemFilterContext);
  if (context === undefined) {
    throw new Error(
      "useBossItemFilter must be used within a BossItemFilterProvider",
    );
  }
  return context;
}
