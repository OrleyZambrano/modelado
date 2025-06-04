import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Obtener todos los tickets
    const tickets = await prisma.ticket.findMany();
    res.status(200).json(tickets);
  } else if (req.method === 'POST') {
    const { seat, buyer, movie_id } = req.body;
    if (!seat || !buyer || !movie_id) return res.status(400).json({ error: 'Faltan datos' });
    const ticket = await prisma.ticket.create({ data: { seat, buyer, movie_id: Number(movie_id) } });
    res.status(201).json(ticket);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Falta id' });
    await prisma.ticket.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
