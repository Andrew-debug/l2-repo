"use client";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import {
  useMarkerIconVariants,
  MARKER_ICON_OFFSET_X_PX,
} from "./markerIcon";
import { useKonvaClickGuard } from "./useKonvaClickGuard";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";

export interface MapBoss {
  id: string;
  name: string;
  level: number;
  absoluteX: number;
  absoluteY: number;
}

interface BossMarkerKonvaProps {
  boss: MapBoss;
  isSelected: boolean;
  onSelect: (id: string) => void;
  scale: number; // Current zoom scale from stage
  // True while an active item-drop filter (see BossItemFilterProvider)
  // doesn't include this boss. Rendered exactly like a user-hidden marker
  // (dimmed gray, see below) rather than omitted — a boss that doesn't
  // drop the searched item is still on the map, just deemphasized, so the
  // player keeps their bearings instead of pins vanishing out from under
  // them.
  dimmed?: boolean;
}

// Just the pin icon — the popup showing name/state/action lives outside the
// Konva canvas entirely now (see BossStateCard, rendered as a real HTML
// overlay by KonvaMapViewer for the selected boss), since canvas-drawn text
// reads small and blurry next to the rest of the app's crisp DOM text.
export default function BossMarkerKonva({
  boss,
  isSelected,
  onSelect,
  scale,
  dimmed = false,
}: BossMarkerKonvaProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const variants = useMarkerIconVariants();
  const { handleMouseDown, isGenuineClick } = useKonvaClickGuard();
  const { getStatus, isHidden } = useBossRespawn();
  const status = getStatus(boss.id);
  // Either reason renders identically — see the dimmed prop's own comment
  // for why a filter mismatch borrows the hidden treatment instead of
  // unmounting the marker.
  const hidden = isHidden(boss.id) || dimmed;

  const highlighted = isHovered || isSelected;

  // Keep the selected marker above plain, unhighlighted markers — hover
  // still wins over this via its own moveToTop() on mouse enter.
  useEffect(() => {
    if (isSelected) groupRef.current?.moveToTop();
  }, [isSelected]);

  // Inverse scale so marker appears constant size on screen
  const inverseScale = 1 / scale;

  // Icon size stays constant — only brightness changes on hover/selection
  const iconScreenSize = 20;
  const iconSize = iconScreenSize * inverseScale;

  // Hidden bosses always render with the dimmed gray icon, no matter their
  // actual respawn status — hiding is "I don't care about this one," not a
  // report on whether it's up, so it shouldn't borrow the "dead" color.
  const iconSource = variants
    ? hidden || status === "dead"
      ? highlighted
        ? variants.grayBright
        : variants.gray
      : status === "pending"
        ? highlighted
          ? variants.pendingBright
          : variants.pending
        : highlighted
          ? variants.normalBright
          : variants.normal
    : null;

  return (
    <Group
      ref={groupRef}
      x={boss.absoluteX}
      y={boss.absoluteY}
      onMouseEnter={() => {
        setIsHovered(true);
        groupRef.current?.moveToTop();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.cancelBubble = true;
        if (!isGenuineClick(e)) return;
        onSelect(boss.id);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect(boss.id);
      }}
      listening={true}
    >
      {iconSource && (
        <KonvaImage
          image={iconSource}
          x={-iconSize / 2 + MARKER_ICON_OFFSET_X_PX * inverseScale}
          y={-iconSize / 2}
          width={iconSize}
          height={iconSize}
          opacity={hidden ? 0.45 : 1}
        />
      )}
    </Group>
  );
}
