"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type MapSize = "large" | "small";

interface MapContextType {
  mapSize: MapSize;
  setMapSize: (size: MapSize) => void;
  minimizeSize: number;
  // Whether the Map window itself is shown at all — separate from mapSize
  // (large/small), which only matters while it's open. Map.tsx renders
  // nothing while false.
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Collapsed to a small draggable icon (see Map.tsx) — a distinct state
  // from isOpen, since a folded map is still "open," just iconified.
  isFolded: boolean;
  setIsFolded: (folded: boolean) => void;
  // Toggles between fully visible (open and unfolded) and closed. A folded
  // map counts as "not fully visible," so this unfolds it rather than just
  // flipping isOpen — flipping isOpen alone while folded would hide the
  // folded icon instead of opening the map. Shared by Map.tsx's Alt+M
  // shortcut and MenuSection's map toolbar button so both do the same
  // thing.
  toggleMapOpen: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const defaultSize = "large";
  // Small-mode map canvas is rendered at this fixed size (see
  // MapPlaceholder) — keep in sync with Map.tsx's small-mode window width
  // (currently 276px) minus WindowBorder's 4px of nested borders.
  const minimizeSize = 272;
  const [mapSize, setMapSize] = useState<MapSize>(defaultSize);
  const [isOpen, setIsOpen] = useState(true);
  const [isFolded, setIsFolded] = useState(false);

  const toggleMapOpen = () => {
    if (isOpen && !isFolded) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsFolded(false);
    }
  };

  const value: MapContextType = {
    mapSize,
    setMapSize,
    minimizeSize,
    isOpen,
    setIsOpen,
    isFolded,
    setIsFolded,
    toggleMapOpen,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapSize(): MapContextType {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapSize must be used within a MapProvider");
  }
  return context;
}
