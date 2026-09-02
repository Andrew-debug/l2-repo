"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "../ui-l2/header";
import { MapPlaceholder } from "../map-placeholder";
import { useMapSize } from "../providers/MapProvider";
import { WindowBorder } from "../ui-l2/window-l2";
import { DraggableWindow, DragHandle } from "../ui-l2/draggable-window";
import { FoldIcon, FOLD_ICON_SIZE } from "../ui-l2/fold-icon";
import { IconStateButton } from "../ui/icon-state-button";
import { MapSearchBar } from "./map-search-bar";
import { STATUS_ICON } from "@/lib/boss-status";
import { usePersistedOffset } from "@/hooks/use-persisted-offset";
import { useAppShortcut, formatShortcutLabel } from "@/hooks/use-app-shortcut";
import { useEnterChat } from "@/components/providers/EnterChatProvider";
import { cn } from "@/lib/utils";

const BUTTON_CLASS = "w-16 h-4.5 text-[13px]";

// Short, at-a-glance phrasing for this inline hint specifically — distinct
// from STATUS_LABEL (boss-status.ts), which is worded for the fuller Boss
// States reference panel (System Menu > Help) rather than a compact toolbar
// row. Both read from the same STATUS_ICON/status colors, so they can't
// visually disagree even though the wording differs by context.
const STATUS_HINT_LABEL: Record<"alive" | "pending" | "dead", string> = {
  alive: "up now",
  pending: "could be up",
  dead: "on cooldown",
};

