export interface IPedido {
  id: string,
  clienteId: string,
  enderecoId?: string,
  itens: {
    produtoId: string,
    quantidade: number
  }[]
  formaPagamento: 'pix' | 'cartao',
  status: 'aguardando_pagamento' | 'pago' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado',
  total?: number,
  mpPaymentId?: string,
  mpEventId?: string,
  createdAt: Date,
  updatedAt: Date
}