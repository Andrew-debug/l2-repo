import type { RespawnStatus } from "./respawn";

// Single source of truth for how a RespawnStatus reads across the app —
// info-display, upcoming-spawns, level-navigator, and the states legend all
// pull from here, so the map pins (BossMarkerKonva, same three colors) and
// every list/card agree on what "alive" looks like.
export const STATUS_LABEL: Record<RespawnStatus, string> = {
  dead: "Killed",
  pending: "Could be up",
  alive: "Currently visible",
};

export const STATUS_COLOR: Record<RespawnStatus, string> = {
  dead: "#c25c5c",
  pending: "#f5c518",
  alive: "#7ed957",
};

export const STATUS_DOT_CLASS: Record<RespawnStatus, string> = {
  alive: "bg-[#7ed957]",
  pending: "bg-[#f5c518]",
  dead: "bg-[#c25c5c]",
};

export const STATUS_TEXT_CLASS: Record<RespawnStatus, string> = {
  dead: "text-[#c25c5c]",
  pending: "text-[#f5c518]",
  alive: "text-[#7ed957]",
};

// The short code line under a state's label (e.g. states-legend, the map
// marker's tooltip) — a few words, not a sentence.
export const STATUS_CODE: Record<RespawnStatus, string> = {
  dead: "timer running",
  pending: "could be up now",
  alive: "confirmed up",
};

// The longer explanation of what each state means — same copy everywhere
// it's spelled out (states-legend, the map marker's tooltip), so the
// wording can't drift between the two places a player reads it.
export const STATUS_MEANING: Record<RespawnStatus, string> = {
  dead: "Killed, and too early to matter. The default state of almost every boss — so it's the quietest thing on the screen.",
  pending: "The earliest spawn time has passed and the latest hasn't. This is the state a boss hunter actually plays around.",
  alive: "Someone saw it standing. Only ever set by a person, never guessed by the clock.",
};

// Same three map-pin icons (markerIcon.ts bakes these onto canvases for the
// Konva-drawn pins) as plain <img> paths, for HTML contexts like a boss's
// state card that don't need the canvas treatment.
export const STATUS_ICON: Record<RespawnStatus, string> = {
  alive: "/icons/map_raid_spawning_i00.png",
  pending: "/icons/map_raid_pending_i00.png",
  dead: "/icons/map_raid_respawn_i00.png",
};
