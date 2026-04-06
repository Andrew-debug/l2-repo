"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type MapSize = "large" | "small";

interface MapContextType {
  mapSize: MapSize;
  setMapSize: (size: MapSize) => void;
  minimizeSize: number;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const defaultSize = "large";
  const minimizeSize = 370;
  const [mapSize, setMapSize] = useState<MapSize>(defaultSize);

  const value: MapContextType = {
    mapSize,
    setMapSize,
    minimizeSize,
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
