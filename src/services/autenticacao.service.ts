import prisma from '../config/prisma';
import { ErroApi } from '../utils/ErroApi';
import { gerarHashSenha, verificarSenha } from '../utils/senha';
import { gerarToken } from '../utils/jwt';
import { RegistrarClienteInput, LoginInput } from '../schemas/autenticacao.schema';

export async function registrarCliente(dados: RegistrarClienteInput) {
  const clienteExistente = await prisma.cliente.findUnique({
    where: { email: dados.email },
  });

  if (clienteExistente) {
    throw new ErroApi(409, 'Já existe um cliente cadastrado com este e-mail');
  }

  const senhaHash = await gerarHashSenha(dados.senha);

  const cliente = await prisma.cliente.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senhaHash,
    },
    select: { id: true, nome: true, email: true, criadoEm: true },
  });

  const token = gerarToken({ clienteId: cliente.id, email: cliente.email });

  return { cliente, token };
}

export async function autenticarCliente(dados: LoginInput) {
  const cliente = await prisma.cliente.findUnique({
    where: { email: dados.email },
  });

  if (!cliente) {
    throw new ErroApi(401, 'E-mail ou senha inválidos');
  }

  const senhaValida = await verificarSenha(dados.senha, cliente.senhaHash);

  if (!senhaValida) {
    throw new ErroApi(401, 'E-mail ou senha inválidos');
  }

  const token = gerarToken({ clienteId: cliente.id, email: cliente.email });

  return {
    cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email },
    token,
  };
}
