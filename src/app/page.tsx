import { L2Icon } from "@/components/ui/l2-icon";

export default function Home() {
  return (
    <div className="p-8 space-y-8">
      {/* <MainPage /> */}

      {/* Example 1: Simple Icon without button behavior */}
      <L2Icon
        initialSrc="/icons/inventory_trash.png"
        hoveredSrc="/icons/inventory_trash_drag.png"
        alt="Delete"
        className="w-8 h-8"
        sizes="32px"
      />

      {/* Example 2: Button with label */}
      <L2Icon
        initialSrc="/icons/smallbutton2.png"
        hoveredSrc="/icons/smallbutton2_down.png"
        alt="Add"
        label="Add"
        className="w-[83px] h-[25px]"
        sizes="64px"
        // onClick={() => console.log("Add clicked")}
      />
    </div>
  );
}
