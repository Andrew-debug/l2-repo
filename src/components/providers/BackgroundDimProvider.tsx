"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface BackgroundDimContextType {
  // Whether the dark overlay over the epic-boss background image is shown.
  // Turned off by the System Menu's Exit Game action (see menu-section.tsx)
  // alongside closing every window, so "leaving" also clears the dimmed
  // backdrop those windows were floating over.
  isDimmed: boolean;
  setIsDimmed: (dimmed: boolean) => void;
  // Whether the epic-boss background image itself is shown at all — a
  // separate, independent flag from isDimmed (Options' "Monsters" checkbox,
  // not Exit Game). Rendering isDimmed's overlay while this is false would
  // just be a plain black screen, so <Background> gates the overlay on
  // both together, not on isDimmed alone.
  isBackgroundVisible: boolean;
  setIsBackgroundVisible: (visible: boolean) => void;
}

const BackgroundDimContext = createContext<
  BackgroundDimContextType | undefined
>(undefined);

export function BackgroundDimProvider({ children }: { children: ReactNode }) {
  const [isDimmed, setIsDimmed] = useState(true);
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(true);

  return (
    <BackgroundDimContext.Provider
      value={{
        isDimmed,
        setIsDimmed,
        isBackgroundVisible,
        setIsBackgroundVisible,
      }}
    >
      {children}
    </BackgroundDimContext.Provider>
  );
}

export function useBackgroundDim(): BackgroundDimContextType {
  const context = useContext(BackgroundDimContext);
  if (context === undefined) {
    throw new Error(
      "useBackgroundDim must be used within a BackgroundDimProvider",
    );
  }
  return context;
}
