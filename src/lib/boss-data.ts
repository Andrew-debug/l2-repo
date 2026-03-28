export interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory" | "material" | "recipe";
  grade: "D" | "C" | "B" | "A" | "S" | "S80";
  icon: string;
}

export interface Boss {
  id: string;
  name: string;
  level: number;
  type: "raid" | "epic" | "field";
  respawnTime: string;
  location: string;
  region: string;
  drops: string[];
  description: string;
}

export const items: Item[] = [
  // D Grade
  {
    id: "item-1",
    name: "Sword of Revolution",
    type: "weapon",
    grade: "D",
    icon: "⚔️",
  },
  { id: "item-2", name: "Elven Bow", type: "weapon", grade: "D", icon: "🏹" },
  {
    id: "item-3",
    name: "Mithril Tunic",
    type: "armor",
    grade: "D",
    icon: "🛡️",
  },
  {
    id: "item-4",
    name: "Necklace of Devotion",
    type: "accessory",
    grade: "D",
    icon: "📿",
  },

  // C Grade
  {
    id: "item-5",
    name: "Samurai Longsword",
    type: "weapon",
    grade: "C",
    icon: "⚔️",
  },
  {
    id: "item-6",
    name: "Akat Longbow",
    type: "weapon",
    grade: "C",
    icon: "🏹",
  },
  { id: "item-7", name: "Demon Staff", type: "weapon", grade: "C", icon: "🪄" },
  {
    id: "item-8",
    name: "Plated Leather",
    type: "armor",
    grade: "C",
    icon: "🛡️",
  },
  {
    id: "item-9",
    name: "Black Ore Necklace",
    type: "accessory",
    grade: "C",
    icon: "📿",
  },
  {
    id: "item-10",
    name: "Blessed Spiritshot C",
    type: "material",
    grade: "C",
    icon: "💎",
  },

  // B Grade
  {
    id: "item-11",
    name: "Sword of Damascus",
    type: "weapon",
    grade: "B",
    icon: "⚔️",
  },
  {
    id: "item-12",
    name: "Dark Elven Longbow",
    type: "weapon",
    grade: "B",
    icon: "🏹",
  },
  {
    id: "item-13",
    name: "Staff of Evil Spirits",
    type: "weapon",
    grade: "B",
    icon: "🪄",
  },
  {
    id: "item-14",
    name: "Blue Wolf Tunic",
    type: "armor",
    grade: "B",
    icon: "🛡️",
  },
  {
    id: "item-15",
    name: "Doom Plate Armor",
    type: "armor",
    grade: "B",
    icon: "🛡️",
  },
  {
    id: "item-16",
    name: "Tateossian Necklace",
    type: "accessory",
    grade: "B",
    icon: "📿",
  },
  {
    id: "item-17",
    name: "Recipe: Blue Wolf Breastplate",
    type: "recipe",
    grade: "B",
    icon: "📜",
  },

  // A Grade
  {
    id: "item-18",
    name: "Sword of Miracles",
    type: "weapon",
    grade: "A",
    icon: "⚔️",
  },
  {
    id: "item-19",
    name: "Carnage Bow",
    type: "weapon",
    grade: "A",
    icon: "🏹",
  },
  {
    id: "item-20",
    name: "Arcana Mace",
    type: "weapon",
    grade: "A",
    icon: "🔨",
  },
  {
    id: "item-21",
    name: "Tallum Plate Armor",
    type: "armor",
    grade: "A",
    icon: "🛡️",
  },
  {
    id: "item-22",
    name: "Dark Crystal Robe",
    type: "armor",
    grade: "A",
    icon: "👘",
  },
  {
    id: "item-23",
    name: "Majestic Necklace",
    type: "accessory",
    grade: "A",
    icon: "📿",
  },
  {
    id: "item-24",
    name: "Ring of Core",
    type: "accessory",
    grade: "A",
    icon: "💍",
  },
  {
    id: "item-25",
    name: "Earring of Orfen",
    type: "accessory",
    grade: "A",
    icon: "✨",
  },

  // S Grade
  {
    id: "item-26",
    name: "Forgotten Blade",
    type: "weapon",
    grade: "S",
    icon: "⚔️",
  },
  {
    id: "item-27",
    name: "Draconic Bow",
    type: "weapon",
    grade: "S",
    icon: "🏹",
  },
  {
    id: "item-28",
    name: "Arcana Sigil",
    type: "weapon",
    grade: "S",
    icon: "🔮",
  },
  {
    id: "item-29",
    name: "Imperial Crusader Armor",
    type: "armor",
    grade: "S",
    icon: "🛡️",
  },
  {
    id: "item-30",
    name: "Dynasty Tunic",
    type: "armor",
    grade: "S",
    icon: "👘",
  },
  {
    id: "item-31",
    name: "Necklace of Valakas",
    type: "accessory",
    grade: "S",
    icon: "🔥",
  },
  {
    id: "item-32",
    name: "Ring of Baium",
    type: "accessory",
    grade: "S",
    icon: "💍",
  },
  {
    id: "item-33",
    name: "Earring of Antharas",
    type: "accessory",
    grade: "S",
    icon: "🐉",
  },
  {
    id: "item-34",
    name: "Cloak of Protection",
    type: "armor",
    grade: "S",
    icon: "🧥",
  },

  // S80 Grade
  {
    id: "item-35",
    name: "Vesper Fighter",
    type: "weapon",
    grade: "S80",
    icon: "⚔️",
  },
  {
    id: "item-36",
    name: "Vesper Thrower",
    type: "weapon",
    grade: "S80",
    icon: "🏹",
  },
  {
    id: "item-37",
    name: "Vesper Noble Armor",
    type: "armor",
    grade: "S80",
    icon: "🛡️",
  },
  {
    id: "item-38",
    name: "Lindvior Earring",
    type: "accessory",
    grade: "S80",
    icon: "✨",
  },
];

