import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*source.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*cdn-crm.adscrush.com.stevensmith.a2hosted.com*",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*cdn-crm.adscrush.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
