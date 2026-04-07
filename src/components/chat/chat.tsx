"use client";

import React from "react";
import { WindowBorder } from "../ui-l2/window-l2";

export default function Chat() {
  return (
    <WindowBorder className="h-[200px] w-[500px]">
      {/* 1. MAIN WRAPPER: Must be relative so we can absolutely position the hammer inside it.
        Added a dark blue/gray background matching the game.
      */}
      <div className="relative w-full h-full bg-[#181d22]/95 p-1 flex">
        {/* 2. SCROLLING CONTAINER: 
          - direction: rtl puts the scrollbar on the left.
          - The magic happens at `[&::-webkit-scrollbar-track]:mb-[20px]`. This stops the scrollbar 20px before the bottom!
        */}
        <div
          className="flex-1 h-full overflow-y-auto custom-scrollbar"
          style={{ direction: "rtl" }}
        >
          {/* 3. TEXT WRAPPER: 
            - direction: ltr fixes the text.
            - pl-3 adds padding so the text doesn't touch the scrollbar.
          */}
          <div
            className="flex flex-col gap-0.5 leading-[1.15] p-1 pl-3"
            style={{ direction: "ltr" }}
          >
            <span className="text-[#B0B5B9] text-[13px] font-sans drop-shadow-md">
              Welcome to the World of ElmoreLab.
            </span>
            <span className="text-[#61B5B5] text-[13px] font-sans drop-shadow-md">
              Announcements: Welcome to free LineageII Interlude Server!
            </span>
            <span className="text-[#61B5B5] text-[13px] font-sans drop-shadow-md">
              Announcements: Voice command: .menu
            </span>
            <span className="text-[#61B5B5] text-[13px] font-sans drop-shadow-md">
              Announcements: Thank you ArtDamage for support!
            </span>
            <span className="text-[#61B5B5] text-[13px] font-sans drop-shadow-md">
              Announcements: Благодарим ArtDamage за поддержку сервера!
            </span>
            <span className="text-[#C87533] text-[13px] font-sans drop-shadow-md">
              Hanuman: WTS AS Haste\ Sheed Focus
            </span>
            <span className="text-[#C87533] text-[13px] font-sans drop-shadow-md">
              ZukaTuga: WTS HATCHLING WIND/STAR LV35
            </span>

            {/* Filler text to force the scrollbar to appear so you can test it */}
            <span className="text-[#C87533] text-[13px] font-sans drop-shadow-md">
              gladvalakas: kavo
            </span>
            <span className="text-[#C87533] text-[13px] font-sans drop-shadow-md">
              gladvalakas: kavo
            </span>
            <span className="text-[#C87533] text-[13px] font-sans drop-shadow-md">
              gladvalakas: kavo
            </span>
            <span className="text-[#C87533] text-[13px] font-sans drop-shadow-md">
              gladvalakas: kavo
            </span>
          </div>
        </div>

        {/* 4. HAMMER ICON: 
          Absolutely positioned directly into the empty space we left at the bottom of the scrollbar track.
        */}
        {/* <div className="absolute bottom-[4px] left-[4px] w-[15px] h-[16px] flex items-center justify-center bg-[#0d1014] border border-[#303841] cursor-pointer hover:brightness-125">
          <span className="text-[10px]">🔨</span>
         
        </div> */}
      </div>
    </WindowBorder>
  );
}
