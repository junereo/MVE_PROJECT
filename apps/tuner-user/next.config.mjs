// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "example.com",
      "yt3.ggpht.com",
      "i.ytimg.com",
      "img.youtube.com",
      "www.youtube.com",
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
