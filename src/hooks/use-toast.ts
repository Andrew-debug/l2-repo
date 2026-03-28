"use client";

import { toast as sonnerToast, type ExternalToast } from "sonner";

// Define the old Shadcn properties so your existing code doesn't throw TS errors
type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
} & ExternalToast;

/**
 * A proxy function that maps the old Shadcn toast API to Sonner's API.
 */
function toast(opts: ToastProps) {
  const { title, description, variant, action, ...rest } = opts;

  // Sonner expects the first argument to be the main message.
  const message = title || description;
  const options = {
    // If we have a title, put the description in its proper place
    description: title ? description : undefined,
    action: action as any,
    ...rest,
  };

  if (variant === "destructive") {
    return sonnerToast.error(message, options);
  }

  return sonnerToast(message, options);
}

/**
 * The hook wrapper to maintain backwards compatibility
 * with components using `const { toast } = useToast()`
 */
function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
