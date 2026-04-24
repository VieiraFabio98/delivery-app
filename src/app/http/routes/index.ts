import { FastifyInstance } from 'fastify'
import { categoriaRoutes } from './application-routes/categoria.routes'
import { clienteRoutes } from './application-routes/cliente.routes'


export async function apiRoutes(app: FastifyInstance) {
  app.register(categoriaRoutes, { prefix: '/categorias' })
  app.register(clienteRoutes, { prefix: '/clientes' })
}