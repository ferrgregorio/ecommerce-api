import prisma from '../config/prisma';
import { ErroApi } from '../utils/ErroApi';
import { CriarPedidoInput } from '../schemas/pedido.schema';
import { Prisma, PrismaClient } from '@prisma/client';

type PrismaTransacao = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// Esta é a lógica de negócio mais rica do projeto: criar um pedido precisa
// validar estoque, congelar o preço unitário no momento da compra, debitar
// o estoque e registrar a movimentação — tudo dentro de uma transação atômica,
// porque se qualquer passo falhar, nada deve ser salvo.

export async function criarPedido(clienteId: string, dados: CriarPedidoInput) {
  return prisma.$transaction(async (tx: PrismaTransacao) => {
    const endereco = await tx.endereco.findFirst({
      where: { id: dados.enderecoId, clienteId },
    });

    if (!endereco) {
      throw new ErroApi(404, 'Endereço não encontrado para este cliente');
    }

    let total = new Prisma.Decimal(0);
    const itensParaCriar: {
      produtoId: string;
      quantidade: number;
      precoUnitario: Prisma.Decimal;
    }[] = [];

    for (const item of dados.itens) {
      const produto = await tx.produto.findUnique({ where: { id: item.produtoId } });

      if (!produto || !produto.ativo) {
        throw new ErroApi(404, `Produto ${item.produtoId} não encontrado`);
      }

      if (produto.estoqueAtual < item.quantidade) {
        throw new ErroApi(
          409,
          `Estoque insuficiente para "${produto.nome}" — disponível: ${produto.estoqueAtual}`
        );
      }

      // Preço é "congelado" aqui — se o produto mudar de preço depois,
      // o histórico do pedido permanece fiel ao valor pago
      total = total.plus(produto.preco.mul(item.quantidade));

      itensParaCriar.push({
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
      });

      await tx.produto.update({
        where: { id: produto.id },
        data: { estoqueAtual: { decrement: item.quantidade } },
      });

      await tx.estoqueMovimento.create({
        data: {
          produtoId: produto.id,
          quantidade: item.quantidade,
          tipo: 'SAIDA',
          motivo: 'Venda — pedido criado',
        },
      });
    }

    const pedido = await tx.pedido.create({
      data: {
        clienteId,
        enderecoId: dados.enderecoId,
        total,
        itens: { create: itensParaCriar },
      },
      include: { itens: { include: { produto: true } }, endereco: true },
    });

    return pedido;
  });
}

export async function listarPedidosDoCliente(clienteId: string) {
  return prisma.pedido.findMany({
    where: { clienteId },
    include: {
      itens: { include: { produto: { select: { nome: true, preco: true } } } },
      pagamento: true,
    },
    orderBy: { criadoEm: 'desc' },
  });
}

export async function buscarPedidoPorId(id: string, clienteId: string) {
  const pedido = await prisma.pedido.findFirst({
    where: { id, clienteId },
    include: {
      itens: { include: { produto: true } },
      endereco: true,
      pagamento: true,
    },
  });

  if (!pedido) {
    throw new ErroApi(404, 'Pedido não encontrado');
  }

  return pedido;
}

export async function atualizarStatusPedido(id: string, status: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    throw new ErroApi(404, 'Pedido não encontrado');
  }

  return prisma.pedido.update({
    where: { id },
    data: { status: status as never },
  });
}
