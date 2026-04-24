import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"
import { ICreateCategoriaDTO, IUpdateCategoriaDTO } from "@modules/restaurante/application/dto/i-categoria-dto"
import { CreateCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/create-categoria-use-case"
import { GetCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/get-categoria-use-case"
import { ListCategoriasUseCase } from "@modules/restaurante/application/use-cases/categoria/list-categorias-use-case"
import { UpdateCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/update-categoria-use-case"
import { DeleteCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/delete-categoria-use-case"

export async function create(request: FastifyRequest<{ Body: ICreateCategoriaDTO }>, reply: FastifyReply) {
  const { nome, ordem } = request.body

  const createUseCase = container.resolve(CreateCategoriaUseCase)
  const result = await createUseCase.execute({ nome, ordem })

  return reply.status(result.statusCode).send(result)
}

export async function list(_request: FastifyRequest, reply: FastifyReply) {
  const listUseCase = container.resolve(ListCategoriasUseCase)
  const result = await listUseCase.execute()

  return reply.status(result.statusCode).send(result)
}

export async function get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const getUseCase = container.resolve(GetCategoriaUseCase)
  const result = await getUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}

export async function update(request: FastifyRequest<{ Params: { id: string }, Body: IUpdateCategoriaDTO }>, reply: FastifyReply) {
  const { id } = request.params
  const body = request.body

  const updateUseCase = container.resolve(UpdateCategoriaUseCase)
  const result = await updateUseCase.execute(id, body)

  return reply.status(result.statusCode).send(result)
}

export async function remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const deleteUseCase = container.resolve(DeleteCategoriaUseCase)
  const result = await deleteUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}
