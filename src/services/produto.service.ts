import prisma from '../config/prisma';
import { ErroApi } from '../utils/ErroApi';
import { CriarProdutoInput, AtualizarProdutoInput } from '../schemas/produto.schema';

interface FiltrosProduto {
  pagina: number;
  limite: number;
  categoriaId?: string;
  busca?: string;
}

export async function listarProdutos(filtros: FiltrosProduto) {
  const { pagina, limite, categoriaId, busca } = filtros;
  const skip = (pagina - 1) * limite;

  const where = {
    ativo: true,
    ...(categoriaId && { categoriaId }),
    ...(busca && {
      nome: { contains: busca, mode: 'insensitive' as const },
    }),
  };

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      skip,
      take: limite,
      include: { categoria: true, fornecedor: { select: { id: true, nome: true } } },
      orderBy: { criadoEm: 'desc' },
    }),
    prisma.produto.count({ where }),
  ]);

  return {
    produtos,
    paginacao: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
}

export async function buscarProdutoPorId(id: string) {
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { categoria: true, fornecedor: true },
  });

  if (!produto) {
    throw new ErroApi(404, 'Produto não encontrado');
  }

  return produto;
}

export async function criarProduto(dados: CriarProdutoInput) {
  const [categoria, fornecedor] = await Promise.all([
    prisma.categoria.findUnique({ where: { id: dados.categoriaId } }),
    prisma.fornecedor.findUnique({ where: { id: dados.fornecedorId } }),
  ]);

  if (!categoria) throw new ErroApi(404, 'Categoria não encontrada');
  if (!fornecedor) throw new ErroApi(404, 'Fornecedor não encontrado');

  return prisma.produto.create({ data: dados });
}

export async function atualizarProduto(id: string, dados: AtualizarProdutoInput) {
  await buscarProdutoPorId(id);
  return prisma.produto.update({ where: { id }, data: dados });
}

export async function removerProduto(id: string): Promise<void> {
  await buscarProdutoPorId(id);
  // Soft delete — mantém o histórico de pedidos íntegro mesmo após "remoção"
  await prisma.produto.update({ where: { id }, data: { ativo: false } });
}
