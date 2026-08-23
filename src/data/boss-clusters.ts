export interface BossCluster {
  id: string;
  // Boss whose map position anchors the collapsed marker.
  anchorBossId: string;
  // Bosses that fly out into a circle around the anchor point on expand.
  memberBossIds: string[];
  // World-space vertical nudge for the whole cluster (collapsed icon and
  // expanded circle alike), relative to the anchor boss's actual map
  // position. Defaults to BossClusterMarkerKonva's DEFAULT_CLUSTER_Y_OFFSET
  // if omitted — override per cluster since the right value depends on
  // what's around that specific spot on the map.
  yOffset?: number;
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
  },
];
