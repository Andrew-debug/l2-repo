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
export function usePersistedBoolean(key: string, defaultValue = false) {
  const [value, setValueState] = useState(defaultValue);

  useLayoutEffect(() => {
    setValueState(readBoolean(key, defaultValue));
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

  return [value, setValue] as const;
}
