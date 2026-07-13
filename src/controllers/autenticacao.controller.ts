import { Request, Response } from 'express';
import * as autenticacaoService from '../services/autenticacao.service';

export async function registrar(req: Request, res: Response): Promise<void> {
  const resultado = await autenticacaoService.registrarCliente(req.body);
  res.status(201).json(resultado);
}

export async function login(req: Request, res: Response): Promise<void> {
  const resultado = await autenticacaoService.autenticarCliente(req.body);
  res.status(200).json(resultado);
}
