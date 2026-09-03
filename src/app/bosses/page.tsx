import type { Metadata } from "next";
import Link from "next/link";
import { bosses, levelRanges } from "@/lib/boss-data";

export const metadata: Metadata = {
  title: "L2 Bosses & Lineage 2 Raid Boss List — Locations, Levels, Drops",
  description:
    "Find every L2 boss and Lineage 2 raid boss in the Interlude chronicle: levels, HP, spawn locations, respawn information and complete drop tables for raid and epic bosses.",
  alternates: {
    canonical: "/bosses",
    languages: {
      en: "/bosses",
      ru: "/ru/bosses",
      uk: "/uk/bosses",
      "x-default": "/bosses",
    },
  },
  openGraph: {
    title: "L2 Bosses & Lineage 2 Raid Boss List",
    description:
      "Every L2 raid boss and epic boss with level, HP, spawn location and full drop table.",
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
    .map((name) =>
      bosses.find((b) => b.npcType === "EpicBoss" && b.name === name),
    )
    .filter((b): b is (typeof bosses)[number] => Boolean(b));

  const raidBossesByRange = levelRanges.map((range) => ({
    range,
    list: bosses
      .filter(
        (b) =>
          b.npcType !== "EpicBoss" &&
          b.level >= range.min &&
          b.level <= range.max,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://l2bosstracker.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "L2 Bosses",
        item: "https://l2bosstracker.com/bosses",
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-6 text-[13px]">
          <Link href="/" className="text-system-text hover:underline">
            &larr; Back to the interactive boss map
          </Link>
        </p>

        <h1 className="font-marcellus text-[28px] leading-tight text-system-text">
          L2 Bosses: Full Lineage 2 Raid &amp; Epic Boss List
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
          A complete list of every L2 raid boss and epic boss in the Interlude
          chronicle of Lineage 2, with level, HP, spawn location and a full drop
          table for each. Click any boss below for its detailed page, or use the{" "}
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
            The eight world bosses — the toughest, most contested spawns in the
            game.
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
                  {/* table-fixed + explicit widths so a long boss name
                      wraps instead of forcing horizontal scroll on
                      mobile — see the per-boss drop table's own comment
                      on the same tradeoff. */}
                  <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px]">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground/60">
                        <th className="w-[40%] py-1.5 pr-2 font-normal">
                          Boss
                        </th>
                        <th className="w-[15%] py-1.5 pr-2 font-normal">
                          Level
                        </th>
                        <th className="w-[25%] py-1.5 pr-2 font-normal">
                          Race
                        </th>
                        <th className="w-[20%] py-1.5 font-normal">HP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((b) => (
                        <tr key={b.id} className="border-b border-border/40">
                          <td className="py-1.5 pr-2">
                            <Link
                              href={`/bosses/${b.slug}`}
                              className="text-button-text hover:underline"
                            >
                              {b.name}
                            </Link>
                          </td>
                          <td className="py-1.5 pr-2 text-foreground/80">
                            {b.level}
                          </td>
                          <td className="py-1.5 pr-2 text-foreground/80">
                            {b.race}
                          </td>
                          <td className="py-1.5 text-foreground/80">
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
