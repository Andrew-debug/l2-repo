"use client";
import Header from "../ui-l2/header";
import { MapPlaceholder } from "../map-placeholder";
import { useMapSize } from "../providers/MapProvider";
import { WindowBorder } from "../ui-l2/window-l2";
import { L2Icon } from "../ui/l2-icon";
import { IconStateButton } from "../ui/icon-state-button";
import { cn } from "@/lib/utils";

export default function Map() {
  const { mapSize, setMapSize } = useMapSize();
  return (
    <div
      className={cn(
        "flex flex-col max-w-[800px] max-h-[1000px] h-full py-4",
        mapSize === "small" ? "w-[370px]" : "w-full aspect-square",
      )}
    >
      <Header>
        <Header.Title>Map</Header.Title>

        <Header.Close />
      </Header>

      <div className={cn(mapSize === "small" ? "" : "flex-1")}>
        <WindowBorder>
          <div className="flex flex-col h-full">
            <div className="flex justify-end gap-1.75 pt-1 pb-0.75 px-1.5">
              <IconStateButton
                defaultIcon="/icons/smallbutton1.png"
                hoverIcon="/icons/smallbutton1_over.png"
                clickIcon="/icons/smallbutton1_down.png"
                className="w-13.5 h-6.25"
                text="Find"
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-21 h-6.25"
                text="World info."
              />
            </div>

            <MapPlaceholder />

            <div className="flex justify-end gap-1.75 pb-1 pt-0.75 px-1.5">
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-21 h-6.25"
                text="whatever"
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-21 h-6.25"
                text="whatever"
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-21 h-6.25"
                text="whatever"
              />
              {mapSize === "small" ? (
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className="w-21 h-6.25"
                  text="Enlarge map"
                  onClick={() => setMapSize("large")}
                />
              ) : (
                <IconStateButton
                  defaultIcon="/icons/smallbutton2.png"
                  hoverIcon="/icons/smallbutton2_over.png"
                  clickIcon="/icons/smallbutton2_down.png"
                  className="w-21 h-6.25"
                  text="Minimize"
                  onClick={() => setMapSize("small")}
                />
              )}
            </div>
          </div>
        </WindowBorder>
      </div>
    </div>
  );
}
