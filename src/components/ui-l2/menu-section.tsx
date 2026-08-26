"use client";

import { useState } from "react";
import Image from "next/image";
import { WindowBorder } from "./window-l2";
import { DraggableWindow, DragHandle, StickyWindowGroup } from "./draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import SystemMenuPanel from "./system-menu-panel";
import { cn } from "@/lib/utils";
import { DOCK_CONTENT_WIDTH } from "./dock-layout";

// Vertical grab handle running down the dock's left edge, alongside the
// icons — same top-cap/stretched-middle/bottom-cap composite as Header's
// FrameBack pieces, just rotated to a column. Grabbing it moves the dock —
// only the dock, not SystemMenuPanel; they're separate, independently
// movable windows.
function SideHandle() {
  return (
    <div className="relative top-px flex h-[calc(100%-2px)] w-2.5 flex-col">
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

// The reference screenshot shows 4 toolbar shortcuts — only the map and
// hammer icons have real assets so far, the other two slots are left out
// rather than filled with a placeholder.
const OUTLINE_ICONS = {
  outlineDefaultIcon: "/icons/basic_outline1.png",
  outlineHoverIcon: "/icons/basic_outline1_over.png",
  outlineClickIcon: "/icons/basic_outline1_down.png",
};

const toolbarItems = [
  {
    key: "tmp1",
    defaultIcon: "/icons/menuicon3.png",
    hoverIcon: "/icons/menuicon3_over.png",
    clickIcon: "/icons/menuicon3_down.png",
    ...OUTLINE_ICONS,
  },
  {
    key: "tmp2",
    defaultIcon: "/icons/menuicon4.png",
    hoverIcon: "/icons/menuicon4_over.png",
    clickIcon: "/icons/menuicon4_down.png",
    ...OUTLINE_ICONS,
  },
  {
    key: "map",
    defaultIcon: "/icons/menuicon3.png",
    hoverIcon: "/icons/menuicon3_over.png",
    clickIcon: "/icons/menuicon3_down.png",
    ...OUTLINE_ICONS,
  },
  {
    key: "hammer",
    defaultIcon: "/icons/menuicon4.png",
    hoverIcon: "/icons/menuicon4_over.png",
    clickIcon: "/icons/menuicon4_down.png",
    ...OUTLINE_ICONS,
  },
];

// Always-visible dock — the actual System Menu list (Community/Help/etc.)
// is a separate window, hidden until the map icon here toggles it open.
// Dock and panel are independent DraggableWindows: each moves on its own,
// but a StickyWindowGroup keeps them from being dragged through one another
// — same resist-then-breakaway feel as the viewport edge.
export default function MenuSection() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Lifted out of SystemMenuPanel since it unmounts on close — kept here,
  // in the always-mounted parent, so it survives to the next open.
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });

  return (
    <StickyWindowGroup>
      {isPanelOpen && (
        <SystemMenuPanel
          onClose={() => setIsPanelOpen(false)}
          offset={panelOffset}
          onOffsetChange={setPanelOffset}
        />
      )}
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
              {toolbarItems.map(({ key, ...item }) => (
                <IconStateButton
                  key={key}
                  {...item}
                  className="size-7.5"
                  onClick={
                    key === "map" ? () => setIsPanelOpen((v) => !v) : undefined
                  }
                />
              ))}
            </div>
          </WindowBorder>
        </div>
      </DraggableWindow>
    </StickyWindowGroup>
  );
}
