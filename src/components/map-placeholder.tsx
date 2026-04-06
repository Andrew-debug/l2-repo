"use client";

import dynamic from "next/dynamic";
import { useMapSize } from "./providers/MapProvider";
import { cn } from "@/lib/utils";
import { useContainerSize } from "./hooks/useContainerSize";

const DynamicKonvaMapViewer = dynamic(
  () => import("@/components/map/KonvaMapViewer"),
  { ssr: false },
);

export function MapPlaceholder() {
  const { mapSize, minimizeSize } = useMapSize();
  const [containerRef, dimensions] = useContainerSize<HTMLDivElement>();

  const isLarge = mapSize === "large";

  const baseWidth = isLarge ? dimensions.width : minimizeSize;
  const baseHeight = isLarge ? dimensions.height : minimizeSize;

  return (
    <div
      className={cn(
        "relative border border-black overflow-hidden px-0.5",
        isLarge ? "flex-1 w-full h-full" : "flex-none",
      )}
      style={
        !isLarge
          ? { width: `${minimizeSize}px`, height: `${minimizeSize}px` }
          : undefined
      }
    >
      <div ref={containerRef} className="absolute inset-x-1 inset-y-0">
        {baseWidth > 0 && baseHeight > 0 && (
          <DynamicKonvaMapViewer width={baseWidth} height={baseHeight} />
        )}
      </div>
    </div>
  );
}
