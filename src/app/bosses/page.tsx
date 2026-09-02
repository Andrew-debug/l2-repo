import type { Metadata } from "next";
import Link from "next/link";
import { bosses, levelRanges } from "@/lib/boss-data";

export const metadata: Metadata = {
  title: "L2 Bosses List — All Lineage 2 Raid & Epic Boss Locations, Levels, Drops",
  description:
    "Every Lineage 2 raid boss and epic boss (Queen Ant, Orfen, Zaken, Baium, Valakas, Antharas, Core, Frintezza) with level, HP, spawn location and full drop table. Interlude chronicle.",
  alternates: { canonical: "/bosses" },
  openGraph: {
    title: "L2 Bosses List — Lineage 2 Raid & Epic Boss Directory",
    description:
      "Every Lineage 2 raid boss and epic boss with level, HP, spawn location and full drop table.",
    url: "/bosses",
    type: "website",
  },
};

const epicBossOrder = [
  "Queen Ant",
  "Orfen",
  "Core",
  "Zaken",
  "Baium",
  "Antharas",
  "Valakas",
  "Frintezza",
];

export default function BossesPage() {
  const epicBosses = epicBossOrder
    .map((name) => bosses.find((b) => b.npcType === "EpicBoss" && b.name === name))
    .filter((b): b is (typeof bosses)[number] => Boolean(b));

  const raidBossesByRange = levelRanges.map((range) => ({
    range,
    list: bosses
      .filter(
        (b) =>
          b.npcType !== "EpicBoss" && b.level >= range.min && b.level <= range.max,
      )
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)),
  }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lineage 2 Raid and Epic Bosses",
    itemListElement: bosses.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      url: `https://l2bosstracker.com/bosses/${b.slug}`,
    })),
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-6 text-[13px]">
          <Link href="/" className="text-system-text hover:underline">
            &larr; Back to the interactive boss map
          </Link>
        </p>

        <h1 className="font-marcellus text-[28px] leading-tight text-system-text">
          Lineage 2 Bosses: Full Raid &amp; Epic Boss List
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
          A complete list of every raid boss and epic boss in the Interlude
          chronicle of Lineage 2, with level, HP, spawn location and a full
          drop table for each. Click any boss below for its detailed page, or
          use the{" "}
          <Link href="/" className="text-system-text hover:underline">
            interactive L2 boss map
          </Link>{" "}
          to see live spawn timers and filter drops by item.
        </p>

        <section className="mt-10">
          <h2 className="font-marcellus text-[20px] text-system-text">
            Epic Bosses
          </h2>
          <p className="mt-2 text-[14px] text-foreground/80">
            The eight world bosses — the toughest, most contested spawns in
            the game.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {epicBosses.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/bosses/${b.slug}`}
                  className="text-[14px] text-button-text hover:underline"
                >
                  {b.name}
                </Link>
                <span className="ml-1 text-[12px] text-foreground/50">
                  Lv{b.level}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {raidBossesByRange.map(
          ({ range, list }) =>
            list.length > 0 && (
              <section key={range.label} className="mt-10">
                <h2 className="font-marcellus text-[20px] text-system-text">
                  Level {range.label} Raid Bosses
                </h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-[14px]">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground/60">
                        <th className="py-1.5 pr-4 font-normal">Boss</th>
                        <th className="py-1.5 pr-4 font-normal">Level</th>
                        <th className="py-1.5 pr-4 font-normal">Race</th>
                        <th className="py-1.5 pr-4 font-normal">HP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((b) => (
                        <tr key={b.id} className="border-b border-border/40">
                          <td className="py-1.5 pr-4">
                            <Link
                              href={`/bosses/${b.slug}`}
                              className="text-button-text hover:underline"
                            >
                              {b.name}
                            </Link>
                          </td>
                          <td className="py-1.5 pr-4 text-foreground/80">
                            {b.level}
                          </td>
                          <td className="py-1.5 pr-4 text-foreground/80">
                            {b.race}
                          </td>
                          <td className="py-1.5 pr-4 text-foreground/80">
                            {b.hp.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ),
        )}
      </div>
    </div>
  );
}
