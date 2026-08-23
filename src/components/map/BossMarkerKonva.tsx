"use client";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage, Text, Rect, Line } from "react-konva";
import Konva from "konva";
import { useMarkerIconVariants, useTitleFontFamily } from "./markerIcon";

export interface MapBoss {
  id: string;
  name: string;
  level: number;
  description: string;
  absoluteX: number;
  absoluteY: number;
  killed?: boolean;
}

interface BossMarkerKonvaProps {
  boss: MapBoss;
  isSelected: boolean;
  onSelect: (id: string) => void;
  scale: number; // Current zoom scale from stage
}

export default function BossMarkerKonva({
  boss,
  isSelected,
  onSelect,
  scale,
}: BossMarkerKonvaProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const variants = useMarkerIconVariants();
  const fontFamily = useTitleFontFamily();

  const highlighted = isHovered || isSelected;
  const showTooltip = highlighted;

  // Keep the selected marker's tooltip above plain, unhighlighted markers —
  // hover still wins over this via its own moveToTop() on mouse enter.
  useEffect(() => {
    if (isSelected) groupRef.current?.moveToTop();
  }, [isSelected]);

  // Inverse scale so marker appears constant size on screen
  const inverseScale = 1 / scale;

  // Icon size stays constant — only brightness changes on hover/selection
  const iconScreenSize = 15;
  const iconSize = iconScreenSize * inverseScale;

  const iconSource = variants
    ? boss.killed
      ? highlighted
        ? variants.grayBright
        : variants.gray
      : highlighted
        ? variants.normalBright
        : variants.normal
    : null;

  // The rendered canvas includes the outline padding, so it draws a bit
  // larger than the bare glyph size while staying centered on it.
  const displaySize = iconSize * (variants?.sizeRatio ?? 1);

  // Tooltip box, laid out in fixed screen-pixel units (the group itself is
  // scaled by inverseScale so it stays a constant size regardless of zoom).
  const boxWidth = 130;
  const boxHeight = 50;
  const gap = 4;

  return (
    <Group
      ref={groupRef}
      x={boss.absoluteX}
      y={boss.absoluteY}
      onMouseEnter={() => {
        setIsHovered(true);
        // Bring the hovered marker (and its tooltip) above every other
        // marker, including a selected one whose tooltip may overlap it —
        // otherwise stacking order depends on array/render order and looks
        // inconsistent depending on which boss happens to be selected.
        groupRef.current?.moveToTop();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(boss.id);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect(boss.id);
      }}
      listening={true}
    >
      {/* Marker icon — the outline is baked into the canvas, no drop shadow needed */}
      {iconSource && (
        <KonvaImage
          image={iconSource}
          x={-displaySize / 2}
          y={-displaySize / 2}
          width={displaySize}
          height={displaySize}
        />
      )}

      {/* Tooltip - shown on hover or when selected, anchored to the icon's top-right */}
      {showTooltip && (
        <Group
          x={iconSize / 2 + gap * inverseScale}
          y={-iconSize / 2 - boxHeight * inverseScale - gap * inverseScale}
          scaleX={inverseScale}
          scaleY={inverseScale}
          onClick={(e) => (e.cancelBubble = true)}
          onTap={(e) => (e.cancelBubble = true)}
          listening={isSelected}
        >
          {/* Tooltip background box */}
          <Rect
            width={boxWidth}
            height={boxHeight}
            fill="#100c07"
            opacity={0.92}
            stroke="#7c5e2e"
            strokeWidth={1}
            cornerRadius={2}
            shadowColor="#000"
            shadowBlur={8}
            shadowOpacity={0.8}
          />

          {/* Boss name */}
          <Text
            x={7}
            y={5}
            text={boss.name}
            fontSize={10}
            fontFamily={fontFamily}
            fontStyle="bold"
            fill="#e3d3a3"
            width={boxWidth - 14}
            wrap="none"
            ellipsis
          />

          {/* Divider under the name */}
          <Line
            points={[7, 18, boxWidth - 7, 18]}
            stroke="#7c5e2e"
            strokeWidth={1}
          />

          {/* Level + type */}
          <Text
            x={7}
            y={22}
            text={`${boss.level}Lv. Raid Monster`}
            fontSize={9}
            fontFamily={fontFamily}
            fill="#f5c518"
          />

          {/* Current state */}
          <Text
            x={7}
            y={36}
            text="Current State : "
            fontSize={8.5}
            fontFamily={fontFamily}
            fill="#c7c7c7"
          />
          <Text
            x={70}
            y={36}
            text={boss.killed ? "Killed" : "Currently visible"}
            fontSize={8.5}
            fontFamily={fontFamily}
            fill={boss.killed ? "#c25c5c" : "#7ed957"}
          />
        </Group>
      )}
    </Group>
  );
}
