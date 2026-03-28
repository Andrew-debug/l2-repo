import type { Metadata } from "next";
import { Cinzel, Inter, Marcellus } from "next/font/google";
// import { Analytics } from '@vercel/analytics/next'
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cinzel = Marcellus({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        className={`${cinzel.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
        {/* <Analytics /> */}
        <Toaster />
      </body>
    </html>
  );
}
