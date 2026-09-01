import { WindowBorder } from "../ui-l2/window-l2";
import { IconStateButton } from "../ui/icon-state-button";
import { STATUS_TEXT_CLASS } from "@/lib/boss-status";
import type { RespawnStatus } from "@/lib/respawn";
import { cn } from "@/lib/utils";

interface BossStateCardProps {
  name: string;
  level: number;
  status: RespawnStatus;
  // null when the boss has never been marked killed — nothing to count.
  timerLabel: string | null;
  onMarkAction: () => void;
}

// A boss marker's popup, rendered as real HTML/CSS (not drawn on the Konva
// canvas) so its text is crisp at any zoom instead of small and blurry.
// No status label — the marker icon itself already shows status color, and
// the timer line below covers the same information with more detail
// (a countdown, not just a word).
export function BossStateCard({
  name,
  level,
  status,
  timerLabel,
  onMarkAction,
}: BossStateCardProps) {
  return (
    <div className="w-38">
      {/* Floating over a busy map image, not the plain dark page background
          WindowBorder's default bg-window-bg (50% opacity) is tuned for —
          needs to be much closer to opaque to keep the text readable. */}
      <WindowBorder innerClassName="bg-black/95">
        <div className="flex flex-col gap-1 px-2 py-2">
          <div>
            <h3
              className={cn("text-[13px] leading-3", STATUS_TEXT_CLASS[status])}
            >
              {name}
            </h3>
            <p className="mt-0.5 text-[11px] leading-none text-white/50">
              Lv. {level}
            </p>
            {timerLabel && (
              <p
                className={cn(
                  "mt-1 text-[11px] leading-none",
                  STATUS_TEXT_CLASS[status],
                )}
              >
                {timerLabel}
              </p>
            )}
          </div>

          <div className="flex gap-1 mt-1">
            {/* Same smallbutton2 asset, at the exact size/fit the map's own
                Current Loc./Party Member/etc. row uses (Map.tsx's
                BUTTON_CLASS) — no fit="fill" stretching here, so it's a
                1:1 match rather than just the same asset. */}
            <IconStateButton
              defaultIcon="/icons/smallbutton2.png"
              hoverIcon="/icons/smallbutton2_over.png"
              clickIcon="/icons/smallbutton2_down.png"
              className="w-16 h-4.5 text-[13px]"
              sizes="64px"
              text={status === "alive" ? "Mark Killed" : "Mark Alive"}
              onClick={onMarkAction}
            />
          </div>
        </div>
      </WindowBorder>
    </div>
  );
}
