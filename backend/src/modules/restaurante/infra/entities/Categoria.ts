import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Produto } from './Produto'

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'varchar', name: 'nome', length: 100})
  nome: string

  @OneToMany(() => Produto, produto => produto.categoria)
  produtos: Produto[]

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
