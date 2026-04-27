// src/app/http/routes/simulator.routes.ts
import { FastifyInstance } from 'fastify'

const mensagens: { to: string; body: any; createdAt: Date }[] = []

export async function simulatorRoutes(app: FastifyInstance) {
  // WhatsAppService vai chamar esse endpoint em vez da Meta
  app.post('/message', async (request, reply) => {
    const body = request.body as any
    mensagens.push({ ...body, createdAt: new Date() })
    return reply.status(200).send()
  })

  // Simulador faz polling aqui para buscar respostas do bot
  app.get('/messages', async (request, reply) => {
    const todas = [...mensagens]
    mensagens.length = 0 // limpa após entregar
    return reply.send(todas)
  })
}