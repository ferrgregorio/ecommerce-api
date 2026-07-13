import { Router } from 'express';
import * as autenticacaoController from '../controllers/autenticacao.controller';
import { validar } from '../middlewares/validar';
import { asyncHandler } from '../middlewares/tratarErros';
import { registrarClienteSchema, loginSchema } from '../schemas/autenticacao.schema';

const router = Router();

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Cria uma nova conta de cliente
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Fernando Gregório
 *               email:
 *                 type: string
 *                 example: fernando@email.com
 *               senha:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso, retorna o token JWT
 *       409:
 *         description: Já existe um cliente com esse e-mail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/registrar', validar(registrarClienteSchema), asyncHandler(autenticacaoController.registrar));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um cliente e retorna o token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: fernando@email.com
 *               senha:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: E-mail ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/login', validar(loginSchema), asyncHandler(autenticacaoController.login));

export default router;
