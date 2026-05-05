import { ICreateProdutoDTO, IUpdateProdutoDTO } from "@modules/restaurante/application/dto/i-produto-dto"
import { CreateProdutoUseCase } from "@modules/restaurante/application/use-cases/produto/create-produto-use-case"
import { DeleteProdutoUseCase } from "@modules/restaurante/application/use-cases/produto/delete-produto-use-case"
import { GetProdutoUseCase } from "@modules/restaurante/application/use-cases/produto/get-produto-use-case"
import { ListProdutosUseCase } from "@modules/restaurante/application/use-cases/produto/list-produto-use-case"
import { UpdateProdutoUseCase } from "@modules/restaurante/application/use-cases/produto/update-produto-use-case"
import { UploadPhotoUseCase } from "@modules/restaurante/application/use-cases/produto/upload-photo-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { container } from "tsyringe"




export async function create(request: FastifyRequest<{ Body: ICreateProdutoDTO }>, reply: FastifyReply) {
  const { categoriaId, nome, descricao, preco } = request.body

  const createUseCase = container.resolve(CreateProdutoUseCase)
  const result = await createUseCase.execute({ categoriaId, nome, descricao, preco })

  return reply.status(result.statusCode).send(result)
}

export async function list(_request: FastifyRequest, reply: FastifyReply) {
  const listUseCase = container.resolve(ListProdutosUseCase)
  const result = await listUseCase.execute()

  return reply.status(result.statusCode).send(result)
}

export async function get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const getUseCase = container.resolve(GetProdutoUseCase)
  const result = await getUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}

export async function update(request: FastifyRequest<{ Params: { id: string }, Body: IUpdateProdutoDTO }>, reply: FastifyReply) {
  const { id } = request.params
  const body = request.body

  const updateUseCase = container.resolve(UpdateProdutoUseCase)
  const result = await updateUseCase.execute(id, body)

  return reply.status(result.statusCode).send(result)
}

export async function remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params

  const deleteUseCase = container.resolve(DeleteProdutoUseCase)
  const result = await deleteUseCase.execute(id)

  return reply.status(result.statusCode).send(result)
}

export async function upload(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params
  const data = await request.file()
  const buffer = await data?.toBuffer()!

  const uploadPhoto = container.resolve(UploadPhotoUseCase)
  const result = await uploadPhoto.execute(id, buffer)

  return reply.status(result.statusCode).send(result)
}
