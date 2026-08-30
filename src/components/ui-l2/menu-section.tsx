"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { WindowBorder } from "./window-l2";
import {
  DraggableWindow,
  DragHandle,
  StickyWindowGroup,
} from "./draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import SystemMenuPanel from "./system-menu-panel";
import { StatesLegend } from "./boss/states-legend";
import { ConfirmDialog } from "./confirm-dialog";
import { useMapSize } from "../providers/MapProvider";
import { useRaidBossesPanel } from "@/components/providers/RaidBossesPanelProvider";
import { useDropListPanel } from "@/components/providers/DropListPanelProvider";
import { useOptionsPanel } from "@/components/providers/OptionsPanelProvider";
import { useUpcomingSpawnsPanel } from "@/components/providers/UpcomingSpawnsPanelProvider";
import { useNpcInfoPanel } from "@/components/providers/NpcInfoPanelProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";
import { cn } from "@/lib/utils";
import { DOCK_CONTENT_WIDTH } from "./dock-layout";

// Vertical grab handle running down the dock's left edge, alongside the
// icons — same top-cap/stretched-middle/bottom-cap composite as Header's
// FrameBack pieces, just rotated to a column. Grabbing it moves the dock —
// only the dock, not SystemMenuPanel; they're separate, independently
// movable windows.
function SideHandle() {
  return (
    <div className="relative top-px flex h-[calc(100%-2px)] w-2.5 flex-col select-none">
      <Image
        draggable={false}
        width={10}
        height={6}
        src="/icons/smallbar1.png"
        alt=""
      />
      <div className="relative w-full flex-1">
        <Image
          draggable={false}
          fill
          src="/icons/smallbar2.png"
          alt=""
          className="object-fill"
        />
      </div>
      <Image
        draggable={false}
        width={10}
        height={6}
        src="/icons/smallbar3.png"
        alt=""
      />
    </div>
  );
}

const OUTLINE_ICONS = {
  outlineDefaultIcon: "/icons/basic_outline1.png",
  outlineHoverIcon: "/icons/basic_outline1_over.png",
  outlineClickIcon: "/icons/basic_outline1_down.png",
};

const toolbarItems = [
  {
    key: "raid-bosses",
    tooltip: "Raid Bosses(Alt+I)",
    defaultIcon: "/icons/menuicon1.png",
    hoverIcon: "/icons/menuicon1_down.png",
    clickIcon: "/icons/menubutton1_down.png",
    ...OUTLINE_ICONS,
  },
  {
    key: "drop-list",
    tooltip: "Raid Boss Drop List(Alt+V)",
    defaultIcon: "/icons/menuicon2.png",
    hoverIcon: "/icons/menuicon2_over.png",
    clickIcon: "/icons/menuicon2_down.png",
    ...OUTLINE_ICONS,
  },
  {
    key: "map",
    tooltip: "Map (Alt+M)",
    defaultIcon: "/icons/menuicon3.png",
    hoverIcon: "/icons/menuicon3_over.png",
    clickIcon: "/icons/menuicon3_down.png",
    ...OUTLINE_ICONS,
  },
  {
    key: "hammer",
    tooltip: "System Menu(Alt+X)",
    defaultIcon: "/icons/menuicon4.png",
    hoverIcon: "/icons/menuicon4_over.png",
    clickIcon: "/icons/menuicon4_down.png",
    ...OUTLINE_ICONS,
  },
];

// Anchored to each icon's right edge, growing left — the dock itself sits
// flush against the screen's bottom-right corner (see the DraggableWindow
// below), so every icon is close to that edge, not just the last one.
// Growing rightward (the usual tooltip direction) would clip off-screen for
// any of them; growing left never does, since there's a whole dock (and
// then the rest of the screen) to spare in that direction.
function ToolbarTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <div className="pointer-events-none absolute right-0 bottom-full z-20 mb-1 bg-black text-[13px] whitespace-nowrap text-white leading-3">
          {label}
        </div>
      )}
    </div>
  );
}

