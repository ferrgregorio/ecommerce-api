// Erro customizado que carrega o status HTTP junto da mensagem.
// Permite lançar `throw new ErroApi(404, 'Produto não encontrado')` em qualquer
// camada do código e o middleware de erro central cuida de formatar a resposta.

export class ErroApi extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, mensagem: string) {
    super(mensagem);
    this.statusCode = statusCode;
    this.name = 'ErroApi';
    Object.setPrototypeOf(this, ErroApi.prototype);
  }
}
