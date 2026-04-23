// src/controllers/categoriaController.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { AppDataSource } from '../../../../database/data-source'
import { Categoria } from '../entities/Categoria'

const repo = AppDataSource.getRepository(Categoria)

export async function listCategorias(request: FastifyRequest, reply: FastifyReply) {
  const categorias = await repo.find({
    order: { ordem: 'ASC', nome: 'ASC' },
  })

  return reply.send(categorias)
}

export async function getCategoriaById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params

  const categoria = await repo.findOne({
    where: { id },
    relations: { produtos: true },
  })

  if (!categoria) {
    return reply.status(404).send({ error: 'Categoria não encontrada' })
  }

  return reply.send(categoria)
}
