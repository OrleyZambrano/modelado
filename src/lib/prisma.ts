import { PrismaClient } from '@prisma/client'

// Configuración específica para evitar problemas de prepared statements
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

// Siempre crear nueva instancia para evitar conflictos
export async function getPrismaClient() {
  const client = createPrismaClient()
  return client
}

// Función para desconectar cliente
export async function disconnectPrisma(client: PrismaClient) {
  try {
    await client.$disconnect()
  } catch (error) {
    // Ignorar errores de desconexión
    console.warn('Warning disconnecting Prisma:', error)
  }
}

// Función helper para ejecutar operaciones con auto-cleanup
export async function withPrisma<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = await getPrismaClient()
  try {
    const result = await operation(prisma)
    return result
  } finally {
    await disconnectPrisma(prisma)
  }
}
