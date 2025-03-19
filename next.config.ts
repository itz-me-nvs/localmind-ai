import type { NextConfig } from "next";
import removeImport from "next-remove-imports"

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {esmExternals: true}
 
};

export default removeImport()(nextConfig);
