"use client";

import Image from "next/image";
import { Skull } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { levelRanges, type Boss } from "@/lib/boss-data";

// Convention: public/bosses/<levelRange>/<Boss Name>/<Boss Name>.webp
// e.g. level 23 -> /bosses/20-29/Greyclaw Kutus/Greyclaw Kutus.webp
// The level-range folder must match a levelRanges label exactly, the boss
// folder/file must match boss.name exactly (minus commas, see below), and
// the file must be .webp — no fuzzy matching, no alternate extensions. If
// it 404s, that's a mistake in the asset folder to go fix, not something to
// guess around here.
//
// Commas are stripped from the name before building the path — a comma in
// a local image's path (e.g. "Spirit of Andras, the Betrayer") makes
// Next's built-in image optimizer fail with a 400 ("not a valid image")
// even though the exact same file serves fine unoptimized. Asset
// folders/files for these bosses are named without the comma to match;
// boss.name itself (the display name) is untouched.
function getBossImagePath(boss: Boss): string {
  const name = boss.name.replace(/,/g, "");
  if (boss.npcType === "EpicBoss") {
    const fileName = name.replace(/\s+/g, "");
    return `/bosses/epic/${fileName}/${fileName}.webp`;
  }
  const range = levelRanges.find(
    (r) => boss.level >= r.min && boss.level <= r.max,
  );
  return `/bosses/${range?.label}/${name}/${name}.webp`;
}

export function BossPortraitImage({
  boss,
  className,
  sizes,
}: {
  boss: Boss;
  className?: string;
  sizes?: string;
}) {
  // Tracks *which src* last failed, not just whether one has — this
  // component's own DraggableWindow stays mounted even while closed/showing
  // a different boss (same instance reused across selections, not
  // remounted), so a plain boolean would stay stuck true forever after the
  // first bad image, permanently placeholder-ing every boss selected after
  // it regardless of whether *their* image is actually fine.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = getBossImagePath(boss);
  const failed = failedSrc === src;

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-black/40",
          className,
        )}
      >
        <Skull className="size-1/3 text-white/10" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-black/40", className)}>
      <Image
        src={src}
        alt={boss.name}
        fill
        sizes={sizes ?? "10vw"}
        // aspect-4/3 matches this component's only current caller
        // (info-display.tsx's `aspect-4/3` wrapper) — update if a future
        // caller needs a different ratio.
        className="aspect-4/3 object-cover"
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
}
