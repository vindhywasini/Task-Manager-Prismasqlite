import express from 'express';
import prisma from '../prismaClient';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Create task
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ title: z.string().min(1), description: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  try {
    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        ownerId: req.user.id
      }
    });
    return res.status(201).json(task);
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// List tasks with pagination, filtering, searching
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const page = Math.max(1, parseInt((req.query.page as string) || '1'));
  const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '10')));
  const search = (req.query.search as string) || '';
  const status = (req.query.status as string) || '';
  const where: any = { ownerId: req.user.id };
  if(search) where.title = { contains: search, mode: 'insensitive' };
  if(status === 'completed') where.completed = true;
  if(status === 'pending') where.completed = false;
  try {
    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: (page-1)*limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);
    return res.json({ items, page, limit, total });
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get a single task
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if(!id) return res.status(400).json({ error: 'Invalid id' });
  const task = await prisma.task.findUnique({ where: { id }});
  if(!task || task.ownerId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  return res.json(task);
});

// Update task
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if(!id) return res.status(400).json({ error: 'Invalid id' });
  const schema = z.object({ title: z.string().min(1).optional(), description: z.string().optional(), completed: z.boolean().optional() });
  const parsed = schema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  try {
    const existing = await prisma.task.findUnique({ where: { id }});
    if(!existing || existing.ownerId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.task.update({
      where: { id },
      data: parsed.data
    });
    return res.json(updated);
  } catch(e){
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if(!id) return res.status(400).json({ error: 'Invalid id' });
  const existing = await prisma.task.findUnique({ where: { id }});
  if(!existing || existing.ownerId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  await prisma.task.delete({ where: { id }});
  return res.json({ ok: true });
});

// Toggle
router.post('/:id/toggle', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if(!id) return res.status(400).json({ error: 'Invalid id' });
  const existing = await prisma.task.findUnique({ where: { id }});
  if(!existing || existing.ownerId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.task.update({ where: { id }, data: { completed: !existing.completed }});
  return res.json(updated);
});

export default router;