// Always-visible dock — the actual System Menu list (Community/Help/etc.)
// is a separate window, hidden until the hammer icon here toggles it open.
// Dock and panel are independent DraggableWindows: each moves on its own,
// but a StickyWindowGroup keeps them from being dragged through one another
// — same resist-then-breakaway feel as the viewport edge.
export default function MenuSection() {
  // Persisted to localStorage so a reload reopens the System Menu panel if
  // it was left open, same as the other windows' open/position/fold state.
  const [isPanelOpen, setIsPanelOpen] = usePersistedBoolean(
    "l2-system-menu-open",
  );
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const { setIsOpen: setMapOpen, toggleMapOpen } = useMapSize();
  const { setIsOpen: setRaidBossesOpen, toggleOpen: toggleRaidBossesOpen } =
    useRaidBossesPanel();
  const { setIsOpen: setDropListOpen, toggleOpen: toggleDropListOpen } =
    useDropListPanel();
  const { setIsOpen: setOptionsOpen, toggleOpen: toggleOptionsOpen } =
    useOptionsPanel();
  const {
    setIsOpen: setUpcomingSpawnsOpen,
    toggleOpen: toggleUpcomingSpawnsOpen,
  } = useUpcomingSpawnsPanel();
  const { setIsOpen: setNpcInfoOpen, toggleOpen: toggleNpcInfoOpen } =
    useNpcInfoPanel();
  const {
    resetAll,
    hasCustomRange,
    hasEverMarkedKilled,
    dismissRespawnOnboarding,
  } = useBossRespawn();
  const { setIsDimmed } = useBackgroundDim();
  // Lifted out of SystemMenuPanel since it unmounts on close — kept here,
  // in the always-mounted parent, so it survives to the next open.
  // Persisted to localStorage so a reload reopens it wherever it was last
  // dropped.
  const [panelOffset, setPanelOffset] = usePersistedOffset("system-menu");

  // Alt+X — matches the hammer icon's own "System Menu(Alt+X)" tooltip and
  // does the same thing clicking it does. `e.code` (not `e.key`) so the
  // physical key is what matters regardless of what character Alt produces
  // on a given OS/layout.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.code !== "KeyX" || e.repeat) return;
      e.preventDefault();
      setIsPanelOpen((v) => !v);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Destructive — wipes every tracked kill, hidden boss, and preference,
  // then reloads (see BossRespawnProvider.resetAll). Confirmed first since
  // there's no undo.
  const handleRestartConfirm = () => {
    setShowRestartConfirm(false);
    resetAll();
  };

  // Not a real "quit" — there's nothing to quit out of in a web app — so
  // this instead closes every window (including this menu, the legend, and
  // the respawn-timing onboarding strip) and clears the background dim
  // they were floating over, the closest read on "leave" that's actually
  // reversible. dismissRespawnOnboarding is the one exception — same as
  // its own Skip button, it's permanent (see RespawnOnboarding) — so it's
  // only called while the strip could actually be showing; calling it
  // blindly would silently lock in the fallback range for a player who's
  // never even killed a boss yet, before they'd ever seen the prompt.
  const handleExit = () => {
    setIsPanelOpen(false);
    setIsLegendOpen(false);
    setMapOpen(false);
    setRaidBossesOpen(false);
    setDropListOpen(false);
    setOptionsOpen(false);
    setUpcomingSpawnsOpen(false);
    setNpcInfoOpen(false);
    setIsDimmed(false);
    if (!hasCustomRange && hasEverMarkedKilled) dismissRespawnOnboarding();
  };

  return (
    <StickyWindowGroup>
      {showRestartConfirm && (
        <ConfirmDialog
          message="Reset all tracked boss data?"
          onConfirm={handleRestartConfirm}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}
      {isPanelOpen && (
        <SystemMenuPanel
          onClose={() => setIsPanelOpen(false)}
          offset={panelOffset}
          onOffsetChange={setPanelOffset}
          onHelpClick={() => setIsLegendOpen((v) => !v)}
          onOptionsClick={() => toggleOptionsOpen()}
          onUpcomingSpawnsClick={() => toggleUpcomingSpawnsOpen()}
          onNpcInfoClick={() => toggleNpcInfoOpen()}
          onRestartClick={() => setShowRestartConfirm(true)}
          onExitClick={handleExit}
        />
      )}
      {isLegendOpen && <StatesLegend onClose={() => setIsLegendOpen(false)} />}
      <DraggableWindow className="absolute bottom-0 right-0">
        <div className="flex">
          <DragHandle className="shrink-0">
            <SideHandle />
          </DragHandle>
          <WindowBorder
            className={cn(DOCK_CONTENT_WIDTH, "border-l-0 border-t")}
            innerClassName="border-l-0 border-t"
          >
            <div className="flex gap-1 p-1 pl-2">
              {toolbarItems.map(({ key, tooltip, ...item }) => (
                <ToolbarTooltip key={key} label={tooltip}>
                  <IconStateButton
                    {...item}
                    className="size-7.5 select-none"
                    onClick={
                      key === "hammer"
                        ? () => setIsPanelOpen((v) => !v)
                        : key === "map"
                          ? () => toggleMapOpen()
                          : key === "raid-bosses"
                            ? () => toggleRaidBossesOpen()
                            : key === "drop-list"
                              ? () => toggleDropListOpen()
                              : undefined
                    }
                  />
                </ToolbarTooltip>
              ))}
            </div>
          </WindowBorder>
        </div>
      </DraggableWindow>
    </StickyWindowGroup>
  );
}
