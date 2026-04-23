import 'reflect-metadata'
import 'dotenv/config'
import Fastify from 'fastify'
import { AppDataSource } from './database/data-source'
import { apiRoutes } from '@app/http/routes'
import { webhookRoutes } from '@app/http/routes/webhook'


const app = Fastify({ logger: true })

app.register(webhookRoutes, { prefix: '/webhook' })
app.register(apiRoutes, { prefix: '/api' })

app.get('/health', async () => ({ status: 'ok' }))

const start = async () => {
  try {
    await AppDataSource.initialize().then(() => {
      console.log('Data Source has been initialized!')
      console.log('Registered Entities: ', AppDataSource.entityMetadatas.map(entity => entity.name))
    })
    app.log.info('Banco de dados conectado')
    await app.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
