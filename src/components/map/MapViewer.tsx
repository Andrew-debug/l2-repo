"use client";

import React, { useEffect, useRef, useState } from "react";
import BossMarker from "./BossMarker";

// --- CONFIGURATION & DATA ---
const MAP_CONFIG = {
  cols: 6,
  rows: 10,
  tileWidth: 302,
  tileHeight: 262,
  get totalWidth() {
    return this.cols * this.tileWidth;
  },
  get totalHeight() {
    return this.rows * this.tileHeight;
  },
};

interface Boss {
  id: string;
  name: string;
  level: number;
  description: string;
  absoluteX: number;
  absoluteY: number;
}

const getAbsolutePosition = (
  chunkCol: number,
  chunkRow: number,
  offsetX: number,
  offsetY: number,
) => ({
  absoluteX: chunkCol * MAP_CONFIG.tileWidth + offsetX,
  absoluteY: chunkRow * MAP_CONFIG.tileHeight + offsetY,
});

const BOSS_DATA: Boss[] = [
  {
    id: "baium",
    name: "Baium",
    level: 75,
    description: "Emperor of Elmoreden.",
    ...getAbsolutePosition(2, 1, 150, 100),
  },
  {
    id: "queen-ant",
    name: "Queen Ant",
    level: 40,
    description: "Ruler of the Wasteland.",
    ...getAbsolutePosition(1, 5, 50, 200),
  },
  {
    id: "zaken",
    name: "Zaken",
    level: 60,
    description: "Cursed pirate captain.",
    ...getAbsolutePosition(4, 8, 250, 120),
  },
];

export default function CanvasMapViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeBossId, setActiveBossId] = useState<string | null>(null);

  // Background Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let isMounted = true;

    for (let row = 0; row < MAP_CONFIG.rows; row++) {
      for (let col = 0; col < MAP_CONFIG.cols; col++) {
        const sliceNumber = row * MAP_CONFIG.cols + col + 1;
        const img = new Image();
        img.src = `/map-chunks/Slice ${sliceNumber}.jpg`;
        img.onload = () => {
          if (isMounted) {
            ctx.drawImage(
              img,
              col * MAP_CONFIG.tileWidth,
              row * MAP_CONFIG.tileHeight,
              MAP_CONFIG.tileWidth,
              MAP_CONFIG.tileHeight,
            );
          }
        };
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-gray-950 overflow-hidden relative font-sans">
      {/* Main Map Wrapper */}
      <div
        className="relative"
        style={{
          width: MAP_CONFIG.totalWidth,
          height: MAP_CONFIG.totalHeight,
        }}
        onClick={(e) => {
          if (e.target === canvasRef.current) setActiveBossId(null);
        }}
      >
        {/* The Static Canvas Layer */}
        <canvas
          ref={canvasRef}
          width={MAP_CONFIG.totalWidth}
          height={MAP_CONFIG.totalHeight}
          className="absolute top-0.75 -left-2.5 block pointer-events-auto"
        />

        {/* The Interactive DOM Layer */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {BOSS_DATA.map((boss) => (
            <BossMarker
              key={boss.id}
              boss={boss}
              isActive={activeBossId === boss.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveBossId(activeBossId === boss.id ? null : boss.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
