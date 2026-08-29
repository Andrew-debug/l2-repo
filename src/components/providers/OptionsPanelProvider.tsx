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
}

const OptionsPanelContext = createContext<OptionsPanelContextType | undefined>(
  undefined,
);

export function OptionsPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <OptionsPanelContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
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
