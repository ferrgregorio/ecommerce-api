import { Router } from 'express';
import * as produtoController from '../controllers/produto.controller';
import { autenticar } from '../middlewares/autenticar';
import { validar } from '../middlewares/validar';
import { asyncHandler } from '../middlewares/tratarErros';
import { criarProdutoSchema, atualizarProdutoSchema } from '../schemas/produto.schema';

const router = Router();

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista produtos do catálogo com paginação e filtros
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: categoriaId
 *         schema: { type: string }
 *         description: Filtra produtos por categoria (UUID)
 *       - in: query
 *         name: busca
 *         schema: { type: string }
 *         description: Busca por nome do produto
 *     responses:
 *       200:
 *         description: Lista paginada de produtos
 */
router.get('/', asyncHandler(produtoController.listar));

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto específico pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/:id', asyncHandler(produtoController.buscarPorId));

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra um novo produto no catálogo
 *     tags: [Produtos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, preco, categoriaId, fornecedorId]
 *             properties:
 *               nome: { type: string, example: "Teclado mecânico" }
 *               descricao: { type: string, example: "Teclado mecânico RGB switch blue" }
 *               preco: { type: number, example: 349.90 }
 *               estoqueAtual: { type: integer, example: 50 }
 *               categoriaId: { type: string, example: "uuid-da-categoria" }
 *               fornecedorId: { type: string, example: "uuid-do-fornecedor" }
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       401:
 *         description: Token de autenticação ausente ou inválido
 */
router.post('/', autenticar, validar(criarProdutoSchema), asyncHandler(produtoController.criar));

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', autenticar, validar(atualizarProdutoSchema), asyncHandler(produtoController.atualizar));

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto (soft delete — mantém histórico de pedidos)
 *     tags: [Produtos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', autenticar, asyncHandler(produtoController.remover));

export default router;
