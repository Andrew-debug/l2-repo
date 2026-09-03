import Link from "next/link";
import { bosses, levelRanges } from "@/lib/boss-data";

type Locale = "ru" | "uk";

type LocalizedCopy = {
  lang: Locale;
  title: string;
  intro: string;
  epic: string;
  epicIntro: string;
  raid: (label: string) => string;
  boss: string;
  level: string;
  race: string;
  hp: string;
  back: string;
  map: string;
  schemaName: string;
};

const copy: Record<Locale, LocalizedCopy> = {
  ru: {
    lang: "ru",
    title: "Боссы L2: полный список рейдовых и эпических боссов Lineage 2",
    intro:
      "Полный список боссов Lineage 2 и L2 для хроники Interlude: уровни, HP, места появления, таймеры респауна и таблицы дропа. Откройте страницу любого босса, чтобы посмотреть характеристики и награды.",
    epic: "Эпические боссы",
    epicIntro: "Восемь мировых боссов Lineage 2 с подробными таблицами дропа.",
    raid: (label) => `Рейдовые боссы ${label} уровня`,
    boss: "Босс",
    level: "Уровень",
    race: "Раса",
    hp: "HP",
    back: "Интерактивная карта боссов L2",
    map: "Открыть карту с таймерами респауна",
    schemaName: "Боссы Lineage 2: рейдовые и эпические боссы",
  },
  uk: {
    lang: "uk",
    title: "Боси L2: повний список рейдових та епічних босів Lineage 2",
    intro:
      "Повний список босів Lineage 2 і L2 для хроніки Interlude: рівні, HP, місця появи, таймери відродження та таблиці дропу. Відкрийте сторінку будь-якого боса, щоб переглянути характеристики й нагороди.",
    epic: "Епічні боси",
    epicIntro: "Вісім світових босів Lineage 2 з детальними таблицями дропу.",
    raid: (label) => `Рейдові боси ${label} рівня`,
    boss: "Бос",
    level: "Рівень",
    race: "Раса",
    hp: "HP",
    back: "Інтерактивна карта босів L2",
    map: "Відкрити карту з таймерами відродження",
    schemaName: "Боси Lineage 2: рейдові та епічні боси",
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

export function LocalizedBossIndex({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const epicBosses = epicBossOrder
    .map((name) =>
      bosses.find((boss) => boss.npcType === "EpicBoss" && boss.name === name),
    )
    .filter((boss): boss is (typeof bosses)[number] => Boolean(boss));
  const raidBossesByRange = levelRanges.map((range) => ({
    range,
    list: bosses
      .filter(
        (boss) =>
          boss.npcType !== "EpicBoss" &&
          boss.level >= range.min &&
          boss.level <= range.max,
      )
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)),
  }));
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: text.schemaName,
    numberOfItems: bosses.length,
    itemListElement: bosses.map((boss, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: boss.name,
      url: `https://l2bosstracker.com/bosses/${boss.slug}`,
    })),
  };

  return (
    <main lang={text.lang} className="min-h-dvh bg-background text-foreground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-6 text-[13px]">
          <Link href="/" className="text-system-text hover:underline">
            {text.back}
          </Link>
        </p>
        <h1 className="font-marcellus text-[28px] leading-tight text-system-text">
          {text.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
          {text.intro} {text.map}:{" "}
          <Link href="/" className="text-system-text hover:underline">
            {text.back}
          </Link>
          .
        </p>

        <section className="mt-10">
          <h2 className="font-marcellus text-[20px] text-system-text">
            {text.epic}
          </h2>
          <p className="mt-2 text-[14px] text-foreground/80">
            {text.epicIntro}
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {epicBosses.map((boss) => (
              <li key={boss.id}>
                <Link
                  href={`/bosses/${boss.slug}`}
                  className="text-[14px] text-button-text hover:underline"
                >
                  {boss.name}
                </Link>
                <span className="ml-1 text-[12px] text-foreground/50">
                  Lv{boss.level}
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
                  {text.raid(range.label)}
                </h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px]">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground/60">
                        <th className="w-[40%] py-1.5 pr-2 font-normal">
                          {text.boss}
                        </th>
                        <th className="w-[15%] py-1.5 pr-2 font-normal">
                          {text.level}
                        </th>
                        <th className="w-[25%] py-1.5 pr-2 font-normal">
                          {text.race}
                        </th>
                        <th className="w-[20%] py-1.5 font-normal">
                          {text.hp}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((boss) => (
                        <tr key={boss.id} className="border-b border-border/40">
                          <td className="py-1.5 pr-2">
                            <Link
                              href={`/bosses/${boss.slug}`}
                              className="text-button-text hover:underline"
                            >
                              {boss.name}
                            </Link>
                          </td>
                          <td className="py-1.5 pr-2 text-foreground/80">
                            {boss.level}
                          </td>
                          <td className="py-1.5 pr-2 text-foreground/80">
                            {boss.race}
                          </td>
                          <td className="py-1.5 text-foreground/80">
                            {boss.hp.toLocaleString()}
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
    </main>
  );
}
