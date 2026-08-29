"use client";

import { useHeaderVisibility } from "@/components/providers/HeaderVisibilityProvider";

// Purely decorative framing at the top of the page — gold side tabs, a
// gradient-bordered frame (see .title-banner-frame in globals.css), and the
// game's serif display font for the title. Toggled from Options' Display
// section (the "Header" checkbox) — MainWindowsRow reads the same flag to
// reclaim/give back the reserved top space, so hiding this never leaves a
// dead gap or an overlap.
export function PageTitleBanner() {
  const { isHeaderVisible } = useHeaderVisibility();
  if (!isHeaderVisible) return null;

  return (
    <div className="absolute top-3.5 left-1/2 w-144 -translate-x-1/2">
      <div className="relative">
        <div className="absolute top-1/2 left-[-7px] h-6.5 w-1.75 -translate-y-1/2 bg-gradient-to-b from-[#bdae84] to-[#735929] shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        <div className="absolute top-1/2 right-[-7px] h-6.5 w-1.75 -translate-y-1/2 bg-gradient-to-b from-[#bdae84] to-[#735929] shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        <div className="title-banner-frame p-1.25">
          <div className="border border-[#bdae84]/32 px-4.5 pt-2.25 pb-2 text-center">
            <div
              className="font-marcellus text-[27px] tracking-[0.15em] text-[#e8dcc0]"
              style={{
                textShadow: "0 0 14px rgba(189,174,132,0.35), 1px 1px 0 #000",
              }}
            >
              LINEAGE 2 BOSS TRACKING
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-2.5">
              <div className="h-px w-14 bg-gradient-to-r from-[#bdae84]/0 to-[#bdae84]/70" />
              <span className="text-[11px] tracking-[0.28em] text-system-text">
                l2bosstracking.com
              </span>
              <div className="h-px w-14 bg-gradient-to-r from-[#bdae84]/70 to-[#bdae84]/0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
