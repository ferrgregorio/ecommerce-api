// Estende o tipo Request do Express para incluir os dados do cliente autenticado,
// preenchidos pelo middleware de autenticação após validar o token JWT

export interface PayloadToken {
  clienteId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      cliente?: PayloadToken;
    }
  }
}

export {};
