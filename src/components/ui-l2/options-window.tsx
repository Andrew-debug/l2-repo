"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "./header";
import { WindowBorder } from "./window-l2";
import { DraggableWindow, DragHandle } from "./draggable-window";
import { IconStateButton } from "../ui/icon-state-button";
import { useOptionsPanel } from "@/components/providers/OptionsPanelProvider";
import { useBackgroundDim } from "@/components/providers/BackgroundDimProvider";
import { useBossRespawn } from "@/components/providers/BossRespawnProvider";
import {
  CUSTOM_RESPAWN_ID,
  findPresetIdByRange,
  findRespawnPreset,
  parseCustomRespawnRange,
} from "@/lib/respawn-presets";
import type { RespawnRange } from "@/lib/respawn";
import { cn } from "@/lib/utils";

type Tab = "video" | "audio" | "game";

const TABS: { id: Tab; label: string }[] = [
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "game", label: "Game" },
];

const FOOTER_BUTTON_CLASS = "w-3.5 h-4.75 flex-1 text-[13px]";

function TabButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  // normal_tab: unselected. normal_tab_on: the active tab. normal_tab_on_over:
  // hover — for a tab you could switch *to*, not the one you're already on
  // (active wins over hovered: nothing to preview-highlight about clicking
  // the tab you're already looking at). Disabled tabs (Video/Audio — no
  // settings behind them) never track hover at all either.
  const src = disabled
    ? "/icons/petinterface_tab2.png"
    : active
      ? "/icons/petinterface_tab1.png"
      : hovered
        ? "/icons/petinterface_tab2_over.png"
        : "/icons/petinterface_tab2.png";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : () => setHovered(true)}
      onMouseLeave={disabled ? undefined : () => setHovered(false)}
      disabled={disabled}
      className={cn(
        "relative h-5 flex-1",
        disabled ? "cursor-default opacity-60" : "cursor-pointer",
      )}
    >
      <Image src={src} alt="" fill className="object-fill" />
      <span className="relative text-[13px] text-system-text-dim bottom-0.5">
        {label}
      </span>
    </button>
  );
}

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
          <Image src={arrowSrc} alt="" fill className="object-contain" />
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

function rangesEqual(a: RespawnRange, b: RespawnRange): boolean {
  return a.minHours === b.minHours && a.maxHours === b.maxHours;
}

const BOSS_RESPAWN_TIME_OPTIONS: { id: string; label: string }[] = [
  { id: "static-6h", label: "6 hours" },
  { id: "static-12h", label: "12 hours" },
  { id: "static-24h", label: "24 hours" },
  { id: "12-16h", label: "12-16 hours" },
];

