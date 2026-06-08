import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Cliente } from '@modules/restaurante/infra/entities/Cliente'

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  clienteId: string

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente

  @Column({ type: 'varchar', length: 8 })
  cep: string

  @Column({ type: 'varchar', length: 150 })
  rua: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string

  @Column({ type: 'varchar', length: 20 })
  numero: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento: string

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
