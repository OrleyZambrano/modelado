/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Deshabilitar SSR para Azure Static Web Apps
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
