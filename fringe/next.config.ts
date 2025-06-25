import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { dev }) => {
        // Only generate source maps in development
        if (!dev) {
            config.devtool = false;
        }

        return config;
    },
    // Disable ESLint during production builds
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;