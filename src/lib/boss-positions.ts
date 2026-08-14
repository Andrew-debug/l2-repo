export const MAP_CONFIG = {
  cols: 6,
  rows: 10,
  tileWidth: 302,
  tileHeight: 262,
  minZoom: 0.7,
  maxZoom: 1,
  get totalWidth() {
    return this.cols * this.tileWidth;
  },
  get totalHeight() {
    return this.rows * this.tileHeight;
  },
};

const getAbsolutePosition = (
  chunkCol: number,
  chunkRow: number,
  offsetX: number,
  offsetY: number,
) => ({
  absoluteX: chunkCol * MAP_CONFIG.tileWidth + offsetX,
  absoluteY: chunkRow * MAP_CONFIG.tileHeight + offsetY,
});

export interface BossMapPosition {
  bossId: string;
  absoluteX: number;
  absoluteY: number;
}

// bossId matches Boss.id in @/lib/boss-data. Only bosses with a known
// spawn location on the map chunks are listed here.
export const bossPositions: BossMapPosition[] = [
  { bossId: "boss-13", ...getAbsolutePosition(2, 1, 150, 100) }, // Baium
  { bossId: "boss-10", ...getAbsolutePosition(1, 5, 50, 200) }, // Queen Ant
  { bossId: "boss-11", ...getAbsolutePosition(4, 8, 250, 120) }, // Zaken
];

export function getBossMapPosition(bossId: string) {
  return bossPositions.find((p) => p.bossId === bossId);
}
