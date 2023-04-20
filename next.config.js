/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
    ],
  },
  // experimental: {
  //   largePageDataBytes: 128 * 1000000
  // }
  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, child_process: false };

    return config;
  },
};

module.exports = nextConfig;
