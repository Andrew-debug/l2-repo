"use client";

import { useEffect } from "react";

// Fired by reopenAllPersistedWindows so every mounted main window (Map,
// Raid Bosses, Up Next, Drop List, NPC Info) reopens immediately — same
// live-reset approach as clearAllPersistedOffsets/unfoldAllPersistedWindows
// (no page reload, no central store of open state to update directly).
// A dedicated event rather than folding this into usePersistedBoolean
// itself: that hook backs many unrelated flags (isDimmed, transparent,
// enterChat, ...) that Initialize must NOT touch, only these 5 windows'
// open state.
const WINDOW_OPEN_RESET_EVENT = "l2-window-open-reset";

// Used by Options' "Initialize" — unlike positions/stacking/fold (which
// only affect windows that are already open), reopening is the one piece
// of "back to default" that has to reach windows currently *closed*, since
// OptionsWindow itself renders outside all 5 of these windows' own
// providers (see page.tsx) and so can't call their setIsOpen directly.
export function reopenAllPersistedWindows() {
  window.dispatchEvent(new Event(WINDOW_OPEN_RESET_EVENT));
}

// Call from each of the 5 main-window providers (Map/RaidBosses/DropList/
// UpcomingSpawns/NpcInfo) right after their own usePersistedBoolean("...-open")
// call, passing that same setIsOpen — wires the window up to reopen live
// when reopenAllPersistedWindows fires.
export function useWindowOpenReset(setIsOpen: (open: boolean) => void) {
  useEffect(() => {
    const handleReset = () => setIsOpen(true);
    window.addEventListener(WINDOW_OPEN_RESET_EVENT, handleReset);
    return () =>
      window.removeEventListener(WINDOW_OPEN_RESET_EVENT, handleReset);
  }, [setIsOpen]);
}
