"use client";

import { useEffect } from "react";
import { useEnterChat } from "@/components/providers/EnterChatProvider";

// Every global window-toggle shortcut (Up Next, Raid Bosses, Drop List,
// Map, System Menu) goes through this one hook so the Alt requirement only
// has to be branched on in one place — see EnterChatProvider for what the
// checkbox means. Unchecked (default): fires on Alt+<code>, same as
// before this setting existed. Checked: fires on a bare <code> press, but
// only when focus isn't in a text input/textarea/contenteditable — a bare
// letter key with no modifier would otherwise hijack ordinary typing
// (e.g. the raid boss filter box), a problem the Alt-modified form never
// had since holding Alt already keeps most browsers from inserting the
// character.
export function useAppShortcut(code: string, onTrigger: () => void) {
  const { enterChat } = useEnterChat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== code || e.repeat) return;
      if (enterChat) {
        if (e.altKey) return;
        const target = e.target as HTMLElement | null;
        if (
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable
        ) {
          return;
        }
      } else if (!e.altKey) {
        return;
      }
      e.preventDefault();
      onTrigger();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, enterChat, onTrigger]);
}

// Formats a shortcut hint to match whichever form is currently active —
// "Up Next(Alt+N)" unchecked, "Up Next(N)" checked — so tooltips/labels
// never fall out of sync with what actually triggers the shortcut.
export function formatShortcutLabel(
  base: string,
  key: string,
  enterChat: boolean,
): string {
  return enterChat ? `${base}(${key})` : `${base}(Alt+${key})`;
}
