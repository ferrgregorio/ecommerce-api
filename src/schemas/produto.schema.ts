import { z } from 'zod';

export const criarProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  descricao: z.string().optional(),
  preco: z.number().positive('Preço deve ser maior que zero'),
  estoqueAtual: z.number().int().nonnegative('Estoque não pode ser negativo').default(0),
  categoriaId: z.string().uuid('categoriaId deve ser um UUID válido'),
  fornecedorId: z.string().uuid('fornecedorId deve ser um UUID válido'),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial();

export type CriarProdutoInput = z.infer<typeof criarProdutoSchema>;
export type AtualizarProdutoInput = z.infer<typeof atualizarProdutoSchema>;
