import { FastifyInstance } from 'fastify'
import { create, list, get, update, remove } from '@modules/restaurante/infra/controllers/categoria-controller'

export async function categoriaRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.get('/list', list)
  app.get('/:id', get)
  app.put('/:id', update)
  app.delete('/:id', remove)
}