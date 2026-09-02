"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";
import { usePersistedFoldState } from "@/hooks/use-persisted-fold-state";
import { useWindowOpenReset } from "@/hooks/use-persisted-window-open";

interface RaidBossesPanelContextType {
  // Whether the Raid Bosses window is shown at all.
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Collapsed to a small draggable icon (see level-navigator.tsx) — a
  // distinct state from isOpen, since a folded panel is still "open," just
  // iconified.
  isFolded: boolean;
  setIsFolded: (folded: boolean) => void;
  // Toggles between fully visible (open and unfolded) and closed. A folded
  // panel counts as "not fully visible," so this unfolds it rather than
  // just flipping isOpen — flipping isOpen alone while folded would hide
  // the folded icon instead of opening the panel. Shared by the Alt+I
  // shortcut and MenuSection's raid-bosses toolbar button so both do the
  // same thing. Same pattern as MapProvider's toggleMapOpen.
  toggleOpen: () => void;
}

const RaidBossesPanelContext = createContext<
  RaidBossesPanelContextType | undefined
>(undefined);

export function RaidBossesPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = usePersistedBoolean("l2-raid-bosses-open", true);
  useWindowOpenReset(setIsOpen);
  const [isFolded, setIsFolded] = usePersistedFoldState("raid-bosses");

  const toggleOpen = () => {
    if (isOpen && !isFolded) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsFolded(false);
    }
  };

  return (
    <RaidBossesPanelContext.Provider
      value={{ isOpen, setIsOpen, isFolded, setIsFolded, toggleOpen }}
    >
      {children}
    </RaidBossesPanelContext.Provider>
  );
}

export function useRaidBossesPanel(): RaidBossesPanelContextType {
  const context = useContext(RaidBossesPanelContext);
  if (context === undefined) {
    throw new Error(
      "useRaidBossesPanel must be used within a RaidBossesPanelProvider",
    );
  }
  return context;
}
