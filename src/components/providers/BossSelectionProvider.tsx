"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type SelectionSource = "list" | "map";

interface BossSelectionContextType {
  selectedBossId: string | null;
  selectionSource: SelectionSource | null;
  setSelectedBoss: (id: string | null, source: SelectionSource) => void;
  // Armed via "Set Location" in the info window — while true, the next
  // click on the map saves that spot as the selected boss's position.
  isPlacingLocation: boolean;
  setIsPlacingLocation: (value: boolean) => void;
}

const BossSelectionContext = createContext<
  BossSelectionContextType | undefined
>(undefined);

export function BossSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedBossId, setSelectedBossId] = useState<string | null>(null);
  const [selectionSource, setSelectionSource] =
    useState<SelectionSource | null>(null);
  const [isPlacingLocation, setIsPlacingLocation] = useState(false);

  const setSelectedBoss = useCallback(
    (id: string | null, source: SelectionSource) => {
      setSelectedBossId(id);
      setSelectionSource(id ? source : null);
      setIsPlacingLocation(false);
    },
    [],
  );

  return (
    <BossSelectionContext.Provider
      value={{
        selectedBossId,
        selectionSource,
        setSelectedBoss,
        isPlacingLocation,
        setIsPlacingLocation,
      }}
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
