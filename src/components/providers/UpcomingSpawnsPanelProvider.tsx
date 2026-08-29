"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface UpcomingSpawnsPanelContextType {
  // Whether the Upcoming Spawns window is shown at all.
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Collapsed to a small draggable icon (see upcoming-spawns.tsx) — a
  // distinct state from isOpen, since a folded panel is still "open," just
  // iconified.
  isFolded: boolean;
  setIsFolded: (folded: boolean) => void;
  // Toggles between fully visible (open and unfolded) and closed. A folded
  // panel counts as "not fully visible," so this unfolds it rather than
  // just flipping isOpen — flipping isOpen alone while folded would hide
  // the folded icon instead of opening the panel. Shared by the Alt+N
  // shortcut and System Menu's Upcoming Spawns row so both do the same
  // thing. Same pattern as MapProvider's toggleMapOpen.
  toggleOpen: () => void;
}

const UpcomingSpawnsPanelContext = createContext<
  UpcomingSpawnsPanelContextType | undefined
>(undefined);

export function UpcomingSpawnsPanelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isFolded, setIsFolded] = useState(false);

  const toggleOpen = () => {
    if (isOpen && !isFolded) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsFolded(false);
    }
  };

  return (
    <UpcomingSpawnsPanelContext.Provider
      value={{ isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen }}
    >
      {children}
    </UpcomingSpawnsPanelContext.Provider>
  );
}

export function useUpcomingSpawnsPanel(): UpcomingSpawnsPanelContextType {
  const context = useContext(UpcomingSpawnsPanelContext);
  if (context === undefined) {
    throw new Error(
      "useUpcomingSpawnsPanel must be used within a UpcomingSpawnsPanelProvider",
    );
  }
  return context;
}
