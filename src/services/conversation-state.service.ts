import { appDataSource } from "@database/data-source"
import { IConversationState } from "@modules/restaurante/domain/entities/i-conversation-state"
import { ConversationState } from "@modules/restaurante/infra/entities/ConversationState"
import { serverError } from "@shared/helpers"
import { Repository } from "typeorm"


class ConversationStateService {
  private conversationStateRepository: Repository<IConversationState>

  constructor(){
    this.conversationStateRepository = appDataSource.getRepository(ConversationState)
  }

  async getState(telefone: string): Promise<IConversationState | null> { 
    try {
      const state = await this.conversationStateRepository.findOneBy({ telefone})
      
      if(!state) {
        const newState = this.conversationStateRepository.create({
          telefone: telefone,
          etapa: 'inicio'
        })
        return await this.conversationStateRepository.save(newState)
      }

      return state

    } catch(error) {
      throw serverError(error as Error)
    }
  }
}

export { ConversationStateService }