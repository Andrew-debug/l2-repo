import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.106.19.24"],
  images: {
    // Next's optimizer only allows quality values listed here — default is
    // just [75]. 75 stays for every other <Image> in the app (icons, item
    // sprites) that doesn't pass a `quality` prop; 90 is for boss portrait
    // art (see boss-portrait-image.tsx), where re-encoding painterly,
    // already-compressed .webp source art down to 75 was visibly softening
    // it — fine detail/gradients show compression artifacts at 75 that
    // aren't there in the source file.
    qualities: [75, 90],
  },
};

export default nextConfig;
