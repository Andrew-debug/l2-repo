"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "./header";
import { WindowBorder } from "./window-l2";
import { DraggableWindow, DragHandle } from "./draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import { TabButton } from "./tab-button";
import { useOptionsPanel } from "@/components/providers/OptionsPanelProvider";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";
import { useHeaderVisibility } from "@/components/providers/HeaderVisibilityProvider";
import { useEnterChat } from "@/components/providers/EnterChatProvider";
import {
  useBossRespawn,
  VOLUME_STEPS,
} from "@/components/providers/BossRespawnProvider";
import {
  CUSTOM_RESPAWN_ID,
  NOT_SET_RESPAWN_ID,
  findPresetIdByRange,
  findRespawnPreset,
  parseCustomRespawnRange,
} from "@/lib/respawn-presets";
import type { RespawnRange } from "@/lib/respawn";
import { clearAllPersistedOffsets } from "@/hooks/use-persisted-offset";
import { clearPersistedStackOrder } from "./draggable-window";
import { unfoldAllPersistedWindows } from "@/hooks/use-persisted-fold-state";
import { reopenAllPersistedWindows } from "@/hooks/use-persisted-window-open";
import { usePersistedBoolean } from "@/hooks/use-persisted-boolean";
import { cn } from "@/lib/utils";

// gameCursor lives only in this component's own usePersistedBoolean call —
// unlike Header/Background/EnterChat (each a real context, always mounted
// and reachable from anywhere), there's no shared setter another component
// can call. Same live-reset-event approach as
// use-persisted-offset.ts/use-persisted-window-open.ts for the same reason:
// an external localStorage write alone wouldn't update this component's
// already-in-memory state, so the System Menu's "Restart" needs a way to
// reach it live.
const GAME_CURSOR_RESET_EVENT = "l2-game-cursor-reset";

export function resetGameCursor() {
  try {
    window.localStorage.setItem("l2-game-cursor", "1");
  } catch {
    // Non-fatal — see usePersistedBoolean's own read/write try/catch.
  }
  window.dispatchEvent(new Event(GAME_CURSOR_RESET_EVENT));
}

type Tab = "video" | "audio" | "game";

const TABS: { id: Tab; label: string }[] = [
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "game", label: "Game" },
];

const FOOTER_BUTTON_CLASS = "w-3.5 h-4.75 flex-1 text-[13px]";

