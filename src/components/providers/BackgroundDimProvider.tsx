"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";

// Which of the main game windows were open right before Exit Game closed
// them (see menu-section.tsx's handleExit) — restored verbatim when the
// player clicks back in via one of Background's epic-boss panels, rather
// than reopening a fixed default set.
export interface ExitedWindowSnapshot {
  map: boolean;
  raidBosses: boolean;
  dropList: boolean;
  upcomingSpawns: boolean;
  npcInfo: boolean;
}

interface BackgroundDimContextType {
  // Whether the dark overlay over the epic-boss background image is shown.
  // Turned off by the System Menu's Exit Game action (see menu-section.tsx)
  // alongside closing every window, so "leaving" also clears the dimmed
  // backdrop those windows were floating over. Also toggleable directly via
  // Options > Game's "Dim Background" checkbox, independent of Exit Game.
  isDimmed: boolean;
  setIsDimmed: (dimmed: boolean) => void;
  // Whether the epic-boss background image itself is shown at all — a
  // separate, independent flag from isDimmed (Options' "Monsters" checkbox,
  // not Exit Game). Rendering isDimmed's overlay while this is false would
  // just be a plain black screen, so <Background> gates the overlay on
  // both together, not on isDimmed alone.
  isBackgroundVisible: boolean;
  setIsBackgroundVisible: (visible: boolean) => void;
  // Whether the epic-boss background panels respond to hover/click at all
  // (see Background's isPickable) — independent of isDimmed, for a player
  // who wants to see the art clearly (undimmed) without the hover glow
  // getting in the way or risking an accidental click back into the game.
  isBackgroundInteractive: boolean;
  setIsBackgroundInteractive: (interactive: boolean) => void;
  // Captured by handleExit right before it closes every window — null once
  // consumed (see returnToGameBossId below) or before Exit Game has ever
  // run, in which case a return-to-game click falls back to reopening
  // everything (this app's default "playing" state).
  exitedWindowSnapshot: ExitedWindowSnapshot | null;
  setExitedWindowSnapshot: (snapshot: ExitedWindowSnapshot | null) => void;
  // One-shot signal: Background sets this to a boss id when the player
  // clicks that boss's panel while exited (isDimmed false). Background
  // itself sits outside every window-open provider (see page.tsx's nesting)
  // so it can't restore windows or select a boss directly — MenuSection,
  // which does have all of that, watches this value and reacts, then clears
  // it back to null once handled.
  returnToGameBossId: string | null;
  setReturnToGameBossId: (bossId: string | null) => void;
  // True once isDimmed/isBackgroundVisible/isBackgroundInteractive have all
  // been read from localStorage — see usePersistedBoolean's own isHydrated.
  // Background gates its own rendering on this so the SSR defaults (visible,
  // dimmed) never flash on screen for a player who turned either off,
  // before snapping to the real values a moment later.
  isHydrated: boolean;
}

const BackgroundDimContext = createContext<
  BackgroundDimContextType | undefined
>(undefined);

export function BackgroundDimProvider({ children }: { children: ReactNode }) {
  const [isDimmed, setIsDimmed, isDimmedHydrated] = usePersistedBoolean(
    "l2-background-dimmed",
    true,
  );
  const [
    isBackgroundVisible,
    setIsBackgroundVisible,
    isBackgroundVisibleHydrated,
  ] = usePersistedBoolean("l2-background-visible", true);
  const [
    isBackgroundInteractive,
    setIsBackgroundInteractive,
    isBackgroundInteractiveHydrated,
  ] = usePersistedBoolean("l2-background-interactive", true);
  // All three hydrate synchronously together (same initial layout-effect
  // pass), so this is really just one signal — combined via && rather than
  // picking one arbitrarily so it stays correct even if that ever changes.
  const isHydrated =
    isDimmedHydrated &&
    isBackgroundVisibleHydrated &&
    isBackgroundInteractiveHydrated;
  const [exitedWindowSnapshot, setExitedWindowSnapshot] =
    useState<ExitedWindowSnapshot | null>(null);
  const [returnToGameBossId, setReturnToGameBossId] = useState<string | null>(
    null,
  );

  return (
    <BackgroundDimContext.Provider
      value={{
        isDimmed,
        setIsDimmed,
        isBackgroundVisible,
        setIsBackgroundVisible,
        isBackgroundInteractive,
        setIsBackgroundInteractive,
        exitedWindowSnapshot,
        setExitedWindowSnapshot,
        returnToGameBossId,
        setReturnToGameBossId,
        isHydrated,
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
