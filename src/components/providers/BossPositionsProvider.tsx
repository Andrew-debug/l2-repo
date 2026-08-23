"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { BossMapPosition } from "@/lib/boss-positions";

interface BossPositionsContextType {
  positions: BossMapPosition[];
  isKilled: (bossId: string) => boolean;
  setKilled: (bossId: string, killed: boolean) => void;
}

const BossPositionsContext = createContext<
  BossPositionsContextType | undefined
>(undefined);

export function BossPositionsProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<BossMapPosition[]>([]);

  useEffect(() => {
    fetch("/api/boss-position")
      .then((res) => res.json())
      .then(setPositions)
      .catch((err) => console.warn("Failed to load boss positions:", err));
  }, []);

  const isKilled = useCallback(
    (bossId: string) =>
      positions.find((p) => p.bossId === bossId)?.killed ?? false,
    [positions],
  );

  const setKilled = useCallback((bossId: string, killed: boolean) => {
    setPositions((prev) =>
      prev.map((p) => (p.bossId === bossId ? { ...p, killed } : p)),
    );

    fetch("/api/boss-position", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bossId, killed }),
    })
      .then((res) => res.json())
      .then((data: { positions?: BossMapPosition[] }) => {
        if (data.positions) setPositions(data.positions);
      })
      .catch((err) => console.warn("Failed to save killed state:", err));
  }, []);

  return (
    <BossPositionsContext.Provider value={{ positions, isKilled, setKilled }}>
      {children}
    </BossPositionsContext.Provider>
  );
}

export function useBossPositions(): BossPositionsContextType {
  const context = useContext(BossPositionsContext);
  if (context === undefined) {
    throw new Error(
      "useBossPositions must be used within a BossPositionsProvider",
    );
  }
  return context;
}
