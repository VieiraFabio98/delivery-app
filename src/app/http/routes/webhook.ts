import { ConversationState } from '@modules/restaurante/infra/entities/ConversationState'
import { ConversationStateService } from '@services/conversation-state.service'
import { WhatsAppService } from '@services/whats-app.service'
import { serverError } from '@shared/helpers'
import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

export async function webhookRoutes(app: FastifyInstance) {
  // Verificação do webhook pela Meta (GET)
  app.get('/whatsapp', async (request, reply) => {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = request.query as Record<string, string>

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      app.log.info('Webhook verificado com sucesso')
      return reply.send(challenge)
    }

    return reply.status(403).send({ error: 'Token inválido' })
  })

  // Recebe eventos do WhatsApp (POST)
  app.post('/whatsapp', async (request, reply) => {
    const body = request.body as any

    app.log.info({ body }, 'Evento recebido do WhatsApp')

    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const message = changes?.value?.messages?.[0]

    if (message) {

      const conversationsStateService = container.resolve(ConversationStateService)
      const whatsAppService = container.resolve(WhatsAppService)

      const telefone = message.from
      const text = message?.text?.body ?? '(sem texto)'
      app.log.info(`Mensagem de ${telefone}: ${text}`)

      if(text) {
        await handleMessage(message, telefone, conversationsStateService, whatsAppService)
      }
    }

    // Meta exige status 200 imediato, senão reenvia o evento
    return reply.status(200).send()
  })
}

async function handleMessage(message: any, telefone: string, conversationsStateService: ConversationStateService, whatsAppService: WhatsAppService) {
  try {
    const state = await conversationsStateService.getState(telefone)
    
    switch(state?.etapa) {
      case 'inicio':
        await whatsAppService.sendText(telefone, 'Bem-vindo! Digite "menu" para ver as opções.')
        break
    }


    return null
  } catch(error) {
    throw serverError(error as Error)
  }
}