export const bosses: Boss[] = [
  // Level 20-30
  {
    id: "boss-1",
    name: "Kasha Bear",
    level: 22,
    type: "field",
    respawnTime: "30 min",
    location: "Execution Grounds",
    region: "Gludio",
    drops: ["item-1", "item-3"],
    description:
      "A corrupted bear that roams the Execution Grounds, known for its ferocity.",
  },
  {
    id: "boss-2",
    name: "Pan Dryad",
    level: 25,
    type: "field",
    respawnTime: "30 min",
    location: "Dion Hills",
    region: "Dion",
    drops: ["item-2", "item-4"],
    description: "A mystical forest spirit corrupted by dark magic.",
  },
  {
    id: "boss-3",
    name: "Giant Poison Bee",
    level: 28,
    type: "field",
    respawnTime: "45 min",
    location: "Cruma Marshlands",
    region: "Dion",
    drops: ["item-1", "item-4"],
    description:
      "Oversized venomous insects that guard their territory fiercely.",
  },

  // Level 30-40
  {
    id: "boss-4",
    name: "Tyrant",
    level: 32,
    type: "raid",
    respawnTime: "8 hours",
    location: "Ant Nest",
    region: "Gludio",
    drops: ["item-5", "item-8", "item-10"],
    description: "The fearsome Ant Queen that rules over the Ant Nest.",
  },
  {
    id: "boss-5",
    name: "Medusa",
    level: 35,
    type: "raid",
    respawnTime: "8 hours",
    location: "Gorgon Flower Garden",
    region: "Giran",
    drops: ["item-6", "item-9"],
    description:
      "The legendary serpent-haired monster that turns victims to stone.",
  },
  {
    id: "boss-6",
    name: "Guillotine",
    level: 38,
    type: "raid",
    respawnTime: "10 hours",
    location: "Execution Grounds",
    region: "Gludio",
    drops: ["item-5", "item-7", "item-10"],
    description: "An undead executioner wielding his massive blade.",
  },

  // Level 40-50
  {
    id: "boss-7",
    name: "Core",
    level: 45,
    type: "epic",
    respawnTime: "24 hours",
    location: "Cruma Tower",
    region: "Dion",
    drops: ["item-24", "item-11", "item-17"],
    description: "A powerful magical construct at the heart of Cruma Tower.",
  },
  {
    id: "boss-8",
    name: "Orfen",
    level: 48,
    type: "epic",
    respawnTime: "24 hours",
    location: "Sea of Spores",
    region: "Oren",
    drops: ["item-25", "item-13", "item-16"],
    description: "The Queen of the Sea of Spores, a massive spider creature.",
  },
  {
    id: "boss-9",
    name: "Enmity Ghost Raider",
    level: 42,
    type: "raid",
    respawnTime: "12 hours",
    location: "Ivory Tower",
    region: "Oren",
    drops: ["item-11", "item-14"],
    description: "A vengeful spirit of a fallen knight.",
  },

  // Level 50-60
  {
    id: "boss-10",
    name: "Queen Ant",
    level: 52,
    type: "epic",
    respawnTime: "24 hours",
    location: "Ant Nest",
    region: "Gludio",
    drops: ["item-23", "item-18", "item-21"],
    description:
      "The true ruler of the Ant Nest, commanding legions of soldiers.",
  },
  {
    id: "boss-11",
    name: "Zaken",
    level: 55,
    type: "epic",
    respawnTime: "36 hours",
    location: "Devil's Isle",
    region: "Giran",
    drops: ["item-18", "item-22", "item-23"],
    description: "The immortal pirate lord who rules from his cursed ship.",
  },
  {
    id: "boss-12",
    name: "Kernon",
    level: 53,
    type: "raid",
    respawnTime: "12 hours",
    location: "Devastated Castle",
    region: "Aden",
    drops: ["item-12", "item-15", "item-16"],
    description: "A demon that has taken residence in the ruined castle.",
  },

  // Level 60-70
  {
    id: "boss-13",
    name: "Baium",
    level: 65,
    type: "epic",
    respawnTime: "5 days",
    location: "Tower of Insolence",
    region: "Aden",
    drops: ["item-32", "item-26", "item-29"],
    description:
      "The awakened giant king, once a ruler turned to stone by the gods.",
  },
  {
    id: "boss-14",
    name: "Frintezza",
    level: 68,
    type: "epic",
    respawnTime: "48 hours",
    location: "Frintezza's Imperial Tomb",
    region: "Rune",
    drops: ["item-27", "item-30", "item-34"],
    description:
      "The vampire musician who commands the forces of darkness with his melody.",
  },
  {
    id: "boss-15",
    name: "Hallate",
    level: 62,
    type: "raid",
    respawnTime: "18 hours",
    location: "Seal of Shilen",
    region: "Goddard",
    drops: ["item-19", "item-21", "item-17"],
    description: "A powerful demon sealed away in the depths.",
  },

  // Level 70-80
  {
    id: "boss-16",
    name: "Antharas",
    level: 75,
    type: "epic",
    respawnTime: "7 days",
    location: "Antharas' Lair",
    region: "Giran",
    drops: ["item-33", "item-28", "item-29"],
    description:
      "The Earth Dragon, one of the most powerful creatures in existence.",
  },
  {
    id: "boss-17",
    name: "Valakas",
    level: 78,
    type: "epic",
    respawnTime: "7 days",
    location: "Valakas' Lair",
    region: "Goddard",
    drops: ["item-31", "item-26", "item-30"],
    description: "The Fire Dragon, residing in the volcanic depths.",
  },
  {
    id: "boss-18",
    name: "Beleth",
    level: 75,
    type: "epic",
    respawnTime: "48 hours",
    location: "Hall of Suffering",
    region: "Hellbound",
    drops: ["item-27", "item-29", "item-34"],
    description: "The demon lord who commands the forces of Hellbound.",
  },

  // Level 80+
  {
    id: "boss-19",
    name: "Lindvior",
    level: 82,
    type: "epic",
    respawnTime: "7 days",
    location: "Seed of Annihilation",
    region: "Gracia",
    drops: ["item-38", "item-35", "item-37"],
    description: "The Wind Dragon, master of the skies.",
  },
  {
    id: "boss-20",
    name: "Istina",
    level: 85,
    type: "epic",
    respawnTime: "48 hours",
    location: "Crystal Prison",
    region: "Gracia",
    drops: ["item-36", "item-37", "item-38"],
    description: "A powerful queen trapped within the Crystal Prison.",
  },
  {
    id: "boss-21",
    name: "Trasken",
    level: 80,
    type: "raid",
    respawnTime: "24 hours",
    location: "Garden of Genesis",
    region: "Gracia",
    drops: ["item-35", "item-37"],
    description: "A massive creature guarding the Garden of Genesis.",
  },
];

