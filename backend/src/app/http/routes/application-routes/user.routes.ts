import { FastifyInstance } from 'fastify'
import { create, get, remove } from '@modules/auth/infra/controllers/user-controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.get('/:id', get)
  app.delete('/:id', remove)
}
