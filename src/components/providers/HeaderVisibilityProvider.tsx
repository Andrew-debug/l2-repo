"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface HeaderVisibilityContextType {
  // Whether PageTitleBanner (the "LINEAGE 2 BOSS TRACKING" banner) is
  // shown — toggled from Options' Display section (the "Header" checkbox).
  // Also read by MainWindowsRow so the windows row reclaims the banner's
  // reserved top space when it's hidden, instead of leaving a gap.
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;
}

const HeaderVisibilityContext = createContext<
  HeaderVisibilityContextType | undefined
>(undefined);

export function HeaderVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <HeaderVisibilityContext.Provider
      value={{ isHeaderVisible, setIsHeaderVisible }}
    >
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

export function useHeaderVisibility(): HeaderVisibilityContextType {
  const context = useContext(HeaderVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useHeaderVisibility must be used within a HeaderVisibilityProvider",
    );
  }
  return context;
}
