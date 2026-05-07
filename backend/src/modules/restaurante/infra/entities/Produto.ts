import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
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

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null

  @Column({ name: 'categoria_id' })
  categoriaId: string

  @ManyToOne(() => Categoria, categoria => categoria.nome)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria

  @OneToMany(() => ItemPedido, item => item.produto)
  itens: ItemPedido[]

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
