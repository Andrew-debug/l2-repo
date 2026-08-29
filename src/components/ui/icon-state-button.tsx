"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface IconStateButtonProps {
  defaultIcon: string;
  hoverIcon: string;
  clickIcon: string;
  // Optional frame rendered behind the icon, 1px larger than the button on
  // every side (e.g. a 34x34 outline for a 32x32 icon) — pass all three or
  // none, it follows the same hover/click state as the icon itself.
  outlineDefaultIcon?: string;
  outlineHoverIcon?: string;
  outlineClickIcon?: string;
  onClick?: () => void;
  className?: string;
  text?: string;
  // "contain" (default) preserves the icon's aspect ratio — right for
  // square icons. "fill" stretches it to the button's box, for pill-shaped
  // button backgrounds that need to actually grow wider/taller on demand.
  fit?: "contain" | "fill";
}

export function IconStateButton({
  defaultIcon,
  hoverIcon,
  clickIcon,
  outlineDefaultIcon,
  outlineHoverIcon,
  outlineClickIcon,
  onClick,
  className,
  text,
  fit = "contain",
}: IconStateButtonProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleDocumentMouseUp = () => {
      setIsMouseDown(false);
    };

    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return; // left click only — ignore right/middle click
    setIsMouseDown(true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (e.button !== 0) return;
    if (isHovered) {
      onClick?.();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getCurrentIcon = () => {
    if (isMouseDown && isHovered) return clickIcon;
    if (isHovered) return hoverIcon;
    return defaultIcon;
  };

  const getCurrentOutlineIcon = () => {
    if (isMouseDown && isHovered) return outlineClickIcon;
    if (isHovered) return outlineHoverIcon;
    return outlineDefaultIcon;
  };
  const currentOutlineIcon = getCurrentOutlineIcon();

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center",
        // Longhand, not `size-3` — the installed tailwind-merge doesn't
        // recognize size-* as conflicting with a later w-*/h-* override, so
        // custom width/height passed via className was silently ignored.
        "w-3 h-3",
        // "shadow-[1px_1px_2px_0px_#000000]",
        className,
      )}
    >
      {currentOutlineIcon && (
        // Plain <img>, not next/image's `fill` — `fill` forces its own
        // `inset: 0`. Explicit top/left + calc() width/height, not
        // `-inset-px` — inferring size purely from inset values on all 4
        // sides rendered asymmetric here (only top/left visible). `max-w-none`
        // overrides Preflight's `img { max-width: 100% }`, which otherwise
        // clamps the width right back down to the button's own size.
        <img
          src={currentOutlineIcon}
          alt=""
          draggable={false}
          className="pointer-events-none absolute h-[calc(100%+1px)] w-[calc(100%+1px)] max-w-none object-contain z-2"
        />
      )}
      <Image
        src={getCurrentIcon()}
        alt=""
        fill
        className={cn(
          "pointer-events-none",
          fit === "fill" ? "object-fill" : "object-contain",
        )}
      />
      {text && (
        <span className="absolute inset-0 flex items-center justify-center mt-px">
          {text}
        </span>
      )}
    </button>
  );
}
