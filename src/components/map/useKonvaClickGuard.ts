import { useRef } from "react";
import type Konva from "konva";

const CLICK_DRAG_THRESHOLD_PX = 5;

// Konva's click/tap events fire purely from "same target on mousedown and
// mouseup" — unlike a native DOM click, there's no built-in check for
// pointer movement in between or which mouse button was used. That let a
// map-pan drag that happened to end back over a marker "click" it open,
// and let a right-click do the same. Track real movement since mousedown
// so callers can gate their click handler on both.
export function useKonvaClickGuard() {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    startRef.current = { x: e.evt.clientX, y: e.evt.clientY };
  };

  const isGenuineClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return false;
    const start = startRef.current;
    if (!start) return true;
    const dx = e.evt.clientX - start.x;
    const dy = e.evt.clientY - start.y;
    return Math.hypot(dx, dy) < CLICK_DRAG_THRESHOLD_PX;
  };

  return { handleMouseDown, isGenuineClick };
}
