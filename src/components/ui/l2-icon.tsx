"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface L2IconProps {
  initialSrc: string;
  hoveredSrc: string;
  alt?: string;
  className?: string;
  sizes?: string;
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export function L2Icon({
  initialSrc,
  hoveredSrc,
  alt = "icon",
  className,
  sizes,
  onClick,
  label,
  disabled = false,
}: L2IconProps) {
  const [src, setSrc] = useState(initialSrc);
  const isButton = onClick || label;

  const content = (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => !disabled && setSrc(hoveredSrc)}
      onMouseLeave={() => setSrc(initialSrc)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain pointer-events-none"
      />
      {label && (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center l2-original-style mt-px",
            "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (isButton) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn("relative", disabled && "opacity-50 cursor-not-allowed")}
      >
        {content}
      </button>
    );
  }

  return content;
}
