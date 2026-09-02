"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { DropIcon, GRADE_ICON, gradeForDisplay } from "./drop-icon";
import { ItemHoverTooltip } from "./item-hover-tooltip";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { usePersistedView } from "@/hooks/use-persisted-view";
import { useAppShortcut, formatShortcutLabel } from "@/hooks/use-app-shortcut";
import { useEnterChat } from "@/components/providers/EnterChatProvider";
import { cn } from "@/lib/utils";

const GRID_COLUMNS = 6;
const VIEW_OPTIONS = ["grid", "list"] as const;

export function BossLootDisplay() {
  const { selectedBossId } = useBossSelection();
  // Persisted to localStorage so a reload keeps whichever view (grid/list)
  // was last chosen.
  const [view, setView] = usePersistedView(
    "l2-drop-list-view",
    "grid",
    VIEW_OPTIONS,
  );
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
  // Persisted to localStorage so a reload reopens it wherever it was last
  // dropped. isHydrated gates visibility below until that persisted value
  // has actually loaded — see usePersistedOffset for why.
  const [offset, setOffset, isOffsetHydrated] = usePersistedOffset("drop-list");

  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  const sortedDrops = boss ? [...boss.drops].sort(compareDrops) : [];
  // Pads the last row out to a full 6 columns with blank cells — a boss
  // with, say, 3 drops still shows a 6-wide row instead of 3 cells and a
  // ragged edge.
  const lastRowPad =
    sortedDrops.length % GRID_COLUMNS === 0
      ? 0
      : GRID_COLUMNS - (sortedDrops.length % GRID_COLUMNS);
  // Additional full blank rows below that, out to the bottom of whatever
  // height this window actually rendered at — the window's height comes
  // from the row's viewport-derived calc() in main-content-row.tsx, so it's
  // genuinely different per monitor/window size, not just content. Measured
  // via ResizeObserver (not a one-off read) so resizing the browser window
  // keeps it filled instead of leaving a stale gap.
  const gridRef = useRef<HTMLDivElement>(null);
  const [extraRowCount, setExtraRowCount] = useState(0);
  const emptyCellCount = lastRowPad + extraRowCount * GRID_COLUMNS;

  // A stale index from the previous boss could otherwise point at the
  // wrong drop (or nothing) the instant the selection changes.
  useEffect(() => {
    setHoveredIndex(null);
  }, [selectedBossId]);

  // useLayoutEffect, not useEffect: this has to settle *before* the browser
  // paints. Switching bosses changes sortedDrops.length but not the
  // container's own pixel size, so ResizeObserver's callback (async, fires
  // on the next frame) wouldn't fire at all here — extraRowCount would stay
  // stale from the previous boss for one frame, mismatched against the new
  // item count, which either overflows the box (flashing a real, working
  // scrollbar) or leaves a gap. The synchronous recompute below runs on
  // every boss switch too (sortedDrops.length is a dependency), closing
  // that gap; the ResizeObserver on top only has to handle the window
  // actually resizing later, once this effect isn't rerunning anyway.
  useLayoutEffect(() => {
    if (view !== "grid" || sortedDrops.length === 0) {
      setExtraRowCount(0);
      return;
    }
    const el = gridRef.current;
    if (!el) return;

    const recompute = () => {
      const style = getComputedStyle(el);
      const paddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const columnGap = parseFloat(style.columnGap) || 0;
      const rowGap = parseFloat(style.rowGap) || 0;

      const contentWidth = el.clientWidth - paddingX;
      const contentHeight = el.clientHeight - paddingY;
      if (contentWidth <= 0 || contentHeight <= 0) return;

      const cellSize =
        (contentWidth - columnGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
      const rowHeight = cellSize + rowGap;
      if (rowHeight <= 0) return;

      // Rows already occupied by real drops plus the last-row padding
      // above — extra rows only need to fill what's left below that.
      const usedRows = Math.ceil(sortedDrops.length / GRID_COLUMNS);
      const usedHeight =
        usedRows * cellSize + Math.max(0, usedRows - 1) * rowGap;
      const remaining = contentHeight - usedHeight;
      // Floor, not round/ceil — a filler row that overshoots the visible
      // area would itself trigger the scrollbar this is meant to avoid
      // needing.
      const extraRows =
        remaining > 0 ? Math.floor((remaining + rowGap) / rowHeight) : 0;

      setExtraRowCount(extraRows);
    };

    recompute();
    // Debounced, unlike the synchronous call above: a live window drag can
    // fire this many times a second, and each tick forces a style/layout
    // read (getComputedStyle, clientWidth/clientHeight) — worth coalescing
    // into one recompute after resizing settles rather than paying that
    // cost on every intermediate frame.
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = setTimeout(recompute, 120);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [view, sortedDrops.length]);

  const { enterChat } = useEnterChat();
  const dropListShortcutLabel = formatShortcutLabel(
    "Raid Boss Drop List",
    "V",
    enterChat,
  );

  // Matches the fold icon's own tooltip below and does the same thing
  // MenuSection's drop-list toolbar button does (see toggleOpen). See
  // useAppShortcut for the Alt-vs-bare-key branching (Options > Game tab's
  // "Enter Chat" checkbox).
  useAppShortcut("KeyV", toggleOpen);

  // Stays mounted while closed (invisible, not removed) instead of
  // returning null — this sits in a flex row with NPC Info/Respawn
  // Settings, and unmounting dropped its slot from the row, shifting its
  // neighbors over. invisible keeps the slot reserved so closing one
  // window never moves the others.
  if (isFolded) {
    return (
      <DraggableWindow
        id="drop-list"
        className={cn(
          "relative size-7.5",
          (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
        )}
        initialOffset={offset}
        onOffsetChange={setOffset}
        snapIntoViewport={isFolded}
      >
        <DragHandle>
          <FoldIcon
            icon="/icons/menuicon2.png"
            label={dropListShortcutLabel}
            onUnfold={() => setIsFolded(false)}
          />
        </DragHandle>
      </DraggableWindow>
    );
  }

  return (
    <DraggableWindow
      id="drop-list"
      className={cn(
        "relative flex h-full min-h-0 w-80 shrink-0 flex-col",
        (!isOpen || !isOffsetHydrated) && "invisible pointer-events-none",
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
                  <div
                    ref={gridRef}
                    className="grid min-h-0 flex-1 auto-rows-min grid-cols-6 content-start gap-1 overflow-y-scroll custom-scrollbar border border-window-content-border bg-window-content-bg p-1.5 pr-3"
                  >
                    {sortedDrops.map((drop, index) => {
                      const grade = gradeForDisplay(drop.item);
                      return (
                        <div
                          key={`${drop.item}-${index}`}
                          tabIndex={0}
                          onMouseEnter={(e) => {
                            setHoveredIndex(index);
                            setHoveredRect(
                              e.currentTarget.getBoundingClientRect(),
                            );
                          }}
                          onMouseLeave={() =>
                            setHoveredIndex((i) => (i === index ? null : i))
                          }
                          onFocus={(e) => {
                            setHoveredIndex(index);
                            setHoveredRect(
                              e.currentTarget.getBoundingClientRect(),
                            );
                          }}
                          onBlur={() =>
                            setHoveredIndex((i) => (i === index ? null : i))
                          }
                          className={cn(
                            "drop-slot relative flex aspect-square items-center justify-center transition-colors",
                            hoveredIndex === index && "border-white/40!",
                          )}
                        >
                          <DropIcon item={drop.item} className="size-9" />
                          <span className="absolute right-0.5 bottom-0 text-[10px] tabular-nums text-white/80">
                            x{drop.count}
                          </span>
                          {grade !== "none" && (
                            <span className="absolute top-0 left-0 size-3.25">
                              <Image
                                src={GRADE_ICON[grade]}
                                alt={grade}
                                fill
                                sizes="13px"
                                className="aspect-square object-contain"
                              />
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {Array.from({ length: emptyCellCount }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        aria-hidden
                        className="drop-slot aspect-square opacity-55"
                      />
                    ))}
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
                                {drop.item}
                              </span>
                              {grade !== "none" && (
                                <span className="relative size-3.25 mt-0.5 shrink-0">
                                  <Image
                                    src={GRADE_ICON[grade]}
                                    alt={grade}
                                    fill
                                    sizes="13px"
                                    className="aspect-square object-contain"
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
