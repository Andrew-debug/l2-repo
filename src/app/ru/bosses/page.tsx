import type { Metadata } from "next";
import { LocalizedBossIndex } from "@/components/localized-boss-index";

const title = "Боссы L2: полный список рейдовых и эпических боссов Lineage 2";
const description =
  "Полный список боссов Lineage 2 и L2 для хроники Interlude: уровни, HP, места появления, таймеры респауна и таблицы дропа.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/ru/bosses",
    languages: {
      en: "/bosses",
      ru: "/ru/bosses",
      uk: "/uk/bosses",
      "x-default": "/bosses",
    },
  },
  openGraph: {
    title,
    description,
    url: "/ru/bosses",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RussianBossesPage() {
  return <LocalizedBossIndex locale="ru" />;
}
