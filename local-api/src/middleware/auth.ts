import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
export interface AuthedRequest extends Request {
  user?: any;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid auth format' });
  const payload = verifyJwt(parts[1]);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  req.user = payload;
  next();
}
