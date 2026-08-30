"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage, Group, Rect } from "react-konva";
import Konva from "konva";
import BossMarkerKonva from "./BossMarkerKonva";
import BossClusterMarkerKonva, {
  DEFAULT_CLUSTER_Y_OFFSET,
} from "./BossClusterMarkerKonva";
import { BossStateCard } from "./boss-state-card";
import { WindowBorder } from "../ui-l2/window-l2";
import { ItemHoverTooltip } from "../ui-l2/boss/item-hover-tooltip";
import { bosses } from "@/lib/boss-data";
import { MAP_CONFIG, type BossMapPosition } from "@/lib/boss-positions";
import { BOSS_CLUSTERS } from "@/data/boss-clusters";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossPositions } from "@/components/providers/BossPositionsProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useBossItemFilter } from "@/components/providers/BossItemFilterProvider";
import { useBossLevelFilter } from "@/components/providers/BossLevelFilterProvider";
import { formatDuration } from "@/lib/respawn";

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
  // Fires once every map tile has finished loading (success or error) — the
  // placeholder wrapper uses this to know when to drop its own loading
  // overlay, since before that the map itself is just an empty stage.
  onReady?: () => void;
}

export default function KonvaMapViewer({
  width,
  height,
  onReady,
}: KonvaMapViewerProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const { selectedBossId, setSelectedBoss } = useBossSelection();
  const { positions: bossPositions } = useBossPositions();
  const {
    getStatus,
    markKilled,
    markAlive,
    getKilledAt,
    globalRange,
    isHidden,
    hideBoss,
    unhideBoss,
  } = useBossRespawn();
  const {
    activeItem,
    matchingBossIds: itemMatchingBossIds,
    clearItemFilter,
  } = useBossItemFilter();
  const { matchingBossIds: levelMatchingBossIds } = useBossLevelFilter();
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mapImages, setMapImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(
    null,
  );
  const [itemChipHovered, setItemChipHovered] = useState(false);
  const MAP_BOSSES = useMemo(
    () => deriveMapBosses(bossPositions),
    [bossPositions],
  );
  // Combines the item filter and the Raid Bosses level-range filter into
  // the one Set the rest of this file already reads as "matchingBossIds"
  // (dimming, and the cluster solo-member shortcut both key off it) — a
  // marker only counts as matching while *every* currently active filter
  // passes, same null-when-nothing-active/empty-when-nothing-matches
  // convention as each filter's own Set. Keeping both providers' outputs
  // separate and merging here (rather than, say, having one filter know
  // about the other) is what lets either filter change independently
  // without the other's logic needing to care.
  const matchingBossIds = useMemo(() => {
    if (!itemMatchingBossIds && !levelMatchingBossIds) return null;
    const ids = new Set<string>();
    for (const boss of MAP_BOSSES) {
      const passesItem =
        !itemMatchingBossIds || itemMatchingBossIds.has(boss.id);
      const passesLevel =
        !levelMatchingBossIds || levelMatchingBossIds.has(boss.id);
      if (passesItem && passesLevel) ids.add(boss.id);
    }
    return ids;
  }, [itemMatchingBossIds, levelMatchingBossIds, MAP_BOSSES]);

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
  // The "pan to selected boss" Konva.Tween below (see the effect that
  // creates it) keeps writing to the layer's x/y on its own schedule for
  // its whole duration. A manual interaction (zoom, drag, pinch) also
  // writes to the same layer x/y directly for smooth, non-state-driven
  // movement — if the tween is still running when that happens, its very
  // next tick overwrites the interaction's position with its own
  // interpolated value, snapping the map back onto the tween's path. Every
  // interaction entry point interrupts the tween first (see
  // interruptBossPanTween below) so there's only ever one thing driving the
  // layer's position at a time.
  const bossPanTweenRef = useRef<Konva.Tween | null>(null);

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

  // Only reacts to mapImages itself (not onReady's identity, which changes
  // every time the parent re-renders) — onReady is expected to be
  // idempotent (e.g. setState(true)), so firing it more than once is
  // harmless, but there's no reason to re-run this just because the parent
  // passed a fresh inline callback.
  useEffect(() => {
    if (mapImages.length > 0) onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapImages]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const OVERLAY_GAP_PX = 12;

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
        bossPanTweenRef.current = null;
        setPosition({ x: layer.x(), y: layer.y() });
      },
    });
    bossPanTweenRef.current = tween;
    tween.play();

    return () => {
      // interruptBossPanTween (or onFinish, above) may have already
      // destroyed this same tween and nulled the ref — Konva.Tween isn't
      // safe to destroy() twice, so only do it here if this effect's tween
      // is still the one currently registered.
      if (bossPanTweenRef.current === tween) {
        bossPanTweenRef.current = null;
        tween.destroy();
      }
    };
  }, [selectedBossId, MAP_BOSSES]);

  // Stops the boss-pan tween mid-flight, if one is running, and resyncs
  // positionRef straight from the layer's actual current position (already
  // wherever the tween had animated it to) — called at the start of every
  // manual interaction below so the interaction always wins instead of
  // fighting the animation. See bossPanTweenRef above for why this is
  // necessary at all.
  const interruptBossPanTween = () => {
    const tween = bossPanTweenRef.current;
    if (!tween) return;
    tween.destroy();
    bossPanTweenRef.current = null;
    const layer = layerRef.current;
    if (layer) {
      positionRef.current = { x: layer.x(), y: layer.y() };
    }
  };

  // Keep the selected boss's HTML card glued to its marker the same way the
  // original Konva-drawn tooltip was — as a child of the map's own
  // pan/zoom layer, it moved together with the terrain by construction, so
  // it never visually drifted off the boss as the map panned, and simply
  // went off-screen if panned far enough away. A plain DOM overlay can't
  // literally be a child of the Konva transform, so this reproduces the
  // same effect by re-reading positionRef/scaleRef (the authoritative
  // pan/zoom values — see the handlers below) every animation frame and
  // re-anchoring the card at a fixed offset from the marker — no clamping
  // to the viewport and no side-flipping based on available space, both of
  // which fought this same goal (one held it against the window edge while
  // panning, the other jumped it between sides mid-animation).
  useEffect(() => {
    if (!selectedBossId) return;
    const boss = MAP_BOSSES.find((b) => b.id === selectedBossId);
    if (!boss) return;

    let rafId: number;
    const sync = () => {
      const el = overlayRef.current;
      if (el) {
        const markerX =
          positionRef.current.x + boss.absoluteX * scaleRef.current;
        const markerY =
          positionRef.current.y + boss.absoluteY * scaleRef.current;
        el.style.transform = `translate(${markerX + OVERLAY_GAP_PX}px, ${markerY - OVERLAY_GAP_PX}px) translateY(-100%)`;
      }
      rafId = requestAnimationFrame(sync);
    };
    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [selectedBossId, MAP_BOSSES]);

  // Handle mouse wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // Disable zoom while dragging
    if (isDragging) return;

    e.evt.preventDefault();
    interruptBossPanTween();

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
      interruptBossPanTween();
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
    interruptBossPanTween();
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

  const selectedMapBoss = selectedBossId
    ? MAP_BOSSES.find((b) => b.id === selectedBossId)
    : undefined;

  // "Respawns in 3h 12m" / "Could be up · closes in 40m" / "Respawned 6m
  // ago" — null only when the boss has never been marked killed, since
  // there's nothing to count from.
  function bossTimerLabel(bossId: string): string | null {
    const killedAt = getKilledAt(bossId);
    if (killedAt == null) return null;

    const elapsedMs = Date.now() - killedAt;
    const minMs = globalRange.minHours * 60 * 60 * 1000;
    const maxMs = globalRange.maxHours * 60 * 60 * 1000;

    const status = getStatus(bossId);
    if (status === "dead")
      return `Respawns in ${formatDuration(minMs - elapsedMs)}`;
    if (status === "pending")
      return `Could be up · closes in ${formatDuration(maxMs - elapsedMs)}`;
    return `Respawned ${formatDuration(elapsedMs - maxMs)} ago`;
  }

  return (
    <div style={{ position: "relative", width, height }}>
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
                  dimmed={
                    matchingBossIds ? !matchingBossIds.has(boss.id) : false
                  }
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

              const matchingMembers = matchingBossIds
                ? members.filter((b) => matchingBossIds.has(b.id))
                : members;

              // Filtered down to a single matching boss — expanding a
              // one-member circle would just make the player click the
              // cluster open and then click again to reach its only member.
              // Drop straight to a plain marker, at the spot the collapsed
              // cluster icon would have sat. (Zero or multiple matches fall
              // through to the normal cluster below, dimmed rather than
              // hidden — see BossClusterMarkerKonva's matchingBossIds prop.)
              if (matchingBossIds && matchingMembers.length === 1) {
                const solo = matchingMembers[0];
                const yOffset = cluster.yOffset ?? DEFAULT_CLUSTER_Y_OFFSET;
                return (
                  <BossMarkerKonva
                    key={cluster.id}
                    boss={{
                      ...solo,
                      absoluteX: anchor.absoluteX,
                      absoluteY: anchor.absoluteY + yOffset,
                    }}
                    isSelected={selectedBossId === solo.id}
                    onSelect={(id) => {
                      setSelectedBoss(selectedBossId === id ? null : id, "map");
                      setExpandedClusterId(null);
                    }}
                    scale={scale}
                  />
                );
              }

              return (
                <BossClusterMarkerKonva
                  key={cluster.id}
                  members={members}
                  matchingBossIds={matchingBossIds}
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

      {activeItem && (
        <div className="absolute left-2 bottom-2 z-10">
          <WindowBorder innerClassName="bg-black/90">
            <div className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-white">
              <span>
                Showing bosses that drop{"  "}
                <span
                  className="relative cursor-default text-system-text underline decoration-dotted underline-offset-2"
                  onMouseEnter={() => setItemChipHovered(true)}
                  onMouseLeave={() => setItemChipHovered(false)}
                >
                  {activeItem}
                  {itemChipHovered && (
                    <ItemHoverTooltip
                      item={activeItem}
                      showIcon
                      className="absolute bottom-full left-1/2 mb-1 -translate-x-1/4"
                    />
                  )}
                </span>
              </span>
              <button
                onClick={clearItemFilter}
                className="text-white/50 transition-colors hover:text-white"
                aria-label="Clear item filter"
              >
                ✕
              </button>
            </div>
          </WindowBorder>
        </div>
      )}

      {selectedMapBoss && (
        // Position is written every frame by the tracking effect above, so
        // this is just a plain top-left anchor for its translate().
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <BossStateCard
              name={selectedMapBoss.name}
              level={selectedMapBoss.level}
              status={getStatus(selectedMapBoss.id)}
              timerLabel={bossTimerLabel(selectedMapBoss.id)}
              isHidden={isHidden(selectedMapBoss.id)}
              onMarkAction={() =>
                getStatus(selectedMapBoss.id) === "alive"
                  ? markKilled(selectedMapBoss.id)
                  : markAlive(selectedMapBoss.id)
              }
              onHideAction={() =>
                isHidden(selectedMapBoss.id)
                  ? unhideBoss(selectedMapBoss.id)
                  : hideBoss(selectedMapBoss.id)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
