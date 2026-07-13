import { Router } from 'express';
import * as pedidoController from '../controllers/pedido.controller';
import { autenticar } from '../middlewares/autenticar';
import { validar } from '../middlewares/validar';
import { asyncHandler } from '../middlewares/tratarErros';
import { criarPedidoSchema, atualizarStatusPedidoSchema } from '../schemas/pedido.schema';

const router = Router();

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido para o cliente autenticado
 *     description: >
 *       Valida estoque disponível, congela o preço unitário de cada item no
 *       momento da compra, debita o estoque e registra a movimentação —
 *       tudo em uma transação atômica.
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [enderecoId, itens]
 *             properties:
 *               enderecoId: { type: string, example: "uuid-do-endereco" }
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId: { type: string, example: "uuid-do-produto" }
 *                     quantidade: { type: integer, example: 2 }
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       409:
 *         description: Estoque insuficiente para algum item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', autenticar, validar(criarPedidoSchema), asyncHandler(pedidoController.criar));

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos do cliente autenticado
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de pedidos do cliente
 */
router.get('/', autenticar, asyncHandler(pedidoController.listarMeusPedidos));

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido específico do cliente autenticado
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', autenticar, asyncHandler(pedidoController.buscarPorId));

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido (uso administrativo)
 *     tags: [Pedidos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, PAGO, ENVIADO, ENTREGUE, CANCELADO]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch(
  '/:id/status',
  autenticar,
  validar(atualizarStatusPedidoSchema),
  asyncHandler(pedidoController.atualizarStatus)
);

export default router;
