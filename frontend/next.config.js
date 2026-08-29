/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: process.env.PORT === '3005' ? '.next-3005' : '.next',
};

module.exports = nextConfig;
