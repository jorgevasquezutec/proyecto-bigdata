/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true, 
  publicRuntimeConfig : {
    APIURL: process.env.API_URL
  }
}

module.exports = nextConfig
