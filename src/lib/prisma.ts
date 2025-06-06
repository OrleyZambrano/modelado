import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Función para crear cliente Prisma con configuración optimizada para serverless
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
  })
}

// En desarrollo usar singleton, en producción crear nueva instancia
export const prisma = process.env.NODE_ENV === 'production' 
  ? createPrismaClient()
  : (globalThis.__prisma ?? (globalThis.__prisma = createPrismaClient()))

// Función para obtener cliente con reconexión automática
export async function getPrismaClient() {
  // En producción, siempre crear nueva instancia para evitar prepared statements
  if (process.env.NODE_ENV === 'production') {
    const client = createPrismaClient()
    try {
      // Test de conexión
      await client.$queryRaw`SELECT 1`
      return client
    } catch (error) {
      console.error('Error testing connection:', error)
      await client.$disconnect()
      throw error
    }
  }
  
  // En desarrollo usar singleton
  try {
    await prisma.$connect()
    return prisma
  } catch (error) {
    console.error('Error connecting to Prisma:', error)
    await prisma.$disconnect()
    throw error
  }
}

// Función para desconectar cliente
export async function disconnectPrisma(client: PrismaClient) {
  try {
    await client.$disconnect()
  } catch (error) {
    console.error('Error disconnecting Prisma:', error)
  }
}
