/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY
  }
}

module.exports = nextConfig
