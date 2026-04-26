import { appDataSource } from '@database/data-source'
import { IConversationState } from '@modules/restaurante/domain/entities/i-conversation-state'
import cron from 'node-cron'
import { LessThan, Repository } from 'typeorm'

export function scheduleConversationCleanup() {
  console.log('Cleanup job scheduled: runs every hour from 17h to 23h')
  cron.schedule('0 17-23 * * *', async () => {
    const repository: Repository<IConversationState> = appDataSource.getRepository('ConversationState')
    const lastHour = new Date()
    lastHour.setHours(lastHour.getHours() - 1)

    const { affected } = await repository.delete({
      updatedAt: LessThan(lastHour)
    })

    console.log(`[cleanup] ${affected} estados removidos`)
  })
}