export default function Map() {
  const {
    mapSize,
    setMapSize,
    isOpen,
    setIsOpen,
    isFolded,
    setIsFolded,
    toggleMapOpen,
  } = useMapSize();
  const isSmall = mapSize === "small";
  const [searchOpen, setSearchOpen] = useState(false);
  // Shared by both DraggableWindows below (each anchored at the same
  // top-left corner of the wrapper, just at different sizes) so folding
  // collapses to an icon exactly where the window currently sits, and
  // unfolding reopens exactly where the icon was last dragged to — the
  // same trick SystemMenuPanel uses to survive its own unmount, except
  // here both forms stay mounted (see the invisible/pointer-events-none
  // toggling below) so folding never touches the Konva map underneath.
  // Persisted to localStorage so a reload reopens it wherever it was last
  // dropped. isHydrated gates visibility below until that persisted value
  // has actually loaded — see usePersistedOffset for why.
  const [offset, setOffset, isOffsetHydrated] = usePersistedOffset("map");
  const { enterChat } = useEnterChat();
  const mapShortcutLabel = formatShortcutLabel("Map ", "M", enterChat);

  // Matches the fold icon's own tooltip below and does the same thing
  // MenuSection's map toolbar button does (see toggleMapOpen). `e.code`
  // (not `e.key`) since Alt+M produces "µ" on Mac keyboards — the physical
  // key stays "KeyM" either way. See useAppShortcut for the Alt-vs-bare-key
  // branching (Options > Game tab's "Enter Chat" checkbox).
  useAppShortcut("KeyM", toggleMapOpen);

  return (
    // Always sized as if large (isSmall never changes this box) — Map sits
    // in a flex row with the loot/info/settings windows, and this wrapper
    // is what reserves its slot there. Letting it shrink to the small
    // (276px) footprint on minimize was the same class of bug as the
    // isOpen/isFolded one above: it freed up flex space, so the windows
    // after Map slid over to fill it. The small window itself still
    // renders at its real 276px size below (see isSmall on the inner
    // DraggableWindow) — anchored top-left, just inside a reserved box
    // that no longer changes size.
    <div
      className={cn(
        "pointer-events-auto relative min-h-0 max-w-[800px] max-h-[1000px] h-full w-full aspect-square",
        !isOpen && "invisible pointer-events-none",
      )}
    >
      <DraggableWindow
        id="map"
        className={cn(
          FOLD_ICON_SIZE,
          "absolute top-0 left-0",
          (!isFolded || !isOffsetHydrated) && "invisible pointer-events-none",
        )}
        initialOffset={offset}
        onOffsetChange={setOffset}
        snapIntoViewport={isFolded}
      >
        <DragHandle>
          <FoldIcon
            icon="/icons/menuicon3.png"
            label={mapShortcutLabel}
            onUnfold={() => setIsFolded(false)}
          />
        </DragHandle>
      </DraggableWindow>

      <DraggableWindow
        id="map"
        className={cn(
          "absolute top-0 left-0 flex flex-col",
          // The window's own real size — independent of the wrapper above,
          // which now always reserves the large footprint (see its own
          // comment). w-full/h-full here means full-size-of-wrapper, i.e.
          // large; small gets its own fixed 276px instead.
          isSmall ? "h-69 w-69" : "h-full w-full",
          // Stay mounted while folded/closed instead of unmounting —
          // visibility:hidden (not display:none) keeps this box's real
          // layout size, so MapPlaceholder's ResizeObserver never sees a
          // 0×0 and never tears down the Konva stage underneath.
          // Unmounting reloaded all ~60 map tile images and reset
          // pan/zoom/selection every time.
          (isFolded || !isOffsetHydrated) && "invisible pointer-events-none",
        )}
        initialOffset={offset}
        onOffsetChange={setOffset}
      >
        <DragHandle>
          <Header
            title="Map"
            canFold
            canClose
            onFold={() => setIsFolded(true)}
            onClose={() => setIsOpen(false)}
          />
        </DragHandle>

        <div className={cn(isSmall ? "" : "flex-1")}>
          <WindowBorder>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-1.75 pt-1.25 pb-1 pr-0.5 pl-0.5">
                {searchOpen && (
                  <MapSearchBar onClose={() => setSearchOpen(false)} />
                )}
                {/* Standing in for the Find search bar while it's closed —
                    a quick reminder of what each pin color means, right
                    where a search would otherwise go. The fuller reference
                    (System Menu > Help > Boss states) still exists
                    separately for the complete pin/rail/action breakdown. */}
                {!searchOpen && !isSmall && (
                  <div className="flex items-center gap-2.5 text-[13px] text-white/55 h-4.5">
                    <span className="flex items-center gap-1">
                      <Image
                        src={STATUS_ICON.alive}
                        alt=""
                        width={18}
                        height={18}
                      />
                      {STATUS_HINT_LABEL.alive}
                    </span>
                    <span className="flex items-center gap-1">
                      <Image
                        src={STATUS_ICON.pending}
                        alt=""
                        width={18}
                        height={18}
                      />
                      {STATUS_HINT_LABEL.pending}
                    </span>
                    <span className="flex items-center gap-1">
                      <Image
                        src={STATUS_ICON.dead}
                        alt=""
                        width={18}
                        height={18}
                        className="opacity-60"
                      />
                      {STATUS_HINT_LABEL.dead}
                    </span>
                  </div>
                )}
                <div className={cn("flex gap-1.75", !searchOpen && "ml-auto")}>
                  <IconStateButton
                    defaultIcon="/icons/smallbutton1.png"
                    hoverIcon="/icons/smallbutton1_over.png"
                    clickIcon="/icons/smallbutton1_down.png"
                    className="w-10 h-4.5 text-[13px]"
                    sizes="40px"
                    text="Find"
                    onClick={() => setSearchOpen(true)}
                  />
                  <IconStateButton
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className="w-16 h-4.5 text-[13px]"
                    sizes="64px"
                    text="World info."
                    disabled
                  />
                </div>
              </div>

              <div className={cn(!isSmall && "flex-1 min-h-0")}>
                <MapPlaceholder />
              </div>

              <div
                className={cn(
                  "flex gap-0.5 pb-1 pt-0.75 px-0.5 ml-0.5",
                  isSmall ? "justify-center" : "justify-end",
                )}
              >
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className={BUTTON_CLASS}
                  sizes="64px"
                  text="Current Loc."
                  disabled
                />
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className={BUTTON_CLASS}
                  sizes="64px"
                  text="Party Member"
                  disabled
                />
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className={BUTTON_CLASS}
                  sizes="64px"
                  text="Target Loc."
                  disabled
                />
                {isSmall ? (
                  <IconStateButton
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className={BUTTON_CLASS}
                    sizes="64px"
                    text="Enlarge map"
                    onClick={() => setMapSize("large")}
                  />
                ) : (
                  <IconStateButton
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className={BUTTON_CLASS}
                    sizes="64px"
                    text="Minimize"
                    onClick={() => setMapSize("small")}
                  />
                )}
              </div>
            </div>
          </WindowBorder>
        </div>
      </DraggableWindow>
    </div>
  );
}
