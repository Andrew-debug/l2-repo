import { cn } from "@/lib/utils";
import React from "react";

function WindowBorder({
  className,
  innerClassName,
  children,
  ...props
}: React.ComponentProps<"div"> & { innerClassName?: string }) {
  return (
    <div
      className={cn(
        "border-l border-r border-b border-black h-full",
        className,
      )}
    >
      <div
        className={cn(
          "border-l border-r border-b border-window-inner-gray bg-window-bg h-full",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { WindowBorder };
