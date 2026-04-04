import Image from "next/image";
import React from "react";
import { IconStateButton } from "./icon-state-button";
import { L2Icon } from "./l2-icon";
import { cn } from "@/lib/utils";

export default function L2Window() {
  const isActive = false;
  return (
    <div className="w-64 overflow-hidden">
      <div className="flex h-5 drop-shadow-[0_8px_4px_rgba(0,0,0,0.5)]">
        <Image width={16} height={20} src="/icons/FrameBackLeft.png" alt="" />
        <div className="relative flex-1 flex items-center justify-between w-auto pl-1.25">
          <Image
            fill
            src="/icons/FrameBackMid.png"
            alt=""
            className="object-fill z-0"
          />
          <div className="relative l2-original-style mt-0.5">Macro</div>
          <IconStateButton
            defaultIcon={"/icons/FrameCloseBtn.png"}
            hoverIcon={"/icons/frameclosebtn_over.png"}
            clickIcon={"/icons/FrameCloseOnBtn.png"}
            tooltipLabel="Button tooltip"
            className="-mr-1.75"
          />
        </div>
        <Image width={16} height={20} src="/icons/FrameBackRight.png" alt="" />
      </div>

      <div className="border-l border-r border-b border-black">
        <div className="border-l border-r border-b border-window-inner-gray px-1 bg-window-bg pt-1.25 pb-1">
          <div className="flex items-center justify-between -mb-1">
            <h3 className="ml-1.5">Macro List</h3>
            <span className="mr-3.25">(08/24)</span>
          </div>
          <div className="grid grid-cols-6 content-start gap-x-0.5 w-full border border-window-content-border bg-window-content-bg p-0.5 pt-px h-73.25 overflow-y-scroll custom-scrollbar pr-1.5">
            {Array.from({ length: 48 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square mt-px",
                  isActive
                    ? "window-item-gradient-active"
                    : "border border-square-border bg-square-bg",
                )}
              ></div>
            ))}
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex h-fit flex-col gap-0.75 ml-1 mt-2">
              <L2Icon
                initialSrc="/icons/smallbutton2.png"
                hoveredSrc="/icons/smallbutton2_down.png"
                alt="Add"
                label="Add"
                className="w-18.5 h-5.5"
                sizes="74px"
                // onClick={() => console.log("Add clicked")}
              />
              <L2Icon
                initialSrc="/icons/smallbutton2.png"
                hoveredSrc="/icons/smallbutton2_down.png"
                alt="Help"
                label="Help"
                className="w-18.5 h-5.5"
                sizes="74px"
                // onClick={() => console.log("Add clicked")}
              />
            </div>

            <div className="flex items-center h-fit p-1.5 bg-window-content-bg border border-window-action-border">
              <div className="flex gap-1">
                <L2Icon
                  initialSrc="/icons/macro_edit.png"
                  hoveredSrc="/icons/macro_edit_drag.png"
                  alt="Delete"
                  className="w-8.5 h-8.5"
                  sizes="34px"
                />

                <L2Icon
                  initialSrc="/icons/inventory_trash.png"
                  hoveredSrc="/icons/inventory_trash_drag.png"
                  alt="Delete"
                  className="w-8.5 h-8.5"
                  sizes="34px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
