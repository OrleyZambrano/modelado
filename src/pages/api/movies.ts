import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient, disconnectPrisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma;
  
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL no configurada' });
    }

    prisma = await getPrismaClient();
    
    if (req.method === 'GET') {
      const movies = await prisma.movie.findMany({ 
        include: { tickets: true }
      });
      res.status(200).json(movies);
    } else if (req.method === 'POST') {
      const { title, genre } = req.body;
      if (!title || !genre) return res.status(400).json({ error: 'Faltan datos' });
      const movie = await prisma.movie.create({ data: { title, genre } });
      res.status(201).json(movie);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Falta id' });
      await prisma.movie.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error en /api/movies:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    // Siempre desconectar en producción
    if (prisma && process.env.NODE_ENV === 'production') {
      await disconnectPrisma(prisma);
    }
  }
}
