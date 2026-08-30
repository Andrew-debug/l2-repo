"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  computeRespawnStatus,
  type RespawnRange,
  type RespawnStatus,
} from "@/lib/respawn";
import {
  DEFAULT_RESPAWN_PRESET_ID,
  getPresetRange,
} from "@/lib/respawn-presets";
import { clearAllPersistedOffsets } from "@/hooks/use-persisted-offset";
import { clearPersistedStackOrder } from "@/components/ui-l2/draggable-window";
import { unfoldAllPersistedWindows } from "@/hooks/use-persisted-fold-state";

const RECORDS_STORAGE_KEY = "l2-boss-respawn-tracking";
const GLOBAL_RANGE_STORAGE_KEY = "l2-boss-respawn-default-range";
const SOUND_ENABLED_STORAGE_KEY = "l2-boss-respawn-sound";
const SOUND_VOLUME_STORAGE_KEY = "l2-boss-respawn-sound-volume";
const HIDDEN_STORAGE_KEY = "l2-boss-hidden";
// The Options > Audio tab's volume slider is 5 discrete steps (0-4), not a
// continuous 0-100 range — matches the reference client's own stepped
// sliders, and there's no real mixer behind this to need finer control.
// Exported so the slider component itself doesn't hardcode the step count
// a second time.
export const VOLUME_STEPS = 5;
const DEFAULT_VOLUME_STEP = VOLUME_STEPS - 1;
// The raw step-to-volume mapping (step / (VOLUME_STEPS - 1)) topped out at
// 1.0 — the source clip itself is loud enough that even the slider's lowest
// non-mute step was still too loud. Scaling every step down by half (so the
// slider's own max only ever reaches 50% real volume) fixes that without
// changing the slider's own 5-step feel.
const MAX_VOLUME_SCALE = 0.3;
// PoE Trade-style alert: plays whenever a tracked boss's status changes,
// and — while the tab is in the background — badges the document title
// with an unread count until the player switches back. No browser
// Notification API/permission involved, so there's nothing to request or
// get denied.
const NOTIFICATION_SOUND_SRC = "/sounds/la2-questitem-get.mp3";
// How often derived statuses (dead/pending/alive) get recomputed — status is
// purely a function of wall-clock time, so nothing else triggers a refresh.
const TICK_INTERVAL_MS = 1_000;
const FALLBACK_RANGE: RespawnRange = getPresetRange(
  DEFAULT_RESPAWN_PRESET_ID,
) ?? { minHours: 12, maxHours: 16 };

// One respawn timer applies to every boss — servers run their own single
// rate, they don't vary it per boss — so all this tracks per boss is when
// it was last marked killed.
interface BossRespawnEntry {
  killedAt: number | null;
}

type BossRespawnRecords = Record<string, BossRespawnEntry>;

function readRecords(): BossRespawnRecords {
  try {
    const raw = window.localStorage.getItem(RECORDS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BossRespawnRecords) : {};
  } catch {
    return {};
  }
}

function readGlobalRange(): RespawnRange {
  try {
    const raw = window.localStorage.getItem(GLOBAL_RANGE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RespawnRange) : FALLBACK_RANGE;
  } catch {
    return FALLBACK_RANGE;
  }
}

// Whether the user has ever explicitly chosen a range (vs. it just being on
// FALLBACK_RANGE because nothing was saved yet) — lets the onboarding strip
// and corner chip tell "never configured" apart from "configured, and it
// happens to match the fallback."
function readHasCustomRange(): boolean {
  try {
    return window.localStorage.getItem(GLOBAL_RANGE_STORAGE_KEY) != null;
  } catch {
    return false;
  }
}

// Defaults to on — an audible alert is the whole point of this feature, so
// unlike the old browser-permission-gated version, there's no "ask first"
// step; the player mutes it themselves if they don't want it.
function readSoundEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
    return raw == null ? true : raw === "1";
  } catch {
    return true;
  }
}

