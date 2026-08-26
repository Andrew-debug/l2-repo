"use client";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { useMarkerIconVariants, MARKER_ICON_OFFSET_X_PX } from "./markerIcon";
import BossMarkerKonva, { type MapBoss } from "./BossMarkerKonva";

const ANIMATION_DURATION_MS = 350;
// Same size as a normal single boss marker.
const ANCHOR_ICON_SCREEN_SIZE = 20;
// World-space (map) units, NOT screen pixels — scales naturally with zoom
// just like the map tiles do, so the circle stays visually consistent with
// the rest of the map instead of holding a constant on-screen size while
// everything around it grows/shrinks.
// Radius grows a little per member beyond 3 so icons don't start stacking
// on top of each other as more bosses join a cluster over time.
const CIRCLE_RADIUS_BASE = 15;
const CIRCLE_RADIUS_PER_EXTRA_MEMBER = 5;
// World-space nudge so the whole cluster (collapsed icon and the expanded
// circle alike) sits relative to the boss's actual map position. Each
// cluster can override this (see BOSS_CLUSTERS) since the right offset
// depends on what's around that specific anchor point on the map.
const DEFAULT_CLUSTER_Y_OFFSET = 20;

interface BossClusterMarkerKonvaProps {
  members: MapBoss[];
  anchorX: number;
  anchorY: number;
  yOffset?: number;
  expanded: boolean;
  onExpand: () => void;
  onMemberSelect: (id: string) => void;
  selectedBossId: string | null;
  scale: number;
}

export default function BossClusterMarkerKonva({
  members,
  anchorX,
  anchorY,
  yOffset = DEFAULT_CLUSTER_Y_OFFSET,
  expanded,
  onExpand,
  onMemberSelect,
  selectedBossId,
  scale,
}: BossClusterMarkerKonvaProps) {
  const [isHovered, setIsHovered] = useState(false);
  const variants = useMarkerIconVariants();

  // 0 = collapsed (single anchor marker), 1 = fully expanded (circle).
  // Animates toward whichever state `expanded` currently asks for, from
  // wherever it currently is — so a mid-animation toggle reverses smoothly
  // instead of snapping.
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const target = expanded ? 1 : 0;
    const startValue = progressRef.current;
    const delta = target - startValue;
    if (delta === 0) return;

    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / ANIMATION_DURATION_MS, 1);
      const eased = Konva.Easings.EaseOut(t, 0, 1, 1);
      const value = startValue + delta * eased;
      progressRef.current = value;
      setProgress(value);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [expanded]);

  const inverseScale = 1 / scale;
  const iconSize = ANCHOR_ICON_SCREEN_SIZE * inverseScale;
  const iconSource = variants
    ? isHovered
      ? variants.normalBright
      : variants.normal
    : null;
  const radius =
    CIRCLE_RADIUS_BASE +
    Math.max(0, members.length - 3) * CIRCLE_RADIUS_PER_EXTRA_MEMBER;
  const originY = anchorY + yOffset;

  return (
    <>
      <Group
        x={anchorX}
        y={originY}
        opacity={1 - progress}
        listening={!expanded}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.cancelBubble = true;
          onExpand();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onExpand();
        }}
      >
        {iconSource && (
          <KonvaImage
            image={iconSource}
            x={-iconSize / 2 + MARKER_ICON_OFFSET_X_PX * inverseScale}
            y={-iconSize / 2}
            width={iconSize}
            height={iconSize}
          />
        )}
      </Group>

      {progress > 0.001 &&
        members.map((member, i) => {
          // Start pointing right (not up) so a 2-member cluster lands
          // side-by-side left-to-right instead of stacked top-to-bottom.
          const angle = i * ((2 * Math.PI) / members.length);
          const memberBoss: MapBoss = {
            ...member,
            absoluteX: anchorX + Math.cos(angle) * radius * progress,
            absoluteY: originY + Math.sin(angle) * radius * progress,
          };
          return (
            <BossMarkerKonva
              key={member.id}
              boss={memberBoss}
              isSelected={selectedBossId === member.id}
              onSelect={onMemberSelect}
              scale={scale}
            />
          );
        })}
    </>
  );
}
