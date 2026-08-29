import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Gives the gold border a permanent hover-like glow — for a tab or
  // preset row that's the current selection, not just under the pointer.
  active?: boolean;
}

// The game's gold-bevel CTA look (see .gold-button in globals.css), for
// primary actions like "Killed now" or a selected level tab — distinct
// from IconStateButton, which renders real game button art (Find,
// Minimize) rather than this CSS gradient.
export function GoldButton({
  active,
  className,
  ...props
}: GoldButtonProps) {
  return (
    <button
      className={cn(
        "gold-button px-2 py-1 text-[13px] text-button-text transition-colors hover:text-[#bcd9ff]",
        active && "gold-button-active text-[#e8dcc0]",
        className,
      )}
      {...props}
    />
  );
}
