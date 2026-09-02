"use client";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import {
  useMarkerIconVariants,
  MARKER_ICON_OFFSET_X_PX,
} from "./markerIcon";
import { useKonvaClickGuard } from "./useKonvaClickGuard";
import type { RespawnStatus } from "@/lib/respawn";

export interface MapBoss {
  id: string;
  name: string;
  level: number;
  absoluteX: number;
  absoluteY: number;
  // True for the 8 world bosses — swaps the alive-state icon for the
  // "engaged" marker art (see markerIcon.ts) instead of the normal one.
  isEpic?: boolean;
}

interface BossMarkerKonvaProps {
  boss: MapBoss;
  isSelected: boolean;
  onSelect: (id: string) => void;
  scale: number; // Current zoom scale from stage
  // Both computed by the parent (from BossRespawnProvider) and passed down
  // as plain values rather than read from context in here — this component
  // renders once per boss on the map (up to ~200 at once), and the
  // respawn context's value changes identity every second (it ticks a
  // live clock for status/countdown purposes). Reading it directly in
  // every single marker would re-render all of them every second whether
  // or not any individual boss's status actually changed; hoisting it to
  // the parent and wrapping this component in React.memo means each
  // marker only re-renders when its own status/hidden value changes.
  status: RespawnStatus;
  // True if the player hid this boss, OR if an active item-drop filter
  // (see BossItemFilterProvider) doesn't include it. Rendered exactly the
  // same either way (dimmed gray) rather than omitted — a boss that
  // doesn't drop the searched item is still on the map, just
  // deemphasized, so the player keeps their bearings instead of pins
  // vanishing out from under them.
  hidden?: boolean;
}

// Just the pin icon — the popup showing name/state/action lives outside the
// Konva canvas entirely now (see BossStateCard, rendered as a real HTML
// overlay by KonvaMapViewer for the selected boss), since canvas-drawn text
// reads small and blurry next to the rest of the app's crisp DOM text.
function BossMarkerKonva({
  boss,
  isSelected,
  onSelect,
  scale,
  status,
  hidden = false,
}: BossMarkerKonvaProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const variants = useMarkerIconVariants();
  const { handleMouseDown, isGenuineClick } = useKonvaClickGuard();

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
        : boss.isEpic
          ? highlighted
            ? variants.epicBright
            : variants.epic
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
          perfectDrawEnabled={false}
        />
      )}
    </Group>
  );
}

// Memoized so a parent re-render (KonvaMapViewer re-renders every second,
// see the status/hidden prop comment above) only actually re-renders each
// individual marker when its own props changed — the whole point of
// hoisting status/hidden out of context and into props here.
export default React.memo(BossMarkerKonva);
