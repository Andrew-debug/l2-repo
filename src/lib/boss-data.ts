import bossDataJson from "../../BOSS_DATA.json";

export interface LootDrop {
  item: string;
  chance: string;
  count: string;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  level: number;
  hp: number;
  mp: number;
  race: string;
  description: string;
  drops: LootDrop[];
  weakness?: string;
  // "EpicBoss" for the 8 world bosses (Queen Ant, Baium, Core, Orfen,
  // Frintezza, Antharas, Valakas, Zaken) — everything else is "RaidBoss".
  // Drives the special map-marker treatment in BossMarkerKonva.
  npcType: string;
  // A "Road to <boss>" video from the "Lineage II database best pvp"
  // YouTube channel, when one was actually found for this boss — undefined
  // (not a placeholder link) for bosses the channel never covered. Drives
  // the "Route video - how to reach" button in BossInfoDisplay.
  routeVideoUrl?: string;
}

export const bosses: Boss[] = bossDataJson.data.map((b) => ({
  id: String(b.id),
  name: b.name,
  title: b.title,
  level: b.level,
  hp: b.hp,
  mp: b.features?.mp ?? 0,
  race: b.race ?? "Unknown",
  description: b.description ?? "",
  drops: b.drops ?? [],
  weakness: b.weakness,
  npcType: b.npcType ?? "RaidBoss",
  routeVideoUrl: b.routeVideoUrl,
}));

export interface LevelRange {
  label: string;
  min: number;
  max: number;
}

// Matches the game's own "Raid Spawn Locations" admin menu bands
// (20-29, 30-39, ...) — non-overlapping, unlike the old 20-30/30-40 style.
export const levelRanges: LevelRange[] = [
  { label: "20-29", min: 20, max: 29 },
  { label: "30-39", min: 30, max: 39 },
  { label: "40-49", min: 40, max: 49 },
  { label: "50-59", min: 50, max: 59 },
  { label: "60-69", min: 60, max: 69 },
  { label: "70-79", min: 70, max: 79 },
  { label: "80-89", min: 80, max: 89 },
];

export function getBossById(id: string): Boss | undefined {
  return bosses.find((b) => b.id === id);
}
