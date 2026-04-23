import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Cliente } from './Cliente'
import { ItemPedido } from './ItemPedido'

export type PedidoStatus = 'aguardando_pagamento' | 'pago' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado'

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  cliente: Cliente

  @Column({ default: 'aguardando_pagamento' })
  status: PedidoStatus

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number

  @Column({ nullable: true })
  mpPaymentId: string

  @Column({ nullable: true })
  mpEventId: string

  @OneToMany(() => ItemPedido, item => item.pedido, { cascade: true })
  itens: ItemPedido[]

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
