import { CarrinhoItem, ConversationStep } from '@modules/restaurante/domain/entities/i-conversation-state'
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class ConversationState {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({type: 'varchar', name: 'telefone', length: 100, unique: true})
  telefone: string

  @Column({type: 'varchar', name: 'etapa', length: 100})
  etapa: ConversationStep

  @Column('jsonb', { default: [], nullable: true })
  carrinho: CarrinhoItem[]

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date
  
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date
}
