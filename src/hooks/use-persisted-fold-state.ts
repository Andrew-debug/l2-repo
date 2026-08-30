"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const FOLD_STORAGE_PREFIX = "l2-window-folded-";
// Fired by unfoldAllPersistedWindows so every mounted usePersistedFoldState
// instance unfolds immediately — same live-reset approach as
// usePersistedOffset's OFFSETS_RESET_EVENT, for the same reason (no page
// reload, no central store of fold state to update directly).
const FOLD_RESET_EVENT = "l2-window-folded-reset";

function storageKeyFor(id: string) {
  return `${FOLD_STORAGE_PREFIX}${id}`;
}

function readFolded(id: string): boolean {
  try {
    return window.localStorage.getItem(storageKeyFor(id)) === "1";
  } catch {
    return false;
  }
}

// Unfolds every persisted-fold window immediately and clears their stored
// state — used by Options' "Initialize" and the System Menu's "Restart",
// both of which should bring every window back to fully visible/unfolded.
// Scans by prefix instead of keeping a separate list of every window id in
// sync with the id strings scattered across each provider's own
// usePersistedFoldState call.
export function unfoldAllPersistedWindows() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(FOLD_STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Non-fatal — see readFolded.
  }
  window.dispatchEvent(new Event(FOLD_RESET_EVENT));
}

// Remembers whether a window is folded (collapsed to its small draggable
// icon) across reloads, keyed by a stable per-window id. Starts unfolded —
// same as every window's default — so the server render and the first
// client render match, then hydrates from localStorage in a layout effect
// (not a plain effect) so the correction lands before the browser's next
// paint, same timing fix usePersistedOffset uses for its own SSR-vs-
// localStorage mismatch.
export function usePersistedFoldState(id: string) {
  const [isFolded, setIsFoldedState] = useState(false);

  useLayoutEffect(() => {
    setIsFoldedState(readFolded(id));
  }, [id]);

  useEffect(() => {
    const handleReset = () => setIsFoldedState(false);
    window.addEventListener(FOLD_RESET_EVENT, handleReset);
    return () => window.removeEventListener(FOLD_RESET_EVENT, handleReset);
  }, []);

  const setIsFolded = useCallback(
    (folded: boolean) => {
      setIsFoldedState(folded);
      try {
        window.localStorage.setItem(storageKeyFor(id), folded ? "1" : "0");
      } catch {
        // Private browsing / quota exceeded — in-memory state still works
        // for the current session, just won't survive a reload.
      }
    },
    [id],
  );

  return [isFolded, setIsFolded] as const;
}
