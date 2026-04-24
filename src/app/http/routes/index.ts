import { FastifyInstance } from 'fastify'
import { categoriaRoutes } from './application-routes/categoria.routes'


export async function apiRoutes(app: FastifyInstance) {
  app.register(categoriaRoutes, { prefix: '/categorias' })
  // app.register(produtoRoutes, { prefix: '/produtos' })
}