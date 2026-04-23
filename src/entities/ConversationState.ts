import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm'

export type ConversationStep =
  | 'inicio'
  | 'menu_categoria'
  | 'menu_produto'
  | 'carrinho'
  | 'aguardando_pagamento'
  | 'concluido'

export interface CarrinhoItem {
  produtoId: number
  nome: string
  preco: number
  quantidade: number
}

@Entity()
export class ConversationState {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({type: 'varchar', name: 'telefone', length: 100, unique: true})
  telefone: string

  @Column({type: 'varchar', name: 'etapa', length: 100, unique: true})
  etapa: ConversationStep

  @Column('jsonb', { default: [] })
  carrinho: CarrinhoItem[]

  @Column({ nullable: true })
  categoriaId: number

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
