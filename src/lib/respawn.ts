export type RespawnStatus = "alive" | "pending" | "dead";

export interface RespawnRange {
  minHours: number;
  maxHours: number;
}

/**
 * Derives a boss's current respawn status from the last time it was marked
 * killed and its respawn window. Nothing is stored beyond `killedAt` — this
 * always recomputes from wall-clock time, so it stays correct as time passes
 * without needing an update elsewhere.
 */
export function computeRespawnStatus(
  killedAt: number | null,
  range: RespawnRange,
  now: number = Date.now(),
): RespawnStatus {
  if (killedAt == null) return "alive";

  const elapsedHours = (now - killedAt) / (1000 * 60 * 60);
  if (elapsedHours < range.minHours) return "dead";
  if (elapsedHours < range.maxHours) return "pending";
  return "alive";
}

// "3h 24m" / "18m" / "42s" style duration, for showing how long ago a boss
// was marked killed or how far into/until a respawn window the clock is.
// Drops to seconds under a minute — matters for windows set in seconds or
// minutes (see RespawnRangePicker's unit selector), not just real ones.
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}
