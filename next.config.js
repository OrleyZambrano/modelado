/** @type {import('next').NextConfig} */
const nextConfig = {
  // Solo usar export para Azure, no para Docker
  ...(process.env.AZURE_BUILD ? {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    // Deshabilitar funciones del servidor para Azure
    experimental: {
      appDir: false
    }
  } : {
    output: 'standalone'
  })
}

module.exports = nextConfig
