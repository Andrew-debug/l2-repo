"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface DropListPanelContextType {
  // Whether the Raid Boss Drop List window is shown at all.
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Collapsed to a small draggable icon (see loot-display.tsx) — a
  // distinct state from isOpen, since a folded panel is still "open," just
  // iconified.
  isFolded: boolean;
  setIsFolded: (folded: boolean) => void;
  // Toggles between fully visible (open and unfolded) and closed. A folded
  // panel counts as "not fully visible," so this unfolds it rather than
  // just flipping isOpen — flipping isOpen alone while folded would hide
  // the folded icon instead of opening the panel. Shared by the Alt+V
  // shortcut and MenuSection's drop-list toolbar button so both do the
  // same thing. Same pattern as MapProvider's toggleMapOpen.
  toggleOpen: () => void;
}

const DropListPanelContext = createContext<
  DropListPanelContextType | undefined
>(undefined);

export function DropListPanelProvider({ children }: { children: ReactNode }) {
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
    <DropListPanelContext.Provider
      value={{ isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen }}
    >
      {children}
    </DropListPanelContext.Provider>
  );
}

export function useDropListPanel(): DropListPanelContextType {
  const context = useContext(DropListPanelContext);
  if (context === undefined) {
    throw new Error(
      "useDropListPanel must be used within a DropListPanelProvider",
    );
  }
  return context;
}
