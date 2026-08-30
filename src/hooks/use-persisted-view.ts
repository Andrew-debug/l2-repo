"use client";

import { useCallback, useLayoutEffect, useState } from "react";

// Persists a small string-enum UI preference across reloads — e.g. the
// Drop List's grid/list view toggle. Starts at `defaultValue` (matching
// whatever the server rendered) so the server render and the first client
// render match, then hydrates from localStorage in a layout effect, not a
// plain effect, so the correction lands before the browser's next paint —
// same SSR-vs-localStorage timing fix usePersistedOffset/
// usePersistedFoldState/usePersistedBoolean use for their own state.
//
// `options` validates whatever's in storage against the current allowed
// values — protects against a stale value left over from a previous
// version of the app that had different choices.
export function usePersistedView<T extends string>(
  key: string,
  defaultValue: T,
  options: readonly T[],
) {
  const [value, setValueState] = useState<T>(defaultValue);

  useLayoutEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw && (options as readonly string[]).includes(raw)) {
        setValueState(raw as T);
      }
    } catch {
      // Non-fatal — stays at defaultValue.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (next: T) => {
      setValueState(next);
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Private browsing / quota exceeded — in-memory state still works
        // for the current session, just won't survive a reload.
      }
    },
    [key],
  );

  return [value, setValue] as const;
}
