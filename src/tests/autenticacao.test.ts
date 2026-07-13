import request from 'supertest';
import app from '../app';
import prisma from '../config/prisma';

// Testes de integração do fluxo de autenticação.
// Usam supertest para simular requisições HTTP reais contra o app Express,
// sem precisar subir um servidor de verdade numa porta.

describe('Autenticação', () => {
  const clienteTeste = {
    nome: 'Cliente Teste',
    email: `teste-${Date.now()}@email.com`,
    senha: 'senha123456',
  };

  afterAll(async () => {
    // Limpa o cliente criado durante os testes para não sujar o banco
    await prisma.cliente.deleteMany({ where: { email: clienteTeste.email } });
    await prisma.$disconnect();
  });

  describe('POST /auth/registrar', () => {
    it('deve criar um novo cliente e retornar um token JWT', async () => {
      const resposta = await request(app).post('/auth/registrar').send(clienteTeste);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('token');
      expect(resposta.body.cliente).toMatchObject({
        nome: clienteTeste.nome,
        email: clienteTeste.email,
      });
      // Garante que a senha em texto puro nunca vaza na resposta
      expect(resposta.body.cliente).not.toHaveProperty('senha');
      expect(resposta.body.cliente).not.toHaveProperty('senhaHash');
    });

    it('deve rejeitar registro com e-mail já existente', async () => {
      const resposta = await request(app).post('/auth/registrar').send(clienteTeste);

      expect(resposta.status).toBe(409);
      expect(resposta.body.mensagem).toMatch(/já existe/i);
    });

    it('deve rejeitar registro com e-mail inválido', async () => {
      const resposta = await request(app)
        .post('/auth/registrar')
        .send({ ...clienteTeste, email: 'nao-e-um-email' });

      expect(resposta.status).toBe(400);
    });

    it('deve rejeitar registro com senha muito curta', async () => {
      const resposta = await request(app)
        .post('/auth/registrar')
        .send({ ...clienteTeste, email: 'outro@email.com', senha: '123' });

      expect(resposta.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('deve autenticar com credenciais corretas e retornar token', async () => {
      const resposta = await request(app).post('/auth/login').send({
        email: clienteTeste.email,
        senha: clienteTeste.senha,
      });

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('token');
    });

    it('deve rejeitar login com senha incorreta', async () => {
      const resposta = await request(app).post('/auth/login').send({
        email: clienteTeste.email,
        senha: 'senhaErrada',
      });

      expect(resposta.status).toBe(401);
    });

    it('deve rejeitar login com e-mail inexistente', async () => {
      const resposta = await request(app).post('/auth/login').send({
        email: 'naoexiste@email.com',
        senha: 'qualquercoisa',
      });

      expect(resposta.status).toBe(401);
    });
  });
});