function readSoundVolume(): number {
  try {
    const raw = window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY);
    if (raw == null) return DEFAULT_VOLUME_STEP;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed >= 0 && parsed < VOLUME_STEPS
      ? parsed
      : DEFAULT_VOLUME_STEP;
  } catch {
    return DEFAULT_VOLUME_STEP;
  }
}

// Bosses the player has permanently dismissed as "not interested" — kept
// separate from respawn tracking (killedAt/status) since hiding a boss says
// nothing about whether it's alive or dead, just that its marker should
// stop demanding attention. Still fully trackable underneath; only the map
// pin's look (and this set) changes.
function readHidden(): Record<string, true> {
  try {
    const raw = window.localStorage.getItem(HIDDEN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, true>) : {};
  } catch {
    return {};
  }
}

interface BossRespawnContextType {
  // The one respawn window applied to every boss.
  globalRange: RespawnRange;
  setGlobalRange: (range: RespawnRange) => void;
  // False until setGlobalRange has actually been called (by the user, or by
  // the onboarding strip's Skip) at least once.
  hasCustomRange: boolean;
  markKilled: (bossId: string) => void;
  markAlive: (bossId: string) => void;
  getKilledAt: (bossId: string) => number | null;
  getStatus: (bossId: string) => RespawnStatus;
  // Every boss with a kill on record, regardless of current status — the
  // upcoming-spawns list filters/sorts this itself.
  trackedBossIds: string[];
  // True once the player has marked any boss killed, ever — even if every
  // record has since been cleared back to "alive." Unlike trackedBossIds
  // (current state), this never goes back to false, since a record's key
  // stays in `records` once created. Gates the onboarding strip: no point
  // asking about respawn timing before there's a single timer to apply it
  // to.
  hasEverMarkedKilled: boolean;
  // Mutes the respawn-alert sound (see the status-transition effect below)
  // — the badge-the-title-while-hidden half of the alert always runs
  // regardless, since it's silent by definition.
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  // 0..VOLUME_STEPS-1 (5 discrete steps) — the Options > Audio tab's
  // Notification Vol. slider. Applied to the alert audio element's own
  // `volume` before each play(), independent of soundEnabled (mute skips
  // playing entirely; this just scales it while unmuted).
  soundVolume: number;
  setSoundVolume: (step: number) => void;
  // Marks the range as configured without necessarily changing its value —
  // for the onboarding strip's "Skip" (keep the fallback, just stop asking).
  dismissRespawnOnboarding: () => void;
  // Bosses dismissed as "not interested" — still tracked/clickable as
  // normal, just rendered dimmed/gray on the map instead of by status.
  isHidden: (bossId: string) => boolean;
  hideBoss: (bossId: string) => void;
  unhideBoss: (bossId: string) => void;
  // Wipes every tracked kill, hidden boss, custom respawn range, window
  // position/stacking/folding, and alert-sound preference — the System
  // Menu's Restart button. Resets in place (no page reload): each piece of
  // state is set back to its own fresh-load default directly.
  resetAll: () => void;
}

const BossRespawnContext = createContext<BossRespawnContextType | undefined>(
  undefined,
);

