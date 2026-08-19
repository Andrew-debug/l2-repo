"use client";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage, Text, Rect, Line } from "react-konva";
import Konva from "konva";

const MARKER_ICON_SRC = "/icons/rb-available1.png";

// The source icon is tiny (~19x18) — render outline compositing at a
// multiple of that so the blur stays smooth once Konva scales it back down.
const RENDER_SCALE = 4;
const OUTLINE_PAD = 6; // px, in the upscaled render space
const OUTLINE_BLUR = 3; // px, in the upscaled render space

interface IconVariants {
  normal: HTMLCanvasElement;
  normalBright: HTMLCanvasElement;
  gray: HTMLCanvasElement;
  grayBright: HTMLCanvasElement;
  sizeRatio: number; // total canvas size / bare icon size, for display sizing
}

// Renders the icon (optionally grayscaled/brightened) with a soft blurred
// black outline behind it, replacing a plain drop shadow with something that
// actually follows the icon's silhouette.
function buildOutlinedVariant(
  img: HTMLImageElement,
  { gray = false, brightness = 1 }: { gray?: boolean; brightness?: number },
): { canvas: HTMLCanvasElement; sizeRatio: number } {
  const upW = img.naturalWidth * RENDER_SCALE;
  const upH = img.naturalHeight * RENDER_SCALE;
  const totalW = upW + OUTLINE_PAD * 2;
  const totalH = upH + OUTLINE_PAD * 2;

  // Crisp, color-filtered icon layer
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = upW;
  colorCanvas.height = upH;
  const colorCtx = colorCanvas.getContext("2d")!;
  const filters: string[] = [];
  if (gray) filters.push("grayscale(1)");
  if (brightness !== 1) filters.push(`brightness(${brightness})`);
  colorCtx.filter = filters.length ? filters.join(" ") : "none";
  colorCtx.drawImage(img, 0, 0, upW, upH);

  // Solid black silhouette matching the icon's alpha shape
  const silhouetteCanvas = document.createElement("canvas");
  silhouetteCanvas.width = upW;
  silhouetteCanvas.height = upH;
  const silhouetteCtx = silhouetteCanvas.getContext("2d")!;
  silhouetteCtx.drawImage(colorCanvas, 0, 0);
  silhouetteCtx.globalCompositeOperation = "source-in";
  silhouetteCtx.fillStyle = "#000";
  silhouetteCtx.fillRect(0, 0, upW, upH);

  // Compose: blurred silhouette behind, crisp icon on top
  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d")!;
  ctx.filter = `blur(${OUTLINE_BLUR}px)`;
  ctx.drawImage(silhouetteCanvas, OUTLINE_PAD, OUTLINE_PAD);
  ctx.filter = "none";
  ctx.drawImage(colorCanvas, OUTLINE_PAD, OUTLINE_PAD);

  return { canvas, sizeRatio: totalW / upW };
}

// Same font as the l2-window title bar (see globals.css: body font-family).
// fs-tahoma-8px is a real loaded local font with a Next.js-generated family
// name, so — unlike a plain system-font string — it has to be read off the
// DOM at runtime; Konva's canvas text can't resolve a CSS var() itself.
function useTitleFontFamily(): string {
  const [family, setFamily] = useState("Tahoma, sans-serif");
  useEffect(() => {
    const resolved = getComputedStyle(document.body)
      .getPropertyValue("--font-fs-tahoma-8px")
      .trim();
    if (resolved) setFamily(`${resolved}, Tahoma, sans-serif`);
  }, []);
  return family;
}

interface BossMarkerKonvaProps {
  boss: {
    id: string;
    name: string;
    level: number;
    description: string;
    absoluteX: number;
    absoluteY: number;
    killed?: boolean;
  };
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
  const [variants, setVariants] = useState<IconVariants | null>(null);
  const fontFamily = useTitleFontFamily();

  useEffect(() => {
    const img = new window.Image();
    img.src = MARKER_ICON_SRC;
    img.onload = () => {
      const normal = buildOutlinedVariant(img, {});
      const normalBright = buildOutlinedVariant(img, { brightness: 1.2 });
      const gray = buildOutlinedVariant(img, { gray: true, brightness: 0.7 });
      const grayBright = buildOutlinedVariant(img, {
        gray: true,
        brightness: 0.84,
      });
      setVariants({
        normal: normal.canvas,
        normalBright: normalBright.canvas,
        gray: gray.canvas,
        grayBright: grayBright.canvas,
        sizeRatio: normal.sizeRatio,
      });
    };
  }, []);

  const highlighted = isHovered || isSelected;
  const showTooltip = highlighted;

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
