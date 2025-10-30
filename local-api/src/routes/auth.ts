import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { signJwt } from '../utils/jwt';
export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { username, email, password: hash } });
    const token = signJwt({ id: user.id, username: user.username, role: user.role });
    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt({ id: user.id, username: user.username, role: user.role });
  res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
});
