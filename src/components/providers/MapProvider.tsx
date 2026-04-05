"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type MapSize = "large" | "small";

export interface MapSizeConfig {
  width: number;
  height: number;
}

interface MapContextType {
  mapSize: MapSize;
  setMapSize: (size: MapSize) => void;
  sizeConfig: Record<MapSize, MapSizeConfig>;
  currentSize: MapSizeConfig;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MAP_SIZE_CONFIG: Record<MapSize, MapSizeConfig> = {
  large: { width: 600, height: 600 },
  small: { width: 370, height: 370 },
};

interface MapProviderProps {
  children: ReactNode;
  defaultSize?: MapSize;
}

export function MapProvider({
  children,
  defaultSize = "large",
}: MapProviderProps) {
  const [mapSize, setMapSize] = useState<MapSize>(defaultSize);

  const value: MapContextType = {
    mapSize,
    setMapSize,
    sizeConfig: MAP_SIZE_CONFIG,
    currentSize: MAP_SIZE_CONFIG[mapSize],
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
