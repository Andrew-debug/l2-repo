"use client";

import Image from "next/image";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { GoldButton } from "../gold-button";
import { getBossById } from "@/lib/boss-data";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossPositions } from "@/components/providers/BossPositionsProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useNpcInfoPanel } from "@/components/providers/NpcInfoPanelProvider";
import { BossPortraitImage } from "./boss-portrait-image";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { cn } from "@/lib/utils";

export default function BossInfoDisplay() {
  const { selectedBossId } = useBossSelection();
  const { positions } = useBossPositions();
  const { getStatus, markKilled, markAlive, isHidden, hideBoss, unhideBoss } =
    useBossRespawn();
  const { isOpen, setIsOpen } = useNpcInfoPanel();
  // Persisted to localStorage so a reload reopens it wherever it was last
  // dropped, same as the other windows. isHydrated gates visibility below
  // until that persisted value has actually loaded — see
  // usePersistedOffset for why.
  const [offset, setOffset, isOffsetHydrated] = usePersistedOffset("npc-info");

  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  // Mark/Hide only make sense for a boss actually placed on the map — one
  // without a position has nowhere for that state to be reflected.
  const hasMapPosition = boss
    ? positions.some((p) => p.bossId === boss.id)
    : false;

  const status = boss ? getStatus(boss.id) : "alive";
  const hidden = boss ? isHidden(boss.id) : false;

  return (
    // Stays mounted while closed (invisible, not removed) instead of
    // returning null — this sits in a flex row with Raid Boss Drop
    // List/Respawn Settings, and unmounting dropped its slot from the row,
    // shifting its neighbors over. invisible keeps the slot reserved so
    // closing one window never moves the others.
    <DraggableWindow
      id="npc-info"
      className={cn(
        "relative flex h-full min-h-0 w-80 shrink-0 flex-col",
        (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
      )}
      initialOffset={offset}
      onOffsetChange={setOffset}
    >
      <DragHandle>
        <Header title="Raid Boss" canClose onClose={() => setIsOpen(false)} />
      </DragHandle>
      <div className="min-h-0 flex-1">
        <WindowBorder>
          {/* Name/level, the buttons, and the portrait all live in one
              scrollable region — overflow-y-scroll (not auto) so the
              custom-scrollbar track/thumb stay visible even when the
              content fits, same treatment as Up Next's list
              (upcoming-spawns.tsx) and Raid Boss Drop List's grid view. */}
          <div className="flex h-full min-h-0 flex-col gap-2 p-2">
            {!boss && (
              <p className="py-6 text-center text-xs text-white/40">
                Select a boss to see its info
              </p>
            )}

            {boss && (
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-scroll custom-scrollbar pr-1">
                {/* One block, one left accent bar for both lines — same
                    per-status treatment as Up Next's rows (upcoming-spawns.tsx),
                    not a separate bar per line. */}
                <div
                  className={cn(
                    "flex shrink-0 flex-col gap-0.5 border px-2 py-1.5",
                    status === "alive" &&
                      "border-window-content-border border-l-2 border-l-[#7ed957] bg-[#7ed957]/12",
                    status === "pending" &&
                      "border-[#f5c518]/40 bg-[#f5c518]/7",
                    status === "dead" &&
                      "border-window-content-border bg-[#c25c5c]/6",
                  )}
                >
                  <span className="text-[13px]">{boss.name}</span>
                  <span className="text-[13px] text-white/50">
                    Lv {boss.level}
                  </span>
                </div>

                {hasMapPosition && (
                  <div className="flex shrink-0 gap-1.5">
                    <GoldButton
                      className="flex-1"
                      onClick={() =>
                        status === "alive"
                          ? markKilled(boss.id)
                          : markAlive(boss.id)
                      }
                    >
                      {status === "alive" ? "Mark as Killed" : "Mark as Alive"}
                    </GoldButton>
                    <GoldButton
                      className="flex-1"
                      onClick={() =>
                        hidden ? unhideBoss(boss.id) : hideBoss(boss.id)
                      }
                    >
                      {hidden ? "Unhide" : "Hide on Map"}
                    </GoldButton>
                  </div>
                )}

                <BossPortraitImage
                  boss={boss}
                  className="aspect-4/3 w-full shrink-0 border border-window-content-border"
                  sizes="288px"
                />

                {/* Only rendered once a real "Road to <boss>" video has
                    actually been found for this boss (see boss-data.ts'
                    routeVideoUrl) — no dead "#" placeholder link. */}
                {boss.routeVideoUrl && (
                  <a
                    href={boss.routeVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-button flex shrink-0 items-center justify-center gap-2 px-2 py-1 text-[13px] text-button-text transition-colors hover:text-[#bcd9ff]"
                  >
                    <Image
                      src="/icons/yt_icon_digital.png"
                      alt=""
                      width={824}
                      height={580}
                      className="h-3 w-auto"
                    />
                    Route video - how to reach
                  </a>
                )}
              </div>
            )}
          </div>
        </WindowBorder>
      </div>
    </DraggableWindow>
  );
}
