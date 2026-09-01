"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface OptionsPanelContextType {
  // Whether the Options window is shown at all — no fold state, same as
  // Respawn Settings/NPC Info: this doesn't fold either.
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  // Bumped by requestFocusRespawnTime below — OptionsWindow watches this to
  // jump to the Game tab and BossRespawnTimeSelect watches it to switch
  // itself into Custom mode (which focuses its own input as a side effect).
  // A counter, not a boolean, so asking twice in a row (already open, still
  // on Game tab) still re-fires the effects instead of being a no-op change.
  focusRespawnTimeSignal: number;
  // Called by Up Next's "Set Time" prompt — opens Options straight to the
  // respawn-time input instead of making the player find it themselves.
  requestFocusRespawnTime: () => void;
}

const OptionsPanelContext = createContext<OptionsPanelContextType | undefined>(
  undefined,
);

export function OptionsPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusRespawnTimeSignal, setFocusRespawnTimeSignal] = useState(0);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const requestFocusRespawnTime = () => {
    setIsOpen(true);
    setFocusRespawnTimeSignal((n) => n + 1);
  };

  return (
    <OptionsPanelContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleOpen,
        focusRespawnTimeSignal,
        requestFocusRespawnTime,
      }}
    >
      {children}
    </OptionsPanelContext.Provider>
  );
}

export function useOptionsPanel(): OptionsPanelContextType {
  const context = useContext(OptionsPanelContext);
  if (context === undefined) {
    throw new Error(
      "useOptionsPanel must be used within a OptionsPanelProvider",
    );
  }
  return context;
}