export function BossRespawnProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BossRespawnRecords>({});
  const [hidden, setHidden] = useState<Record<string, true>>({});
  const [globalRange, setGlobalRangeState] =
    useState<RespawnRange>(FALLBACK_RANGE);
  const [hasCustomRange, setHasCustomRange] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [soundVolume, setSoundVolumeState] = useState(DEFAULT_VOLUME_STEP);
  // Last status seen per boss, purely to detect transitions for
  // notifications — not persisted, and never drives rendering itself.
  const prevStatusRef = useRef<Map<string, RespawnStatus>>(new Map());
  // Created once and reused rather than `new Audio()` per alert — playing
  // the same element again just restarts it (see the effect below, which
  // rewinds currentTime first so back-to-back alerts don't get swallowed by
  // an in-progress play()).
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);
  // Set once, the first time the title actually needs badging — restoring
  // to this (rather than some hardcoded string) means whatever the page's
  // real title is stays correct even if that ever changes.
  const originalTitleRef = useRef<string | null>(null);
  const unreadCountRef = useRef(0);
  // The one <link rel="icon"> this app actually controls (see the mount
  // effect below, which consolidates down to a single element) and the
  // plain, unbadged source image drawn onto it — kept separate so every
  // badge redraw starts from a clean copy instead of compounding onto
  // whatever the canvas already had.
  const faviconLinkRef = useRef<HTMLLinkElement | null>(null);
  const baseFaviconImageRef = useRef<HTMLImageElement | null>(null);
  // The previous badge's object URL — revoked once the next one replaces
  // it (blob URLs otherwise leak for the life of the tab).
  const faviconBlobUrlRef = useRef<string | null>(null);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setRecords(readRecords());
    setHidden(readHidden());
    setGlobalRangeState(readGlobalRange());
    setHasCustomRange(readHasCustomRange());
    setSoundEnabledState(readSoundEnabled());
    setSoundVolumeState(readSoundVolume());
  }, []);

  // Created once — playing it again later just rewinds and restarts (see
  // the status-transition effect below).
  useEffect(() => {
    alertAudioRef.current = new Audio(NOTIFICATION_SOUND_SRC);
  }, []);

  // Redraws the favicon from a clean base image every call (never onto
  // whatever the canvas already had) — a plain circle-and-number badge in
  // the bottom-right corner, cleared entirely once `count` is back to 0.
  // Sweeps and removes *every* icon-ish link before adding the new one —
  // not just the one this code was tracking — self-healing against strays
  // that reappear from outside this code (confirmed via logging: Next Fast
  // Refresh re-injected the layout's static icon links mid-session, so the
  // one-time mount cleanup below wasn't enough — the tracked link kept
  // getting updated correctly, but the browser was showing one of the
  // untouched originals sitting alongside it). Also replaces the <link>
  // element itself rather than mutating href in place, and uses a blob:
  // object URL rather than a data: URI, both extra precautions against
  // browsers that don't repaint on a plain attribute/URI-scheme change.
  const renderFaviconBadge = useCallback((count: number) => {
    const base = baseFaviconImageRef.current;
    if (!base) return;

    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(base, 0, 0, size, size);

    if (count > 0) {
      const radius = size * 0.38;
      const cx = size - radius;
      const cy = size - radius;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#e03131";
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(radius * 1.5)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(count > 9 ? "9+" : String(count), cx, cy + 1);
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);

      document
        .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
        .forEach((el) => el.remove());

      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.type = "image/png";
      newLink.sizes = "32x32";
      newLink.href = url;
      document.head.appendChild(newLink);
      faviconLinkRef.current = newLink;

      if (faviconBlobUrlRef.current)
        URL.revokeObjectURL(faviconBlobUrlRef.current);
      faviconBlobUrlRef.current = url;
    }, "image/png");
  }, []);

  // Takes over the tab's favicon so the badge above can be drawn onto it.
  // The page otherwise ships several favicon-ish links at once — Next's own
  // favicon.ico file-convention link (sizes="48x48"), this app's metadata
  // icon, and a legacy shortcut-icon link — and browsers don't agree on
  // which one wins when several exist; removing all of them and installing
  // exactly one <link rel="icon"> this code owns makes that unambiguous.
  // (An earlier version of this kept the *first* existing link instead of
  // removing everything — which happened to be the low-priority "shortcut
  // icon" one, not the one browsers were actually displaying, so updating
  // it did nothing visible.)
  useEffect(() => {
    document
      .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
      .forEach((el) => el.remove());

    const img = new Image();
    img.src = "/favicon-32x32.png";
    img.onload = () => {
      baseFaviconImageRef.current = img;
      renderFaviconBadge(unreadCountRef.current);
    };
  }, [renderFaviconBadge]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const persistRecords = useCallback((next: BossRespawnRecords) => {
    setRecords(next);
    try {
      window.localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing / quota exceeded — in-memory state still works for
      // the current session, just won't survive a reload.
    }
  }, []);

  const setGlobalRange = useCallback((range: RespawnRange) => {
    setGlobalRangeState(range);
    setHasCustomRange(true);
    try {
      window.localStorage.setItem(
        GLOBAL_RANGE_STORAGE_KEY,
        JSON.stringify(range),
      );
    } catch {
      // Same as above — non-fatal.
    }
  }, []);

  const dismissRespawnOnboarding = useCallback(() => {
    setGlobalRange(globalRange);
  }, [globalRange, setGlobalRange]);

  const markKilled = useCallback(
    (bossId: string) => {
      const existing = records[bossId] ?? {};
      persistRecords({
        ...records,
        [bossId]: { ...existing, killedAt: Date.now() },
      });
    },
    [records, persistRecords],
  );

  const markAlive = useCallback(
    (bossId: string) => {
      const existing = records[bossId] ?? {};
      persistRecords({
        ...records,
        [bossId]: { ...existing, killedAt: null },
      });
    },
    [records, persistRecords],
  );

  const persistHidden = useCallback((next: Record<string, true>) => {
    setHidden(next);
    try {
      window.localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Non-fatal — see persistRecords.
    }
  }, []);

  const isHidden = useCallback(
    (bossId: string) => hidden[bossId] === true,
    [hidden],
  );

  const hideBoss = useCallback(
    (bossId: string) => persistHidden({ ...hidden, [bossId]: true }),
    [hidden, persistHidden],
  );

  const unhideBoss = useCallback(
    (bossId: string) => {
      const next = { ...hidden };
      delete next[bossId];
      persistHidden(next);
    },
    [hidden, persistHidden],
  );

  const getKilledAt = useCallback(
    (bossId: string) => records[bossId]?.killedAt ?? null,
    [records],
  );

  const getStatus = useCallback(
    (bossId: string): RespawnStatus =>
      computeRespawnStatus(getKilledAt(bossId), globalRange, now),
    [getKilledAt, globalRange, now],
  );

  const trackedBossIds = useMemo(
    () =>
      Object.entries(records)
        .filter(([, entry]) => entry.killedAt != null)
        .map(([bossId]) => bossId),
    [records],
  );

  const hasEverMarkedKilled = useMemo(
    () => Object.keys(records).length > 0,
    [records],
  );

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      window.localStorage.setItem(
        SOUND_ENABLED_STORAGE_KEY,
        enabled ? "1" : "0",
      );
    } catch {
      // Non-fatal — see persistRecords.
    }
  }, []);

  const setSoundVolume = useCallback((step: number) => {
    const clamped = Math.min(VOLUME_STEPS - 1, Math.max(0, step));
    setSoundVolumeState(clamped);
    try {
      window.localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, String(clamped));
    } catch {
      // Non-fatal — see persistRecords.
    }
  }, []);

  const resetAll = useCallback(() => {
    try {
      window.localStorage.removeItem(RECORDS_STORAGE_KEY);
      window.localStorage.removeItem(GLOBAL_RANGE_STORAGE_KEY);
      window.localStorage.removeItem(SOUND_ENABLED_STORAGE_KEY);
      window.localStorage.removeItem(SOUND_VOLUME_STORAGE_KEY);
      window.localStorage.removeItem(HIDDEN_STORAGE_KEY);
    } catch {
      // Non-fatal — see persistRecords.
    }
    // Everything, not just boss-tracking data — a "reset all" that left
    // dragged window positions/stacking/folding behind wouldn't actually be
    // "all." All three dispatch a live-reset event so mounted windows snap
    // back immediately — no page reload needed, same as the state resets
    // below.
    clearAllPersistedOffsets();
    clearPersistedStackOrder();
    unfoldAllPersistedWindows();
    setRecords({});
    setHidden({});
    setGlobalRangeState(FALLBACK_RANGE);
    setHasCustomRange(false);
    setSoundEnabledState(true);
    setSoundVolumeState(DEFAULT_VOLUME_STEP);
    // A reset shouldn't leave a stale unread badge from before it ran.
    unreadCountRef.current = 0;
    if (originalTitleRef.current != null) {
      document.title = originalTitleRef.current;
    }
    renderFaviconBadge(0);
  }, [renderFaviconBadge]);

  // Plays the alert sound and, if the tab is currently in the background,
  // bumps the title badge — the moment a tracked boss's status changes.
  // Not on first sight of a boss (that would fire for every kill already
  // in progress when the tab loads), only on transitions observed while
  // the app is open and ticking.
  useEffect(() => {
    const seen = new Set<string>();
    let transitions = 0;
    for (const bossId of trackedBossIds) {
      seen.add(bossId);
      const status = getStatus(bossId);
      const prev = prevStatusRef.current.get(bossId);
      prevStatusRef.current.set(bossId, status);

      if (prev === undefined || prev === status) continue;
      if (status === "pending" || status === "alive") transitions += 1;
    }

    // Drop bosses no longer tracked (e.g. cleared via "Mark as Alive") so a
    // later re-kill starts fresh instead of comparing against stale state.
    for (const bossId of prevStatusRef.current.keys()) {
      if (!seen.has(bossId)) prevStatusRef.current.delete(bossId);
    }

    if (transitions === 0) return;

    if (soundEnabled) {
      const audio = alertAudioRef.current;
      if (audio) {
        audio.volume = (soundVolume / (VOLUME_STEPS - 1)) * MAX_VOLUME_SCALE;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Autoplay blocked (no user gesture on the page yet) — silent,
          // same as any other environment where the sound just can't play.
        });
      }
    }

    if (document.hidden) {
      if (originalTitleRef.current == null) {
        originalTitleRef.current = document.title;
      }
      unreadCountRef.current += transitions;
      document.title = `(${unreadCountRef.current}) ${originalTitleRef.current}`;
      renderFaviconBadge(unreadCountRef.current);
    }
  }, [
    trackedBossIds,
    getStatus,
    soundEnabled,
    soundVolume,
    renderFaviconBadge,
  ]);

  // Clears the unread badge the moment the player actually comes back to
  // this tab — visibilitychange covers switching tabs/minimizing, focus
  // covers alt-tabbing back on some browsers that don't fire the former
  // reliably for window-level (not tab-level) switches.
  useEffect(() => {
    const clearBadge = () => {
      if (document.hidden) return;
      unreadCountRef.current = 0;
      if (originalTitleRef.current != null) {
        document.title = originalTitleRef.current;
      }
      renderFaviconBadge(0);
    };
    document.addEventListener("visibilitychange", clearBadge);
    window.addEventListener("focus", clearBadge);
    return () => {
      document.removeEventListener("visibilitychange", clearBadge);
      window.removeEventListener("focus", clearBadge);
    };
  }, [renderFaviconBadge]);

  return (
    <BossRespawnContext.Provider
      value={{
        globalRange,
        setGlobalRange,
        hasCustomRange,
        dismissRespawnOnboarding,
        markKilled,
        markAlive,
        getKilledAt,
        getStatus,
        trackedBossIds,
        hasEverMarkedKilled,
        soundEnabled,
        setSoundEnabled,
        soundVolume,
        setSoundVolume,
        isHidden,
        hideBoss,
        unhideBoss,
        resetAll,
      }}
    >
      {children}
    </BossRespawnContext.Provider>
  );
}

export function useBossRespawn(): BossRespawnContextType {
  const context = useContext(BossRespawnContext);
  if (context === undefined) {
    throw new Error("useBossRespawn must be used within a BossRespawnProvider");
  }
  return context;
}
