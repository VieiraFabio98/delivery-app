import { ICreateEnderecoDTO, IUpdateEnderecoDTO } from "@modules/clientes/application/dto/i-endereco"
import { CreateEnderecoUseCase } from "@modules/clientes/application/use-cases/endereco/create-endereco-use-case"
import { DeleteEnderecoUseCase } from "@modules/clientes/application/use-cases/endereco/delete-endereco-use-case"
import { GetEnderecoUseCase } from "@modules/clientes/application/use-cases/endereco/get-endereco-use-case"
import { ListEnderecosUseCase } from "@modules/clientes/application/use-cases/endereco/list-endereco-use-case"
import { ListEnderecosByPhoneUseCase } from "@modules/clientes/application/use-cases/endereco/list-endereco-by-phone-use-case"
import { UpdateEnderecoUseCase } from "@modules/clientes/application/use-cases/endereco/update-endereco-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"


export async function create(request: FastifyRequest<{ Body: ICreateEnderecoDTO }>, reply: FastifyReply) {
  const { clienteId, cep, rua, bairro, cidade, numero, complemento } = request.body

  const createUseCase = container.resolve(CreateEnderecoUseCase)
  const result = await createUseCase.execute({ clienteId, cep, rua, bairro, cidade, numero, complemento })

  return reply.status(result.statusCode).send(result)
}

export async function listByCliente(request: FastifyRequest<{ Params: { clienteId: string } }>, reply: FastifyReply) {
  const { clienteId } = request.params

  const listUseCase = container.resolve(ListEnderecosUseCase)
  const result = await listUseCase.execute(clienteId)

  return reply.status(result.statusCode).send(result)
}

export async function listByPhone(request: FastifyRequest<{ Params: { telefone: string } }>, reply: FastifyReply) {
  const { telefone } = request.params

  const listUseCase = container.resolve(ListEnderecosByPhoneUseCase)
  const result = await listUseCase.execute(telefone)

  return reply.status(result.statusCode).send(result)
}

export async function get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const getUseCase = container.resolve(GetEnderecoUseCase)
  const result = await getUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}

export async function update(request: FastifyRequest<{ Params: { id: string }, Body: IUpdateEnderecoDTO }>, reply: FastifyReply) {
  const { id } = request.params
  const body = request.body

  const updateUseCase = container.resolve(UpdateEnderecoUseCase)
  const result = await updateUseCase.execute(id, body)

  return reply.status(result.statusCode).send(result)
}

export async function remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const deleteUseCase = container.resolve(DeleteEnderecoUseCase)
  const result = await deleteUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}
