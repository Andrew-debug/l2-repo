import bossDataJson from "../../BOSS_DATA.json";

export interface LootDrop {
  item: string;
  chance: string;
  count: string;
}

export interface Boss {
  id: string;
  // URL-safe identifier for /bosses/[slug] pages — see baseSlug below.
  slug: string;
  name: string;
  title: string;
  level: number;
  hp: number;
  mp: number;
  exp: number;
  sp: number;
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
  // Alternate spellings players search for (e.g. "Chacram" for "Shacram") —
  // surfaced on the boss detail page for search-matching, not shown as UI.
  synonyms?: string[];
}

function baseSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// A few instance-zone bosses (e.g. "Anakazel") reuse the same name across
// several level-scaled variants, so a bare name-slug would collide across
// them — level is appended only within that group, leaving every other
// boss with a plain-name URL.
const baseSlugCounts = new Map<string, number>();
for (const b of bossDataJson.data) {
  const s = baseSlug(b.name);
  baseSlugCounts.set(s, (baseSlugCounts.get(s) ?? 0) + 1);
}

export const bosses: Boss[] = bossDataJson.data.map((b) => {
  const s = baseSlug(b.name);
  const slug = (baseSlugCounts.get(s) ?? 1) > 1 ? `${s}-lv${b.level}` : s;
  return {
    id: String(b.id),
    slug,
    name: b.name,
    title: b.title,
    level: b.level,
    hp: b.hp,
    mp: b.features?.mp ?? 0,
    exp: b.features?.exp ?? 0,
    sp: b.features?.sp ?? 0,
    race: b.race ?? "Unknown",
    description: b.description ?? "",
    drops: b.drops ?? [],
    weakness: b.weakness,
    npcType: b.npcType ?? "RaidBoss",
    routeVideoUrl: b.routeVideoUrl,
    synonyms: b.synonyms,
  };
});

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

export function getBossBySlug(slug: string): Boss | undefined {
  return bosses.find((b) => b.slug === slug);
}
