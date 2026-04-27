export interface ICreatePedidoDTO {
  clientId: string,
  itens: {
    produtoId: string,
    quantidade: number
  }[]
  formaPagamento: 'pix' | 'cartao'
}