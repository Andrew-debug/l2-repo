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
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
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
