import Image from "next/image";
import React from "react";
import { IconStateButton } from "./icon-state-button";

export default function L2Window() {
  return (
    <div className="flex w-64 h-5 bg-red-500 overflow-hidden">
      <Image width={16} height={20} src="/icons/FrameBackLeft.png" alt="" />
      <div className="relative flex-1 flex items-center justify-between w-auto pl-1.25">
        <Image
          fill
          src="/icons/FrameBackMid.png"
          alt=""
          className="object-fill z-0"
        />
        <div className="relative l2-original-style mt-0.75 text-[15px]">
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

      {/* <span className="l2-original-style relative z-3 ml-5 bottom-0.5 text-[12px]">
        Options
      </span> */}
    </div>
  );
}
