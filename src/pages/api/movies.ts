import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Obtener todas las películas con sus tickets
    const movies = await prisma.movie.findMany({ include: { tickets: true } });
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
}
