import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { tratarErros } from './middlewares/tratarErros';

import autenticacaoRoutes from './routes/autenticacao.routes';
import produtoRoutes from './routes/produto.routes';
import pedidoRoutes from './routes/pedido.routes';

const app: Application = express();

// Segurança: headers HTTP seguros + rate limiting básico contra abuso
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { mensagem: 'Muitas requisições — tente novamente em alguns minutos' },
  })
);

app.use(express.json());

// Documentação interativa da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Healthcheck simples — útil para monitoramento e para verificar se o deploy subiu
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/auth', autenticacaoRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ mensagem: `Rota ${req.method} ${req.path} não existe` });
});

// Middleware de erro — deve ser o último a ser registrado
app.use(tratarErros);

export default app;
