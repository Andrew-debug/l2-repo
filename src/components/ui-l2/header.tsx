import Image from "next/image";
import { ReactNode } from "react";
import { IconStateButton } from "../ui/icon-state-button";

function HeaderContent({
  title,
  canFold,
  canClose,
  onClose,
}: {
  title: string;
  canFold?: boolean;
  canClose?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="relative flex h-4 drop-shadow-[0_8px_4px_rgba(0,0,0,0.5)] select-none">
      <Image width={13} height={16} src="/icons/FrameBackLeft.png" alt="" />
      <div className="relative flex-1 flex items-center justify-between w-auto pl-1.5">
        <Image
          fill
          src="/icons/FrameBackMid.png"
          alt=""
          className="object-fill z-0"
        />
      </div>
      <Image width={13} height={16} src="/icons/FrameBackRight.png" alt="" />
      <div className="absolute inset-0">
        <div className="relative flex pl-4.5">
          <HeaderTitle>{title}</HeaderTitle>
          {(canFold || canClose) && (
            <div className="flex gap-1 ml-auto mr-1.75 mt-0.5">
              {canFold && <HeaderFold />}
              {canClose && <HeaderClose onClick={onClose} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderTitle({ children }: { children: ReactNode }) {
  return <div className="text-[13px]">{children}</div>;
}

function HeaderClose({ onClick }: { onClick?: () => void }) {
  return (
    <IconStateButton
      defaultIcon={"/icons/FrameCloseBtn.png"}
      hoverIcon={"/icons/frameclosebtn_over.png"}
      clickIcon={"/icons/FrameCloseOnBtn.png"}
      onClick={onClick}
    />
  );
}

function HeaderFold() {
  return (
    <IconStateButton
      defaultIcon={"/icons/FrameMiniBtn.png"}
      hoverIcon={"/icons/frameminibtn_over.png"}
      clickIcon={"/icons/FrameMiniOnBtn.png"}
    />
  );
}

export default Object.assign(HeaderContent, {
  Title: HeaderTitle,
  Close: HeaderClose,
  Fold: HeaderFold,
});
