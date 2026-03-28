"use client";
import React, { useRef, useState } from "react";
import { Group, Circle, Star, Text, Rect, Line } from "react-konva";
import Konva from "konva";

interface BossMarkerKonvaProps {
  boss: {
    id: string;
    name: string;
    level: number;
    description: string;
    absoluteX: number;
    absoluteY: number;
  };
  isActive: boolean;
  onSelect: (id: string) => void;
  scale: number; // Current zoom scale from stage
}

export default function BossMarkerKonva({
  boss,
  isActive,
  onSelect,
  scale,
}: BossMarkerKonvaProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Inverse scale so marker appears constant size on screen
  const inverseScale = 1 / scale;

  // Icon size on screen (constant regardless of zoom)
  const iconScreenSize = 40;

  // Actual size in canvas coordinates
  const iconSize = iconScreenSize * inverseScale;

  return (
    <Group
      ref={groupRef}
      x={boss.absoluteX}
      y={boss.absoluteY}
      onMouseEnter={() => setIsHovered(true)}
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
      {/* Background circle for visual separation */}
      <Circle
        radius={iconSize / 2}
        fill={isHovered ? "#dc2626" : "#ef4444"}
        opacity={0.9}
        shadowColor="#000"
        shadowBlur={8}
        shadowOpacity={0.6}
        shadowOffset={{ x: 0, y: 2 }}
      />

      {/* Star icon */}
      <Star
        numPoints={5}
        innerRadius={iconSize * 0.15}
        outerRadius={iconSize * 0.35}
        fill="#facc15"
        stroke="#1e293b"
        strokeWidth={1}
      />

      {/* Tooltip - only shown when active, positioned above */}
      {isActive && (
        <Group
          y={-iconSize * 0.7 - 60 * inverseScale}
          onClick={(e) => (e.cancelBubble = true)}
          onTap={(e) => (e.cancelBubble = true)}
        >
          {/* Tooltip background box */}
          <Rect
            x={-80 * inverseScale}
            y={-40 * inverseScale}
            width={160 * inverseScale}
            height={80 * inverseScale}
            fill="#0f172a"
            stroke="#334155"
            strokeWidth={1 * inverseScale}
            cornerRadius={4}
            shadowColor="#000"
            shadowBlur={8 * inverseScale}
            shadowOpacity={0.8}
          />

          {/* Boss name */}
          <Text
            x={-75 * inverseScale}
            y={-30 * inverseScale}
            text={boss.name}
            fontSize={12 * inverseScale}
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            fill="#f87171"
          />

          {/* Level */}
          <Text
            x={-75 * inverseScale}
            y={-12 * inverseScale}
            text={`Lvl ${boss.level}`}
            fontSize={10 * inverseScale}
            fontFamily="Arial, sans-serif"
            fill="#cbd5e1"
          />

          {/* Description */}
          <Text
            x={-75 * inverseScale}
            y={4 * inverseScale}
            text={boss.description}
            fontSize={9 * inverseScale}
            fontFamily="Arial, sans-serif"
            fill="#e2e8f0"
            width={150 * inverseScale}
          />

          {/* Arrow pointing down to marker */}
          <Line
            points={[0, 40 * inverseScale, 0, 50 * inverseScale]}
            stroke="#334155"
            strokeWidth={1 * inverseScale}
          />
        </Group>
      )}
    </Group>
  );
}
