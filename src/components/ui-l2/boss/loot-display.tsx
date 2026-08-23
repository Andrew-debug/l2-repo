"use client";

import Image from "next/image";
import { Sword } from "lucide-react";
import Header from "../header";
import { WindowBorder } from "../window-l2";
import { getBossById } from "@/lib/boss-data";
import {
  compareDrops,
  getItemCategory,
  getItemGrade,
  getItemIcon,
} from "@/lib/item-icons";
import { useBossSelection } from "@/components/providers/BossSelectionProvider";

function DropIcon({ item }: { item: string }) {
  const src = getItemIcon(item);
  return (
    <div className="relative flex size-9 shrink-0 items-center justify-center border border-window-content-border bg-black/40">
      {src ? (
        <Image
          src={src}
          alt={item}
          fill
          sizes="36px"
          className="object-contain p-0.5"
        />
      ) : (
        <Sword className="size-4 text-white/15" />
      )}
    </div>
  );
}

function dropLabel(item: string): string {
  const category = getItemCategory(item);
  if (category !== "weapon" && category !== "armor" && category !== "accessory")
    return item;
  const grade = getItemGrade(item);
  return grade === "none" ? item : `${item} (${grade})`;
}

export function BossLootDisplay() {
  const { selectedBossId } = useBossSelection();
  const boss = selectedBossId ? getBossById(selectedBossId) : undefined;
  const sortedDrops = boss ? [...boss.drops].sort(compareDrops) : [];

  return (
    <div className="w-70 shrink-0">
      <Header title="NPC Drop List" canClose />
      <WindowBorder>
        <div className="flex flex-col gap-2 p-2">
          {!boss && (
            <p className="py-6 text-center text-xs text-white/40">
              Select a boss to see its drops
            </p>
          )}

          {boss && (
            <>
              <div>
                <h3 className="text-sm font-bold text-system-text">
                  {boss.name}
                </h3>
                <p className="text-[11px] text-white/50">
                  {boss.title} · Lv. {boss.level}
                </p>
              </div>

              <ul className="flex flex-col gap-1">
                {sortedDrops.map((drop, index) => (
                  <li
                    key={`${drop.item}-${index}`}
                    className="flex items-center gap-2 border border-window-content-border bg-window-content-bg px-2 py-1.5"
                  >
                    <DropIcon item={drop.item} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs">{dropLabel(drop.item)}</p>
                      <p className="text-[10px] text-white/40">x{drop.count}</p>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-system-text">
                      {drop.chance}
                    </span>
                  </li>
                ))}
                {sortedDrops.length === 0 && (
                  <p className="py-4 text-center text-xs text-white/40">
                    No known drops
                  </p>
                )}
              </ul>
            </>
          )}
        </div>
      </WindowBorder>
    </div>
  );
}
