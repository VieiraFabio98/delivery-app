import { ICreatePedidoDTO } from "@modules/restaurante/application/dto/i-pedido-dto"
import { CreatePedidoUseCase } from "@modules/restaurante/application/use-cases/pedido/create-pedido-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"

export async function create(request: FastifyRequest<{ Body: ICreatePedidoDTO }>, reply: FastifyReply) {
  const { telefone, formaPagamento, itens } = request.body

  const createUseCase = container.resolve(CreatePedidoUseCase)
  const result = await createUseCase.execute({ telefone, formaPagamento, itens })

  return reply.status(result.statusCode).send(result)
}