export const levelRanges = [
  { label: "Level 20-30", min: 20, max: 30 },
  { label: "Level 30-40", min: 30, max: 40 },
  { label: "Level 40-50", min: 40, max: 50 },
  { label: "Level 50-60", min: 50, max: 60 },
  { label: "Level 60-70", min: 60, max: 70 },
  { label: "Level 70-80", min: 70, max: 80 },
  { label: "Level 80+", min: 80, max: 100 },
];

export const bossTypes = [
  { label: "Epic Boss", value: "epic" },
  { label: "Raid Boss", value: "raid" },
  { label: "Field Boss", value: "field" },
];

export const itemGrades = ["D", "C", "B", "A", "S", "S80"] as const;

export const regions = [
  "Gludio",
  "Dion",
  "Giran",
  "Oren",
  "Aden",
  "Goddard",
  "Rune",
  "Hellbound",
  "Gracia",
];

export function getBossDrops(boss: Boss): Item[] {
  return boss.drops
    .map((dropId) => items.find((item) => item.id === dropId))
    .filter((item): item is Item => item !== undefined);
}

export function getBossesByItem(itemId: string): Boss[] {
  return bosses.filter((boss) => boss.drops.includes(itemId));
}

export function getBossesByLevelRange(min: number, max: number): Boss[] {
  return bosses.filter((boss) => boss.level >= min && boss.level <= max);
}

export function searchBosses(query: string): Boss[] {
  const lowerQuery = query.toLowerCase();
  return bosses.filter(
    (boss) =>
      boss.name.toLowerCase().includes(lowerQuery) ||
      boss.location.toLowerCase().includes(lowerQuery) ||
      boss.region.toLowerCase().includes(lowerQuery),
  );
}

export function searchItems(query: string): Item[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.type.toLowerCase().includes(lowerQuery),
  );
}
