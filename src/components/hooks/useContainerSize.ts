import { useState, useEffect, useRef, RefObject } from "react";

// The only consumer (MapPlaceholder) feeds this straight into a Konva
// Stage's width/height, which clears and fully redraws every map tile and
// boss marker on the canvas — not an incremental update. Committing every
// intermediate ResizeObserver tick would run that full redraw on every
// frame of a window drag; debouncing so it only commits once resizing
// settles keeps the map at its last-known size mid-drag and pays the
// redraw cost once, not continuously.
const RESIZE_COMMIT_DELAY_MS = 120;

export function useContainerSize<T extends HTMLElement>(): [
  RefObject<T | null>,
  { width: number; height: number },
] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    // The very first measurement (on mount) commits immediately so the map
    // doesn't sit blank for the debounce delay before its initial render.
    let hasCommitted = false;

    const observer = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0].contentRect.width);
      const height = Math.floor(entries[0].contentRect.height);

      if (!hasCommitted) {
        hasCommitted = true;
        setSize({ width, height });
        return;
      }

      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        setSize({ width, height });
      }, RESIZE_COMMIT_DELAY_MS);
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, []);

  return [ref, size];
}
