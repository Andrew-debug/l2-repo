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
  tooltipLabel?: string;
  alt?: string;
}

export function IconStateButton({
  defaultIcon,
  hoverIcon,
  clickIcon,
  onClick,
  className,
  tooltipLabel,
  alt = "icon",
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
        "size-3.5",
        "shadow-[1px_1px_2px_0px_#000000]",
        className,
      )}
      title={tooltipLabel}
    >
      <Image
        src={getCurrentIcon()}
        alt={alt}
        fill
        className="object-contain pointer-events-none"
      />
    </button>
  );
}
