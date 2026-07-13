import swaggerJsdoc from 'swagger-jsdoc';

// Configuração central do Swagger — gera a documentação interativa em /api-docs
// a partir dos comentários JSDoc espalhados nos arquivos de rotas

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description:
        'API REST para gestão de pedidos de e-commerce: clientes, produtos, pedidos, pagamentos e controle de estoque. ' +
        'Construída com Node.js, Express, TypeScript, Prisma e PostgreSQL.',
      contact: {
        name: 'Fernando Gregório',
        url: 'https://github.com/ferrgregorio',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /auth/login',
        },
      },
      schemas: {
        Erro: {
          type: 'object',
          properties: {
            mensagem: { type: 'string', example: 'Recurso não encontrado' },
          },
        },
      },
    },
    tags: [
      { name: 'Autenticação', description: 'Login e registro de clientes' },
      { name: 'Clientes', description: 'Gestão de dados do cliente' },
      { name: 'Produtos', description: 'Catálogo de produtos' },
      { name: 'Categorias', description: 'Categorias de produtos' },
      { name: 'Pedidos', description: 'Ciclo de vida do pedido' },
      { name: 'Pagamentos', description: 'Processamento de pagamentos' },
    ],
  },
  apis: [
    process.env.NODE_ENV === 'production'
      ? './dist/routes/*.js'
      : './src/routes/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
