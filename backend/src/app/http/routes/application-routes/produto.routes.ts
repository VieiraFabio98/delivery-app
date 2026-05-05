import { FastifyInstance } from 'fastify'
import { create, list, get, update, remove, upload } from '@modules/restaurante/infra/controllers/produto-controller'

export async function produtoRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.post('/image/:id', upload)
  app.get('/list', list)
  app.get('/:id', get)
  app.put('/:id', update)
  app.delete('/:id', remove)
}