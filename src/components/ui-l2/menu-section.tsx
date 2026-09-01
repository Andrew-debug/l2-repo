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
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useBossItemFilter } from "@/components/providers/BossItemFilterProvider";
import { useBossLevelFilter } from "@/components/providers/BossLevelFilterProvider";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";
import { useAppShortcut, formatShortcutLabel } from "@/hooks/use-app-shortcut";
import { useEnterChat } from "@/components/providers/EnterChatProvider";
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
        // w-2.5 h-1.5 (10x6px) overrides Tailwind Preflight's
        // `img { height: auto }`, which would otherwise re-derive height
        // from the source PNG's native (non-matching) aspect ratio.
        className="w-2.5 h-1.5"
      />
      <div className="relative w-full flex-1">
        <Image
          draggable={false}
          fill
          src="/icons/smallbar2.png"
          alt=""
          sizes="10px"
          className="aspect-square object-fill"
        />
      </div>
      <Image
        draggable={false}
        width={10}
        height={6}
        src="/icons/smallbar3.png"
        alt=""
        className="w-2.5 h-1.5"
      />
    </div>
  );
}

const OUTLINE_ICONS = {
  outlineDefaultIcon: "/icons/basic_outline1.png",
  outlineHoverIcon: "/icons/basic_outline1_over.png",
  outlineClickIcon: "/icons/basic_outline1_down.png",
};

