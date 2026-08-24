import React from "react";
import Header from "./header";
import { WindowBorder } from "./window-l2";
import { DraggableWindow } from "./draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import { cn } from "@/lib/utils";

const MenuSection = ({
  defaultIcon,
  hoverIcon,
  clickIcon,
  text,
}: {
  defaultIcon: string;
  hoverIcon: string;
  clickIcon: string;
  text: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1.5 text-[13px]",
        "odd:bg-[rgb(18,24,30)] even:bg-gray-950",
      )}
    >
      <IconStateButton
        defaultIcon={defaultIcon}
        hoverIcon={hoverIcon}
        clickIcon={clickIcon}
        className="size-8"
      />
      {text}
    </div>
  );
};

export default function SystemMenu() {
  return (
    <DraggableWindow className="absolute w-36 bottom-0 right-0">
      <Header title="System Menu" canFold canClose />
      <WindowBorder>
        <div className="py-2.5 space-y-1">
          {menuItems.map((item, index) => (
            <MenuSection key={index} {...item} />
          ))}
        </div>
      </WindowBorder>
    </DraggableWindow>
  );
}

const menuItems = [
  {
    text: "Community(Alt+B)",
    defaultIcon: "/icons/board_icon.png",
    hoverIcon: "/icons/board_icon_over.png",
    clickIcon: "/icons/board_icon_down.png",
  },
  {
    text: "Help",
    defaultIcon: "/icons/TutorialBtn.png",
    hoverIcon: "/icons/TutorialBtn_light.png",
    clickIcon: "/icons/TutorialBtn_down.png",
  },
  {
    text: "Community(Alt+B)",
    defaultIcon: "/icons/board_icon.png",
    hoverIcon: "/icons/board_icon_over.png",
    clickIcon: "/icons/board_icon_down.png",
  },
  {
    text: "Help",
    defaultIcon: "/icons/TutorialBtn.png",
    hoverIcon: "/icons/TutorialBtn_light.png",
    clickIcon: "/icons/TutorialBtn_down.png",
  },
  {
    text: "Community(Alt+B)",
    defaultIcon: "/icons/board_icon.png",
    hoverIcon: "/icons/board_icon_over.png",
    clickIcon: "/icons/board_icon_down.png",
  },
  {
    text: "Help",
    defaultIcon: "/icons/TutorialBtn.png",
    hoverIcon: "/icons/TutorialBtn_light.png",
    clickIcon: "/icons/TutorialBtn_down.png",
  },
];
