"use client";

import Image from "next/image";
import { IconStateButton } from "../ui/icon-state-button";
import { WindowBorder } from "./window-l2";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// The game's own confirm-prompt look — fixed dead-center of the viewport
// (not a DraggableWindow: nothing here is worth letting the player misplace
// or lose track of), no drag handle, no ✕, no backdrop-click/Escape
// dismissal. Confirm or Cancel are the only way out, on purpose — this is
// for choices that shouldn't be dismissed absent-mindedly.
export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center">
      <WindowBorder className="w-65 h-auto">
        <div className="border border-window-inner-gray bg-window-bg">
          <div className="flex flex-col gap-12 p-2">
            <div className="flex items-start gap-1.5">
              <Image
                src="/icons/warningicon.png"
                alt=""
                width={20}
                height={20}
                className="mt-0.5 shrink-0"
              />
              <p className="text-[13px] leading-snug text-white">{message}</p>
            </div>
            <div className="flex justify-center gap-1">
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-16 h-4.5 text-[13px]"
                text="Confirm"
                onClick={onConfirm}
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className="w-16 h-4.5 text-[13px]"
                text="Cancel"
                onClick={onCancel}
              />
            </div>
          </div>
        </div>
      </WindowBorder>
    </div>
  );
}
