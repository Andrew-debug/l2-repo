import Image from "next/image";
import { ReactNode } from "react";
import { IconStateButton } from "../ui/icon-state-button";

function HeaderContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-6 drop-shadow-[0_8px_4px_rgba(0,0,0,0.5)] select-none">
      <Image width={19} height={24} src="/icons/FrameBackLeft.png" alt="" />
      <div className="relative flex-1 flex items-center justify-between w-auto pl-1.5">
        <Image
          fill
          src="/icons/FrameBackMid.png"
          alt=""
          className="object-fill z-0"
        />
        {children}
      </div>
      <Image width={19} height={24} src="/icons/FrameBackRight.png" alt="" />
    </div>
  );
}

function HeaderTitle({ children }: { children: ReactNode }) {
  return <div className="relative mt-1">{children}</div>;
}

function HeaderClose() {
  return (
    <IconStateButton
      defaultIcon={"/icons/FrameCloseBtn.png"}
      hoverIcon={"/icons/frameclosebtn_over.png"}
      clickIcon={"/icons/FrameCloseOnBtn.png"}
      className="-mr-2.25"
    />
  );
}

export default Object.assign(HeaderContent, {
  Title: HeaderTitle,
  Close: HeaderClose,
});
