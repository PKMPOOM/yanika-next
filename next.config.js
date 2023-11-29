const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["kgjimzdelnpigevgscbx.supabase.co"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = withPWA(nextConfig);
