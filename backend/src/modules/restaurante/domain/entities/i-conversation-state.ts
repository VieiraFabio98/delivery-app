export type ConversationStep =
  | 'inicio'
  | 'menu_principal'
  | 'aguardando_pedido'
  | 'aguardando_pagamento'
  | 'concluido'

export interface CarrinhoItem {
  produtoId: string
  nome: string
  preco: number
  quantidade: number
}

export interface IConversationState {
  id: string
  telefone: string
  etapa: ConversationStep
  carrinho: CarrinhoItem[]
  createdAt: Date
  updatedAt: Date
}