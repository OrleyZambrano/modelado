/** @type {import('next').NextConfig} */
const nextConfig = {
  // Solo usar export para Azure, no para Docker
  ...(process.env.AZURE_BUILD ? {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  } : {
    output: 'standalone'
  })
}

module.exports = nextConfig
