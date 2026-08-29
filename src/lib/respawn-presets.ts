import type { RespawnRange } from "./respawn";

export interface RespawnPreset {
  id: string;
  label: string;
  minHours: number;
  maxHours: number;
}

// Common respawn windows seen across L2 servers. Not exhaustive — servers
// vary the actual numbers constantly — this is just a starting menu; any
// boss (or the global default) can still be set to a fully custom range.
export const RESPAWN_PRESETS: RespawnPreset[] = [
  { id: "static-6h", label: "Static 6h", minHours: 6, maxHours: 6 },
  { id: "static-12h", label: "Static 12h", minHours: 12, maxHours: 12 },
  { id: "static-24h", label: "Static 24h", minHours: 24, maxHours: 24 },
  { id: "8-12h", label: "8 – 12h", minHours: 8, maxHours: 12 },
  { id: "12-16h", label: "12 – 16h", minHours: 12, maxHours: 16 },
  { id: "18-24h", label: "18 – 24h", minHours: 18, maxHours: 24 },
  { id: "24-48h", label: "24 – 48h", minHours: 24, maxHours: 48 },
  { id: "48-96h", label: "48 – 96h (epic)", minHours: 48, maxHours: 96 },
];

export const DEFAULT_RESPAWN_PRESET_ID = "12-16h";

// Sentinel used by the UI to switch a <select> into free-entry min/max
// fields instead of picking one of the fixed presets above.
export const CUSTOM_RESPAWN_ID = "custom";

export function findRespawnPreset(id: string): RespawnPreset | undefined {
  return RESPAWN_PRESETS.find((preset) => preset.id === id);
}

export function getPresetRange(id: string): RespawnRange | undefined {
  const preset = findRespawnPreset(id);
  return preset
    ? { minHours: preset.minHours, maxHours: preset.maxHours }
    : undefined;
}

// Reverse lookup — used by range-picker UIs to figure out whether a stored
// range matches one of the fixed presets (so that preset stays selected) or
// needs to fall back to the free-entry "Custom" option.
export function findPresetIdByRange(range: RespawnRange): string | undefined {
  return RESPAWN_PRESETS.find(
    (preset) =>
      preset.minHours === range.minHours && preset.maxHours === range.maxHours,
  )?.id;
}

// Strict parsing for the Options window's free-entry respawn time field: a
// single whole number of hours ("18") or a "min-max" whole-number range
// ("12-16"). Anything else — decimals, units, stray whitespace inside the
// numbers, a reversed range — is rejected rather than guessed at, since a
// silently-misparsed respawn window would throw off every tracked boss.
export function parseCustomRespawnRange(input: string): RespawnRange | undefined {
  const trimmed = input.trim();

  const single = /^(\d+)$/.exec(trimmed);
  if (single) {
    const hours = Number(single[1]);
    return hours > 0 ? { minHours: hours, maxHours: hours } : undefined;
  }

  const range = /^(\d+)-(\d+)$/.exec(trimmed);
  if (range) {
    const minHours = Number(range[1]);
    const maxHours = Number(range[2]);
    return minHours > 0 && maxHours >= minHours
      ? { minHours, maxHours }
      : undefined;
  }

  return undefined;
}
