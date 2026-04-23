import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Pedido } from './Pedido'
import { Produto } from './Produto'

@Entity()
export class ItemPedido {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToOne(() => Pedido, pedido => pedido.itens)
  pedido: Pedido

  @ManyToOne(() => Produto, produto => produto.itens)
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
