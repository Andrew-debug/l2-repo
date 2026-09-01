"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// The reference client's 3-state tab art: petinterface_tab2 (unselected),
// petinterface_tab1 (the active tab), petinterface_tab2_over (hover — only
// for a tab you could switch *to*; active wins over hovered, since there's
// nothing to preview-highlight about clicking the tab you're already on).
// Shared by Options' Video/Audio/Game tabs and Raid Bosses' level-range
// tabs — same art, same state rules, wherever a row of tabs like this
// shows up.
export function TabButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const src = disabled
    ? "/icons/petinterface_tab2.png"
    : active
      ? "/icons/petinterface_tab1.png"
      : hovered
        ? "/icons/petinterface_tab2_over.png"
        : "/icons/petinterface_tab2.png";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : () => setHovered(true)}
      onMouseLeave={disabled ? undefined : () => setHovered(false)}
      disabled={disabled}
      className={cn(
        "relative h-5 flex-1",
        disabled ? "cursor-default opacity-60" : "cursor-pointer",
      )}
    >
      <Image src={src} alt="" fill className="object-fill" />
      <span className="relative text-[13px] text-system-text-dim bottom-0.5">
        {label}
      </span>
    </button>
  );
}
