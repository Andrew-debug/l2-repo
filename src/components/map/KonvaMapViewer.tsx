"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Group, Rect } from "react-konva";
import Konva from "konva";
import BossMarkerKonva from "./BossMarkerKonva";

const MAP_CONFIG = {
  cols: 6,
  rows: 10,
  tileWidth: 302,
  tileHeight: 262,
  minZoom: 0.7,
  maxZoom: 1,
  get totalWidth() {
    return this.cols * this.tileWidth;
  },
  get totalHeight() {
    return this.rows * this.tileHeight;
  },
};

// Helper function to clamp position within boundaries
// Ensures the map stays visible without black areas
const clampPosition = (
  x: number,
  y: number,
  scale: number,
  stageWidth: number,
  stageHeight: number,
) => {
  const scaledWidth = MAP_CONFIG.totalWidth * scale;
  const scaledHeight = MAP_CONFIG.totalHeight * scale;

  // Calculate bounds to prevent black areas
  // If map is smaller than stage, keep it centered
  // If map is larger, allow panning but keep it within bounds
  const minX = Math.min(0, stageWidth - scaledWidth);
  const maxX = 0;
  const minY = Math.min(0, stageHeight - scaledHeight);
  const maxY = 0;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
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

interface KonvaMapViewerProps {
  width: number;
  height: number;
}

export default function KonvaMapViewer({ width, height }: KonvaMapViewerProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [activeBossId, setActiveBossId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mapImages, setMapImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Use refs for smooth dragging without re-renders
  const positionRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(0.5);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const momentumRef = useRef<NodeJS.Timeout | null>(null);
  const stageDimensionsRef = useRef({ width, height });

  // Update stage dimensions ref when props change
  useEffect(() => {
    stageDimensionsRef.current = { width, height };
  }, [width, height]);

  // Load all map tiles
  useEffect(() => {
    positionRef.current = position;
    scaleRef.current = scale;
  }, [position, scale]);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let row = 0; row < MAP_CONFIG.rows; row++) {
      for (let col = 0; col < MAP_CONFIG.cols; col++) {
        const sliceNumber = row * MAP_CONFIG.cols + col + 1;
        const img = new Image();
        img.src = `/map-chunks/Slice ${sliceNumber}.jpg`;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === MAP_CONFIG.rows * MAP_CONFIG.cols) {
            setMapImages(images);
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load: Slice ${sliceNumber}.jpg`);
          loadedCount++;
          if (loadedCount === MAP_CONFIG.rows * MAP_CONFIG.cols) {
            setMapImages(images);
          }
        };
        images.push(img);
      }
    }
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // Disable zoom while dragging
    if (isDragging) return;

    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage || !layerRef.current) return;

    const scaleBy = 1.1;
    const oldScale = scaleRef.current;

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(
      MAP_CONFIG.minZoom,
      Math.min(MAP_CONFIG.maxZoom, newScale),
    );

    if (clampedScale === scaleRef.current) return;

    // Get mouse position relative to stage
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Calculate new position to keep zoom centered on cursor
    // Use refs to get the actual current position
    const cursorX = (pointerPos.x - positionRef.current.x) / oldScale;
    const cursorY = (pointerPos.y - positionRef.current.y) / oldScale;

    let newX = pointerPos.x - cursorX * clampedScale;
    let newY = pointerPos.y - cursorY * clampedScale;

    // Apply boundary constraints after zoom
    const clamped = clampPosition(
      newX,
      newY,
      clampedScale,
      stage.width(),
      stage.height(),
    );
    newX = clamped.x;
    newY = clamped.y;

    // Update layer directly for smooth zoom without state-driven re-renders
    layerRef.current.x(newX);
    layerRef.current.y(newY);
    layerRef.current.scaleX(clampedScale);
    layerRef.current.scaleY(clampedScale);
    layerRef.current.getStage()?.batchDraw();

    // Update refs to keep them in sync
    positionRef.current = { x: newX, y: newY };
    scaleRef.current = clampedScale;

    // Update state for consistency (but won't trigger re-renders yet)
    setScale(clampedScale);
    setPosition({ x: newX, y: newY });
  };

  // Handle pan with mouse drag
  const handleMouseDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!isDragging) {
      setIsDragging(true);
      const pos = stageRef.current?.getPointerPosition();
      if (pos) {
        dragStartPos.current = {
          x: pos.x - positionRef.current.x,
          y: pos.y - positionRef.current.y,
        };
        lastPosRef.current = { ...positionRef.current };
        velocityRef.current = { x: 0, y: 0 };
        if (momentumRef.current) {
          clearInterval(momentumRef.current);
          momentumRef.current = null;
        }
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!isDragging) return;

    const pos = stageRef.current?.getPointerPosition();
    if (pos && layerRef.current && stageRef.current) {
      let newX = pos.x - dragStartPos.current.x;
      let newY = pos.y - dragStartPos.current.y;

      // Apply boundary constraints
      const clamped = clampPosition(
        newX,
        newY,
        scaleRef.current,
        stageRef.current.width(),
        stageRef.current.height(),
      );
      newX = clamped.x;
      newY = clamped.y;

      // Calculate velocity for momentum
      velocityRef.current = {
        x: newX - lastPosRef.current.x,
        y: newY - lastPosRef.current.y,
      };
      lastPosRef.current = { x: newX, y: newY };

      // Update layer directly via Konva for smooth performance
      layerRef.current.x(newX);
      layerRef.current.y(newY);
      layerRef.current.getStage()?.batchDraw();

      // Update ref (state will sync later)
      positionRef.current = { x: newX, y: newY };
    }
  };

  const startMomentumScroll = () => {
    let friction = 0.95;
    let velocity = { x: velocityRef.current.x, y: velocityRef.current.y };

    if (momentumRef.current) {
      clearInterval(momentumRef.current);
    }

    momentumRef.current = setInterval(() => {
      velocity.x *= friction;
      velocity.y *= friction;

      if (Math.abs(velocity.x) < 0.5 && Math.abs(velocity.y) < 0.5) {
        clearInterval(momentumRef.current!);
        momentumRef.current = null;
        // Sync final position to state
        setPosition({ ...positionRef.current });
        return;
      }

      let newX = positionRef.current.x + velocity.x;
      let newY = positionRef.current.y + velocity.y;

      // Apply boundary constraints to momentum
      const clamped = clampPosition(
        newX,
        newY,
        scaleRef.current,
        stageDimensionsRef.current.width,
        stageDimensionsRef.current.height,
      );

      // If position was clamped (hit a boundary), stop the momentum
      if (clamped.x !== newX || clamped.y !== newY) {
        clearInterval(momentumRef.current!);
        momentumRef.current = null;
        newX = clamped.x;
        newY = clamped.y;
      } else {
        newX = clamped.x;
        newY = clamped.y;
      }

      if (layerRef.current) {
        layerRef.current.x(newX);
        layerRef.current.y(newY);
        layerRef.current.getStage()?.batchDraw();
      }

      positionRef.current = { x: newX, y: newY };
    }, 16); // ~60fps
  };

  // Handle touch zooming (pinch) and panning
  const lastDistanceRef = useRef<number | null>(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touches = e.evt.touches;
    if (touches.length === 1) {
      // Single finger - prepare for panning
      const pos = stageRef.current?.getPointerPosition();
      if (pos) {
        setIsDragging(true);
        dragStartPos.current = {
          x: pos.x - positionRef.current.x,
          y: pos.y - positionRef.current.y,
        };
        touchStartPosRef.current = { x: pos.x, y: pos.y };
        lastPosRef.current = { ...positionRef.current };
        velocityRef.current = { x: 0, y: 0 };
        if (momentumRef.current) {
          clearInterval(momentumRef.current);
          momentumRef.current = null;
        }
      }
    } else if (touches.length === 2) {
      // Two fingers - prepare for pinch zoom
      setIsDragging(false);
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      lastDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touches = e.evt.touches;

    if (touches.length === 1 && isDragging) {
      // Single finger pan
      e.evt.preventDefault();
      const pos = stageRef.current?.getPointerPosition();
      if (pos && layerRef.current && stageRef.current) {
        let newX = pos.x - dragStartPos.current.x;
        let newY = pos.y - dragStartPos.current.y;

        // Apply boundary constraints
        const clamped = clampPosition(
          newX,
          newY,
          scaleRef.current,
          stageRef.current.width(),
          stageRef.current.height(),
        );
        newX = clamped.x;
        newY = clamped.y;

        velocityRef.current = {
          x: newX - lastPosRef.current.x,
          y: newY - lastPosRef.current.y,
        };
        lastPosRef.current = { x: newX, y: newY };

        // Update layer directly for smooth performance
        layerRef.current.x(newX);
        layerRef.current.y(newY);
        layerRef.current.getStage()?.batchDraw();

        positionRef.current = { x: newX, y: newY };
      }
    } else if (touches.length === 2) {
      // Two finger pinch zoom
      e.evt.preventDefault();
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastDistanceRef.current !== null) {
        const scaleBy = distance / lastDistanceRef.current;
        const newScale = scale * scaleBy;
        const clampedScale = Math.max(
          MAP_CONFIG.minZoom,
          Math.min(MAP_CONFIG.maxZoom, newScale),
        );

        if (clampedScale !== scale) {
          setScale(clampedScale);
        }
      }
      lastDistanceRef.current = distance;
    }
  };

  const handleTouchEnd = () => {
    // Sync position to state (inertia disabled)
    setPosition({ ...positionRef.current });
    setIsDragging(false);
    lastDistanceRef.current = null;
  };

  const handleMouseUp = () => {
    // Sync position to state (inertia disabled)
    setPosition({ ...positionRef.current });
    setIsDragging(false);
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Layer
        ref={layerRef}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
      >
        {/* Background rect to catch drag events */}
        <Rect
          x={0}
          y={0}
          width={MAP_CONFIG.totalWidth}
          height={MAP_CONFIG.totalHeight}
          fill="transparent"
          listening={true}
        />

        {/* Render map tiles */}
        {mapImages.length > 0 &&
          Array.from({ length: MAP_CONFIG.rows }).map((_, row) =>
            Array.from({ length: MAP_CONFIG.cols }).map((_, col) => {
              const index = row * MAP_CONFIG.cols + col;
              const img = mapImages[index];
              if (!img || !img.complete) return null;

              return (
                <KonvaImage
                  key={`tile-${row}-${col}`}
                  image={img}
                  x={col * MAP_CONFIG.tileWidth}
                  y={row * MAP_CONFIG.tileHeight}
                  width={MAP_CONFIG.tileWidth}
                  height={MAP_CONFIG.tileHeight}
                />
              );
            }),
          )}

        {/* Render boss markers */}
        <Group>
          {BOSS_DATA.map((boss) => (
            <BossMarkerKonva
              key={boss.id}
              boss={boss}
              isActive={activeBossId === boss.id}
              onSelect={(id) =>
                setActiveBossId(activeBossId === id ? null : id)
              }
              scale={scale}
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
}
