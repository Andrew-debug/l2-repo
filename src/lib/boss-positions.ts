export const MAP_CONFIG = {
  cols: 6,
  rows: 10,
  tileWidth: 302,
  tileHeight: 262,
  // Matches KonvaMapViewer's initial scale (0.5) — if these don't match,
  // the first zoom-out snaps the scale to minZoom, a visible jump.
  minZoom: 0.5,
  maxZoom: 1,
  get totalWidth() {
    return this.cols * this.tileWidth;
  },
  get totalHeight() {
    return this.rows * this.tileHeight;
  },
};

export interface BossMapPosition {
  bossId: string;
  absoluteX: number;
  absoluteY: number;
}
