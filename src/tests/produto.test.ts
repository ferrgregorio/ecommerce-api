import request from 'supertest';
import app from '../app';
import prisma from '../config/prisma';

describe('Produtos', () => {
  let token: string;
  let categoriaId: string;
  let fornecedorId: string;
  let produtoId: string;

  const emailTeste = `produtos-teste-${Date.now()}@email.com`;

  beforeAll(async () => {
    // Prepara dados de apoio: cliente autenticado, categoria e fornecedor
    const registro = await request(app).post('/auth/registrar').send({
      nome: 'Teste Produtos',
      email: emailTeste,
      senha: 'senha123456',
    });
    token = registro.body.token;

    const categoria = await prisma.categoria.create({
      data: { nome: 'Eletrônicos Teste', slug: `eletronicos-teste-${Date.now()}` },
    });
    categoriaId = categoria.id;

    const fornecedor = await prisma.fornecedor.create({
      data: { nome: 'Fornecedor Teste', cnpj: `${Date.now()}` },
    });
    fornecedorId = fornecedor.id;
  });

  afterAll(async () => {
    await prisma.produto.deleteMany({ where: { fornecedorId } });
    await prisma.fornecedor.delete({ where: { id: fornecedorId } });
    await prisma.categoria.delete({ where: { id: categoriaId } });
    await prisma.cliente.deleteMany({ where: { email: emailTeste } });
    await prisma.$disconnect();
  });

  describe('POST /produtos', () => {
    it('deve criar um produto quando autenticado', async () => {
      const resposta = await request(app)
        .post('/produtos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Teclado mecânico',
          preco: 349.9,
          estoqueAtual: 20,
          categoriaId,
          fornecedorId,
        });

      expect(resposta.status).toBe(201);
      expect(resposta.body.nome).toBe('Teclado mecânico');
      produtoId = resposta.body.id;
    });

    it('deve rejeitar criação sem token de autenticação', async () => {
      const resposta = await request(app).post('/produtos').send({
        nome: 'Produto sem auth',
        preco: 10,
        categoriaId,
        fornecedorId,
      });

      expect(resposta.status).toBe(401);
    });

    it('deve rejeitar preço negativo', async () => {
      const resposta = await request(app)
        .post('/produtos')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Produto inválido', preco: -10, categoriaId, fornecedorId });

      expect(resposta.status).toBe(400);
    });
  });

  describe('GET /produtos', () => {
    it('deve listar produtos com paginação', async () => {
      const resposta = await request(app).get('/produtos?pagina=1&limite=10');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('produtos');
      expect(resposta.body).toHaveProperty('paginacao');
      expect(Array.isArray(resposta.body.produtos)).toBe(true);
    });

    it('deve filtrar produtos por busca de nome', async () => {
      const resposta = await request(app).get('/produtos?busca=Teclado');

      expect(resposta.status).toBe(200);
      expect(resposta.body.produtos.some((p: { nome: string }) => p.nome.includes('Teclado'))).toBe(
        true
      );
    });
  });

  describe('GET /produtos/:id', () => {
    it('deve retornar 404 para produto inexistente', async () => {
      const resposta = await request(app).get('/produtos/00000000-0000-0000-0000-000000000000');
      expect(resposta.status).toBe(404);
    });

    it('deve retornar o produto correto pelo ID', async () => {
      const resposta = await request(app).get(`/produtos/${produtoId}`);
      expect(resposta.status).toBe(200);
      expect(resposta.body.id).toBe(produtoId);
    });
  });
});
