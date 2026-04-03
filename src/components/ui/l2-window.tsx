import Image from "next/image";
import React from "react";
import { IconStateButton } from "./icon-state-button";

export default function L2Window() {
  return (
    <div className="w-64">
      <div className="flex w-64 h-5 shadow-2xl">
        <Image width={16} height={20} src="/icons/FrameBackLeft.png" alt="" />
        <div className="relative flex-1 flex items-center justify-between w-auto pl-1.25">
          <Image
            fill
            src="/icons/FrameBackMid.png"
            alt=""
            className="object-fill z-0"
          />
          <div className="relative l2-original-style mt-0.75 text-xs">
            Options
          </div>
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

      {/* <div className="border-l-2 border-r-2 border-black">
        <div className="border-l border-r border-window-inner-gray px-1 bg-window-bg py-8">
          <div className="grid grid-cols-6 gap-0.75 w-full border border-window-content-border bg-window-content-bg p-0.5">
            {Array.from({ length: 48 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square window-item-gradient"
               
              >
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
