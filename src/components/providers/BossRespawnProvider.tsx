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
import { clearAllPersistedOffsets } from "@/hooks/use-persisted-offset";
import { clearPersistedStackOrder } from "@/components/ui-l2/draggable-window";
import { unfoldAllPersistedWindows } from "@/hooks/use-persisted-fold-state";

const RECORDS_STORAGE_KEY = "l2-boss-respawn-tracking";
const GLOBAL_RANGE_STORAGE_KEY = "l2-boss-respawn-default-range";
const SOUND_ENABLED_STORAGE_KEY = "l2-boss-respawn-sound";
const SOUND_VOLUME_STORAGE_KEY = "l2-boss-respawn-sound-volume";
const ALERT_BUTTON_VISIBLE_STORAGE_KEY = "l2-boss-respawn-alert-button-visible";
const HIDE_SET_TIME_PROMPT_STORAGE_KEY = "l2-boss-hide-set-time-prompt";
const HIDDEN_STORAGE_KEY = "l2-boss-hidden";
// The Options > Audio tab's volume slider is 6 discrete steps (0-5), not a
// continuous 0-100 range — matches the reference client's own stepped
// sliders, and there's no real mixer behind this to need finer control.
// Exported so the slider component itself doesn't hardcode the step count
// a second time.
export const VOLUME_STEPS = 6;
// Level 1, not the slider's leftmost level 0 — audible but quiet out of the
// box, so the "Test" button (see testAlertSound) actually produces sound
// the first time someone tries it.
const DEFAULT_VOLUME_STEP = 1;
// The raw step-to-volume mapping (step / (VOLUME_STEPS - 1)) topped out at
// 1.0 — the source clip itself is loud enough that even the slider's lowest
// non-mute step was still too loud. Scaling every step down (so the
// slider's own max only ever reaches 30% real volume) fixes that without
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

// null (the default) means "not set" — no timer-based tracking at all, see
// globalRange's own doc comment below.
function readGlobalRange(): RespawnRange | null {
  try {
    const raw = window.localStorage.getItem(GLOBAL_RANGE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RespawnRange) : null;
  } catch {
    return null;
  }
}

