import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt';
import { ErroApi } from '../utils/ErroApi';

// Middleware que protege rotas exigindo um token JWT válido no header Authorization.
// Uso: router.post('/rota-protegida', autenticar, controller)

export function autenticar(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ErroApi(401, 'Token de autenticação não informado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verificarToken(token);
    req.cliente = payload;
    next();
  } catch {
    throw new ErroApi(401, 'Token inválido ou expirado');
  }
}