// Tooltip strings depend on Options > Game tab's "Enter Chat" checkbox (see
// useAppShortcut), so this is a function of that flag rather than a plain
// module-level constant.
function getToolbarItems(enterChat: boolean) {
  return [
    {
      key: "raid-bosses",
      tooltip: formatShortcutLabel("Raid Bosses", "I", enterChat),
      defaultIcon: "/icons/menuicon1.png",
      hoverIcon: "/icons/menuicon1_down.png",
      clickIcon: "/icons/menubutton1_down.png",
      ...OUTLINE_ICONS,
    },
    {
      key: "drop-list",
      tooltip: formatShortcutLabel("Raid Boss Drop List", "V", enterChat),
      defaultIcon: "/icons/menuicon2.png",
      hoverIcon: "/icons/menuicon2_over.png",
      clickIcon: "/icons/menuicon2_down.png",
      ...OUTLINE_ICONS,
    },
    {
      key: "map",
      tooltip: formatShortcutLabel("Map ", "M", enterChat),
      defaultIcon: "/icons/menuicon3.png",
      hoverIcon: "/icons/menuicon3_over.png",
      clickIcon: "/icons/menuicon3_down.png",
      ...OUTLINE_ICONS,
    },
    {
      key: "hammer",
      tooltip: formatShortcutLabel("System Menu", "X", enterChat),
      defaultIcon: "/icons/menuicon4.png",
      hoverIcon: "/icons/menuicon4_over.png",
      clickIcon: "/icons/menuicon4_down.png",
      ...OUTLINE_ICONS,
    },
  ];
}

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
  const { isOpen: isMapOpen, setIsOpen: setMapOpen, toggleMapOpen } =
    useMapSize();
  const {
    isOpen: isRaidBossesOpen,
    setIsOpen: setRaidBossesOpen,
    toggleOpen: toggleRaidBossesOpen,
  } = useRaidBossesPanel();
  const {
    isOpen: isDropListOpen,
    setIsOpen: setDropListOpen,
    toggleOpen: toggleDropListOpen,
  } = useDropListPanel();
  const { setIsOpen: setOptionsOpen, toggleOpen: toggleOptionsOpen } =
    useOptionsPanel();
  const {
    isOpen: isUpcomingSpawnsOpen,
    setIsOpen: setUpcomingSpawnsOpen,
    toggleOpen: toggleUpcomingSpawnsOpen,
  } = useUpcomingSpawnsPanel();
  const {
    isOpen: isNpcInfoOpen,
    setIsOpen: setNpcInfoOpen,
    toggleOpen: toggleNpcInfoOpen,
  } = useNpcInfoPanel();
  const { resetAll } = useBossRespawn();
  const { setSelectedBoss } = useBossSelection();
  const { clearItemFilter } = useBossItemFilter();
  const { setSelectedRange } = useBossLevelFilter();
  const {
    setIsDimmed,
    exitedWindowSnapshot,
    setExitedWindowSnapshot,
    returnToGameBossId,
    setReturnToGameBossId,
  } = useBackgroundDim();
  // Lifted out of SystemMenuPanel since it unmounts on close — kept here,
  // in the always-mounted parent, so it survives to the next open.
  // Persisted to localStorage so a reload reopens it wherever it was last
  // dropped.
  const [panelOffset, setPanelOffset] = usePersistedOffset("system-menu");
  const { enterChat } = useEnterChat();
  const toolbarItems = getToolbarItems(enterChat);

  // Matches the hammer icon's own tooltip (toolbarItems above) and does the
  // same thing clicking it does. See useAppShortcut for the Alt-vs-bare-key
  // branching (Options > Game tab's "Enter Chat" checkbox).
  useAppShortcut("KeyX", () => setIsPanelOpen((v) => !v));

  // Destructive — wipes every tracked kill, hidden boss, and preference
  // (see BossRespawnProvider.resetAll), plus every other piece of UI state
  // that isn't that provider's concern: the current boss selection (list or
  // map), the active item/level filters, and every window's open/closed
  // state — restored to whatever a first-ever visit would show, not closed.
  // That means most windows end up *open* (Map/Raid Bosses/Drop List/Up
  // Next/NPC Info all default to open; only Options starts closed) and the
  // background dim back on — the opposite of Exit Game just below, which
  // deliberately closes everything since it's meant to leave nothing on
  // screen. Confirmed first since there's no undo.
  const handleRestartConfirm = () => {
    setShowRestartConfirm(false);
    resetAll();
    setSelectedBoss(null, "list");
    clearItemFilter();
    setSelectedRange(null);
    setIsPanelOpen(false);
    setIsLegendOpen(false);
    setMapOpen(true);
    setRaidBossesOpen(true);
    setDropListOpen(true);
    setOptionsOpen(false);
    setUpcomingSpawnsOpen(true);
    setNpcInfoOpen(true);
    setIsDimmed(true);
  };

  // Not a real "quit" — there's nothing to quit out of in a web app — so
  // this instead closes every window (including this menu and the legend)
  // and clears the background dim they were floating over, the closest read
  // on "leave" that's actually reversible.
  const handleExit = () => {
    // So a later click on one of Background's epic-boss panels (see the
    // returnToGameBossId effect below) reopens exactly what was open here,
    // not a fixed guess.
    setExitedWindowSnapshot({
      map: isMapOpen,
      raidBosses: isRaidBossesOpen,
      dropList: isDropListOpen,
      upcomingSpawns: isUpcomingSpawnsOpen,
      npcInfo: isNpcInfoOpen,
    });
    setIsPanelOpen(false);
    setIsLegendOpen(false);
    setMapOpen(false);
    setRaidBossesOpen(false);
    setDropListOpen(false);
    setOptionsOpen(false);
    setUpcomingSpawnsOpen(false);
    setNpcInfoOpen(false);
    setIsDimmed(false);
  };

  // The other half of handleExit above: the player clicked back in via one
  // of Background's epic-boss panels while exited. Restores whichever
  // windows were open right before Exit Game (falling back to this app's
  // normal "playing" defaults if there's no snapshot — e.g. the very first
  // click ever, before Exit Game has run this session), re-dims the
  // background, and selects the clicked boss so the map pans/centers onto
  // it (see KonvaMapViewer's own selectedBossId effect) the same way
  // clicking it in the Raid Bosses list would.
  useEffect(() => {
    if (!returnToGameBossId) return;
    const snapshot = exitedWindowSnapshot;
    setMapOpen(snapshot?.map ?? true);
    setRaidBossesOpen(snapshot?.raidBosses ?? true);
    setDropListOpen(snapshot?.dropList ?? true);
    setUpcomingSpawnsOpen(snapshot?.upcomingSpawns ?? true);
    setNpcInfoOpen(snapshot?.npcInfo ?? true);
    setIsDimmed(true);
    setSelectedBoss(returnToGameBossId, "map");
    setExitedWindowSnapshot(null);
    setReturnToGameBossId(null);
  }, [
    returnToGameBossId,
    exitedWindowSnapshot,
    setMapOpen,
    setRaidBossesOpen,
    setDropListOpen,
    setUpcomingSpawnsOpen,
    setNpcInfoOpen,
    setIsDimmed,
    setSelectedBoss,
    setExitedWindowSnapshot,
    setReturnToGameBossId,
  ]);

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
                    sizes="30px"
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
