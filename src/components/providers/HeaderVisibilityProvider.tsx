"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";

interface HeaderVisibilityContextType {
  // Whether PageTitleBanner (the "LINEAGE 2 BOSS TRACKING" banner) is
  // shown — toggled from Options' Display section (the "Header" checkbox).
  // Also read by MainWindowsRow so the windows row reclaims the banner's
  // reserved top space when it's hidden, instead of leaving a gap.
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;
  // True once isHeaderVisible has been read from localStorage — see
  // usePersistedBoolean's own isHydrated. PageTitleBanner gates its own
  // rendering on this so the SSR default (visible) never flashes on screen
  // for a player who turned it off, before snapping to the real value a
  // moment later.
  isHeaderVisibleHydrated: boolean;
}

const HeaderVisibilityContext = createContext<
  HeaderVisibilityContextType | undefined
>(undefined);

export function HeaderVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isHeaderVisible, setIsHeaderVisible, isHeaderVisibleHydrated] =
    usePersistedBoolean("l2-header-visible", true);

  return (
    <HeaderVisibilityContext.Provider
      value={{ isHeaderVisible, setIsHeaderVisible, isHeaderVisibleHydrated }}
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
