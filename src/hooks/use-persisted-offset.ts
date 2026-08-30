"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export interface WindowOffset {
  x: number;
  y: number;
}

const ZERO_OFFSET: WindowOffset = { x: 0, y: 0 };
const OFFSET_STORAGE_PREFIX = "l2-window-offset-";
// Fired by clearAllPersistedOffsets so every mounted usePersistedOffset
// instance snaps back to {0,0} immediately — Restart/Initialize reset state
// live, without a page reload, and there's no central store of offsets to
// update directly (each window owns its own local state).
const OFFSETS_RESET_EVENT = "l2-window-offsets-reset";

function storageKeyFor(id: string) {
  return `${OFFSET_STORAGE_PREFIX}${id}`;
}

// Clears every window's persisted position — used by Options' "Initialize"
// (positions/stacking only) and the System Menu's "Restart" (full reset).
// Scans by prefix instead of keeping a separate list of every window id in
// sync with the id strings scattered across each window's own
// usePersistedOffset call.
export function clearAllPersistedOffsets() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(OFFSET_STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Non-fatal — see readOffset.
  }
  window.dispatchEvent(new Event(OFFSETS_RESET_EVENT));
}

function readOffset(id: string): WindowOffset {
  try {
    const raw = window.localStorage.getItem(storageKeyFor(id));
    return raw ? (JSON.parse(raw) as WindowOffset) : ZERO_OFFSET;
  } catch {
    return ZERO_OFFSET;
  }
}

// Remembers a DraggableWindow's dragged-to position across reloads, keyed
// by a stable per-window id. Starts at {0,0} — same as every window's
// un-dragged default — so the server render and the first client render
// match (avoiding a hydration mismatch), then hydrates from localStorage in
// a layout effect, not a plain effect, so the correction lands before the
// browser's *next* paint rather than after it.
//
// That alone still isn't enough to stop the jump: this page is server-
// rendered, and the browser paints that server HTML — always at {0,0},
// since the server has no localStorage — before any client JS has even run,
// let alone hydrated. No in-React effect can undo a paint that already
// happened. `isHydrated` lets a caller keep the window invisible (same
// `invisible` convention already used for isOpen elsewhere) until this
// hook's very first correction has applied, so the window's first *visible*
// paint is already in the right place — the same "hide until positioned"
// trick DraggableWindow's own `centered` option effectively gets for free
// (it starts wherever its static layout puts it, which is presentable, so
// it doesn't need this).
export function usePersistedOffset(id: string) {
  const [offset, setOffsetState] = useState<WindowOffset>(ZERO_OFFSET);
  const [isHydrated, setIsHydrated] = useState(false);

  useLayoutEffect(() => {
    setOffsetState(readOffset(id));
    setIsHydrated(true);
  }, [id]);

  useEffect(() => {
    const handleReset = () => setOffsetState(ZERO_OFFSET);
    window.addEventListener(OFFSETS_RESET_EVENT, handleReset);
    return () => window.removeEventListener(OFFSETS_RESET_EVENT, handleReset);
  }, []);

  const setOffset = useCallback(
    (next: WindowOffset) => {
      setOffsetState(next);
      try {
        window.localStorage.setItem(storageKeyFor(id), JSON.stringify(next));
      } catch {
        // Private browsing / quota exceeded — in-memory state still works
        // for the current session, just won't survive a reload.
      }
    },
    [id],
  );

  return [offset, setOffset, isHydrated] as const;
}
