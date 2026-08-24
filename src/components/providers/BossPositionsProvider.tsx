"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { BossMapPosition } from "@/lib/boss-positions";

interface BossPositionsContextType {
  positions: BossMapPosition[];
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

  return (
    <BossPositionsContext.Provider value={{ positions }}>
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
