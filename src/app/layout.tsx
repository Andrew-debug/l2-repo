import type { Metadata } from "next";
import { Marcellus } from "next/font/google";
// import { Analytics } from '@vercel/analytics/next'
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";

const marcellus = Marcellus({
  subsets: ["latin"],
  variable: "--font-marcellus",
  weight: ["400"],
});

// Its own internal name is "fs Tahoma 8px" — a vector trace of the client's
// bitmap font, pixel-aligned at 8px (or clean multiples: 16/24/32px). Wired
// up as the actual body font via globals.css' plain `body { font-family:
// var(--font-fs-tahoma-8px), ... }` rule (see there) — deliberately NOT via
// a `font-fs-tahoma-8px` Tailwind utility class on <body>, since a Tailwind
// utility lives in the `utilities` cascade layer, which always outranks the
// plain `body` selector's `base` layer regardless of selector specificity.
// (This is exactly the bug that used to silently break this rule: <body>
// carried both this rule *and* the `font-sans` utility class, and the
// utility layer's `font-family: var(--font-sans)` — resolving to Inter —
// always won, so the pixel font was never actually painted anywhere despite
// the CSS looking correct. Removed `font-sans` and the Inter import
// entirely once found — nothing else in the app used either.)
const fsTahoma8px = localFont({
  src: "../../public/fonts/fs-tahoma-8px.otf",
  variable: "--font-fs-tahoma-8px",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://l2bosstracker.com"),
  title: {
    default:
      "L2 Boss Tracker — Lineage 2 Raid Boss Map, Spawn Locations & Drop Lists",
    template: "%s | L2 Boss Tracker",
  },
  description:
    "Interactive Lineage 2 raid boss map with live spawn/respawn timers, level and item-drop filters, and full drop tables for every raid boss and epic boss (Queen Ant, Orfen, Zaken, Baium, Valakas, Antharas, Core, Frintezza) in the Interlude chronicle.",
  keywords: [
    "l2 bosses",
    "lineage 2 raid boss",
    "lineage 2 boss map",
    "l2 raid boss locations",
    "l2 boss drop list",
    "l2 epic boss",
    "lineage 2 interlude bosses",
    "l2 boss respawn timer",
  ],
  applicationName: "L2 Boss Tracker",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "L2 Boss Tracker",
    title: "L2 Boss Tracker — Lineage 2 Raid Boss Map, Spawn Locations & Drop Lists",
    description:
      "Interactive map of every Lineage 2 raid boss and epic boss, with live respawn timers and full drop tables.",
  },
  twitter: {
    card: "summary_large_image",
    title: "L2 Boss Tracker — Lineage 2 Raid Boss Map",
    description:
      "Interactive map of every Lineage 2 raid boss and epic boss, with live respawn timers and full drop tables.",
  },
  robots: { index: true, follow: true },
  // No `icon`/`shortcut` entries here on purpose, and favicon.ico lives in
  // public/ (a plain static file) rather than src/app/ (Next's auto-linked
  // icon convention) — BossRespawnProvider's favicon badge is the sole
  // owner of the tab's <link rel="icon">, created and replaced entirely by
  // its own effect. Letting Next's metadata/file-convention system also
  // render one was the actual cause of a Fast Refresh crash: that link is
  // React-managed, and BossRespawnProvider used to forcibly remove it via
  // raw DOM calls to avoid browsers arbitrating between two different
  // rel="icon" links — which left React holding a reference to a node
  // that no longer had a parent, so the next reconciliation's removeChild
  // call threw. `apple` is left as metadata since nothing else touches it.
  icons: {
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "L2 Boss Tracker",
  url: "https://l2bosstracker.com",
  description:
    "Interactive Lineage 2 raid boss map with live spawn/respawn timers, level and item-drop filters, and full drop tables for every raid boss and epic boss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${marcellus.variable} ${fsTahoma8px.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        {/* <Analytics /> */}
        <Toaster />
      </body>
    </html>
  );
}
