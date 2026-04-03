import { IconStateButton } from "@/components/ui/icon-state-button";
import { L2Icon } from "@/components/ui/l2-icon";
import L2Window from "@/components/ui/l2-window";

async function handleCloseAction() {
  "use server";
  console.log("This logs in your VSCode terminal, not the browser");
  // Update database here
}

export default function Home() {
  return (
    <div className="p-5 space-y-8 bg-amber-500">
      {/* <MainPage /> */}

      <L2Icon
        initialSrc="/icons/inventory_trash.png"
        hoveredSrc="/icons/inventory_trash_drag.png"
        alt="Delete"
        className="w-8 h-8"
        sizes="32px"
      />

      <L2Icon
        initialSrc="/icons/smallbutton2.png"
        hoveredSrc="/icons/smallbutton2_down.png"
        alt="Add"
        label="Add"
        className="w-20.75 h-6.25"
        sizes="64px"
        // onClick={() => console.log("Add clicked")}
      />

      <IconStateButton
        defaultIcon={"/icons/FrameCloseBtn.png"}
        hoverIcon={"/icons/frameclosebtn_over.png"}
        clickIcon={"/icons/FrameCloseOnBtn.png"}
        onClick={handleCloseAction}
        tooltipLabel="Button tooltip"
      />

      <L2Window />
    </div>
  );
}
