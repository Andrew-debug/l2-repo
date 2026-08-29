"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { DraggableWindow, DragHandle } from "../draggable-window";
import { FoldIcon } from "../fold-icon";
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
      className={cn("w-80 shrink-0", !isOpen && "invisible pointer-events-none")}
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
        />
      </DragHandle>
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2">
          {!boss && (
            <p className="py-6 text-center text-xs text-white/40">
              Select a boss to see its drops
            </p>
          )}

          {boss && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-system-text">
                    {boss.name}
                  </h3>
                  <p className="text-[11px] text-white/50">
                    {boss.title} · Lv. {boss.level}
                  </p>
                </div>
                <div className="flex border border-window-content-border text-[11px]">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={cn(
                      "px-2 py-1",
                      view === "grid"
                        ? "bg-system-text/20 text-system-text"
                        : "text-white/50",
                    )}
                  >
                    <LayoutGrid className="size-3.25" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={cn(
                      "border-l border-window-content-border px-2 py-1",
                      view === "list"
                        ? "bg-system-text/20 text-system-text"
                        : "text-white/50",
                    )}
                  >
                    <ListIcon className="size-3.25" />
                  </button>
                </div>
              </div>

              {sortedDrops.length === 0 && (
                <p className="py-4 text-center text-xs text-white/40">
                  No known drops
                </p>
              )}

              {sortedDrops.length > 0 && view === "grid" && (
                <div className="grid grid-cols-7 gap-1 border border-window-content-border bg-window-content-bg p-1.5">
                  {sortedDrops.map((drop, index) => {
                    const grade = gradeForDisplay(drop.item);
                    return (
                      <button
                        key={`${drop.item}-${index}`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() =>
                          setHoveredIndex((i) => (i === index ? null : i))
                        }
                        onFocus={() => setHoveredIndex(index)}
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
                        {hoveredIndex === index && (
                          <ItemHoverTooltip
                            item={drop.item}
                            chance={drop.chance}
                            className="absolute bottom-full left-1/2 mb-1 -translate-x-1/4"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {sortedDrops.length > 0 && view === "list" && (
                <ul className="flex flex-col gap-1">
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
    </DraggableWindow>
  );
}
