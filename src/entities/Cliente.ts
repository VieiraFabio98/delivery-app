import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm'
import { Pedido } from './Pedido'

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({type: 'varchar', name: 'telefone', length: 100, unique: true})
  telefone: string

  @Column({type: 'varchar', name: 'nome', length: 100, unique: true})
  nome: string

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos: Pedido[]

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