// Same custom-dropdown shell as Dropdown above, but backed by real state
// (globalRange) instead of local-only stand-in state — this is the one
// control on the Game tab wired to an actual server-wide setting, so
// picking a preset or typing a custom value takes effect immediately
// (matching how the deleted Respawn Settings window used to work), no
// separate Apply step.
function BossRespawnTimeSelect() {
  const { globalRange, setGlobalRange } = useBossRespawn();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [selection, setSelection] = useState<string>(
    () => findPresetIdByRange(globalRange) ?? CUSTOM_RESPAWN_ID,
  );
  const [customText, setCustomText] = useState(() =>
    findPresetIdByRange(globalRange)
      ? ""
      : globalRange.minHours === globalRange.maxHours
        ? String(globalRange.minHours)
        : `${globalRange.minHours}-${globalRange.maxHours}`,
  );
  const [customInvalid, setCustomInvalid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks what this component itself last pushed to globalRange, so the
  // hydration-resync effect below only reacts to *external* changes (e.g.
  // localStorage finishing its async read after mount) instead of fighting
  // the user's own in-progress edit.
  const lastAppliedRangeRef = useRef(globalRange);

  useEffect(() => {
    if (rangesEqual(globalRange, lastAppliedRangeRef.current)) return;
    lastAppliedRangeRef.current = globalRange;
    const matched = findPresetIdByRange(globalRange);
    if (matched) {
      setSelection(matched);
    } else {
      setSelection(CUSTOM_RESPAWN_ID);
      setCustomText(
        globalRange.minHours === globalRange.maxHours
          ? String(globalRange.minHours)
          : `${globalRange.minHours}-${globalRange.maxHours}`,
      );
    }
  }, [globalRange]);

  useEffect(() => {
    if (selection === CUSTOM_RESPAWN_ID) inputRef.current?.focus();
  }, [selection]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const emit = (range: RespawnRange) => {
    lastAppliedRangeRef.current = range;
    setGlobalRange(range);
  };

  const handlePreset = (id: string) => {
    setSelection(id);
    setOpen(false);
    const preset = findRespawnPreset(id);
    if (preset) emit({ minHours: preset.minHours, maxHours: preset.maxHours });
  };

  const handleCustomChange = (text: string) => {
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
      <div className="relative flex h-3.75 w-full items-center border border-window-content-border bg-window-bg pl-1 text-[13px] leading-3.5 text-white">
        {selection === CUSTOM_RESPAWN_ID ? (
          <input
            ref={inputRef}
            value={customText}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g. 6 or 12-16"
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
          <Image src={arrowSrc} alt="" fill className="object-contain" />
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
          className="object-contain"
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
          className="object-contain"
        />
      </span>
      <span className="leading-3.5">{label}</span>
    </span>
  );
}

// The game's Options dialog — Video/Audio tabs are along for the look only
// (no settings to back them, this app has nothing to configure there); Game
// only keeps Interface/Initialize/Transparent from the reference, since
// everything else on that tab (language, display filters, tracking, party
// loot, ...) has no equivalent here either.
export function OptionsWindow() {
  const { isOpen, setIsOpen } = useOptionsPanel();
  const { isBackgroundVisible, setIsBackgroundVisible } = useBackgroundDim();
  const [tab, setTab] = useState<Tab>("game");
  const [transparent, setTransparent] = useState(false);
  // None of these back real functionality (this isn't a game client) —
  // local, inert toggles purely so the window doesn't read as broken when
  // clicked, matching the reference's checked/unchecked starting state.
  const [showRegion, setShowRegion] = useState(true);
  const [graphicCursor, setGraphicCursor] = useState(true);
  const [arrow3d, setArrow3d] = useState(true);
  const [enterChat, setEnterChat] = useState(true);
  const [autoCode, setAutoCode] = useState(true);
  const [tracking, setTracking] = useState(true);
  const [declineDuels, setDeclineDuels] = useState(false);
  const [hideDropped, setHideDropped] = useState(false);

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
        <Header title="Options" canClose onClose={() => setIsOpen(false)} />
      </DragHandle>
      <div className="flex flex-col border border-black">
        <div className="relative flex pl-2 pr-4 pb-0 pt-1">
          <Image
            src="/icons/siege_back1.png"
            alt=""
            fill
            className="object-fill z-0"
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
              disabled={t.id !== "game"}
              onClick={() => setTab(t.id)}
            />
          ))}
        </div>

        <div className="relative flex flex-col min-h-24">
          <Image
            src="/icons/siege_back31.png"
            alt=""
            fill
            className="object-fill"
          />

          <div className="relative m-1 min-h-24">
            {tab === "game" ? (
              <>
                <div className="flex items-center bg-window-bg mx-1.5 mt-1 pl-3 pt-1 gap-2">
                  <span className="text-[13px] text-white">Interface</span>
                  <div className="flex items-center gap-2">
                    <IconStateButton
                      defaultIcon="/icons/smallbutton2.png"
                      hoverIcon="/icons/smallbutton2_over.png"
                      clickIcon="/icons/smallbutton2_down.png"
                      className="h-4.25 w-16 text-[13px]"
                      text="Initialize"
                    />
                    <Checkbox
                      checked={transparent}
                      onChange={setTransparent}
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
                    <DisabledCheckbox checked label="Player" />
                    {/* The one real toggle here — thematically the closest
                        fit of the six, since the background actually is
                        boss/monster artwork. */}
                    <Checkbox
                      checked={isBackgroundVisible}
                      onChange={setIsBackgroundVisible}
                      label="Monsters"
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
                  <Checkbox
                    checked={showRegion}
                    onChange={setShowRegion}
                    label="Show Region"
                  />
                  <DisabledCheckbox checked={false} label="Disable Game Tips" />
                  <Checkbox
                    checked={graphicCursor}
                    onChange={setGraphicCursor}
                    label="Graphic Cursor"
                  />
                  <Checkbox
                    checked={arrow3d}
                    onChange={setArrow3d}
                    label="3D Arrow"
                  />
                </div>

                <div className="mx-1.5 mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 bg-window-bg px-3 py-1.5">
                  <Checkbox
                    checked={enterChat}
                    onChange={setEnterChat}
                    label="Enter Chat"
                  />
                  <Checkbox
                    checked={autoCode}
                    onChange={setAutoCode}
                    label="Auto Code"
                  />
                  <DisabledCheckbox checked={false} label="Key Security" />
                  <DisabledCheckbox checked label="Game Pad" />
                </div>

                <div className="mx-1.5 mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 bg-window-bg px-3 py-1.5">
                  <Checkbox
                    checked={tracking}
                    onChange={setTracking}
                    label="Tracking"
                  />
                  <Checkbox
                    checked={declineDuels}
                    onChange={setDeclineDuels}
                    label="Decline Duels"
                  />
                  <Checkbox
                    checked={hideDropped}
                    onChange={setHideDropped}
                    label="Hide Dropped Item(s)"
                    className="col-span-2 whitespace-nowrap"
                  />
                </div>

                <div className="flex items-center bg-window-bg mx-1.5 mt-2 mb-1 gap-1 pl-3 py-1">
                  <span className="text-[13px] text-white">Respawn time</span>
                  <BossRespawnTimeSelect />
                </div>
                <div className="flex h-6 gap-px p-1 mb-1">
                  <IconStateButton
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className={FOOTER_BUTTON_CLASS}
                    text="OK"
                    onClick={() => setIsOpen(false)}
                  />
                  <IconStateButton
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className={FOOTER_BUTTON_CLASS}
                    text="Cancel"
                    onClick={() => setIsOpen(false)}
                  />
                  <IconStateButton
                    defaultIcon="/icons/smallbutton2.png"
                    hoverIcon="/icons/smallbutton2_over.png"
                    clickIcon="/icons/smallbutton2_down.png"
                    className={FOOTER_BUTTON_CLASS}
                    text="Apply"
                  />
                </div>
              </>
            ) : (
              <p className="py-6 text-center text-[13px] text-white/40">
                Nothing to configure here.
              </p>
            )}
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
}
