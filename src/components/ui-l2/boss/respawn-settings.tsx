"use client";

import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow } from "../draggable-window";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { RespawnRangePicker } from "./respawn-range-picker";

// One respawn window, applied to every boss — servers run a single rate,
// not a per-boss one, so this is the only place it's configured.
export default function RespawnSettings() {
  const { globalRange, setGlobalRange } = useBossRespawn();

  return (
    <DraggableWindow className="w-50 shrink-0">
      <Header title="Respawn Settings" canClose />
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2">
          <p className="text-[11px] text-white/50">
            Applies to every tracked boss on this server.
          </p>
          <RespawnRangePicker value={globalRange} onChange={setGlobalRange} />
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}
