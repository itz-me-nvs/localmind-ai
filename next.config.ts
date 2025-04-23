import type { NextConfig } from "next";
import removeImport from "next-remove-imports";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  experimental: {esmExternals: true},
  images: {
    remotePatterns: [
     {
      protocol: 'https',
      hostname: 'picsum.photos',
      port: '',
      pathname: '/**'
     }
    ]
  }
};

export default removeImport()(nextConfig);
