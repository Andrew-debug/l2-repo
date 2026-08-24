"use client";
import Header from "../ui-l2/header";
import { MapPlaceholder } from "../map-placeholder";
import { useMapSize } from "../providers/MapProvider";
import { WindowBorder } from "../ui-l2/window-l2";
import { DraggableWindow } from "../ui-l2/draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import { cn } from "@/lib/utils";

const BUTTON_CLASS = "w-16 h-4.5 text-[13px]";

export default function Map() {
  const { mapSize, setMapSize } = useMapSize();
  const isSmall = mapSize === "small";

  return (
    <DraggableWindow
      className={cn(
        "relative flex flex-col max-w-[800px] max-h-[1000px] h-full",
        isSmall ? "w-[276px]" : "w-full aspect-square",
      )}
    >
      <Header title="Map" canFold canClose />

      <div className={cn(isSmall ? "" : "flex-1")}>
        <WindowBorder>
          <div className="flex flex-col h-full">
            <div className="flex justify-end gap-1.75 pt-1.25 pb-1 pr-0.5">
              <IconStateButton
                defaultIcon="/icons/smallbutton1.png"
                hoverIcon="/icons/smallbutton1_over.png"
                clickIcon="/icons/smallbutton1_down.png"
                className="w-10 h-4.5 text-[13px]"
                text="Find"
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-16 h-4.5 text-[13px]"
                text="World info."
              />
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
                text="Current Loc."
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className={BUTTON_CLASS}
                text="Party Member"
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className={BUTTON_CLASS}
                text="Target Loc."
              />
              {isSmall ? (
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className={BUTTON_CLASS}
                  text="Enlarge map"
                  onClick={() => setMapSize("large")}
                />
              ) : (
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className={BUTTON_CLASS}
                  text="Minimize"
                  onClick={() => setMapSize("small")}
                />
              )}
            </div>
          </div>
        </WindowBorder>
      </div>
    </DraggableWindow>
  );
}
