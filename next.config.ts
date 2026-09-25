import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain HTML/CSS/JS site to ./out
  // that can be uploaded to any web host.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
