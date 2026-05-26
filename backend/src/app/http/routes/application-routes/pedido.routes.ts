import { FastifyInstance } from 'fastify'
import { create } from '@modules/restaurante/infra/controllers/pedido-controller'

export async function pedidoRoutes(app: FastifyInstance) {
  app.post('/', create)
}