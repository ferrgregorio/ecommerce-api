import jwt, { SignOptions } from 'jsonwebtoken';
import { PayloadToken } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export function gerarToken(payload: PayloadToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verificarToken(token: string): PayloadToken {
  return jwt.verify(token, JWT_SECRET) as PayloadToken;
}
