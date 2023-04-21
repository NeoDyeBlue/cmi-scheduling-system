const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});

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

module.exports = withPWA(nextConfig);
