import { cn } from "@/lib/utils";
import React from "react";

function WindowBorder({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("border-l border-r border-b border-black h-full")}>
      <div className="border-l border-r border-b border-window-inner-gray bg-window-bg h-full">
        {children}
      </div>
    </div>
  );
}

export { WindowBorder };
// <div
//   data-slot="card-footer"
//   className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
//   {...props}
// />
