import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Popula o banco com dados de exemplo para facilitar testes manuais e
// demonstração da API. Rode com: npm run prisma:seed

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const senhaHash = await bcrypt.hash('senha123456', 10);

  const cliente = await prisma.cliente.create({
    data: {
      nome: 'Fernando Gregório',
      email: 'fernando@exemplo.com',
      senhaHash,
      enderecos: {
        create: {
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          cidade: 'São Paulo',
          estado: 'SP',
          principal: true,
        },
      },
    },
    include: { enderecos: true },
  });

  const categoriaEletronicos = await prisma.categoria.create({
    data: { nome: 'Eletrônicos', slug: 'eletronicos' },
  });

  const categoriaInformatica = await prisma.categoria.create({
    data: { nome: 'Informática', slug: 'informatica' },
  });

  const fornecedor = await prisma.fornecedor.create({
    data: {
      nome: 'TechDistribuidora Ltda',
      cnpj: '12345678000199',
      contato: 'contato@techdistribuidora.com',
    },
  });

  const produtos = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Teclado mecânico RGB',
        descricao: 'Switch blue, retroiluminação RGB, ABNT2',
        preco: 349.9,
        estoqueAtual: 50,
        categoriaId: categoriaInformatica.id,
        fornecedorId: fornecedor.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Mouse gamer sem fio',
        descricao: '16000 DPI, bateria 70h',
        preco: 199.9,
        estoqueAtual: 80,
        categoriaId: categoriaInformatica.id,
        fornecedorId: fornecedor.id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Monitor 27" 144Hz',
        descricao: 'Full HD, painel IPS',
        preco: 1299.0,
        estoqueAtual: 15,
        categoriaId: categoriaEletronicos.id,
        fornecedorId: fornecedor.id,
      },
    }),
  ]);

  console.log('Seed concluído:');
  console.log(`  - Cliente: ${cliente.email} (senha: senha123456)`);
  console.log(`  - Endereço: ${cliente.enderecos[0].id}`);
  console.log(`  - ${produtos.length} produtos criados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
