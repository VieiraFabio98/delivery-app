import { ICreateClienteDTO, IUpdateClienteDTO } from "@modules/restaurante/application/dto/i-cliente-controller"
import { CreateClienteUseCase } from "@modules/restaurante/application/use-cases/cliente/create-cliente-use-case"
import { DeleteClienteUseCase } from "@modules/restaurante/application/use-cases/cliente/delete-cliente-use-case"
import { GetClienteUseCase } from "@modules/restaurante/application/use-cases/cliente/get-cliente-use-case"
import { ListClientesUseCase } from "@modules/restaurante/application/use-cases/cliente/list-cliente-use-case"
import { UpdateClienteUseCase } from "@modules/restaurante/application/use-cases/cliente/update-cliente-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"




export async function create(request: FastifyRequest<{ Body: ICreateClienteDTO }>, reply: FastifyReply) {
  const { nome, telefone } = request.body

  const createUseCase = container.resolve(CreateClienteUseCase)
  const result = await createUseCase.execute({ nome, telefone })

  return reply.status(result.statusCode).send(result)
}

export async function list(_request: FastifyRequest, reply: FastifyReply) {
  const listUseCase = container.resolve(ListClientesUseCase)
  const result = await listUseCase.execute()

  return reply.status(result.statusCode).send(result)
}

export async function get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const getUseCase = container.resolve(GetClienteUseCase)
  const result = await getUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}

export async function update(request: FastifyRequest<{ Params: { id: string }, Body: IUpdateClienteDTO }>, reply: FastifyReply) {
  const { id } = request.params
  const body = request.body

  const updateUseCase = container.resolve(UpdateClienteUseCase)
  const result = await updateUseCase.execute(id, body)

  return reply.status(result.statusCode).send(result)
}

export async function remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const deleteUseCase = container.resolve(DeleteClienteUseCase)
  const result = await deleteUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}
