import { cn } from "@/lib/utils";

export function LevelBadge({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-window-content-border bg-black/40 leading-none",
        className,
      )}
    >
      <span className="text-[8px] uppercase tracking-widest text-white/40">
        Lv
      </span>
      <span className="text-sm font-bold text-system-text">{level}</span>
    </div>
  );
}

export function TypeDot({ type }: { type: "raid" | "epic" | "field" }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        type === "epic"
          ? "bg-system-text"
          : type === "raid"
            ? "bg-white/70"
            : "bg-white/30",
      )}
    />
  );
}
