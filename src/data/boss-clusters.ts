export interface BossCluster {
  id: string;
  // Boss whose map position anchors the collapsed marker.
  anchorBossId: string;
  // Bosses that fly out into a circle around the anchor point on expand.
  memberBossIds: string[];
  // An independent (non-orbiting) boss marker that sits fixed at this
  // cluster's center point (anchorX, anchorY + yOffset) — only rendered
  // (see KonvaMapViewer's CENTER_BOSS_IDS/isExpanded handling) while this
  // cluster is expanded, so the collapsed marker always shows just the
  // cluster's own status icon. Selecting this boss (e.g. from the Raid
  // Bosses list) auto-expands this cluster the same way selecting a real
  // member does, even though it's never part of memberBossIds and never
  // orbits. Its own boss-positions.json entry must be kept in sync with
  // this cluster's anchor/yOffset by hand — nothing derives it automatically.
  centerBossId?: string;
  // World-space vertical nudge for the whole cluster (collapsed icon and
  // expanded circle alike), relative to the anchor boss's actual map
  // position. Defaults to BossClusterMarkerKonva's DEFAULT_CLUSTER_Y_OFFSET
  // if omitted — override per cluster since the right value depends on
  // what's around that specific spot on the map.
  yOffset?: number;
  // Overrides the member-count-based default expanded-circle radius (see
  // BossClusterMarkerKonva's CIRCLE_RADIUS_BASE/CIRCLE_RADIUS_PER_EXTRA_MEMBER).
  // Useful for a cluster with a centerBossId marker, so the orbiting members
  // sit further out and don't crowd the fixed center marker.
  radius?: number;
}

export const BOSS_CLUSTERS: BossCluster[] = [
  {
    // "toi" = Tower of Insolence
    id: "toi",
    anchorBossId: "25447", // Immortal Savior Mardil
    memberBossIds: [
      "25444",
      "25092",
      "25447",
      "25220",
      "25054",
      "25143",
      "25450",
      "25126",
    ], // Enmity Ghost Ramdal, Korim, Immortal Savior Mardil, Death Lord Hallate, Kernon, Fire of Wrath Shuriel, Cherub Galaxia, Longhorn Golkonda
    centerBossId: "29020", // Baium — see centerBossId's own comment above
    yOffset: -10,
  },
  {
    id: "disciples",
    anchorBossId: "25286", // Anakim
    memberBossIds: ["25286", "25283"], // Anakim, Lilith
  },
  {
    // "it" = Imperial Tomb
    id: "it",
    anchorBossId: "25346", // Shadow of Halisha (81) (IC)
    memberBossIds: ["25346", "25342", "25339", "25349"], // Shadow of Halisha (81) (IC), Shadow of Halisha (81) (DB), Shadow of Halisha (81) (DS), Shadow of Halisha (81) (MA)
    centerBossId: "29047", // Frintezza — see centerBossId's own comment above
    radius: 35,
  },
];
