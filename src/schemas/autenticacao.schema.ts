import { z } from 'zod';

export const registrarClienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type RegistrarClienteInput = z.infer<typeof registrarClienteSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
