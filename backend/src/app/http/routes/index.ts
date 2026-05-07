import { FastifyInstance } from 'fastify'
import { categoriaRoutes } from './application-routes/categoria.routes'
import { clienteRoutes } from './application-routes/cliente.routes'
import { produtoRoutes } from './application-routes/produto.routes'
import { userRoutes } from './application-routes/user.routes'


export async function apiRoutes(app: FastifyInstance) {
  app.register(categoriaRoutes, { prefix: '/categorias' })
  app.register(clienteRoutes, { prefix: '/clientes' })
  app.register(produtoRoutes, { prefix: '/produtos' })
  app.register(produtoRoutes, { prefix: '/pedidos' })
  app.register(userRoutes, { prefix: '/users' })
}