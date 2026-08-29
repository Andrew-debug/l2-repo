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
import { DEFAULT_RESPAWN_PRESET_ID, getPresetRange } from "@/lib/respawn-presets";
import { getBossById } from "@/lib/boss-data";

const RECORDS_STORAGE_KEY = "l2-boss-respawn-tracking";
const GLOBAL_RANGE_STORAGE_KEY = "l2-boss-respawn-default-range";
const NOTIFICATIONS_ENABLED_STORAGE_KEY = "l2-boss-respawn-notifications";
const HIDDEN_STORAGE_KEY = "l2-boss-hidden";
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

function readNotificationsEnabled(): boolean {
  try {
    return window.localStorage.getItem(NOTIFICATIONS_ENABLED_STORAGE_KEY) === "1";
  } catch {
    return false;
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

// "unsupported" covers SSR (no `Notification` global) and browsers that
// never implemented the API — both get treated as "can't notify" the
// same way rather than as a special error case.
export type NotificationPermissionState = NotificationPermission | "unsupported";

function readNotificationPermission(): NotificationPermissionState {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
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
  // App-level opt-in, separate from the browser's own permission grant —
  // lets the user mute notifications without revoking OS-level permission.
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  notificationPermission: NotificationPermissionState;
  // Must be called from a user gesture (browsers reject requestPermission()
  // otherwise); also flips notificationsEnabled on once permission is
  // granted, so "enable notifications" is a single click.
  requestNotificationPermission: () => void;
  // Marks the range as configured without necessarily changing its value —
  // for the onboarding strip's "Skip" (keep the fallback, just stop asking).
  dismissRespawnOnboarding: () => void;
  // Bosses dismissed as "not interested" — still tracked/clickable as
  // normal, just rendered dimmed/gray on the map instead of by status.
  isHidden: (bossId: string) => boolean;
  hideBoss: (bossId: string) => void;
  unhideBoss: (bossId: string) => void;
  // Wipes every tracked kill, hidden boss, custom respawn range, and
  // notification preference, then reloads — the System Menu's Restart
  // button. A full reload rather than resetting each piece of in-memory
  // state by hand, so it can't drift out of sync with whatever this
  // provider adds later.
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
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>("unsupported");
  // Last status seen per boss, purely to detect transitions for
  // notifications — not persisted, and never drives rendering itself.
  const prevStatusRef = useRef<Map<string, RespawnStatus>>(new Map());

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setRecords(readRecords());
    setHidden(readHidden());
    setGlobalRangeState(readGlobalRange());
    setHasCustomRange(readHasCustomRange());
    setNotificationsEnabledState(readNotificationsEnabled());
    setNotificationPermission(readNotificationPermission());
  }, []);

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

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    try {
      window.localStorage.setItem(
        NOTIFICATIONS_ENABLED_STORAGE_KEY,
        enabled ? "1" : "0",
      );
    } catch {
      // Non-fatal — see persistRecords.
    }
  }, []);

  const resetAll = useCallback(() => {
    try {
      window.localStorage.removeItem(RECORDS_STORAGE_KEY);
      window.localStorage.removeItem(GLOBAL_RANGE_STORAGE_KEY);
      window.localStorage.removeItem(NOTIFICATIONS_ENABLED_STORAGE_KEY);
      window.localStorage.removeItem(HIDDEN_STORAGE_KEY);
    } catch {
      // Non-fatal — see persistRecords.
    }
    window.location.reload();
  }, []);

  const requestNotificationPermission = useCallback(() => {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
      if (permission === "granted") setNotificationsEnabled(true);
    });
  }, [setNotificationsEnabled]);

  // Fires a browser notification the moment a tracked boss's status
  // changes — not on first sight of a boss (that would spam a notification
  // for every kill already in progress when the tab loads), only on
  // transitions observed while the app is open and ticking.
  useEffect(() => {
    const canNotify =
      notificationsEnabled &&
      notificationPermission === "granted" &&
      typeof Notification !== "undefined";

    const seen = new Set<string>();
    for (const bossId of trackedBossIds) {
      seen.add(bossId);
      const status = getStatus(bossId);
      const prev = prevStatusRef.current.get(bossId);
      prevStatusRef.current.set(bossId, status);

      if (prev === undefined || prev === status || !canNotify) continue;

      const boss = getBossById(bossId);
      const name = boss?.name ?? "A boss";
      if (status === "pending") {
        new Notification(`${name} could be up`, {
          body: "Its respawn window just opened.",
          tag: `boss-respawn-${bossId}`,
        });
      } else if (status === "alive") {
        new Notification(`${name} should be back`, {
          body: "Its respawn window closed — treat it as up.",
          tag: `boss-respawn-${bossId}`,
        });
      }
    }

    // Drop bosses no longer tracked (e.g. cleared via "Mark as Alive") so a
    // later re-kill starts fresh instead of comparing against stale state.
    for (const bossId of prevStatusRef.current.keys()) {
      if (!seen.has(bossId)) prevStatusRef.current.delete(bossId);
    }
  }, [trackedBossIds, getStatus, notificationsEnabled, notificationPermission]);

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
        notificationsEnabled,
        setNotificationsEnabled,
        notificationPermission,
        requestNotificationPermission,
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
    throw new Error(
      "useBossRespawn must be used within a BossRespawnProvider",
    );
  }
  return context;
}
