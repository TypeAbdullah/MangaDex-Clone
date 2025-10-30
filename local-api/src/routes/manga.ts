import express from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
export const mangaRouter = express.Router();

mangaRouter.get('/', async (req, res) => {
  const list = await prisma.manga.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  res.json(list);
});

mangaRouter.post('/', requireAuth, async (req, res) => {
  const { title, description, genres, coverUrl, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const m = await prisma.manga.create({ data: {
    title, description, genres: genres || [], coverUrl: coverUrl || '', status: status || 'ongoing', createdBy: req.user.id
  }});
  res.json(m);
});

mangaRouter.get('/:id', async (req, res) => {
  const m = await prisma.manga.findUnique({ where: { id: req.params.id } });
  if (!m) return res.status(404).json({ error: 'Not found' });
  res.json(m);
});

mangaRouter.get('/:id/chapters', async (req, res) => {
  const ch = await prisma.chapter.findMany({ where: { mangaId: req.params.id }, orderBy: { createdAt: 'desc' } });
  res.json(ch);
});

mangaRouter.post('/:id/chapters', requireAuth, async (req, res) => {
  const { volume, chapterNumber, title, language, pages } = req.body;
  if (!chapterNumber || !pages) return res.status(400).json({ error: 'Missing fields' });
  const created = await prisma.chapter.create({ data: {
    mangaId: req.params.id, volume: volume || null, chapterNumber: parseFloat(chapterNumber), title: title || '', language: language || 'en', pages: pages, uploaderId: req.user.id, published: true
  }});
  res.json(created);
});
