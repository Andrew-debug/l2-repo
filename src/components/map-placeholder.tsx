"use client";

import dynamic from "next/dynamic";
import { useMapSize } from "./providers/MapProvider";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

const DynamicKonvaMapViewer = dynamic(
  () => import("@/components/map/KonvaMapViewer"),
  { ssr: false },
);

export function MapPlaceholder() {
  const { mapSize, currentSize } = useMapSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (mapSize === "small") return;

    const container = containerRef.current;
    if (!container) return;

    // Measure once on mount
    const timer = requestAnimationFrame(() => {
      const parent = container.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      setMeasuredSize({
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      });
    });

    return () => cancelAnimationFrame(timer);
  }, [mapSize]);

  const mapWidth = mapSize === "large" ? measuredSize.width : currentSize.width;
  const mapHeight =
    mapSize === "large" ? measuredSize.height : currentSize.height;

  return (
    <div
      ref={containerRef}
      className={cn("flex-1 border border-black overflow-hidden px-0.5")}
      style={
        mapSize === "large" && measuredSize.width > 0
          ? {
              width: `${measuredSize.width}px`,
              height: `${measuredSize.height}px`,
            }
          : undefined
      }
    >
      <DynamicKonvaMapViewer
        width={mapWidth - 6}
        height={mapHeight - (mapSize === "large" ? 72 : 0)}
      />
    </div>
  );
}
