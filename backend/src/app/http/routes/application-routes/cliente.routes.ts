import { FastifyInstance } from 'fastify'
import { create, list, get, update, remove } from '@modules/restaurante/infra/controllers/cliente-controller'

export async function clienteRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.get('/list', list)
  app.get('/:id', get)
  app.put('/:id', update)
  app.delete('/:id', remove)
}