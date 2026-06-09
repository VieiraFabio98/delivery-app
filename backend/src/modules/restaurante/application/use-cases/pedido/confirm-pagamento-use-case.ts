import { inject, injectable } from "tsyringe"
import { ok, notFound, HttpResponse, serverError } from "@shared/helpers"
import { IPedidoRepository } from "@modules/restaurante/domain/repositories/pedido/i-pedido-repository"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { WhatsAppService } from "@services/whats-app.service"


@injectable()
class ConfirmPagamentoUseCase {
  constructor(
    @inject('PedidoRepository')
    private pedidoRepository: IPedidoRepository,
    @inject('ClienteRepository')
    private clienteRepository: IClienteRepository,
    @inject('WhatsAppService')
    private whatsAppService: WhatsAppService
  ) {}

  async execute(pedidoId: string, eventId?: string): Promise<HttpResponse> {
    try {
      const pedido = await this.pedidoRepository.get(pedidoId)

      if (!pedido) {
        return notFound('Pedido não encontrado')
      }

      // idempotência: já pago ou evento já processado → não faz nada
      if (pedido.status === 'pago' || (eventId && pedido.mpEventId === eventId)) {
        return ok({ pedidoId: pedido.id, status: pedido.status, jaProcessado: true })
      }

      const atualizado = await this.pedidoRepository.update(pedido.id, {
        status: 'pago',
        mpEventId: eventId,
      })

      // confirmação no WhatsApp (não fatal se falhar)
      try {
        const cliente = await this.clienteRepository.get(pedido.clienteId)
        if (cliente?.telefone) {
          await this.whatsAppService.sendText(cliente.telefone, '✅ Pagamento confirmado! Seu pedido já está sendo preparado.')
        }
      } catch (error) {
        console.error('Falha ao enviar confirmação no WhatsApp:', error)
      }

      return ok({ pedidoId: atualizado.id, status: atualizado.status })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { ConfirmPagamentoUseCase }
