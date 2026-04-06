import { useState, useEffect, useRef, RefObject } from "react";

export function useContainerSize<T extends HTMLElement>(): [
  RefObject<T | null>,
  { width: number; height: number },
] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      setSize({
        width: Math.floor(entries[0].contentRect.width),
        height: Math.floor(entries[0].contentRect.height),
      });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
