import Image from "next/image";
import { DropIcon, GRADE_ICON, gradeForDisplay } from "./drop-icon";
import { WindowBorder } from "../window-l2";
import { cn } from "@/lib/utils";

// One-line hover popup: item name (+ grade badge) on the left, chance
// pinned to the right — same shape as a list-view drop row, just floating
// next to whatever triggered it instead of taking up permanent layout
// space. Shared by the NPC Drop List's grid view and the map's item-filter
// chip, so both read as the same "this is item info" affordance.
export function ItemHoverTooltip({
  item,
  chance,
  showIcon,
  className,
}: {
  item: string;
  chance?: string;
  // The map's item-filter chip has no icon elsewhere on screen for the
  // filtered item, so its tooltip shows one here — the grid view's tooltip
  // leaves this off since the hovered cell is already the icon. DropIcon
  // itself never draws the grade badge (that's this component's own badge
  // next to the name below), so there's no double grade icon either way.
  showIcon?: boolean;
  className?: string;
}) {
  const grade = gradeForDisplay(item);
  return (
    <div
      className={cn(
        "pointer-events-none z-20 w-max bg-black border border-black",
        className,
      )}
    >
      <div className="flex items-center gap-1 px-1 text-[13px] whitespace-nowrap text-white border order-window-inner-gray">
        {showIcon && <DropIcon item={item} className="size-6" />}
        <span className="flex items-center gap-0.5">
          <span>{item}</span>
          {grade !== "none" && (
            <span className="relative size-3.25 shrink-0 mt-0.5">
              <Image
                src={GRADE_ICON[grade]}
                alt={grade}
                fill
                sizes="13px"
                className="aspect-square object-contain"
              />
            </span>
          )}
        </span>
        {chance && (
          <span className="ml-auto tabular-nums text-system-text">
            {chance}
          </span>
        )}
      </div>
    </div>
  );
}
