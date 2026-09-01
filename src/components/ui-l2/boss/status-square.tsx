import Image from "next/image";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { STATUS_ICON } from "@/lib/boss-status";
import { cn } from "@/lib/utils";

// Same marker icon (green/yellow/gray) the map pin draws on its Konva
// canvas, as a plain HTML square for list rows. Hidden bosses always show
// the dead/gray icon dimmed, regardless of actual status — matches
// BossMarkerKonva's rule that hiding says nothing about whether a boss is
// up, so it can't borrow the "alive"/"pending" colors.
export function BossStatusSquare({
  bossId,
  className,
}: {
  bossId: string;
  className?: string;
}) {
  const { getStatus, isHidden } = useBossRespawn();
  const status = getStatus(bossId);
  const hidden = isHidden(bossId);
  const icon = hidden ? STATUS_ICON.dead : STATUS_ICON[status];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center border border-window-content-border bg-black/40",
        className,
      )}
    >
      <Image
        src={icon}
        alt={hidden ? "hidden" : status}
        fill
        sizes="20px"
        className="aspect-square object-contain p-0.5"
        style={{ opacity: hidden ? 0.45 : 1 }}
      />
    </div>
  );
}
