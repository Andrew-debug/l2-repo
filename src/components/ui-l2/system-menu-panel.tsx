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
}: {
  defaultIcon: string;
  hoverIcon: string;
  clickIcon: string;
  text: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1.5 text-[13px]",
        "odd:bg-[rgb(18,24,30)] even:bg-gray-950",
      )}
    >
      <IconStateButton
        defaultIcon={defaultIcon}
        hoverIcon={hoverIcon}
        clickIcon={clickIcon}
        className="size-8"
      />
      {text}
    </div>
  );
};

interface SystemMenuPanelProps {
  onClose: () => void;
  offset: { x: number; y: number };
  onOffsetChange: (offset: { x: number; y: number }) => void;
}

// The full list — toggled open/closed from MenuSection's map icon button,
// not always visible like MenuSection's dock is. A separate, independently
// movable window — opens in the bottom-right corner, above MenuSection's
// dock, by default. It unmounts on close, so its position is passed down
// from MenuSection (which outlives it) instead of being kept as local
// state here, so it reopens wherever it was last dragged to.
function SystemMenuPanel({ onClose, offset, onOffsetChange }: SystemMenuPanelProps) {
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
        <div className="space-y-1 py-2.5">
          {menuItems.map((item, index) => (
            <MenuRow key={index} {...item} />
          ))}
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}

export default SystemMenuPanel;

// Petition/Options/Restart/Exit Game belong here too (see the reference
// screenshot) but there are no 3-state icon assets for them yet — add once
// those PNGs are sourced.
const menuItems = [
  {
    text: "Community(Alt+B)",
    defaultIcon: "/icons/board_icon.png",
    hoverIcon: "/icons/board_icon_over.png",
    clickIcon: "/icons/board_icon_down.png",
  },
  {
    text: "Help",
    defaultIcon: "/icons/TutorialBtn.png",
    hoverIcon: "/icons/TutorialBtn_light.png",
    clickIcon: "/icons/TutorialBtn_down.png",
  },
];
