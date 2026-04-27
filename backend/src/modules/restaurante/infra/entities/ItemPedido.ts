import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Pedido } from './Pedido'
import { Produto } from './Produto'

@Entity()
export class ItemPedido {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Pedido, pedido => pedido.itens)
  pedido: Pedido

  @Column()
  produtoId: string

  @ManyToOne(() => Produto, produto => produto.itens)
  @JoinColumn({ name: 'produtoId' })
  produto: Produto

  @Column()
  quantidade: number

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
