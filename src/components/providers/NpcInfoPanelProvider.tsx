"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";
import { useWindowOpenReset } from "@/hooks/use-persisted-window-open";

interface NpcInfoPanelContextType {
  // Whether the NPC Info window is shown at all — no fold state here,
  // unlike Map/Raid Bosses/Drop List/Upcoming Spawns, since this panel
  // doesn't fold.
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Called by System Menu's NPC Info row (this panel has no keyboard
  // shortcut either).
  toggleOpen: () => void;
}

const NpcInfoPanelContext = createContext<NpcInfoPanelContextType | undefined>(
  undefined,
);

export function NpcInfoPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = usePersistedBoolean("l2-npc-info-open", true);
  useWindowOpenReset(setIsOpen);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <NpcInfoPanelContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </NpcInfoPanelContext.Provider>
  );
}

export function useNpcInfoPanel(): NpcInfoPanelContextType {
  const context = useContext(NpcInfoPanelContext);
  if (context === undefined) {
    throw new Error(
      "useNpcInfoPanel must be used within a NpcInfoPanelProvider",
    );
  }
  return context;
}
