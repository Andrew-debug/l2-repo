"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface IconStateButtonProps {
  defaultIcon: string;
  hoverIcon: string;
  clickIcon: string;
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

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
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
