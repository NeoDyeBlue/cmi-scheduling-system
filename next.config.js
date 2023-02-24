/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
  // experimental: {
  //   largePageDataBytes: 128 * 1000000
  // }
};

module.exports = nextConfig;
