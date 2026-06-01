export interface ICreatePedidoDTO {
  clienteId?: string,
  telefone?: string,
  itens: {
    produtoId: string
    quantidade: number
    precoUnitario?: number
  }[],
  formaPagamento: 'pix' | 'cartao'
  total?: number
}