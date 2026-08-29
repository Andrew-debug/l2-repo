"use client";

import Header from "./header";
import { WindowBorder } from "./window-l2";
import { DraggableWindow, DragHandle } from "./draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import { cn } from "@/lib/utils";

const MenuRow = ({
  defaultIcon,
  hoverIcon,
  clickIcon,
  text,
  onClick,
}: {
  defaultIcon: string;
  hoverIcon: string;
  clickIcon: string;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 py-px px-1.5 text-left text-[13px]",
        "odd:bg-window-bg even:bg-zinc-800/10",
      )}
    >
      <IconStateButton
        defaultIcon={defaultIcon}
        hoverIcon={hoverIcon}
        clickIcon={clickIcon}
        className="size-8 select-none"
        onClick={onClick}
      />
      {text}
    </div>
  );
};

interface SystemMenuPanelProps {
  onClose: () => void;
  offset: { x: number; y: number };
  onOffsetChange: (offset: { x: number; y: number }) => void;
  // The boss-states legend used to live behind its own toolbar icon —
  // moved here since it's reference material, the same category of thing
  // as the rest of this menu, not a shortcut worth its own dock slot.
  onHelpClick: () => void;
  onOptionsClick: () => void;
  onUpcomingSpawnsClick: () => void;
  onNpcInfoClick: () => void;
  // Opens a confirm dialog; wipes tracked data (kills, hidden bosses,
  // respawn range, notification prefs) if confirmed — see
  // BossRespawnProvider.resetAll.
  onRestartClick: () => void;
  // Closes every open window and clears the background dim — see
  // MenuSection for what "every window" covers.
  onExitClick: () => void;
}

// The full list — toggled open/closed from MenuSection's map icon button,
// not always visible like MenuSection's dock is. A separate, independently
// movable window — opens in the bottom-right corner, above MenuSection's
// dock, by default. It unmounts on close, so its position is passed down
// from MenuSection (which outlives it) instead of being kept as local
// state here, so it reopens wherever it was last dragged to.
function SystemMenuPanel({
  onClose,
  offset,
  onOffsetChange,
  onHelpClick,
  onOptionsClick,
  onUpcomingSpawnsClick,
  onNpcInfoClick,
  onRestartClick,
  onExitClick,
}: SystemMenuPanelProps) {
  // Petition/Options belong here too (see the reference screenshot) but
  // there are no 3-state icon assets for them yet — add once those PNGs
  // are sourced.
  const menuItems = [
    {
      text: "Community(Alt+B)",
      defaultIcon: "/icons/board_icon.png",
      hoverIcon: "/icons/board_icon_over.png",
      clickIcon: "/icons/board_icon_down.png",
    },
    {
      text: "Help",
      defaultIcon: "/icons/systemicon3.png",
      hoverIcon: "/icons/systemicon3_over.png",
      clickIcon: "/icons/systemicon3_down.png",
      onClick: onHelpClick,
    },
    {
      text: "Options",
      defaultIcon: "/icons/systemicon5.png",
      hoverIcon: "/icons/systemicon5_over.png",
      clickIcon: "/icons/systemicon5_down.png",
      onClick: onOptionsClick,
    },
    {
      text: "Upcoming Spawns(Alt+N)",
      defaultIcon: "/icons/mainwndtabicon4.png",
      hoverIcon: "/icons/mainwndtabicon4_over.png",
      clickIcon: "/icons/mainwndtabicon4_down.png",
      onClick: onUpcomingSpawnsClick,
    },
    {
      text: "NPC Info",
      defaultIcon: "/icons/mainwndtabicon1.png",
      hoverIcon: "/icons/mainwndtabicon1_over.png",
      clickIcon: "/icons/mainwndtabicon1_down.png",
      onClick: onNpcInfoClick,
    },
    {
      text: "Restart",
      defaultIcon: "/icons/systemicon6.png",
      hoverIcon: "/icons/systemicon6_over.png",
      clickIcon: "/icons/systemicon6_down.png",
      onClick: onRestartClick,
    },
    {
      text: "Exit Game",
      defaultIcon: "/icons/systemicon7.png",
      hoverIcon: "/icons/systemicon7_over.png",
      clickIcon: "/icons/systemicon7_down.png",
      onClick: onExitClick,
    },
  ];

  return (
    <DraggableWindow
      className="absolute bottom-12 right-0 w-38.5"
      initialOffset={offset}
      onOffsetChange={onOffsetChange}
    >
      <DragHandle>
        <Header title="System Menu" canClose onClose={onClose} />
      </DragHandle>
      <WindowBorder>
        <div className="py-1.5">
          {menuItems.map((item, index) => (
            <MenuRow key={index} {...item} />
          ))}
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}

export default SystemMenuPanel;
