"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Same size as MenuSection's toolbar icons — every foldable window's icon
// visually belongs with that dock.
export const FOLD_ICON_SIZE = "size-7.5";

interface FoldIconProps {
  icon: string;
  // Shown in the hover tooltip, e.g. "Map (Alt+M)".
  label: string;
  onUnfold: () => void;
  className?: string;
}

// A folded window's collapsed form: one plain icon (no hover/click state
// art — just default + a tooltip) that unfolds on a genuine click. Meant to
// sit inside a DragHandle, inside a DraggableWindow that shares its offset
// with the window's full-size DraggableWindow (see Map.tsx for the pattern
// this was extracted from) — dragging this icon drags that whole shared
// position, and unfolding reopens exactly where it was last dragged to.
export function FoldIcon({ icon, label, onUnfold, className }: FoldIconProps) {
  // True the instant the pointer moves at all after mousedown — not
  // DraggableWindow's own DRAG_THRESHOLD_PX (that's about when the window
  // visually starts following the pointer, a separate concern). Any
  // movement at all means this gesture was a drag, not a click, and must
  // not unfold the window.
  const draggedRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("relative", className)}
      onMouseDown={() => {
        draggedRef.current = false;
        const handleMove = () => {
          draggedRef.current = true;
        };
        const handleUp = () => {
          window.removeEventListener("mousemove", handleMove);
          window.removeEventListener("mouseup", handleUp);
        };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className={cn(FOLD_ICON_SIZE, "relative block")}
        onClick={() => {
          if (!draggedRef.current) onUnfold();
        }}
      >
        <Image
          src={icon}
          alt={label}
          fill
          sizes="30px"
          className="aspect-square object-contain"
        />
      </button>
      {hovered && (
        <div className="pointer-events-none absolute top-full left-0 z-20 bg-window-inner-gray text-[13px] whitespace-nowrap text-white leading-3">
          {label}
        </div>
      )}
    </div>
  );
}