// A fully custom dropdown, not a native <select> — the browser's own
// hover/keyboard-highlight color inside a native select's option list is
// OS-level chrome with no CSS hook to override it (confirmed stuck on blue
// no matter what background/color was set on <option>). Trading native
// keyboard-search and mobile picker UI for exact control over every pixel,
// including that hover color. Shared by Language and Party Loot below —
// both are single-option stand-ins, same as the checkboxes.
function Dropdown({
  options,
  className,
}: {
  options: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const arrowSrc = pressed
    ? "/icons/downbutton_down.png"
    : hovered
      ? "/icons/downbutton_over.png"
      : "/icons/DownButton.png";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className="relative flex h-3.75 w-full items-center border border-window-content-border bg-window-bg pl-1 text-[13px] leading-3.5 text-white"
      >
        {selected}
        <span className="pointer-events-none absolute right-0.5 size-2.5">
          <Image
            src={arrowSrc}
            alt=""
            fill
            sizes="10px"
            className="aspect-square object-contain"
          />
        </span>
      </button>
      {open && (
        <ul className="absolute top-full left-0 z-20 w-full border border-window-content-border bg-window-bg">
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className="flex h-3.5 w-full items-center bg-window-bg pl-1.5 text-left text-[13px] leading-3.5 text-white transition-colors hover:bg-white/10"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function rangesEqual(
  a: RespawnRange | null,
  b: RespawnRange | null,
): boolean {
  if (a == null || b == null) return a === b;
  return a.minHours === b.minHours && a.maxHours === b.maxHours;
}

const BOSS_RESPAWN_TIME_OPTIONS: { id: string; label: string }[] = [
  { id: NOT_SET_RESPAWN_ID, label: "Not Set" },
  { id: "static-6h", label: "6 hours" },
  { id: "static-12h", label: "12 hours" },
  { id: "static-24h", label: "24 hours" },
  { id: "12-16h", label: "12-16 hours" },
];

// Same custom-dropdown shell as Dropdown above, but reads/writes the draft
// (see OptionsWindow's `draft`), not real state directly — like every other
// control in this dialog, picking a preset or typing a custom value doesn't
// take effect until Apply/OK. (It used to bypass the draft entirely and
// apply immediately, matching the deleted Respawn Settings window's old
// behavior — changed on request so it follows the rest of the dialog.)
function BossRespawnTimeSelect({
  range,
  onRangeChange,
  focusCustomSignal,
}: {
  // null — "Not Set" — is the app's real default (see BossRespawnProvider's
  // globalRange): no timer-based tracking, for a player who marks bosses
  // dead/alive on the map themselves.
  range: RespawnRange | null;
  onRangeChange: (range: RespawnRange | null) => void;
  // Bumped by Up Next's "Set Time" prompt (via OptionsPanelProvider's
  // focusRespawnTimeSignal) — switches into Custom mode on change, which
  // the effect below then focuses.
  focusCustomSignal: number;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [selection, setSelection] = useState<string>(() =>
    range == null
      ? NOT_SET_RESPAWN_ID
      : (findPresetIdByRange(range) ?? CUSTOM_RESPAWN_ID),
  );
  const [customText, setCustomText] = useState(() =>
    range == null || findPresetIdByRange(range)
      ? ""
      : range.minHours === range.maxHours
        ? String(range.minHours)
        : `${range.minHours}-${range.maxHours}`,
  );
  const [customInvalid, setCustomInvalid] = useState(false);
  // Pulsating glow around the input, on only right after focusCustomSignal
  // sends the player here — cleared the moment they act on it (type
  // something, or click elsewhere), since its whole job is a one-shot
  // "type here" nudge, not a permanent decoration.
  const [showGuideGlow, setShowGuideGlow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks what this component itself last pushed via onRangeChange, so the
  // resync effect below only reacts to *external* changes to the draft
  // (e.g. the window re-staging its draft from the real globalRange on
  // reopen) instead of fighting the user's own in-progress edit.
  const lastAppliedRangeRef = useRef(range);

  useEffect(() => {
    if (rangesEqual(range, lastAppliedRangeRef.current)) return;
    lastAppliedRangeRef.current = range;
    if (range == null) {
      setSelection(NOT_SET_RESPAWN_ID);
      return;
    }
    const matched = findPresetIdByRange(range);
    if (matched) {
      setSelection(matched);
    } else {
      setSelection(CUSTOM_RESPAWN_ID);
      setCustomText(
        range.minHours === range.maxHours
          ? String(range.minHours)
          : `${range.minHours}-${range.maxHours}`,
      );
    }
  }, [range]);

  useEffect(() => {
    if (selection === CUSTOM_RESPAWN_ID) inputRef.current?.focus();
  }, [selection]);

  useEffect(() => {
    if (focusCustomSignal <= 0) return;
    // If selection is already Custom, the [selection] effect above won't
    // re-fire (its dependency didn't change) — focus directly here too so
    // asking again while already in Custom mode still re-focuses the input.
    setSelection(CUSTOM_RESPAWN_ID);
    inputRef.current?.focus();
    setShowGuideGlow(true);
  }, [focusCustomSignal]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const emit = (newRange: RespawnRange | null) => {
    lastAppliedRangeRef.current = newRange;
    onRangeChange(newRange);
  };

  const handlePreset = (id: string) => {
    setSelection(id);
    setOpen(false);
    if (id === NOT_SET_RESPAWN_ID) {
      emit(null);
      return;
    }
    const preset = findRespawnPreset(id);
    if (preset) emit({ minHours: preset.minHours, maxHours: preset.maxHours });
  };

  const handleCustomChange = (text: string) => {
    setShowGuideGlow(false);
    setCustomText(text);
    const parsed = parseCustomRespawnRange(text);
    if (parsed) {
      setCustomInvalid(false);
      emit(parsed);
    } else {
      setCustomInvalid(text.trim().length > 0);
    }
  };

  const arrowSrc = pressed
    ? "/icons/downbutton_down.png"
    : hovered
      ? "/icons/downbutton_over.png"
      : "/icons/DownButton.png";

  const selectedLabel =
    BOSS_RESPAWN_TIME_OPTIONS.find((opt) => opt.id === selection)?.label ??
    "Custom";

  return (
    <div ref={containerRef} className="relative w-30">
      <div
        className={cn(
          "relative flex h-3.75 w-full items-center border border-window-content-border bg-window-bg pl-1 text-[13px] leading-3.5 text-white",
          selection === CUSTOM_RESPAWN_ID && showGuideGlow && "guide-glow",
        )}
      >
        {selection === CUSTOM_RESPAWN_ID ? (
          <input
            ref={inputRef}
            id="custom-respawn-time"
            name="customRespawnTime"
            value={customText}
            onChange={(e) => handleCustomChange(e.target.value)}
            onBlur={() => setShowGuideGlow(false)}
            placeholder="e.g. 6 or 12-16"
            // Chrome remembers past values typed into a named field and
            // offers them back in its own natively-styled suggestion
            // dropdown — nothing here can restyle that, so the only fix is
            // opting this field out of it entirely.
            autoComplete="off"
            className={cn(
              "h-full w-full bg-transparent pr-4 text-[13px] leading-3.5 text-white placeholder:text-white/30 focus:outline-none",
              customInvalid && "text-red-400",
            )}
          />
        ) : (
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-full w-full text-left"
          >
            {selectedLabel}
          </button>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setPressed(false);
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          className="absolute right-0.5 size-2.5"
        >
          <Image
            src={arrowSrc}
            alt=""
            fill
            sizes="10px"
            className="aspect-square object-contain"
          />
        </button>
      </div>
      {open && (
        <ul className="absolute top-full left-0 z-20 w-full border border-window-content-border bg-window-bg">
          {BOSS_RESPAWN_TIME_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                onClick={() => handlePreset(opt.id)}
                className="flex h-3.5 w-full items-center bg-window-bg pl-1.5 text-left text-[13px] leading-3.5 text-white transition-colors hover:bg-white/10"
              >
                {opt.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                setSelection(CUSTOM_RESPAWN_ID);
                setOpen(false);
              }}
              className="flex h-3.5 w-full items-center bg-window-bg pl-1.5 text-left text-[13px] leading-3.5 text-white transition-colors hover:bg-white/10"
            >
              Custom
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-1 text-[13px] text-white select-none",
        className,
      )}
    >
      <span className="relative size-2.5 shrink-0">
        <Image
          src={checked ? "/icons/CheckBox_checked.png" : "/icons/CheckBox.png"}
          alt=""
          fill
          sizes="10px"
          className="aspect-square object-contain"
        />
      </span>
      <span className="leading-3.5">{label}</span>
    </button>
  );
}

// Decorative only — the reference's Display list is mostly stand-in
// checkboxes with nothing behind them in this app (they're multiplayer
// visibility filters; there's no multiplayer here). Kept non-interactive
// rather than wired to fake state.
function DisabledCheckbox({
  checked,
  label,
  className,
}: {
  checked: boolean;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 text-[13px] text-white/50 select-none",
        className,
      )}
    >
      <span className="relative size-2.5 shrink-0">
        <Image
          src={
            checked
              ? "/icons/CheckBox_checked_unable.png"
              : "/icons/CheckBox_unable.png"
          }
          alt=""
          fill
          sizes="10px"
          className="aspect-square object-contain"
        />
      </span>
      <span className="leading-3.5">{label}</span>
    </span>
  );
}

// Scaled down from the source PNGs' native sizes (slider_back.png 125x9,
// slider_cursor*.png 8x15, slider_mark.png 4x13) to fit the dialog's actual
// available width — all three shrunk by the same ~0.6 factor so the cursor
// and marks stay in proportion to the track instead of looking oversized
// next to it.
const SLIDER_TRACK_WIDTH = 110;
const SLIDER_TRACK_HEIGHT = 7;
const SLIDER_CURSOR_WIDTH = 7;
const SLIDER_CURSOR_HEIGHT = 12;
const SLIDER_MARK_WIDTH = 3;
const SLIDER_MARK_HEIGHT = 8;

// Marks are spaced edge-to-edge across the *whole* track — level 0's mark
// starts flush with the track's left end, the last level's mark ends flush
// with its right end — not across the cursor's narrower travel range,
// which used to leave a gap between the end marks and the track's actual
// ends.
function sliderMarkLeft(step: number): number {
  return ((SLIDER_TRACK_WIDTH - SLIDER_MARK_WIDTH) * step) / (VOLUME_STEPS - 1);
}

// The cursor is wider than a mark, so it's centered on each mark's midpoint
// rather than sharing the marks' own left-edge math — meaning it overhangs
// the track by a couple pixels at both extremes, same as a real slider knob
// riding slightly past the ends of its track.
function sliderCursorLeft(step: number): number {
  return sliderMarkLeft(step) + SLIDER_MARK_WIDTH / 2 - SLIDER_CURSOR_WIDTH / 2;
}

// The reference client's volume sliders are a real draggable cursor on a
// track, not a row of discrete blocks — but still only ever sit at one of
// VOLUME_STEPS fixed levels (marked by slider_mark.png ticks under the
// track), never a free continuous position. Dragging doesn't ease between
// levels: on every pointer move the cursor is redrawn at whichever level's
// exact position is currently closest, so it visibly jumps straight from
// one mark to the next/previous the moment the pointer crosses the
// midpoint between them, rather than trailing the pointer continuously.
function Slider({
  value,
  onChange,
  disabled,
  className,
}: {
  value: number;
  onChange?: (step: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const cursorSrc = pressed
    ? "/icons/slider_cursor_down.png"
    : hovered
      ? "/icons/slider_cursor_over.png"
      : "/icons/slider_cursor.png";

  const stepFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return value;
    const x = clientX - rect.left;
    const clamped = Math.min(Math.max(x, 0), SLIDER_TRACK_WIDTH);
    return Math.round((clamped / SLIDER_TRACK_WIDTH) * (VOLUME_STEPS - 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || e.button !== 0) return;
    setPressed(true);
    onChange?.(stepFromClientX(e.clientX));

    const handleMouseMove = (moveEvent: MouseEvent) => {
      onChange?.(stepFromClientX(moveEvent.clientX));
    };
    const handleMouseUp = () => {
      setPressed(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative shrink-0 select-none",
        disabled ? "opacity-50" : "cursor-pointer",
        className,
      )}
      style={{ width: SLIDER_TRACK_WIDTH, height: SLIDER_CURSOR_HEIGHT }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src="/icons/slider_back.png"
        alt=""
        width={SLIDER_TRACK_WIDTH}
        height={SLIDER_TRACK_HEIGHT}
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2"
        // Explicit pixel size, not just the width/height props above —
        // Tailwind Preflight's `img { height: auto }` would otherwise win
        // and re-derive height from the source PNG's native aspect ratio
        // (this is a deliberately non-native-ratio downscale, see comment
        // above SLIDER_TRACK_WIDTH).
        style={{ width: SLIDER_TRACK_WIDTH, height: SLIDER_TRACK_HEIGHT }}
      />
      {Array.from({ length: VOLUME_STEPS }).map((_, step) => (
        <Image
          key={step}
          src="/icons/slider_mark.png"
          alt=""
          width={SLIDER_MARK_WIDTH}
          height={SLIDER_MARK_HEIGHT}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2"
          style={{
            left: sliderMarkLeft(step),
            width: SLIDER_MARK_WIDTH,
            height: SLIDER_MARK_HEIGHT,
          }}
        />
      ))}
      <Image
        src={cursorSrc}
        alt=""
        width={SLIDER_CURSOR_WIDTH}
        height={SLIDER_CURSOR_HEIGHT}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{
          left: sliderCursorLeft(value),
          width: SLIDER_CURSOR_WIDTH,
          height: SLIDER_CURSOR_HEIGHT,
        }}
      />
    </div>
  );
}

// Decorative row to match — same shape as the real Notification Vol.
// slider below, just inert (no state, nothing plays SFX/music/voice in
// this app). Kept visually present, pinned to level 0, so the tab doesn't
// look broken/empty next to the one real control.
function DisabledSlider({ className }: { className?: string }) {
  return <Slider value={0} disabled className={className} />;
}

// Reads/writes BossRespawnProvider's real soundEnabled/soundVolume directly
// (not staged through OptionsWindow's `draft`) — unlike every other control
// in this dialog, Audio applies instantly: dragging the slider or toggling
// mute takes effect right away, including for Up Next's "Test" button and
// real boss notifications. Cancel/X still rolls it back to whatever was
// live when the window opened — see OptionsWindow's audioSnapshotRef.
function AudioTabContent({
  soundEnabled,
  soundVolume,
  onSoundEnabledChange,
  onSoundVolumeChange,
}: {
  soundEnabled: boolean;
  soundVolume: number;
  onSoundEnabledChange: (enabled: boolean) => void;
  onSoundVolumeChange: (step: number) => void;
}) {
  return (
    <div className="mx-1.5 mt-1 flex flex-col bg-window-bg px-3 py-2 leading-tight">
      <div className="flex items-center gap-2">
        <span className="flex-1 whitespace-nowrap text-right text-[13px] text-white/50">
          SFX Vol.
        </span>
        <DisabledSlider />
      </div>
      <div className="flex items-center gap-2">
        <span className="flex-1 whitespace-nowrap text-right text-[13px] text-white/50">
          Music Vol.
        </span>
        <DisabledSlider />
      </div>
      <div className="flex items-center gap-2">
        <span className="flex-1 whitespace-nowrap text-right text-[13px] text-white/50">
          System Voice
        </span>
        <DisabledSlider />
      </div>
      <div className="flex items-center gap-2">
        <span className="flex-1 whitespace-nowrap text-right text-[13px] text-white">
          Notification Vol.
        </span>
        {/* Not disabled while muted — Up Next's "Test" button deliberately
            plays regardless of the mute state (see testAlertSound's own
            comment: "a test should still be audible"), so locking the
            volume slider behind soundEnabled meant a muted player couldn't
            set a level for that preview (or for whenever they unmute) at
            all — the slider just didn't respond to drags. Setting a volume
            is a configuration action independent of whether sound is
            currently on, same as a real OS volume slider staying live while
            muted. */}
        <Slider value={soundVolume} onChange={onSoundVolumeChange} />
      </div>
      <Checkbox
        checked={!soundEnabled}
        onChange={(muted) => onSoundEnabledChange(!muted)}
        label="Mute all sounds."
        className="mt-1 ml-4.5"
      />
    </div>
  );
}

// The game's Options dialog — Video is along for the look only (no settings
// to back it, this app has nothing to configure there); Audio backs one
// real control (Notification Vol./Mute, wired to BossRespawnProvider's
// alert sound — see AudioTabContent), the rest is decorative to match the
// reference's layout. Game only keeps Interface/Initialize/Transparent from
// the reference, since everything else on that tab (language, display
// filters, tracking, party loot, ...) has no equivalent here either.
// Every checkbox/slider/dropdown on Game/Video — including the respawn-time
// control — is a staged edit (see `draft` below): nothing takes effect
// until Apply or OK, and closing via Cancel or the header's X discards it,
// restoring exactly what was showing when the dialog was opened. Audio is
// the one exception: it applies live, with its own separate Cancel-rollback
// mechanism — see audioSnapshotRef below for why.
export function OptionsWindow() {
  const { isOpen, setIsOpen, focusRespawnTimeSignal } = useOptionsPanel();
  const {
    isBackgroundVisible,
    setIsBackgroundVisible,
    isDimmed,
    setIsDimmed,
    isBackgroundInteractive,
    setIsBackgroundInteractive,
  } = useBackgroundDim();
  const { isHeaderVisible, setIsHeaderVisible } = useHeaderVisibility();
  const { enterChat, setEnterChat } = useEnterChat();
  const {
    isAlertButtonVisible,
    setIsAlertButtonVisible,
    hideSetTimePrompt,
    setHideSetTimePrompt,
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    globalRange,
    setGlobalRange,
  } = useBossRespawn();
  const [tab, setTab] = useState<Tab>("game");
  // Last-applied ("committed") values — what every checkbox reverts to when
  // the window is closed via Cancel/X without hitting Apply/OK. Most of
  // these are local and inert (this isn't a game client), purely so the
  // window doesn't read as broken when clicked, matching the reference's
  // checked/unchecked starting state. Two exceptions besides enterChat
  // (context-backed, destructured above): gameCursor (toggles the
  // game-style cursor via the effect below) and transparent (toggles every
  // window's chrome between the app's default translucent background and a
  // solid one, also via an effect below). Both persisted to localStorage
  // (like every other real checkbox in this dialog) so a reload keeps
  // whatever the player last applied, defaulting to true/checked to match
  // every window's actual out-of-the-box look.
  const [transparent, setTransparent] = usePersistedBoolean(
    "l2-window-transparent",
    true,
  );
  const [gameCursor, setGameCursor] = usePersistedBoolean(
    "l2-game-cursor",
    true,
  );

  // What the checkboxes/slider on screen actually read from and write to.
  // Deliberately not the committed state (or the real context setters)
  // above — every control on the Game/Video tabs is a draft edit until
  // Apply/OK pushes it through applyDraft, so ticking a box (or closing the
  // window afterward) never has a visible effect until then. Audio
  // (soundEnabled/soundVolume) is the one exception — deliberately NOT part
  // of this draft, see audioSnapshotRef below for why.
  const makeDraft = useCallback(
    () => ({
      transparent,
      gameCursor,
      enterChat,
      isHeaderVisible,
      isBackgroundVisible,
      isDimmed,
      isBackgroundInteractive,
      isAlertButtonVisible,
      hideSetTimePrompt,
      globalRange,
    }),
    [
      transparent,
      gameCursor,
      enterChat,
      isHeaderVisible,
      isBackgroundVisible,
      isDimmed,
      isBackgroundInteractive,
      isAlertButtonVisible,
      hideSetTimePrompt,
      globalRange,
    ],
  );
  const [draft, setDraft] = useState(makeDraft);

  const updateDraft = <K extends keyof ReturnType<typeof makeDraft>>(
    key: K,
    value: ReturnType<typeof makeDraft>[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  // Audio applies live — see AudioTabContent's own props below, wired
  // straight to soundEnabled/setSoundEnabled and soundVolume/setSoundVolume
  // rather than through draft/updateDraft — so changing the mute checkbox
  // or dragging the volume slider takes effect immediately, including for
  // Up Next's "Test" button and real boss notifications. That still needs
  // Cancel/X to mean something for audio though: this snapshot captures
  // whatever was live the moment the window opened, and handleCancel below
  // restores it. applyDraft moves the snapshot forward on Apply/OK, so a
  // later Cancel (after more live edits post-Apply) only rolls back to the
  // last applied point, not further.
  const audioSnapshotRef = useRef({ soundEnabled, soundVolume });

  // Re-stages the draft from whatever's currently committed every time the
  // window opens — this is what makes a closed-without-applying edit
  // disappear: nothing reset it, it just never survived to be re-shown.
  // Also re-captures the audio snapshot at the same moment.
  const wasOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setDraft(makeDraft());
      audioSnapshotRef.current = { soundEnabled, soundVolume };
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, makeDraft, soundEnabled, soundVolume]);

  // Commits the draft: pushes every value through to its real store (the
  // context setters take effect immediately; the purely-local ones just
  // become the new committed baseline for next time). Apply calls this and
  // stays open; OK calls it and closes; Cancel/X skip it entirely, so the
  // draft's edits are simply discarded. Audio isn't part of the draft (see
  // audioSnapshotRef above) — it's already live, so this just moves the
  // snapshot forward to the current values.
  const applyDraft = () => {
    setTransparent(draft.transparent);
    setGameCursor(draft.gameCursor);
    setEnterChat(draft.enterChat);
    setIsHeaderVisible(draft.isHeaderVisible);
    setIsBackgroundVisible(draft.isBackgroundVisible);
    setIsDimmed(draft.isDimmed);
    setIsBackgroundInteractive(draft.isBackgroundInteractive);
    setIsAlertButtonVisible(draft.isAlertButtonVisible);
    setHideSetTimePrompt(draft.hideSetTimePrompt);
    setGlobalRange(draft.globalRange);
    audioSnapshotRef.current = { soundEnabled, soundVolume };
  };
  const handleApply = () => applyDraft();
  const handleOk = () => {
    applyDraft();
    setIsOpen(false);
  };
  const handleCancel = () => {
    setSoundEnabled(audioSnapshotRef.current.soundEnabled);
    setSoundVolume(audioSnapshotRef.current.soundVolume);
    setIsOpen(false);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("default-cursor", !gameCursor);
  }, [gameCursor]);

  // See resetGameCursor's own comment above — the System Menu's "Restart"
  // dispatches this so the checkbox (and the actual cursor) snap back to
  // the default live, without a page reload.
  useEffect(() => {
    const handleReset = () => setGameCursor(true);
    window.addEventListener(GAME_CURSOR_RESET_EVENT, handleReset);
    return () =>
      window.removeEventListener(GAME_CURSOR_RESET_EVENT, handleReset);
  }, [setGameCursor]);

  // Every window's WindowBorder reads its chrome background from the
  // --color-window-bg custom property (Tailwind's bg-window-bg utility) —
  // overriding it via a class on <html> when unchecked reaches every
  // window at once, same mechanism as .default-cursor above.
  useEffect(() => {
    document.documentElement.classList.toggle("opaque-windows", !transparent);
  }, [transparent]);

  // Up Next's "Set Time" prompt bumps this (see useOptionsPanel's
  // requestFocusRespawnTime) to jump straight to the respawn-time control —
  // BossRespawnTimeSelect below watches the same signal to switch itself
  // into Custom mode and focus its input.
  useEffect(() => {
    if (focusRespawnTimeSignal > 0) setTab("game");
  }, [focusRespawnTimeSignal]);

  return (
    <DraggableWindow
      centered
      alwaysOnTop
      className={cn(
        "absolute w-55",
        !isOpen && "invisible pointer-events-none",
      )}
    >
      <DragHandle>
        <Header title="Options" canClose onClose={handleCancel} />
      </DragHandle>
      <div className="flex flex-col border border-black">
        <div className="relative flex pl-2 pr-4 pb-0 pt-1">
          <Image
            src="/icons/siege_back1.png"
            alt=""
            fill
            sizes="220px"
            className="aspect-square object-fill z-0"
          />
          <Image
            src="/icons/ssq_back.png"
            alt=""
            width={220}
            height={40}
            className="absolute bottom-0 left-0"
          />
          {TABS.map((t) => (
            <TabButton
              key={t.id}
              label={t.label}
              active={tab === t.id}
              disabled={t.id === "video"}
              onClick={() => setTab(t.id)}
            />
          ))}
        </div>

        <div className="relative flex flex-col min-h-24">
          <Image
            src="/icons/siege_back31.png"
            alt=""
            fill
            sizes="220px"
            className="aspect-square object-fill"
          />

          <div className="relative m-1 flex min-h-24 flex-col">
            {/* Every tab panel below is stacked in the same grid cell
                (col-start-1/row-start-1) and always rendered — only the
                inactive ones are visibility:hidden, not unmounted. That
                makes the grid row auto-size to the *tallest* panel (Game)
                regardless of which tab is showing, so switching to the
                shorter Audio or Video tab keeps the same window height
                instead of shrinking the dialog around it. */}
            <div className="relative grid flex-1">
              <div
                className={cn(
                  "col-start-1 row-start-1",
                  tab !== "game" && "invisible pointer-events-none",
                )}
              >
                <div className="flex items-center bg-window-bg mx-1.5 mt-1 pl-3 pt-1 gap-2">
                  <span className="text-[13px] text-white">Interface</span>
                  <div className="flex items-center gap-2">
                    <IconStateButton
                      defaultIcon="/icons/smallbutton2.png"
                      hoverIcon="/icons/smallbutton2_over.png"
                      clickIcon="/icons/smallbutton2_down.png"
                      className="h-4.25 w-16 text-[13px]"
                      sizes="64px"
                      text="Initialize"
                      // Resets window layout: dragged positions (every
                      // window, including the System Menu's own panel and
                      // its always-visible dock), stacking order, folded
                      // state, and — reopening any of the 5 main windows
                      // (Map/Raid Bosses/Up Next/Drop List/NPC Info) that
                      // were closed — not boss-tracking data. That's
                      // "Restart" in the System Menu (BossRespawnProvider's
                      // resetAll), a separate, more destructive action. All
                      // four dispatch a live-reset event, so mounted
                      // windows snap back immediately — no page reload.
                      // Deliberately doesn't touch isPanelOpen — the System
                      // Menu panel stays open across this if it already
                      // was; reopenAllPersistedWindows only covers the 5
                      // main windows, not the System Menu panel itself.
                      onClick={() => {
                        clearAllPersistedOffsets();
                        clearPersistedStackOrder();
                        unfoldAllPersistedWindows();
                        reopenAllPersistedWindows();
                      }}
                    />
                    <Checkbox
                      checked={draft.transparent}
                      onChange={(v) => updateDraft("transparent", v)}
                      label="Transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center bg-window-bg mx-1.5 mt-1 pl-3 gap-2 py-0.5">
                  <span className="text-[13px] text-white">Language</span>
                  <Dropdown options={["English"]} className="ml-0.25 w-24" />
                </div>

                <div className="relative mx-1.5 mt-2 bg-window-bg px-3 py-1.5">
                  <span className="absolute top-1.5 left-8 text-[13px] text-white">
                    Display
                  </span>
                  <div className="ml-14 flex w-fit flex-col items-start">
                    {/* Shows/hides PageTitleBanner — the "LINEAGE 2 BOSS
                        TRACKING" title banner at the top of the page.
                        Repurposed from the reference's inert "Player" row
                        since a real per-player visibility filter has no
                        equivalent here, but a real toggle for this did. */}
                    <Checkbox
                      checked={draft.isHeaderVisible}
                      onChange={(v) => updateDraft("isHeaderVisible", v)}
                      label="Header"
                    />
                    <Checkbox
                      checked={draft.isBackgroundVisible}
                      onChange={(v) => updateDraft("isBackgroundVisible", v)}
                      label="Background Epic Bosses"
                    />
                    <DisabledCheckbox checked label="Other PCs" />
                    <DisabledCheckbox checked label="Clan" className="pl-2.5" />
                    <DisabledCheckbox
                      checked
                      label="Party"
                      className="pl-2.5"
                    />
                    <DisabledCheckbox
                      checked={false}
                      label="General"
                      className="pl-2.5"
                    />
                  </div>
                </div>

                <div className="mx-1.5 mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 bg-window-bg px-3 py-1.5">
                  {/* Repurposed from the reference's inert "Show Region" —
                      brings back Up Next's Alert on/off button after the
                      player has dismissed it via its own close button. */}
                  <Checkbox
                    checked={draft.isAlertButtonVisible}
                    onChange={(v) => updateDraft("isAlertButtonVisible", v)}
                    label="Alert Button"
                  />
                  <DisabledCheckbox checked={false} label="Disable Game Tips" />
                  <Checkbox
                    checked={draft.gameCursor}
                    onChange={(v) => updateDraft("gameCursor", v)}
                    label="Game Cursor"
                  />
                  {/* Repurposed from the reference's inert "3D Arrow" —
                      unchecked by default (the "Boss respawn timer is not
                      set" prompt shows, same as before this setting
                      existed); checking it hides that prompt from Up Next.
                      Once a respawn timer is actually set, the prompt it
                      controls can't show at all regardless (Up Next's own
                      condition already requires globalRange to still be
                      null first) — so this locks to checked/disabled
                      instead of leaving a live control that no longer does
                      anything. */}
                  {globalRange ? (
                    <DisabledCheckbox checked label="Hide 'Set Time'" />
                  ) : (
                    <Checkbox
                      checked={draft.hideSetTimePrompt}
                      onChange={(v) => updateDraft("hideSetTimePrompt", v)}
                      label="Hide 'Set Time'"
                    />
                  )}
                </div>

                <div className="mx-1.5 mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 bg-window-bg px-3 py-1.5">
                  <Checkbox
                    checked={draft.enterChat}
                    onChange={(v) => updateDraft("enterChat", v)}
                    label="Enter Chat"
                  />
                  {/* Repurposed from the reference's inert "Auto Code" —
                      the dark overlay over the epic-boss background art
                      (see BackgroundDimProvider's isDimmed / Background.tsx).
                      Unchecking it removes the darkening, same as what Exit
                      Game does to the background when leaving. */}
                  <Checkbox
                    checked={draft.isDimmed}
                    onChange={(v) => updateDraft("isDimmed", v)}
                    label="Dim Background"
                  />
                  <DisabledCheckbox checked={false} label="Key Security" />
                  {/* Repurposed from the reference's inert "Game Pad" —
                      whether the epic-boss background panels respond to
                      hover/click at all (see BackgroundDimProvider's
                      isBackgroundInteractive / Background.tsx's isPickable).
                      Unchecking it lets a player see the art clearly, once
                      undimmed, without the hover glow or risking an
                      accidental click back into the game. */}
                  <Checkbox
                    checked={draft.isBackgroundInteractive}
                    onChange={(v) => updateDraft("isBackgroundInteractive", v)}
                    label="Epic Boss Hover"
                  />
                </div>

                <div className="mx-1.5 mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 bg-window-bg px-3 py-1.5">
                  <DisabledCheckbox checked label="Tracking" />
                  <DisabledCheckbox checked={false} label="Decline Duels" />
                  <DisabledCheckbox
                    checked={false}
                    label="Hide Dropped Item(s)"
                    className="col-span-2 whitespace-nowrap"
                  />
                </div>

                <div className="flex items-center bg-window-bg mx-1.5 mt-2 mb-1 gap-1 pl-3 py-1">
                  <span className="text-[13px] text-white">Respawn time</span>
                  <BossRespawnTimeSelect
                    range={draft.globalRange}
                    onRangeChange={(v) => updateDraft("globalRange", v)}
                    focusCustomSignal={focusRespawnTimeSignal}
                  />
                </div>
              </div>

              <div
                className={cn(
                  "col-start-1 row-start-1",
                  tab !== "audio" && "invisible pointer-events-none",
                )}
              >
                {/* Live, not draft-backed — see audioSnapshotRef above for
                    why Audio is the one tab that applies instantly instead
                    of waiting for Apply/OK. */}
                <AudioTabContent
                  soundEnabled={soundEnabled}
                  soundVolume={soundVolume}
                  onSoundEnabledChange={setSoundEnabled}
                  onSoundVolumeChange={setSoundVolume}
                />
              </div>

              <div
                className={cn(
                  "col-start-1 row-start-1 flex items-center justify-center",
                  tab !== "video" && "invisible pointer-events-none",
                )}
              >
                <p className="py-6 text-center text-[13px] text-white/40">
                  Nothing to configure here.
                </p>
              </div>
            </div>

            {/* Shared across every tab (not per-tab) — Apply/OK commit
                whatever's staged across *all* tabs at once, not just
                whichever one happens to be showing, so switching tabs
                mid-edit never loses a pending change. */}
            <div className="flex h-6 gap-px p-1 mb-1">
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className={FOOTER_BUTTON_CLASS}
                sizes="72px"
                text="OK"
                onClick={handleOk}
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className={FOOTER_BUTTON_CLASS}
                sizes="72px"
                text="Cancel"
                onClick={handleCancel}
              />
              <IconStateButton
                defaultIcon="/icons/smallbutton2.png"
                hoverIcon="/icons/smallbutton2_over.png"
                clickIcon="/icons/smallbutton2_down.png"
                className={FOOTER_BUTTON_CLASS}
                sizes="72px"
                text="Apply"
                onClick={handleApply}
              />
            </div>
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
}
