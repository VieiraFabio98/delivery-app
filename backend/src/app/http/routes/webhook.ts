import { ConversationState } from '@modules/restaurante/infra/entities/ConversationState'
import { ProdutoRepository } from '@modules/restaurante/infra/repositories/produto-repository'
import { mercadoPagoWebhook } from '@modules/restaurante/infra/controllers/pedido-controller'
import { ConversationStateService } from '@services/conversation-state.service'
import { WhatsAppService } from '@services/whats-app.service'
import { serverError } from '@shared/helpers'
import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

export async function webhookRoutes(app: FastifyInstance) {
  // Webhook do Mercado Pago (confirmação de pagamento)
  app.post('/mercadopago', mercadoPagoWebhook)

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
    const text =
      message?.text?.body ??
      message?.interactive?.button_reply?.id ??
      message?.interactive?.list_reply?.id ??
      null
    
    switch(state?.etapa) {
      case 'inicio':
        await whatsAppService.sendText(telefone, 'Olá! Bem-vindo ao deliveryhub 🍔')
        await whatsAppService.sendButtons(telefone, 'O que deseja fazer?', [
          { id: 'ver_cardapio', title: 'Ver cardápio' },
          { id: 'meus_pedidos', title: 'Meus pedidos' },
          { id: 'limpar_carrinho', title: 'Limpar carrinho' },
        ])
        await conversationsStateService.setStep(telefone, 'menu_principal')
        break

      case 'menu_principal':
        if(text === 'ver_cardapio') {
          const produtoRepository = container.resolve(ProdutoRepository)
          const produtos = await produtoRepository.list()
          
        }
    }

    const messageId = message.interactive?.button_reply?.id

    switch(messageId) {
      case 'ver_cardapio':
        
        await whatsAppService.sendText(telefone, 'Aqui está o nosso cardápio: https://deliveryhub.com.br/cardapio')
        break
      case 'meus_pedidos':
        await whatsAppService.sendText(telefone, 'Você ainda não fez nenhum pedido.')
        break
      case 'limpar_carrinho':
        await whatsAppService.sendText(telefone, 'Seu carrinho foi limpo.')
        break
    }


    return null
  } catch(error) {
    throw serverError(error as Error)
  }
}
