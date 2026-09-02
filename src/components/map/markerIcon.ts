import { useEffect, useState } from "react";

// "Spawning" (alive), "respawn" (dead/gray), and "pending" ("could be up")
// each have their own actual icon artwork, including a dedicated hover
// ("_Over") variant.
export const MARKER_ICON_NORMAL_SRC = "/icons/map_raid_spawning_i00.png";
export const MARKER_ICON_NORMAL_HOVER_SRC =
  "/icons/map_raid_spawning_i00_Over.png";
export const MARKER_ICON_DEAD_SRC = "/icons/map_raid_respawn_i00.png";
export const MARKER_ICON_DEAD_HOVER_SRC =
  "/icons/map_raid_respawn_i00_Over.png";
export const MARKER_ICON_PENDING_SRC = "/icons/map_raid_pending_i00.png";
export const MARKER_ICON_PENDING_HOVER_SRC =
  "/icons/map_raid_pending_i00_Over.png";
// Epic bosses (Queen Ant, Baium, Core, ...) get this distinct "engaged"
// icon in place of the normal spawning one while alive — dead/pending
// still fall back to the shared respawn/pending art, since there's no
// epic-specific artwork for those states.
export const MARKER_ICON_EPIC_SRC = "/icons/map_raid_engaged_i00.png";
export const MARKER_ICON_EPIC_HOVER_SRC =
  "/icons/map_raid_engaged_i00_Over.png";

// The new icon artwork isn't centered quite the same as the old one — a
// constant screen-pixel nudge so markers line up with their actual map
// position again. Applied as `MARKER_ICON_OFFSET_X_PX * inverseScale` so it
// stays 1px on screen regardless of zoom.
export const MARKER_ICON_OFFSET_X_PX = 2;

export interface IconVariants {
  normal: HTMLCanvasElement;
  normalBright: HTMLCanvasElement;
  gray: HTMLCanvasElement;
  grayBright: HTMLCanvasElement;
  // "Could be up" — respawn time started but hasn't been confirmed alive.
  pending: HTMLCanvasElement;
  pendingBright: HTMLCanvasElement;
  // Epic-boss-only "engaged" icon, used instead of normal/normalBright.
  epic: HTMLCanvasElement;
  epicBright: HTMLCanvasElement;
}

// Renders the icon as-is onto a canvas, for consistent drawing with the
// other marker helpers (e.g. Konva's <Image> wants a canvas/image source).
export function buildIconVariant(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext("2d")!.drawImage(img, 0, 0);
  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
}

export function useMarkerIconVariants(): IconVariants | null {
  const [variants, setVariants] = useState<IconVariants | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadImage(MARKER_ICON_NORMAL_SRC),
      loadImage(MARKER_ICON_NORMAL_HOVER_SRC),
      loadImage(MARKER_ICON_DEAD_SRC),
      loadImage(MARKER_ICON_DEAD_HOVER_SRC),
      loadImage(MARKER_ICON_PENDING_SRC),
      loadImage(MARKER_ICON_PENDING_HOVER_SRC),
      loadImage(MARKER_ICON_EPIC_SRC),
      loadImage(MARKER_ICON_EPIC_HOVER_SRC),
    ]).then(
      ([
        normalImg,
        normalHoverImg,
        deadImg,
        deadHoverImg,
        pendingImg,
        pendingHoverImg,
        epicImg,
        epicHoverImg,
      ]) => {
        if (cancelled) return;

        setVariants({
          normal: buildIconVariant(normalImg),
          normalBright: buildIconVariant(normalHoverImg),
          gray: buildIconVariant(deadImg),
          grayBright: buildIconVariant(deadHoverImg),
          pending: buildIconVariant(pendingImg),
          pendingBright: buildIconVariant(pendingHoverImg),
          epic: buildIconVariant(epicImg),
          epicBright: buildIconVariant(epicHoverImg),
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

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
