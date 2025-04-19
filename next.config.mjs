/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 确保样式被正确处理
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
