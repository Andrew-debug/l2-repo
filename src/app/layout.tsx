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
  // A single real icon entry (not the light/dark/svg trio this used to
  // reference — none of those files actually existed, so browsers were
  // silently falling back to src/app/favicon.ico the whole time) — also
  // matters for BossRespawnProvider's favicon badge, which needs exactly
  // one <link rel="icon"> it can take over and redraw, not several for the
  // browser to arbitrate between.
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon.ico",
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
