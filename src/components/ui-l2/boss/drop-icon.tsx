import Image from "next/image";
import { Sword } from "lucide-react";
import {
  getItemCategory,
  getItemGrade,
  getItemIcon,
  type ItemGrade,
} from "@/lib/item-icons";
import { cn } from "@/lib/utils";

export const GRADE_ICON: Record<Exclude<ItemGrade, "none">, string> = {
  S: "/icons/grade_s.png",
  A: "/icons/grade_a.png",
  B: "/icons/grade_b.png",
  C: "/icons/grade_c.png",
  D: "/icons/grade_d.png",
};

// Only weapons, armor, and jewelry (accessory) carry a grade worth
// showing — crafting materials and scrolls can share a grade letter in
// their data without actually being that grade of gear.
export function gradeForDisplay(item: string): ItemGrade {
  const category = getItemCategory(item);
  if (category !== "weapon" && category !== "armor" && category !== "accessory")
    return "none";
  return getItemGrade(item);
}

// Equipment's grade is shown as an icon badge instead (see gradeForDisplay/
// GRADE_ICON above). Everything else can still bake a bare grade letter
// straight into its own name (e.g. "Scroll: Enchant Weapon (D)") — expanded
// to "(Grade D)" here, wherever an item's name is displayed as text, so it
// doesn't read as an unexplained abbreviation next to the name.
export function dropLabel(item: string): string {
  const category = getItemCategory(item);
  if (category === "weapon" || category === "armor" || category === "accessory")
    return item;
  return item.replace(/\(([SABCD])\)\s*$/, "(Grade $1)");
}

export function DropIcon({
  item,
  className,
}: {
  item: string;
  className?: string;
}) {
  const src = getItemIcon(item);
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center border border-window-content-border bg-black/40",
        className,
      )}
    >
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
