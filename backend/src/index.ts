import 'reflect-metadata'
import 'dotenv/config'
import Fastify from 'fastify'
import { appDataSource } from './database/data-source'
import { apiRoutes } from '@app/http/routes'
import { webhookRoutes } from '@app/http/routes/webhook'
import '@shared/container'
import { simulatorRoutes } from '@app/http/routes/simulator'
import cors from '@fastify/cors'
import { scheduleConversationCleanup } from 'jobs/clen-up-conversation.job'


const app = Fastify({ logger: true })
if(process.env.ENVIRONMENT === 'dev'){
  console.log('Environment -> DEV')
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
}

app.register(webhookRoutes, { prefix: '/webhook' })
app.register(simulatorRoutes, { prefix: '/simulator' })
app.register(apiRoutes, { prefix: '/api' })

app.get('/health', async () => ({ status: 'ok' }))

const start = async () => {
  try {
    scheduleConversationCleanup()
    await appDataSource.initialize().then(() => {
      console.log('Data Source has been initialized!')
      console.log('Registered Entities: ', appDataSource.entityMetadatas.map(entity => entity.name))
    })
    app.log.info('Banco de dados conectado')
    await app.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
