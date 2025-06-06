/** @type {import('next').NextConfig} */
const nextConfig = {
  // Detectar si estamos en Azure o en producción general
  ...(process.env.AZURE_BUILD || process.env.GITHUB_ACTIONS ? {
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
