import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Cliente } from './Cliente'
import { ItemPedido } from './ItemPedido'
import { Endereco } from '@modules/clientes/infra/entities/Endereco'

export type PedidoStatus = 'aguardando_pagamento' | 'pago' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado'

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  clienteId: string

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente

  @Column({ nullable: true })
  enderecoId: string

  @ManyToOne(() => Endereco)
  @JoinColumn({ name: 'enderecoId' })
  endereco: Endereco

  @Column({ default: 'aguardando_pagamento' })
  status: PedidoStatus

  @Column({ enum: ['pix', 'cartao'] })
  formaPagamento: 'pix' | 'cartao'

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
