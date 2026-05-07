import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"
import { ICreateUserDTO } from "@modules/auth/application/dto/i-user-dto"
import { CreateUserUseCase } from "@modules/auth/application/use-cases/create-user-use-case"
import { GetUserUseCase } from "@modules/auth/application/use-cases/get-user-use-case"
import { DeleteUserUseCase } from "@modules/auth/application/use-cases/delete-user-use-case"

export async function create(request: FastifyRequest<{ Body: ICreateUserDTO }>, reply: FastifyReply) {
  const { name, email, password } = request.body

  const createUseCase = container.resolve(CreateUserUseCase)
  const result = await createUseCase.execute({ name, email, password })

  return reply.status(result.statusCode).send(result)
}

export async function get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const getUseCase = container.resolve(GetUserUseCase)
  const result = await getUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}

export async function remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const deleteUseCase = container.resolve(DeleteUserUseCase)
  const result = await deleteUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}
