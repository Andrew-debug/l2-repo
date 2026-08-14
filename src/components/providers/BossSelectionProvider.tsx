"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type SelectionSource = "list" | "map";

interface BossSelectionContextType {
  selectedBossId: string | null;
  selectionSource: SelectionSource | null;
  setSelectedBoss: (id: string | null, source: SelectionSource) => void;
}

const BossSelectionContext = createContext<
  BossSelectionContextType | undefined
>(undefined);

export function BossSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedBossId, setSelectedBossId] = useState<string | null>(null);
  const [selectionSource, setSelectionSource] =
    useState<SelectionSource | null>(null);

  const setSelectedBoss = useCallback(
    (id: string | null, source: SelectionSource) => {
      setSelectedBossId(id);
      setSelectionSource(id ? source : null);
    },
    [],
  );

  return (
    <BossSelectionContext.Provider
      value={{ selectedBossId, selectionSource, setSelectedBoss }}
    >
      {children}
    </BossSelectionContext.Provider>
  );
}

export function useBossSelection(): BossSelectionContextType {
  const context = useContext(BossSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useBossSelection must be used within a BossSelectionProvider",
    );
  }
  return context;
}
