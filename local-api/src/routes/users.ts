import express from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthedRequest } from '../middleware/auth';
export const userRouter = express.Router();

userRouter.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const id = req.user.id;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl });
});
