"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
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
  // Covers both delays behind one flag: the dynamic import resolving (this
  // starts false, before KonvaMapViewer even exists yet) and its own map
  // tiles loading (KonvaMapViewer's onReady, once every tile has finished).
  const [isMapReady, setIsMapReady] = useState(false);

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
          <DynamicKonvaMapViewer
            width={baseWidth}
            height={baseHeight}
            onReady={() => setIsMapReady(true)}
          />
        )}
      </div>
      {!isMapReady && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          {/* unoptimized: Next's built-in image optimizer strips animation
              from GIFs — this one needs to actually play. */}
          <Image
            src="/icons/ezgif.com-optimize.gif"
            alt="Loading map"
            width={118}
            height={38}
            unoptimized
            className="pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
