"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { FoldIcon } from "../fold-icon";
import { IconStateButton } from "../../ui/icon-state-button";
import { getBossById } from "@/lib/boss-data";
import { compareDrops } from "@/lib/item-icons";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";
import { useDropListPanel } from "@/components/providers/DropListPanelProvider";
import { DropIcon, GRADE_ICON, dropLabel, gradeForDisplay } from "./drop-icon";
import { ItemHoverTooltip } from "./item-hover-tooltip";
import { cn } from "@/lib/utils";

export function BossLootDisplay() {
  const { selectedBossId } = useBossSelection();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // The grid view scrolls (overflow-y-auto) once a boss has enough drops —
  // a tooltip positioned via CSS (absolute, relative to the hovered
  // button) gets clipped by that same overflow, and hovering a row near
  // the scrollable edge could even grow the container's own scrollable
  // height to make room for it. Tracking the hovered button's own
  // viewport rect and rendering the tooltip through a portal (fixed
  // position, painted at the document body level) sidesteps both: it's no
  // longer a descendant of the scrolling element at all, so it can't be
  // clipped by it or affect its scroll size.
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const { isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen } =
    useDropListPanel();
  // Shared across the folded-icon and full-window forms below — see
  // BossLevelNavigator for the same pattern (each form mounts only while
  // active; DraggableWindow reads initialOffset fresh at every mount, so
  // switching forms reopens wherever the other form was last dragged to).
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  const sortedDrops = boss ? [...boss.drops].sort(compareDrops) : [];

  // A stale index from the previous boss could otherwise point at the
  // wrong drop (or nothing) the instant the selection changes.
  useEffect(() => {
    setHoveredIndex(null);
  }, [selectedBossId]);

  // Alt+V — matches the fold icon's own "Raid Boss Drop List(Alt+V)"
  // tooltip and does the same thing MenuSection's drop-list toolbar button
  // does (see toggleOpen). `e.code` (not `e.key`) so the physical key is
  // what matters regardless of what character Alt produces on a given
  // OS/layout.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.code !== "KeyV" || e.repeat) return;
      e.preventDefault();
      toggleOpen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOpen]);

  // Stays mounted while closed (invisible, not removed) instead of
  // returning null — this sits in a flex row with NPC Info/Respawn
  // Settings, and unmounting dropped its slot from the row, shifting its
  // neighbors over. invisible keeps the slot reserved so closing one
  // window never moves the others.
  if (isFolded) {
    return (
      <DraggableWindow
        className={cn("size-7.5", !isOpen && "invisible pointer-events-none")}
        initialOffset={offset}
        onOffsetChange={setOffset}
      >
        <DragHandle>
          <FoldIcon
            icon="/icons/menuicon2.png"
            label="Raid Boss Drop List(Alt+V)"
            onUnfold={() => setIsFolded(false)}
          />
        </DragHandle>
      </DraggableWindow>
    );
  }

  return (
    <DraggableWindow
      className={cn(
        "flex h-full min-h-0 w-80 shrink-0 flex-col",
        !isOpen && "invisible pointer-events-none",
      )}
      initialOffset={offset}
      onOffsetChange={setOffset}
    >
      <DragHandle>
        <Header
          title="Raid Boss Drop List"
          canFold
          canClose
          onFold={() => setIsFolded(true)}
          onClose={() => setIsOpen(false)}
          extra={
            // Shows the icon for the view a click would switch *to* — same
            // "icon describes the destination" idea as the map's fold
            // icons — so grid view (the default) shows the list-view icon,
            // and vice versa.
            <IconStateButton
              defaultIcon={
                view === "grid"
                  ? "/icons/joypad_shortcut.png"
                  : "/icons/party_buffbutton.png"
              }
              hoverIcon={
                view === "grid"
                  ? "/icons/joypad_shortcut_over.png"
                  : "/icons/party_buffbutton_over.png"
              }
              clickIcon={
                view === "grid"
                  ? "/icons/joypad_shortcut_down.png"
                  : "/icons/party_buffbutton_down.png"
              }
              onClick={() => setView(view === "grid" ? "list" : "grid")}
            />
          }
        />
      </DragHandle>
      <div className="min-h-0 flex-1">
        <WindowBorder>
          <div className="flex h-full flex-col gap-2 p-2">
            {!boss && (
              <p className="py-6 text-center text-xs text-white/40">
                Select a boss to see its drops
              </p>
            )}

            {boss && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-system-text">
                    {boss.name}
                  </h3>
                  <p className="text-[11px] text-white/50">
                    {boss.title} · Lv. {boss.level}
                  </p>
                </div>

                {sortedDrops.length === 0 && (
                  <p className="py-4 text-center text-xs text-white/40">
                    No known drops
                  </p>
                )}

                {sortedDrops.length > 0 && view === "grid" && (
                  <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-6 content-start gap-1 overflow-y-auto custom-scrollbar border border-window-content-border bg-window-content-bg p-1.5 pr-3">
                    {sortedDrops.map((drop, index) => {
                      const grade = gradeForDisplay(drop.item);
                      return (
                        <button
                          key={`${drop.item}-${index}`}
                          onMouseEnter={(e) => {
                            setHoveredIndex(index);
                            setHoveredRect(e.currentTarget.getBoundingClientRect());
                          }}
                          onMouseLeave={() =>
                            setHoveredIndex((i) => (i === index ? null : i))
                          }
                          onFocus={(e) => {
                            setHoveredIndex(index);
                            setHoveredRect(e.currentTarget.getBoundingClientRect());
                          }}
                          onBlur={() =>
                            setHoveredIndex((i) => (i === index ? null : i))
                          }
                          className={cn(
                            "relative flex aspect-square items-center justify-center border bg-black/40 transition-colors",
                            hoveredIndex === index
                              ? "border-white/40"
                              : "border-window-content-border",
                          )}
                        >
                          <DropIcon item={drop.item} className="size-9" />
                          <span className="absolute right-0.5 bottom-0 text-[10px] tabular-nums text-white/80">
                            x{drop.count}
                          </span>
                          {grade !== "none" && (
                            <span className="absolute top-0.5 left-0.5 size-3.25">
                              <Image
                                src={GRADE_ICON[grade]}
                                alt={grade}
                                fill
                                sizes="13px"
                                className="object-contain"
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {view === "grid" &&
                  hoveredIndex !== null &&
                  hoveredRect &&
                  sortedDrops[hoveredIndex] &&
                  createPortal(
                    <div
                      className="pointer-events-none fixed z-600"
                      style={{
                        top: hoveredRect.top - 4,
                        left: hoveredRect.left + hoveredRect.width / 2,
                        transform: "translate(-25%, -100%)",
                      }}
                    >
                      <ItemHoverTooltip
                        item={sortedDrops[hoveredIndex].item}
                        chance={sortedDrops[hoveredIndex].chance}
                      />
                    </div>,
                    document.body,
                  )}

                {sortedDrops.length > 0 && view === "list" && (
                  <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
                    {sortedDrops.map((drop, index) => {
                      const grade = gradeForDisplay(drop.item);
                      return (
                        <li
                          key={`${drop.item}-${index}`}
                          className="flex items-center gap-2 border border-window-content-border bg-window-content-bg px-2 py-1.5"
                        >
                          <DropIcon item={drop.item} className="size-9" />
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-0.5 text-xs">
                              <span className="min-w-0 truncate">
                                {dropLabel(drop.item)}
                              </span>
                              {grade !== "none" && (
                                <span className="relative size-3.25 mt-0.5 shrink-0">
                                  <Image
                                    src={GRADE_ICON[grade]}
                                    alt={grade}
                                    fill
                                    sizes="13px"
                                    className="object-contain"
                                  />
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-white/40">
                              x{drop.count}
                            </p>
                          </div>
                          <span className="shrink-0 text-[11px] tabular-nums text-system-text">
                            {drop.chance}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
        </WindowBorder>
      </div>
    </DraggableWindow>
  );
}
