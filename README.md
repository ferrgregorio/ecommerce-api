# E-commerce API

API REST completa para gestão de pedidos de e-commerce, construída com foco em boas práticas de arquitetura, documentação e testes automatizados.

**[Documentação interativa (Swagger)](#)** — substitua pelo link após o deploy

## Sobre o projeto

Esta API modela o fluxo real de um e-commerce: clientes se cadastram, navegam pelo catálogo de produtos, criam pedidos com múltiplos itens, e o sistema controla estoque e pagamento de forma consistente.

O objetivo do projeto é demonstrar competências que vão além de um CRUD básico:

- **Documentação Swagger/OpenAPI** completa e testável diretamente no navegador
- **Transações atômicas** no fluxo de criação de pedido (estoque, preço congelado e movimentação são tudo-ou-nada)
- **Autenticação JWT** com senha hasheada via bcrypt
- **Validação de dados** em todas as rotas com Zod
- **Testes automatizados** de integração cobrindo os fluxos principais
- **Modelo de dados relacional** com 9 entidades e relacionamentos reais (1:N, N:N via tabela de junção, 1:1)

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20 |
| Linguagem | TypeScript |
| Framework | Express |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Documentação | Swagger (OpenAPI 3.0) |
| Autenticação | JWT + bcrypt |
| Validação | Zod |
| Testes | Jest + Supertest |
| Containerização | Docker + Docker Compose |

## Modelo de dados

```
Cliente ──┬── Endereço
          └── Pedido ──┬── ItemPedido ── Produto ──┬── Categoria
                        └── Pagamento               ├── Fornecedor
                                                     └── EstoqueMovimento
```

Decisões de design relevantes:

- **Preço congelado**: o preço unitário é copiado para `ItemPedido` no momento da compra, então alterações futuras no preço do produto não afetam pedidos já feitos.
- **Soft delete em produtos**: produtos "removidos" são marcados como inativos (`ativo: false`), preservando a integridade referencial com pedidos antigos.
- **Movimentação de estoque auditável**: toda saída de estoque gera um registro em `EstoqueMovimento`, criando um histórico rastreável.

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Docker (para o PostgreSQL) ou uma instância PostgreSQL própria

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/ferrgregorio/ecommerce-api.git
cd ecommerce-api

# 2. Instale as dependências
npm install

# 3. Gere o cliente Prisma (obrigatório antes de rodar ou compilar)
npm run prisma:generate

# 4. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com suas credenciais, especialmente DATABASE_URL e JWT_SECRET

# 5. Suba o banco de dados local via Docker
docker compose up -d

# 6. Rode as migrações do Prisma
npm run prisma:migrate

# 7. (Opcional) Popule o banco com dados de exemplo
npm run prisma:seed

# 8. Inicie o servidor em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api-docs`.

### Rodando os testes

```bash
npm test
```

Os testes usam o mesmo banco configurado no `.env` — recomenda-se um banco de teste separado em ambientes de CI.

## Principais endpoints

| Método | Rota | Descrição | Autenticado |
|---|---|---|---|
| POST | `/auth/registrar` | Cria uma conta de cliente | Não |
| POST | `/auth/login` | Autentica e retorna token JWT | Não |
| GET | `/produtos` | Lista produtos (paginado, com filtros) | Não |
| GET | `/produtos/:id` | Detalhes de um produto | Não |
| POST | `/produtos` | Cadastra um produto | Sim |
| PUT | `/produtos/:id` | Atualiza um produto | Sim |
| DELETE | `/produtos/:id` | Remove um produto (soft delete) | Sim |
| POST | `/pedidos` | Cria um pedido (valida estoque, congela preços) | Sim |
| GET | `/pedidos` | Lista pedidos do cliente autenticado | Sim |
| GET | `/pedidos/:id` | Detalhes de um pedido | Sim |
| PATCH | `/pedidos/:id/status` | Atualiza o status do pedido | Sim |

A lista completa, com exemplos de request/response, está na documentação Swagger.

## Estrutura do projeto

```
src/
├── config/         # Configuração do Prisma e Swagger
├── controllers/    # Camada fina que recebe request/response
├── services/       # Lógica de negócio
├── schemas/        # Validação de entrada com Zod
├── middlewares/     # Autenticação, validação e tratamento de erros
├── routes/         # Definição de rotas + documentação Swagger
├── utils/          # Funções utilitárias (JWT, hash de senha, erros)
├── tests/          # Testes de integração
├── app.ts          # Configuração do Express
└── server.ts       # Ponto de entrada
prisma/
├── schema.prisma   # Modelo de dados
└── seed.ts         # Dados de exemplo
```

## Autor

**Fernando Gregório**
Desenvolvedor Backend e Full Stack

- GitHub: [github.com/ferrgregorio](https://github.com/ferrgregorio)
- LinkedIn: [linkedin.com/in/fernando-oliveira-gregório](https://www.linkedin.com/in/fernando-oliveira-greg%C3%B3rio-0837732b5/)
- Portfólio: [fergregorio-dev.vercel.app](https://fergregorio-dev.vercel.app)

## Licença

MIT
