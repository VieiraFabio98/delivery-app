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
  mpPaymentId?: string
  enderecoId?: string
  endereco?: {
    cep: string
    rua: string
    bairro?: string
    cidade?: string
    numero: string
    complemento?: string
  }
}