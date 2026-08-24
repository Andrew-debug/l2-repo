"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage, Group, Rect } from "react-konva";
import Konva from "konva";
import BossMarkerKonva from "./BossMarkerKonva";
import BossClusterMarkerKonva from "./BossClusterMarkerKonva";
import { bosses } from "@/lib/boss-data";
import { MAP_CONFIG, type BossMapPosition } from "@/lib/boss-positions";
import { BOSS_CLUSTERS } from "@/data/boss-clusters";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossPositions } from "@/components/providers/BossPositionsProvider";

// Bosses that belong to any cluster get folded into a single collapsible
// marker (see BossClusterMarkerKonva) instead of their own independent one.
const CLUSTERED_BOSS_IDS = new Set(
  BOSS_CLUSTERS.flatMap((cluster) => cluster.memberBossIds),
);

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

// Boss markers: cross-reference map coordinates with the shared boss list
function deriveMapBosses(positions: BossMapPosition[]) {
  return positions
    .map((pos) => {
      const boss = bosses.find((b) => b.id === pos.bossId);
      if (!boss) return null;
      return {
        id: boss.id,
        name: boss.name,
        level: boss.level,
        absoluteX: pos.absoluteX,
        absoluteY: pos.absoluteY,
      };
    })
    .filter((b): b is NonNullable<typeof b> => b !== null);
}

interface KonvaMapViewerProps {
  width: number;
  height: number;
}

export default function KonvaMapViewer({ width, height }: KonvaMapViewerProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const { positions: bossPositions } = useBossPositions();
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mapImages, setMapImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(
    null,
  );
  const MAP_BOSSES = useMemo(
    () => deriveMapBosses(bossPositions),
    [bossPositions],
  );

  // A boss selected from elsewhere (e.g. the Raid Bosses list) only renders
  // on the map once its cluster is expanded — auto-expand it so the marker
  // is actually visible/selectable, no matter where the selection came from.
  // Selecting a boss outside any cluster collapses whatever was open.
  useEffect(() => {
    if (!selectedBossId) return;
    const owningCluster = BOSS_CLUSTERS.find((c) =>
      c.memberBossIds.includes(selectedBossId),
    );
    setExpandedClusterId(owningCluster ? owningCluster.id : null);
  }, [selectedBossId]);

  // Use refs for smooth dragging without re-renders
  const positionRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(0.5);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mouseDownScreenPos = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const momentumRef = useRef<NodeJS.Timeout | null>(null);
  const stageDimensionsRef = useRef({ width, height });
  const backgroundRectRef = useRef<Konva.Rect>(null);

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

  // Smoothly pan/center the map onto whichever boss is selected, whether
  // that selection came from clicking a list row or a marker on the map.
  useEffect(() => {
    if (!selectedBossId) return;

    const stage = stageRef.current;
    const layer = layerRef.current;
    const boss = MAP_BOSSES.find((b) => b.id === selectedBossId);
    if (!stage || !layer || !boss) return;

    const targetScale = scaleRef.current;
    const targetX = stage.width() / 2 - boss.absoluteX * targetScale;
    const targetY = stage.height() / 2 - boss.absoluteY * targetScale;
    const clamped = clampPosition(
      targetX,
      targetY,
      targetScale,
      stage.width(),
      stage.height(),
    );

    const tween = new Konva.Tween({
      node: layer,
      duration: 0.6,
      easing: Konva.Easings.EaseInOut,
      x: clamped.x,
      y: clamped.y,
      onUpdate: () => {
        positionRef.current = { x: layer.x(), y: layer.y() };
      },
      onFinish: () => {
        setPosition({ x: layer.x(), y: layer.y() });
      },
    });
    tween.play();

    return () => {
      tween.destroy();
    };
  }, [selectedBossId, MAP_BOSSES]);

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
        mouseDownScreenPos.current = pos;
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

  const handleMouseUp = (e?: Konva.KonvaEventObject<MouseEvent>) => {
    // Sync position to state (inertia disabled)
    setPosition({ ...positionRef.current });
    setIsDragging(false);

    // A genuine click (not the end of a pan drag) on empty map background
    // deselects the current boss and collapses any expanded cluster.
    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      const dx = pos.x - mouseDownScreenPos.current.x;
      const dy = pos.y - mouseDownScreenPos.current.y;
      const isClick = Math.hypot(dx, dy) < 5;
      if (isClick && e?.target === backgroundRectRef.current) {
        if (expandedClusterId) setExpandedClusterId(null);
        if (selectedBossId) setSelectedBoss(null, "map");
      }
    }
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
      style={{
        cursor: isDragging ? "grabbing" : "grab",
      }}
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
          ref={backgroundRectRef}
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
                  listening={false}
                />
              );
            }),
          )}

        {/* Render boss markers */}
        <Group>
          {MAP_BOSSES.filter((boss) => !CLUSTERED_BOSS_IDS.has(boss.id)).map(
            (boss) => (
              <BossMarkerKonva
                key={boss.id}
                boss={boss}
                isSelected={selectedBossId === boss.id}
                onSelect={(id) => {
                  setSelectedBoss(selectedBossId === id ? null : id, "map");
                  setExpandedClusterId(null);
                }}
                scale={scale}
              />
            ),
          )}

          {BOSS_CLUSTERS.map((cluster) => {
            const anchor = MAP_BOSSES.find(
              (b) => b.id === cluster.anchorBossId,
            );
            const members = MAP_BOSSES.filter((b) =>
              cluster.memberBossIds.includes(b.id),
            );
            if (!anchor || members.length === 0) return null;
            return (
              <BossClusterMarkerKonva
                key={cluster.id}
                members={members}
                anchorX={anchor.absoluteX}
                anchorY={anchor.absoluteY}
                yOffset={cluster.yOffset}
                expanded={expandedClusterId === cluster.id}
                onExpand={() => {
                  setExpandedClusterId(cluster.id);
                  if (selectedBossId) setSelectedBoss(null, "map");
                }}
                onMemberSelect={(id) =>
                  setSelectedBoss(selectedBossId === id ? null : id, "map")
                }
                selectedBossId={selectedBossId}
                scale={scale}
              />
            );
          })}
        </Group>
      </Layer>
    </Stage>
  );
}
