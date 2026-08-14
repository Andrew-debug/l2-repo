import { type ButtonHTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BossActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "default" | "gold";
  iconOnly?: boolean;
}

export function BossActionButton({
  icon: Icon,
  variant = "default",
  iconOnly = false,
  className,
  children,
  ...props
}: BossActionButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 border border-window-content-border bg-window-content-bg text-[10px] uppercase tracking-wider transition-colors hover:bg-white/5 active:translate-y-px",
        iconOnly ? "w-7 shrink-0" : "flex-1 px-2",
        variant === "gold" && "border-system-text/30 text-system-text",
        className,
      )}
      {...props}
    >
      <Icon className="size-3.5 shrink-0" />
      {!iconOnly && children}
    </button>
  );
}
