import { FastifyInstance } from 'fastify'
import { create, listByCliente, listByPhone, get, update, remove } from '@modules/clientes/infra/controllers/endereco-controller'

export async function enderecoRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.get('/cliente/:clienteId', listByCliente)
  app.get('/telefone/:telefone', listByPhone)
  app.get('/:id', get)
  app.put('/:id', update)
  app.delete('/:id', remove)
}
