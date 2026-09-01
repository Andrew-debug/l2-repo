import type { Metadata } from "next";
import { Inter, Marcellus } from "next/font/google";
// import { Analytics } from '@vercel/analytics/next'
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";

const marcellus = Marcellus({
  subsets: ["latin"],
  variable: "--font-marcellus",
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Its own internal name is "fs Tahoma 8px" — a vector trace of the client's
// bitmap font, pixel-aligned at 8px (or clean multiples: 16/24/32px). Not
// wired up as the body font yet — see the font-check block in page.tsx.
const fsTahoma8px = localFont({
  src: "../../public/fonts/fs-tahoma-8px.otf",
  variable: "--font-fs-tahoma-8px",
});

export const metadata: Metadata = {
  title: "L2 Boss Tracker - Lineage 2 Raid Boss Map",
  description:
    "Track and locate Lineage 2 raid bosses, filter by level and item drops",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${marcellus.variable} ${fsTahoma8px.variable} font-sans antialiased`}
      >
        {children}
        {/* <Analytics /> */}
        <Toaster />
      </body>
    </html>
  );
}
