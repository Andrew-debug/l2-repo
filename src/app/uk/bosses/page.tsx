import type { Metadata } from "next";
import { LocalizedBossIndex } from "@/components/localized-boss-index";

const title = "Боси L2: повний список рейдових та епічних босів Lineage 2";
const description =
  "Повний список босів Lineage 2 і L2 для хроніки Interlude: рівні, HP, місця появи, таймери відродження та таблиці дропу.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/uk/bosses",
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
    url: "/uk/bosses",
    type: "website",
    locale: "uk_UA",
  },
};

export default function UkrainianBossesPage() {
  return <LocalizedBossIndex locale="uk" />;
}
