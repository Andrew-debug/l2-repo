"use client";

import Image from "next/image";
import { Skull } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { levelRanges, type Boss } from "@/lib/boss-data";

// Convention: public/bosses/<levelRange>/<Boss Name>/<Boss Name>.webp
// e.g. level 23 -> /bosses/20-29/Greyclaw Kutus/Greyclaw Kutus.webp
// The level-range folder must match a levelRanges label exactly, the boss
// folder/file must match boss.name exactly, and the file must be .webp —
// no fuzzy matching, no alternate extensions. If it 404s, that's a mistake
// in the asset folder to go fix, not something to guess around here.
//
// Epic bosses (npcType "EpicBoss") break both parts of that convention:
// they live under a flat /bosses/epic/ folder instead of a level range, and
// the folder/file name has spaces stripped (e.g. "Queen Ant" -> "QueenAnt")
// rather than matching boss.name verbatim.
function getBossImagePath(boss: Boss): string {
  if (boss.npcType === "EpicBoss") {
    const fileName = boss.name.replace(/\s+/g, "");
    return `/bosses/epic/${fileName}/${fileName}.webp`;
  }
  const range = levelRanges.find(
    (r) => boss.level >= r.min && boss.level <= r.max,
  );
  return `/bosses/${range?.label}/${boss.name}/${boss.name}.webp`;
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
        className="object-cover"
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
}
