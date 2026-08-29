import { WindowBorder } from "../window-l2";
import {
  STATUS_CODE,
  STATUS_COLOR,
  STATUS_LABEL,
  STATUS_MEANING,
} from "@/lib/boss-status";
import type { RespawnStatus } from "@/lib/respawn";

interface StateEntry {
  status: RespawnStatus;
  pin: string;
  rail: string;
  action: string;
}

// Order matches the game's own escalation, not the RespawnStatus union's —
// cooldown (the default, quietest state) first, then window-open (the one
// a boss hunter actually plays around), alive last (the rarest, loudest).
// Code/meaning text lives in boss-status.ts, shared with the map marker's
// tooltip (BossMarkerKonva) so the wording can't drift between the two.
const STATES: StateEntry[] = [
  {
    status: "dead",
    pin: "grey, small, no glow",
    rail: "dimmed row, counts down to the window",
    action: "nothing to do",
  },
  {
    status: "pending",
    pin: "hollow ring",
    rail: "highlighted, shows time left in window",
    action: "go look · Killed now",
  },
  {
    status: "alive",
    pin: "filled + glow",
    rail: "pinned to the top of Up Next",
    action: "Killed now",
  },
];

interface StatesLegendProps {
  onClose: () => void;
}

// Un-headered reference panel — no DragHandle/title bar, since there's
// nothing here worth repositioning mid-session, just a WindowBorder-style
// box toggled from the dock. Colors/labels come from boss-status.ts, the
// same module every live status indicator (map pins, rail rows, info
// window) reads from, so this can't drift out of sync with them.
export function StatesLegend({ onClose }: StatesLegendProps) {
  return (
    <div className="absolute right-45 bottom-12 w-100">
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] text-system-text">Boss states</h3>
            <button
              onClick={onClose}
              className="text-xs text-white/40 hover:text-white/70"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            {STATES.map((state) => (
              <div
                key={state.status}
                className="flex-1 border border-window-content-border bg-window-content-bg p-2"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: STATUS_COLOR[state.status] }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: STATUS_COLOR[state.status] }}
                  >
                    {STATUS_LABEL[state.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-white/40">
                  {STATUS_CODE[state.status]}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-white/60">
                  {STATUS_MEANING[state.status]}
                </p>
                <div className="mt-1.5 flex flex-col gap-0.5 border-t border-window-content-border pt-1.5 text-[10px]">
                  <div className="flex gap-1">
                    <span className="w-8 shrink-0 text-white/40">Pin</span>
                    <span className="text-white/70">{state.pin}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-8 shrink-0 text-white/40">Rail</span>
                    <span className="text-white/70">{state.rail}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-8 shrink-0 text-white/40">Action</span>
                    <span className="text-white/70">{state.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowBorder>
    </div>
  );
}
