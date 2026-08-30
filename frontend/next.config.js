/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: process.env.PORT === '3005' ? '.next-3005' : '.next',
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
