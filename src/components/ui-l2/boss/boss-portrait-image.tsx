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
function getBossImagePath(boss: Boss): string {
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
  const [failed, setFailed] = useState(false);

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
        src={getBossImagePath(boss)}
        alt={boss.name}
        fill
        sizes={sizes ?? "10vw"}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
