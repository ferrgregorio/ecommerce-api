import { z } from 'zod';

export const itemPedidoSchema = z.object({
  produtoId: z.string().uuid('produtoId deve ser um UUID válido'),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
});

export const criarPedidoSchema = z.object({
  enderecoId: z.string().uuid('enderecoId deve ser um UUID válido'),
  itens: z.array(itemPedidoSchema).min(1, 'O pedido deve ter ao menos um item'),
});

export const atualizarStatusPedidoSchema = z.object({
  status: z.enum(['PENDENTE', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']),
});

export type CriarPedidoInput = z.infer<typeof criarPedidoSchema>;
export type AtualizarStatusPedidoInput = z.infer<typeof atualizarStatusPedidoSchema>;
