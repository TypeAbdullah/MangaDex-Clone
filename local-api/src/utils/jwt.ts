import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET = process.env.JWT_SECRET || 'secret';

export function signJwt(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}
