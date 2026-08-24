"use client";

import { Children, useCallback, useRef, useState, type ReactNode } from "react";

const DRAG_THRESHOLD_PX = 4;

// How far past the viewport edge the pointer has to travel, beyond the
// point where the window first hits that edge, before the window actually
// follows it out of bounds — the "sticky edge" resistance.
const STICKY_BREAKAWAY_PX = 48;

// Shared across every DraggableWindow instance — whichever window was most
// recently interacted with claims the next value, so it renders above every
// window that hasn't been touched since (not just whichever is later in the
// DOM). Module-level on purpose: all windows live in one page, so a plain
// global counter is simpler than threading a context through every panel.
let topZIndex = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Clamps `desired` (the raw, unresisted screen coordinate) to [min, max],
// then lets it bleed past that boundary only after STICKY_BREAKAWAY_PX of
// extra travel — continuously, so there's no jump at the breakaway point.
function applyStickyBound(desired: number, min: number, max: number): number {
  const clamped = clamp(desired, min, max);
  const overflow = desired - clamped;
  if (overflow === 0) return clamped;
  const eased = Math.sign(overflow) * Math.max(0, Math.abs(overflow) - STICKY_BREAKAWAY_PX);
  return clamped + eased;
}

interface DraggableWindowProps {
  // First child must be the window's <Header> — it's the only part that
  // starts a drag; the rest (WindowBorder, content) renders untouched.
  children: ReactNode;
  className?: string;
}

// Holding the mouse down on the header and moving repositions the whole
// window via a CSS transform, leaving its layout slot (and any position:
// absolute/static from the caller's className) alone. A plain click with no
// real movement passes through normally, so the header's fold/close buttons
// keep working. Dragging resists leaving the viewport — the window sticks to
// the edge until the pointer pushes past it far enough to break away.
// Clicking anywhere in the window (not just the header) raises it above
// every other one, and it stays raised — a buried window's header can end up
// hidden under a taller neighbor, so the body has to work as a lift too, or
// there'd be no way to reach it again.
export function DraggableWindow({ children, className }: DraggableWindowProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const bringToFront = useCallback(() => {
    topZIndex += 1;
    setZIndex(topZIndex);
  }, []);

  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return; // left click only
      const element = elementRef.current;
      if (!element) return;

      const startMouse = { x: e.clientX, y: e.clientY };
      const startOffset = offset;
      const startRect = element.getBoundingClientRect();
      let didDrag = false;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startMouse.x;
        const dy = moveEvent.clientY - startMouse.y;
        if (!didDrag && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
        didDrag = true;

        const desiredLeft = startRect.left + dx;
        const desiredTop = startRect.top + dy;
        const appliedLeft = applyStickyBound(
          desiredLeft,
          0,
          window.innerWidth - startRect.width,
        );
        const appliedTop = applyStickyBound(
          desiredTop,
          0,
          window.innerHeight - startRect.height,
        );

        setOffset({
          x: startOffset.x + (appliedLeft - startRect.left),
          y: startOffset.y + (appliedTop - startRect.top),
        });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [offset],
  );

  const [header, ...rest] = Children.toArray(children);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform:
          offset.x || offset.y
            ? `translate(${offset.x}px, ${offset.y}px)`
            : undefined,
        zIndex: zIndex || undefined,
      }}
      onMouseDownCapture={bringToFront}
    >
      <div onMouseDown={handleHeaderMouseDown} className="cursor-move">
        {header}
      </div>
      {rest}
    </div>
  );
}
