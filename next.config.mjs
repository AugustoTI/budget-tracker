import('./src/env.mjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === 'development' },
  },
}

export default nextConfig
