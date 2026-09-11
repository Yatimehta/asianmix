/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5001/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
