import { ICreatePedidoDTO } from "@modules/restaurante/application/dto/i-pedido-dto"
import { CreatePedidoUseCase } from "@modules/restaurante/application/use-cases/pedido/create-pedido-use-case"
import { ConfirmPagamentoUseCase } from "@modules/restaurante/application/use-cases/pedido/confirm-pagamento-use-case"
import { getPayment } from "@services/mercado-pago.service"
import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"

export async function create(request: FastifyRequest<{ Body: ICreatePedidoDTO }>, reply: FastifyReply) {
  const { telefone, formaPagamento, itens, endereco } = request.body

  const createUseCase = container.resolve(CreatePedidoUseCase)
  const result = await createUseCase.execute({ telefone, formaPagamento, itens, endereco })

  return reply.status(result.statusCode).send(result)
}

// Webhook do Mercado Pago: MP envia { type, data: { id } } quando o pagamento muda de status
export async function mercadoPagoWebhook(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = request.body as any
    const query = request.query as any

    const tipo = body?.type ?? query?.type ?? query?.topic
    const paymentId = body?.data?.id ?? query?.['data.id'] ?? query?.id

    if (tipo !== 'payment' || !paymentId) {
      // evento que não interessa — responde 200 pra MP não reenviar
      return reply.status(200).send()
    }

    const pagamento = await getPayment(String(paymentId))

    if (pagamento.status === 'approved' && pagamento.externalReference) {
      const confirmUseCase = container.resolve(ConfirmPagamentoUseCase)
      await confirmUseCase.execute(pagamento.externalReference, pagamento.id)
    }

    // MP exige 200 imediato, senão reenvia o evento
    return reply.status(200).send()
  } catch (error) {
    request.log.error(error)
    // ainda assim 200 pra evitar retry infinito; reprocessamento é idempotente
    return reply.status(200).send()
  }
}

// Rota DEV: força confirmação local sem depender do app de banco (só ENVIRONMENT=dev)
export async function pagarDev(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  if (process.env.ENVIRONMENT !== 'dev') {
    return reply.status(403).send({ error: 'Rota disponível apenas em ambiente de desenvolvimento' })
  }

  const { id } = request.params

  const confirmUseCase = container.resolve(ConfirmPagamentoUseCase)
  const result = await confirmUseCase.execute(id, `dev-${Date.now()}`)

  return reply.status(result.statusCode).send(result)
}


