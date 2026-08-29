import Image from "next/image";
import { ReactNode } from "react";
import { IconStateButton } from "../ui/icon-state-button";

function HeaderContent({
  title,
  canFold,
  canClose,
  onFold,
  onClose,
}: {
  title: string;
  canFold?: boolean;
  canClose?: boolean;
  onFold?: () => void;
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
            // stopPropagation on mousedown — Header sits inside a
            // DragHandle (see DragHandle's own onMouseDown), so without
            // this, a mousedown here that moves even slightly before
            // mouseup drags the whole window instead of just clicking the
            // button underneath it.
            <div
              className="flex gap-1 ml-auto mr-1.75 mt-0.5"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {canFold && <HeaderFold onClick={onFold} />}
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

function HeaderFold({ onClick }: { onClick?: () => void }) {
  return (
    <IconStateButton
      defaultIcon={"/icons/FrameMiniBtn.png"}
      hoverIcon={"/icons/frameminibtn_over.png"}
      clickIcon={"/icons/FrameMiniOnBtn.png"}
      onClick={onClick}
    />
  );
}

export default Object.assign(HeaderContent, {
  Title: HeaderTitle,
  Close: HeaderClose,
  Fold: HeaderFold,
});
