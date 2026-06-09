import { FastifyInstance } from 'fastify'
import { create, pagarDev } from '@modules/restaurante/infra/controllers/pedido-controller'

export async function pedidoRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.post('/:id/pagar', pagarDev)
}