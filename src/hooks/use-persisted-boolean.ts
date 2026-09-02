"use client";

import { useCallback, useLayoutEffect, useState } from "react";

function readBoolean(key: string, defaultValue: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? defaultValue : raw === "1";
  } catch {
    return defaultValue;
  }
}

// Persists a single UI on/off flag across reloads — e.g. whether the
// System Menu panel is open. Starts at `defaultValue` (matching whatever
// the server rendered) so the server render and the first client render
// match, then hydrates from localStorage in a layout effect, not a plain
// effect, so the correction lands before the browser's next paint — same
// SSR-vs-localStorage timing fix usePersistedOffset/usePersistedFoldState
// use for their own state.
//
// That alone isn't enough to stop a visible flash for a flag a caller uses
// to gate whether a whole element renders at all (e.g. PageTitleBanner/
// Background reading isHeaderVisible/isBackgroundVisible): the page is
// server-rendered, and the browser paints that server HTML — always at
// `defaultValue`, since the server has no localStorage — before any client
// JS has even run, let alone hydrated. No layout effect can undo a paint
// that already happened. The third return value, `isHydrated`, lets such a
// caller render nothing at all until this hook's first correction has
// applied, so there's no default-then-corrected flash in either direction —
// same "hide until positioned" trick usePersistedOffset's own isHydrated
// uses for window position.
export function usePersistedBoolean(key: string, defaultValue = false) {
  const [value, setValueState] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useLayoutEffect(() => {
    setValueState(readBoolean(key, defaultValue));
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Accepts a functional updater too — matches React's own setState
  // signature since call sites (e.g. an Alt+key toggle) use the
  // `setValue((v) => !v)` form.
  const setValue = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setValueState((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          window.localStorage.setItem(key, resolved ? "1" : "0");
        } catch {
          // Private browsing / quota exceeded — in-memory state still works
          // for the current session, just won't survive a reload.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setValue, isHydrated] as const;
}
