import type { NextConfig } from "next";

const isSitesExport = process.env.AGENTIC_LAB_SITES_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isSitesExport ? "export" : undefined,
  trailingSlash: isSitesExport,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
