export interface IPedido {
  id: string,
  clienteId: string,
  itens: {
    produtoId: string,
    quantidade: number
  }[]
  formaPagamento: 'pix' | 'cartao',
  status: 'aguardando_pagamento' | 'pago' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado',
  createdAt: Date,
  updatedAt: Date
}