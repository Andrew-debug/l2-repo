import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { bosses, getBossBySlug } from "@/lib/boss-data";
import { itemIcons } from "@/lib/item-icons";

export function generateStaticParams() {
  return bosses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const boss = getBossBySlug(slug);
  if (!boss) return {};

  const topDrops = boss.drops
    .slice(0, 3)
    .map((d) => d.item)
    .join(", ");
  const kind = boss.npcType === "EpicBoss" ? "Epic Boss" : "Raid Boss";
  const title = `${boss.name} — Lv${boss.level} Lineage 2 ${kind}: Location, Stats & Drops`;
  const description = `${boss.name} is a level ${boss.level} Lineage 2 ${kind} (${boss.race}).${
    topDrops ? ` Drops: ${topDrops}.` : ""
  } Full stats and drop chances inside.`;

  return {
    title,
    description,
    alternates: { canonical: `/bosses/${boss.slug}` },
    openGraph: {
      title,
      description,
      url: `/bosses/${boss.slug}`,
      type: "article",
    },
  };
}

export default async function BossPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const boss = getBossBySlug(slug);
  if (!boss) notFound();

  const kind = boss.npcType === "EpicBoss" ? "Epic Boss" : "Raid Boss";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://l2bosstracker.com/" },
      { "@type": "ListItem", position: 2, name: "Bosses", item: "https://l2bosstracker.com/bosses" },
      {
        "@type": "ListItem",
        position: 3,
        name: boss.name,
        item: `https://l2bosstracker.com/bosses/${boss.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-6 text-[13px] text-foreground/70">
          <Link href="/" className="text-system-text hover:underline">
            Map
          </Link>
          {" / "}
          <Link href="/bosses" className="text-system-text hover:underline">
            Bosses
          </Link>
          {" / "}
          <span>{boss.name}</span>
        </p>

        <h1 className="font-marcellus text-[26px] leading-tight text-system-text">
          {boss.name}
        </h1>
        <p className="mt-1 text-[14px] text-foreground/60">
          Level {boss.level} {boss.race} · Lineage 2 {kind}
          {boss.synonyms?.length ? (
            <> · also known as {boss.synonyms.join(", ")}</>
          ) : null}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[14px] sm:grid-cols-4">
          <div>
            <dt className="text-foreground/50">HP</dt>
            <dd>{boss.hp.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">MP</dt>
            <dd>{boss.mp.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">EXP</dt>
            <dd>{boss.exp.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">SP</dt>
            <dd>{boss.sp.toLocaleString()}</dd>
          </div>
          {boss.weakness && (
            <div>
              <dt className="text-foreground/50">Weakness</dt>
              <dd>{boss.weakness}</dd>
            </div>
          )}
        </dl>

        {boss.description && (
          <p className="mt-6 text-[14px] leading-relaxed text-foreground/85">
            {boss.description}
          </p>
        )}

        {boss.routeVideoUrl && (
          <p className="mt-4 text-[14px]">
            <a
              href={boss.routeVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-button-text hover:underline"
            >
              Watch: route to {boss.name}&apos;s lair
            </a>
          </p>
        )}

        <h2 className="mt-10 font-marcellus text-[20px] text-system-text">
          {boss.name} Drop List
        </h2>
        {boss.drops.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-border text-left text-foreground/60">
                  <th className="py-1.5 pr-4 font-normal">Item</th>
                  <th className="py-1.5 pr-4 font-normal">Chance</th>
                  <th className="py-1.5 pr-4 font-normal">Count</th>
                </tr>
              </thead>
              <tbody>
                {boss.drops.map((d, i) => {
                  const icon = itemIcons[d.item];
                  return (
                    <tr key={i} className="border-b border-border/40">
                      <td className="flex items-center gap-2 py-1.5 pr-4">
                        {icon && (
                          <Image
                            src={icon}
                            alt=""
                            width={20}
                            height={20}
                            className="shrink-0"
                          />
                        )}
                        {d.item}
                      </td>
                      <td className="py-1.5 pr-4 text-foreground/80">
                        {d.chance}
                      </td>
                      <td className="py-1.5 pr-4 text-foreground/80">
                        {d.count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-[14px] text-foreground/60">
            No recorded drops for {boss.name} yet.
          </p>
        )}

        <p className="mt-10 text-[13px]">
          <Link href="/bosses" className="text-system-text hover:underline">
            &larr; Back to the full boss list
          </Link>
        </p>
      </div>
    </div>
  );
}
