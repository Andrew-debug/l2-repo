"use client";

import { useEffect, useRef, useState } from "react";
import {
  CUSTOM_RESPAWN_ID,
  findPresetIdByRange,
  getPresetRange,
  RESPAWN_PRESETS,
} from "@/lib/respawn-presets";
import type { RespawnRange } from "@/lib/respawn";

const SELECT_CLASS =
  "border border-window-content-border bg-window-content-bg px-1.5 py-1 text-[11px]";
const NUMBER_INPUT_CLASS =
  "w-14 border border-window-content-border bg-window-content-bg px-1 py-0.5 text-[11px]";

type TimeUnit = "seconds" | "minutes" | "hours";

// Custom values are always stored/sent as hours (matches presets and the
// rest of the respawn system) — the unit selector only changes what the
// number inputs show, converting to/from hours underneath. Seconds/minutes
// exist mainly so a real respawn window doesn't have to be sat through to
// test the pending/alive transition and notifications.
const HOURS_PER_UNIT: Record<TimeUnit, number> = {
  seconds: 1 / 3600,
  minutes: 1 / 60,
  hours: 1,
};

const UNIT_LABEL: Record<TimeUnit, string> = {
  seconds: "sec",
  minutes: "min",
  hours: "h",
};

function rangesEqual(a: RespawnRange, b: RespawnRange): boolean {
  return a.minHours === b.minHours && a.maxHours === b.maxHours;
}

interface RespawnRangePickerProps {
  value: RespawnRange;
  onChange: (range: RespawnRange) => void;
}

export function RespawnRangePicker({ value, onChange }: RespawnRangePickerProps) {
  const [selection, setSelection] = useState<string>(
    () => findPresetIdByRange(value) ?? CUSTOM_RESPAWN_ID,
  );
  const [unit, setUnit] = useState<TimeUnit>("hours");
  const [customMinHours, setCustomMinHours] = useState(value.minHours);
  const [customMaxHours, setCustomMaxHours] = useState(value.maxHours);

  // `value` can change for reasons other than this component's own edits —
  // most notably localStorage finishing its async hydration after this
  // component has already mounted with the pre-hydration default. Without
  // this, the picker would keep showing the default forever even though the
  // real stored range loaded correctly right after. Only resync when the
  // incoming value doesn't match what we last emitted ourselves, so this
  // doesn't fight the user's own in-progress edits.
  const lastEmittedRef = useRef<RespawnRange>(value);
  useEffect(() => {
    if (rangesEqual(value, lastEmittedRef.current)) return;
    lastEmittedRef.current = value;
    setSelection(findPresetIdByRange(value) ?? CUSTOM_RESPAWN_ID);
    setCustomMinHours(value.minHours);
    setCustomMaxHours(value.maxHours);
  }, [value]);

  const emit = (range: RespawnRange) => {
    lastEmittedRef.current = range;
    onChange(range);
  };

  const handleSelectChange = (id: string) => {
    setSelection(id);
    if (id === CUSTOM_RESPAWN_ID) {
      emit({ minHours: customMinHours, maxHours: customMaxHours });
      return;
    }
    const preset = getPresetRange(id);
    if (preset) emit(preset);
  };

  const displayMin = customMinHours / HOURS_PER_UNIT[unit];
  const displayMax = customMaxHours / HOURS_PER_UNIT[unit];

  return (
    <div className="flex flex-col gap-1">
      <select
        value={selection}
        onChange={(e) => handleSelectChange(e.target.value)}
        className={SELECT_CLASS}
      >
        {RESPAWN_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
        <option value={CUSTOM_RESPAWN_ID}>Custom…</option>
      </select>

      {selection === CUSTOM_RESPAWN_ID && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            step="any"
            value={displayMin}
            onChange={(e) => {
              const raw = Number(e.target.value) || 0;
              const min = raw * HOURS_PER_UNIT[unit];
              setCustomMinHours(min);
              emit({ minHours: min, maxHours: Math.max(min, customMaxHours) });
            }}
            className={NUMBER_INPUT_CLASS}
          />
          <span className="text-white/40">–</span>
          <input
            type="number"
            min={0}
            step="any"
            value={displayMax}
            onChange={(e) => {
              const raw = Number(e.target.value) || 0;
              const max = raw * HOURS_PER_UNIT[unit];
              setCustomMaxHours(max);
              emit({ minHours: Math.min(customMinHours, max), maxHours: max });
            }}
            className={NUMBER_INPUT_CLASS}
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as TimeUnit)}
            className="border border-window-content-border bg-window-content-bg px-1 py-0.5 text-[11px]"
          >
            {(Object.keys(UNIT_LABEL) as TimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {UNIT_LABEL[u]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
