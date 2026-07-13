import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ErroApi } from '../utils/ErroApi';

// Middleware genérico de validação de body usando schemas Zod.
// Uso: router.post('/produtos', validar(criarProdutoSchema), controller)

export function validar(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const mensagens = resultado.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(' | ');
      throw new ErroApi(400, `Dados inválidos — ${mensagens}`);
    }

    req.body = resultado.data;
    next();
  };
}
