import { Request, Response } from 'express';
import * as produtoService from '../services/produto.service';

export async function listar(req: Request, res: Response): Promise<void> {
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  const categoriaId = req.query.categoriaId as string | undefined;
  const busca = req.query.busca as string | undefined;

  const resultado = await produtoService.listarProdutos({ pagina, limite, categoriaId, busca });
  res.status(200).json(resultado);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  const produto = await produtoService.buscarProdutoPorId(req.params.id);
  res.status(200).json(produto);
}

export async function criar(req: Request, res: Response): Promise<void> {
  const produto = await produtoService.criarProduto(req.body);
  res.status(201).json(produto);
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  const produto = await produtoService.atualizarProduto(req.params.id, req.body);
  res.status(200).json(produto);
}

export async function remover(req: Request, res: Response): Promise<void> {
  await produtoService.removerProduto(req.params.id);
  res.status(204).send();
}
