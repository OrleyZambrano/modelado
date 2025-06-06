import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ error: 'DATABASE_URL no configurada' });
      }
      
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
  } catch (error) {
    console.error('Error en /api/tickets:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
