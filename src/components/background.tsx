"use client";

import Image from "next/image";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";
import { cn } from "@/lib/utils";

// x = horizontal focal point within each source image, 0-100 (50 = centered).
// Tweak per boss so the cropped sliver lands on the character, not empty space.
// id = the matching BOSS_DATA.json entry, so clicking a panel while exited
// (see the click handler below) can select the right boss.
const EPIC_BOSSES = [
  { name: "QueenAnt", id: "29001", x: 50 },
  { name: "Baium", id: "29020", x: 70 },
  { name: "Core", id: "29006", x: 45 },
  { name: "Orfen", id: "29014", x: 51 },
  { name: "Frintezza", id: "29047", x: 50 },
  { name: "Antharas", id: "29068", x: 85 },
  { name: "Valakas", id: "29028", x: 30 },
  { name: "Zaken", id: "29022", x: 40 },
];

// One divider between each pair of adjacent panels above — 7 dividers for
// 8 grid-cols-8 columns, at each column boundary.
const PILLAR_POSITIONS = [12.5, 25, 37.5, 50, 62.5, 75, 87.5];

// An ornate vertical divider standing between two adjacent boss panels: a
// soft shadow bar, a thin gold-gradient line with its own highlight edge,
// and a diamond-gem ornament near the top and bottom. Purely decorative —
// pointer-events-none, painted above the images but below the header/rail.
function Pillar({ left }: { left: number }) {
  return (
    <div className="absolute top-0 bottom-0 w-0" style={{ left: `${left}%` }}>
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: -22,
          width: 44,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: -2,
          width: 4,
          background:
            "linear-gradient(90deg, #05070a 0%, #2b2419 22%, #bdae84 50%, #2b2419 78%, #05070a 100%)",
          boxShadow: "0 0 6px rgba(0,0,0,0.9)",
        }}
      />
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: -1,
          width: 1,
          background:
            "linear-gradient(to bottom, rgba(232,220,192,0.65) 0%, rgba(232,220,192,0.10) 18%, rgba(232,220,192,0.08) 82%, rgba(232,220,192,0.65) 100%)",
        }}
      />

      <div className="absolute top-22 left-0 h-0 w-0">
        <div
          className="absolute"
          style={{
            left: -30,
            top: -1,
            width: 60,
            height: 2,
            background:
              "linear-gradient(90deg, rgba(189,174,132,0) 0%, #bdae84 50%, rgba(189,174,132,0) 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: -13,
            top: 5,
            width: 26,
            height: 2,
            background:
              "linear-gradient(90deg, rgba(115,89,41,0) 0%, #8d7c50 50%, rgba(115,89,41,0) 100%)",
          }}
        />
        <div
          className="absolute rotate-45"
          style={{
            left: -7,
            top: -18,
            width: 14,
            height: 14,
            background:
              "linear-gradient(135deg, #e8dcc0 0%, #bdae84 45%, #735929 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.9)",
          }}
        />
        <div
          className="absolute rotate-45 bg-[#14181d]"
          style={{ left: -3, top: -14, width: 6, height: 6 }}
        />
      </div>

      <div className="absolute bottom-38 left-0 h-0 w-0">
        <div
          className="absolute"
          style={{
            left: -30,
            top: -1,
            width: 60,
            height: 2,
            background:
              "linear-gradient(90deg, rgba(189,174,132,0) 0%, #bdae84 50%, rgba(189,174,132,0) 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: -13,
            top: -7,
            width: 26,
            height: 2,
            background:
              "linear-gradient(90deg, rgba(115,89,41,0) 0%, #8d7c50 50%, rgba(115,89,41,0) 100%)",
          }}
        />
        <div
          className="absolute rotate-45"
          style={{
            left: -7,
            top: 5,
            width: 14,
            height: 14,
            background:
              "linear-gradient(135deg, #735929 0%, #bdae84 55%, #e8dcc0 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.9)",
          }}
        />
        <div
          className="absolute rotate-45 bg-[#14181d]"
          style={{ left: -3, top: 9, width: 6, height: 6 }}
        />
      </div>
    </div>
  );
}

// Split out from page.tsx (a server component) since this needs the
// isDimmed/isBackgroundVisible context values, which only client components
// can read. The dim overlay is gated on both flags together, not isDimmed
// alone — dimming an already-hidden background would just be a plain black
// screen.
export function Background() {
  const {
    isDimmed,
    isBackgroundVisible,
    isBackgroundInteractive,
    setReturnToGameBossId,
  } = useBackgroundDim();
  // Only while exited (dim off — see menu-section.tsx's handleExit) *and*
  // Options' "Interactive Background" checkbox is on do these panels act as
  // a "return to game" picker. While dimmed/playing normally, or with that
  // checkbox off (a player who wants to see the art clearly without the
  // hover glow or an accidental click back into the game), they're inert
  // scenery: no cursor, no glow, no click, so a stray click reaching this
  // layer through a gap between windows can't do anything.
  const isPickable =
    isBackgroundVisible && !isDimmed && isBackgroundInteractive;

  return (
    <>
      {isBackgroundVisible && (
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-1">
          {EPIC_BOSSES.map(({ name, id, x }) => (
            <button
              key={name}
              type="button"
              disabled={!isPickable}
              onClick={() => setReturnToGameBossId(id)}
              aria-label={
                isPickable ? `Return to game — jump to ${name}` : undefined
              }
              className={cn(
                "group relative block overflow-hidden text-left",
                isPickable ? "cursor-pointer" : "cursor-default",
              )}
            >
              <Image
                src={`/bosses/epic/${name}/${name}.webp`}
                alt={name}
                fill
                sizes="12.5vw"
                className="aspect-square object-cover"
                style={{ objectPosition: `${x}% center` }}
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 22%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0.78) 100%)",
                }}
              />
              {isPickable && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 80%)",
                    boxShadow: "inset 0 0 40px 8px rgba(255,255,255,0.55)",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
      {isBackgroundVisible && (
        <div className="absolute inset-0 pointer-events-none">
          {PILLAR_POSITIONS.map((left) => (
            <Pillar key={left} left={left} />
          ))}
        </div>
      )}
      {isBackgroundVisible && isDimmed && (
        <div className="absolute inset-0 bg-black/75 pointer-events-none" />
      )}
    </>
  );
}