// Defaults to off — the player opts in to alert sound via the Up Next
// "Alert" button rather than being opted in automatically.
function readSoundEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
    return raw == null ? false : raw === "1";
  } catch {
    return false;
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

// Defaults to on — the Alert button starts visible in Up Next until the
// player dismisses it themselves (its own close button), at which point
// this is what remembers "yes, I've seen it, hide it" across reloads. Only
// Options' "Notification Button" checkbox brings it back.
function readAlertButtonVisible(): boolean {
  try {
    const raw = window.localStorage.getItem(ALERT_BUTTON_VISIBLE_STORAGE_KEY);
    return raw == null ? true : raw === "1";
  } catch {
    return true;
  }
}

// Defaults to off — the "Boss respawn timer is not set" prompt shows by
// default, same as before this setting existed. The player opts in to
// hiding it via Options' "Hide 'Set Time'" checkbox.
function readHideSetTimePrompt(): boolean {
  try {
    const raw = window.localStorage.getItem(HIDE_SET_TIME_PROMPT_STORAGE_KEY);
    return raw == null ? false : raw === "1";
  } catch {
    return false;
  }
}

// Asks for the native browser notification permission the first time the
// player turns the alert sound on — piggybacking on that click as the real
// user gesture the prompt needs to fire at all. Purely cosmetic: nothing in
// this app is gated on the answer (the sound alert works the same either
// way), and deliberately so — a browser that's been told "denied" refuses
// to ever show this prompt again for the same site, with no way for us to
// detect or undo that short of the player digging into their own browser's
// site settings. Actually gating the in-app alert on that answer would mean
// one wrong click on the native popup permanently and silently breaks the
// alert with no way back — worse than just not asking at all. So: ask once,
// ignore whatever comes back, keep the real on/off switch entirely local.
function askForNotificationPermissionOnce() {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return;
  }
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => {
      // Nothing depends on the outcome — see above.
    });
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
  // The one respawn window applied to every boss — null (the default) means
  // "not set": no timer-based tracking at all, for a player who'd rather
  // just mark bosses dead/alive on the map themselves. A killed boss stays
  // "dead" indefinitely in that mode (see computeRespawnStatus) instead of
  // counting down toward pending/alive.
  globalRange: RespawnRange | null;
  setGlobalRange: (range: RespawnRange | null) => void;
  markKilled: (bossId: string) => void;
  markAlive: (bossId: string) => void;
  getKilledAt: (bossId: string) => number | null;
  getStatus: (bossId: string) => RespawnStatus;
  // Every boss with a kill on record, regardless of current status — the
  // upcoming-spawns list filters/sorts this itself.
  trackedBossIds: string[];
  // Mutes the respawn-alert sound (see the status-transition effect below)
  // — the badge-the-title-while-hidden half of the alert always runs
  // regardless, since it's silent by definition. The one and only on/off
  // switch for the whole alert system — deliberately not tied to the
  // browser's own Notification permission (see askForNotificationPermissionOnce).
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  // 0..VOLUME_STEPS-1 (6 discrete steps) — the Options > Audio tab's
  // Notification Vol. slider. Applied to the alert audio element's own
  // `volume` before each play(), independent of soundEnabled (mute skips
  // playing entirely; this just scales it while unmuted).
  soundVolume: number;
  setSoundVolume: (step: number) => void;
  // Plays the alert sound on demand — Up Next's "Test" button, so the
  // player can preview it at their chosen volume without waiting for a
  // real respawn transition. Deliberately ignores soundEnabled (muted or
  // not, a test should still be audible — that's the point of testing),
  // but not spammable: a click while the sound from a previous click (or a
  // real alert) is still playing is silently ignored rather than
  // restarting it, unlike the real alert's own rewind-and-replay behavior.
  testAlertSound: () => void;
  // Whether Up Next shows its Alert on/off button — the player can dismiss
  // it themselves (its own close button, once they're happy with their
  // choice and don't want it taking up room in the list anymore), and bring
  // it back later from Options' "Notification Button" checkbox.
  isAlertButtonVisible: boolean;
  setIsAlertButtonVisible: (visible: boolean) => void;
  // Options > Game tab's "Hide 'Set Time'" checkbox — suppresses Up Next's
  // "Boss respawn timer is not set" prompt (only relevant while globalRange
  // is still null to begin with). Defaults to false, so the prompt shows
  // unless the player explicitly opts to hide it.
  hideSetTimePrompt: boolean;
  setHideSetTimePrompt: (hide: boolean) => void;
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
  const [globalRange, setGlobalRangeState] = useState<RespawnRange | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const [soundVolume, setSoundVolumeState] = useState(DEFAULT_VOLUME_STEP);
  const [isAlertButtonVisible, setIsAlertButtonVisibleState] = useState(true);
  const [hideSetTimePrompt, setHideSetTimePromptState] = useState(false);
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
  // The one <link rel="icon"> this app has (see renderFaviconBadge below,
  // the only code that ever creates or removes it) and the plain, unbadged
  // source image drawn onto it — kept separate so every badge redraw
  // starts from a clean copy instead of compounding onto whatever the
  // canvas already had.
  const faviconLinkRef = useRef<HTMLLinkElement | null>(null);
  const baseFaviconImageRef = useRef<HTMLImageElement | null>(null);
  // The previous badge's object URL — revoked once the next one replaces
  // it (blob URLs otherwise leak for the life of the tab).
  const faviconBlobUrlRef = useRef<string | null>(null);
  // renderFaviconBadge is called from several places (mount, status
  // transitions, focus/visibility, resetAll) and its canvas.toBlob callback
  // is async with no ordering guarantee — a call that fires first can still
  // resolve last. Each call stamps its id here before encoding; a callback
  // that finds a newer id already stored lost the race and bails out
  // instead of clobbering the link/URL a later call already applied.
  const faviconRenderIdRef = useRef(0);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setRecords(readRecords());
    setHidden(readHidden());
    setGlobalRangeState(readGlobalRange());
    setSoundEnabledState(readSoundEnabled());
    setSoundVolumeState(readSoundVolume());
    setIsAlertButtonVisibleState(readAlertButtonVisible());
    setHideSetTimePromptState(readHideSetTimePrompt());
  }, []);

  // Created once — playing it again later just rewinds and restarts (see
  // the status-transition effect below).
  useEffect(() => {
    alertAudioRef.current = new Audio(NOTIFICATION_SOUND_SRC);
  }, []);

  // Redraws the favicon from a clean base image every call (never onto
  // whatever the canvas already had) — a plain circle-and-number badge in
  // the bottom-right corner, cleared entirely once `count` is back to 0.
  // Only ever removes faviconLinkRef.current — the exact <link> this code
  // itself created last time, tracked by reference, never a selector sweep
  // — since layout.tsx's metadata deliberately has no `icon`/`shortcut`
  // entries and favicon.ico lives in public/ (see layout.tsx's comment),
  // nothing else ever creates a rel="icon" link for this to collide with.
  // Replaces the <link> element itself rather than mutating href in place,
  // and uses a blob: object URL rather than a data: URI, both extra
  // precautions against browsers that don't repaint on a plain
  // attribute/URI-scheme change.
  const renderFaviconBadge = useCallback((count: number) => {
    const base = baseFaviconImageRef.current;
    if (!base) return;

    const renderId = ++faviconRenderIdRef.current;

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
      // A newer renderFaviconBadge call already won — applying this stale
      // result would remove the current (correct) link and, worse, revoke
      // the blob URL the newer call just handed to <link>, which is what
      // produced the blob: ... net::ERR_FILE_NOT_FOUND requests.
      if (renderId !== faviconRenderIdRef.current) return;
      const url = URL.createObjectURL(blob);

      faviconLinkRef.current?.remove();

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

  // Takes over the tab's favicon so the badge above can be drawn onto it —
  // loads the plain source image once, then hands off to renderFaviconBadge
  // above for the actual <link> creation.
  useEffect(() => {
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

  const setGlobalRange = useCallback((range: RespawnRange | null) => {
    setGlobalRangeState(range);
    try {
      window.localStorage.setItem(
        GLOBAL_RANGE_STORAGE_KEY,
        JSON.stringify(range),
      );
    } catch {
      // Same as above — non-fatal.
    }
  }, []);

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
    // Riding along on this click as the real user gesture the browser's
    // permission prompt needs — see askForNotificationPermissionOnce.
    if (enabled) askForNotificationPermissionOnce();
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

  // Shared by the real status-transition alert and testAlertSound below —
  // always rewinds and restarts, since the real alert relies on that to
  // not get swallowed by an already-in-progress play() (see its own call
  // site). testAlertSound is what actually guards against spamming, by
  // simply not calling this while the previous play() hasn't finished.
  const playAlertSound = useCallback(() => {
    const audio = alertAudioRef.current;
    if (!audio) return;
    audio.volume = (soundVolume / (VOLUME_STEPS - 1)) * MAX_VOLUME_SCALE;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Autoplay blocked (no user gesture yet) — silent, same as any other
      // environment where the sound just can't play.
    });
  }, [soundVolume]);

  const testAlertSound = useCallback(() => {
    const audio = alertAudioRef.current;
    // `paused` is false only while actually mid-playback — true once
    // ended, so this only blocks a click that lands *during* a previous
    // (test or real) play, not every click after the first.
    if (audio && !audio.paused) return;
    playAlertSound();
  }, [playAlertSound]);

  const setIsAlertButtonVisible = useCallback((visible: boolean) => {
    setIsAlertButtonVisibleState(visible);
    try {
      window.localStorage.setItem(
        ALERT_BUTTON_VISIBLE_STORAGE_KEY,
        visible ? "1" : "0",
      );
    } catch {
      // Non-fatal — see persistRecords.
    }
  }, []);

  const setHideSetTimePrompt = useCallback((hide: boolean) => {
    setHideSetTimePromptState(hide);
    try {
      window.localStorage.setItem(
        HIDE_SET_TIME_PROMPT_STORAGE_KEY,
        hide ? "1" : "0",
      );
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
      window.localStorage.removeItem(ALERT_BUTTON_VISIBLE_STORAGE_KEY);
      window.localStorage.removeItem(HIDE_SET_TIME_PROMPT_STORAGE_KEY);
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
    setGlobalRangeState(null);
    setSoundEnabledState(false);
    setSoundVolumeState(DEFAULT_VOLUME_STEP);
    setIsAlertButtonVisibleState(true);
    setHideSetTimePromptState(false);
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

    if (soundEnabled) playAlertSound();

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
    playAlertSound,
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
        markKilled,
        markAlive,
        getKilledAt,
        getStatus,
        trackedBossIds,
        soundEnabled,
        setSoundEnabled,
        soundVolume,
        setSoundVolume,
        testAlertSound,
        isAlertButtonVisible,
        setIsAlertButtonVisible,
        hideSetTimePrompt,
        setHideSetTimePrompt,
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
