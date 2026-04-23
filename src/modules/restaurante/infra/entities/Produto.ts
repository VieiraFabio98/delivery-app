import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Categoria } from './Categoria'
import { ItemPedido } from './ItemPedido'

@Entity()
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  nome: string

  @Column({ nullable: true })
  descricao: string

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number

  @Column({ default: true })
  ativo: boolean

  @ManyToOne(() => Categoria, categoria => categoria.produtos)
  categoria: Categoria

  @OneToMany(() => ItemPedido, item => item.produto)
  itens: ItemPedido[]

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
