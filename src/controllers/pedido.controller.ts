import { Request, Response } from 'express';
import * as pedidoService from '../services/pedido.service';
import { ErroApi } from '../utils/ErroApi';

export async function criar(req: Request, res: Response): Promise<void> {
  if (!req.cliente) throw new ErroApi(401, 'Não autenticado');
  const pedido = await pedidoService.criarPedido(req.cliente.clienteId, req.body);
  res.status(201).json(pedido);
}

export async function listarMeusPedidos(req: Request, res: Response): Promise<void> {
  if (!req.cliente) throw new ErroApi(401, 'Não autenticado');
  const pedidos = await pedidoService.listarPedidosDoCliente(req.cliente.clienteId);
  res.status(200).json(pedidos);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  if (!req.cliente) throw new ErroApi(401, 'Não autenticado');
  const pedido = await pedidoService.buscarPedidoPorId(req.params.id, req.cliente.clienteId);
  res.status(200).json(pedido);
}

export async function atualizarStatus(req: Request, res: Response): Promise<void> {
  const pedido = await pedidoService.atualizarStatusPedido(req.params.id, req.body.status);
  res.status(200).json(pedido);
}
