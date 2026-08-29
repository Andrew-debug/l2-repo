"use client";

import Image from "next/image";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";

// x = horizontal focal point within each source image, 0-100 (50 = centered).
// Tweak per boss so the cropped sliver lands on the character, not empty space.
const EPIC_BOSSES = [
  { name: "QueenAnt", x: 50 },
  { name: "Baium", x: 70 },
  { name: "Core", x: 45 },
  { name: "Orfen", x: 51 },
  { name: "Frintezza", x: 50 },
  { name: "Antharas", x: 85 },
  { name: "Valakas", x: 30 },
  { name: "Zaken", x: 40 },
];

// Split out from page.tsx (a server component) since this needs the
// isDimmed/isBackgroundVisible context values, which only client components
// can read. The dim overlay is gated on both flags together, not isDimmed
// alone — dimming an already-hidden background would just be a plain black
// screen.
export function Background() {
  const { isDimmed, isBackgroundVisible } = useBackgroundDim();

  return (
    <>
      {isBackgroundVisible && (
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-1 -z-999">
          {EPIC_BOSSES.map(({ name, x }) => (
            <div key={name} className="relative">
              <Image
                src={`/bosses/epic/${name}/${name}.webp`}
                alt={name}
                fill
                className="object-cover"
                style={{ objectPosition: `${x}% center` }}
                priority
              />
            </div>
          ))}
        </div>
      )}
      {isBackgroundVisible && isDimmed && (
        <div className="absolute inset-0 bg-black/75 -z-998" />
      )}
    </>
  );
}
