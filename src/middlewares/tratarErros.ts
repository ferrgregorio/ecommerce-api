import { Request, Response, NextFunction } from 'express';
import { ErroApi } from '../utils/ErroApi';

// Middleware central de erros — precisa ser o ÚLTIMO middleware registrado no server.ts.
// Captura qualquer erro lançado (throw) em controllers/services e formata uma
// resposta JSON consistente, evitando vazar stack traces em produção.

export function tratarErros(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ErroApi) {
    res.status(err.statusCode).json({ mensagem: err.message });
    return;
  }

  console.error('Erro não tratado:', err);
  res.status(500).json({ mensagem: 'Erro interno do servidor' });
}

// Wrapper para rotas assíncronas — evita precisar de try/catch em cada controller.
// O Express não captura rejeições de Promise automaticamente antes da v5,
// então esse wrapper repassa o erro para o middleware de erro central.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
