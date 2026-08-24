import { useEffect, useState } from "react";

export const MARKER_ICON_SRC = "/icons/rb-available1.png";

// The source icon is tiny (~19x18) — render outline compositing at a
// multiple of that so the blur stays smooth once Konva scales it back down.
const RENDER_SCALE = 4;
const OUTLINE_PAD = 6; // px, in the upscaled render space
const OUTLINE_BLUR = 3; // px, in the upscaled render space

export interface IconVariants {
  normal: HTMLCanvasElement;
  normalBright: HTMLCanvasElement;
  gray: HTMLCanvasElement;
  grayBright: HTMLCanvasElement;
  // "Could be up" — respawn window opened but hasn't been confirmed alive.
  pending: HTMLCanvasElement;
  pendingBright: HTMLCanvasElement;
  sizeRatio: number; // total canvas size / bare icon size, for display sizing
}

// Renders the icon (optionally grayscaled/brightened/tinted) with a soft
// blurred black outline behind it, replacing a plain drop shadow with
// something that actually follows the icon's silhouette.
export function buildOutlinedVariant(
  img: HTMLImageElement,
  {
    gray = false,
    brightness = 1,
    tint,
    tintAlpha = 0.55,
  }: {
    gray?: boolean;
    brightness?: number;
    // Color wash applied on top of the icon (e.g. amber for "pending") —
    // composited with source-atop so it only covers the icon's own pixels,
    // not the transparent background.
    tint?: string;
    tintAlpha?: number;
  },
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
  colorCtx.filter = "none";

  if (tint) {
    colorCtx.globalCompositeOperation = "source-atop";
    colorCtx.globalAlpha = tintAlpha;
    colorCtx.fillStyle = tint;
    colorCtx.fillRect(0, 0, upW, upH);
    colorCtx.globalCompositeOperation = "source-over";
    colorCtx.globalAlpha = 1;
  }

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

export function useMarkerIconVariants(
  src: string = MARKER_ICON_SRC,
): IconVariants | null {
  const [variants, setVariants] = useState<IconVariants | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const normal = buildOutlinedVariant(img, {});
      const normalBright = buildOutlinedVariant(img, { brightness: 1.2 });
      const gray = buildOutlinedVariant(img, { gray: true, brightness: 0.7 });
      const grayBright = buildOutlinedVariant(img, {
        gray: true,
        brightness: 0.84,
      });
      // Amber wash — matches the app's existing gold accent (#f5c518, used
      // for level/type text elsewhere) so "could be up" reads as a deliberate
      // in-between state rather than a random third color.
      const pending = buildOutlinedVariant(img, {
        tint: "#f5c518",
        tintAlpha: 0.55,
      });
      const pendingBright = buildOutlinedVariant(img, {
        tint: "#f5c518",
        tintAlpha: 0.7,
        brightness: 1.1,
      });
      setVariants({
        normal: normal.canvas,
        normalBright: normalBright.canvas,
        gray: gray.canvas,
        grayBright: grayBright.canvas,
        pending: pending.canvas,
        pendingBright: pendingBright.canvas,
        sizeRatio: normal.sizeRatio,
      });
    };
  }, [src]);

  return variants;
}

// Same font as the l2-window title bar (see globals.css: body font-family).
// fs-tahoma-8px is a real loaded local font with a Next.js-generated family
// name, so — unlike a plain system-font string — it has to be read off the
// DOM at runtime; Konva's canvas text can't resolve a CSS var() itself.
export function useTitleFontFamily(): string {
  const [family, setFamily] = useState("Tahoma, sans-serif");
  useEffect(() => {
    const resolved = getComputedStyle(document.body)
      .getPropertyValue("--font-fs-tahoma-8px")
      .trim();
    if (resolved) setFamily(`${resolved}, Tahoma, sans-serif`);
  }, []);
  return family;
}
