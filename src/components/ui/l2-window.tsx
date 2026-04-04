import Image from "next/image";
import React from "react";
import { IconStateButton } from "./icon-state-button";
import { L2Icon } from "./l2-icon";
import { cn } from "@/lib/utils";

export default function L2Window() {
  const isActive = false;
  return (
    <div className="overflow-hidden w-79.5">
      <div className="flex h-6 drop-shadow-[0_8px_4px_rgba(0,0,0,0.5)]">
        <Image width={19} height={24} src="/icons/FrameBackLeft.png" alt="" />
        <div className="relative flex-1 flex items-center justify-between w-auto pl-1.5">
          <Image
            fill
            src="/icons/FrameBackMid.png"
            alt=""
            className="object-fill z-0"
          />
          <div className="relative mt-0.75">Macro</div>
          <IconStateButton
            defaultIcon={"/icons/FrameCloseBtn.png"}
            hoverIcon={"/icons/frameclosebtn_over.png"}
            clickIcon={"/icons/FrameCloseOnBtn.png"}
            // tooltipLabel="Close"
            className="-mr-2.25"
          />
        </div>
        <Image width={19} height={24} src="/icons/FrameBackRight.png" alt="" />
      </div>

      <div className="border-l border-r border-b border-black">
        <div className="border-l border-r border-b border-window-inner-gray bg-window-bg p-1.5 pt-2 pb-2">
          <div className="flex items-center justify-between -mb-1.5">
            <h3 className="ml-2.5">Macro List</h3>
            <span className="mr-4">(08/24)</span>
          </div>
          <div className="grid grid-cols-6 content-start w-full border border-window-content-border bg-window-content-bg overflow-y-scroll custom-scrollbar gap-x-1 p-0.5 pt-0 h-88.75 pr-2.25">
            {Array.from({ length: 48 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square mt-0.5",
                  isActive
                    ? "window-item-gradient-active"
                    : "border border-square-border bg-square-bg",
                )}
              ></div>
            ))}
          </div>

          <div className="flex justify-between mt-3.25">
            <div className="flex flex-col h-fit ml-1 mt-2 gap-1">
              <L2Icon
                initialSrc="/icons/smallbutton2.png"
                hoveredSrc="/icons/smallbutton2_down.png"
                alt="Add"
                label="Add"
                className="w-24 h-7"
                sizes="96px"
              />
              <L2Icon
                initialSrc="/icons/smallbutton2.png"
                hoveredSrc="/icons/smallbutton2_down.png"
                alt="Help"
                label="Help"
                className="w-24 h-7"
                sizes="96px"
              />
            </div>

            <div className="flex items-center h-fit bg-window-content-bg border border-window-action-border p-2.5">
              <div className="flex gap-1.25">
                <L2Icon
                  initialSrc="/icons/macro_edit.png"
                  hoveredSrc="/icons/macro_edit_drag.png"
                  alt="Delete"
                  className="w-10 h-10"
                  sizes="40px"
                />

                <L2Icon
                  initialSrc="/icons/inventory_trash.png"
                  hoveredSrc="/icons/inventory_trash_drag.png"
                  alt="Delete"
                  className="w-10 h-10"
                  sizes="40px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
