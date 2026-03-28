"use client";

import dynamic from "next/dynamic";

const DynamicKonvaMapViewer = dynamic(
  () => import("@/components/map/KonvaMapViewer"),
  { ssr: false },
);

import {
  MapPin,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Compass,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapPlaceholder() {
  return (
    <div className="relative w-full h-full bg-secondary/50 rounded-lg border border-border overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-card/90 border border-border hover:bg-card hover:border-primary/50"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-card/90 border border-border hover:bg-card hover:border-primary/50"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-card/90 border border-border hover:bg-card hover:border-primary/50"
        >
          <Compass className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-card/90 border border-border hover:bg-card hover:border-primary/50"
        >
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 bg-card/90 border border-border hover:bg-card hover:border-primary/50"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Placeholder Content */}
      <div className="">
        <DynamicKonvaMapViewer />
      </div>

      {/* Coordinates display */}
      <div className="absolute bottom-4 left-4 bg-card/90 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground">
        <span className="text-primary">X:</span> 147,432{" "}
        <span className="text-primary ml-2">Y:</span> 26,892
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 right-4 bg-card/90 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground flex items-center gap-2">
        <div className="w-16 h-0.5 bg-primary/50" />
        <span>1km</span>
      </div>
    </div>
  );
}
