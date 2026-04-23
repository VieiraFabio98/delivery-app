# Tozetto — Pedidos via WhatsApp

Aplicação de pedidos online onde o cliente interage com a loja pelo WhatsApp (menu, cardápio, pagamento) e um painel web administrativo gerencia produtos, pedidos e status.

## Escopo

- **Bot WhatsApp**: atende o cliente, exibe menu/cardápio, coleta pedido, gera cobrança e confirma pagamento.
- **Pagamentos**: Pix e cartão, com validação do recebimento antes do WhatsApp confirmar o pedido.
- **Painel admin (web)**: CRUD de produtos/cardápio, visualização e atualização de status de pedidos, relatórios simples.

## Fluxo principal

1. Cliente manda mensagem no WhatsApp da loja.
2. Bot envia menu (lista interativa) → cliente escolhe itens.
3. Bot gera cobrança (Pix copia-e-cola ou link de cartão).
4. Gateway notifica backend via webhook quando pagamento é confirmado.
5. Bot confirma pedido pelo WhatsApp e pedido aparece no painel admin.
6. Operador da loja acompanha/atualiza status (em preparo → pronto → entregue).

## Stack (confirmada)

- **Backend**: Node.js + TypeScript + **Fastify**
- **WhatsApp**: Meta Cloud API (oficial)
- **Pagamentos**: Mercado Pago (Pix + cartão em uma única integração BR)
- **Banco**: PostgreSQL + TypeORM
- **Admin**: Next.js + shadcn/ui
- **Hospedagem**: a definir (Railway/Render para backend, Vercel para admin)

## Roadmap de implementação

Ordem recomendada — cada etapa destrava a próxima, não pular.

> **Convenção:** sempre marcar com `[X]` as etapas e tarefas concluídas, tanto aqui quanto no ROADMAP.md.

### [X] Etapa 1 — Contas e credenciais (antes de código)
- [X] Criar conta em `developers.facebook.com` → criar app → adicionar produto "WhatsApp" → obter número de teste e token.
- [X] Criar conta Mercado Pago e obter credenciais de sandbox.

### [X] Etapa 2 — Projeto "hello world"
- [X] Inicializar projeto (Node + TypeScript + Fastify).
- [X] Endpoint `/webhook/whatsapp` que valida o token (GET) e loga eventos recebidos (POST).
- [X] Expor local via `ngrok`/`cloudflared` para a Meta conseguir entregar webhook.
- [X] Critério de aceite: cliente manda mensagem no WhatsApp → bot responde "oi".

### [ ] Etapa 3 — Fluxo de menu (sem pagamento) ← em andamento
- [X] Schema Postgres: `Produto`, `Categoria`, `Pedido`, `ItemPedido`, `Cliente`, `ConversationState`.
- [X] DataSource TypeORM configurado, `synchronize: true`.
- [ ] Bot envia lista interativa de categorias → produtos → monta carrinho.
- [ ] Persistir estado da conversa por `phone` via `ConversationState`.
- [ ] Critério de aceite: cliente consegue montar um pedido completo e receber resumo, sem pagar.

### [ ] Etapa 4 — Pagamento Pix
- [ ] Integrar Mercado Pago: criar cobrança Pix, enviar QR/copia-e-cola pelo WhatsApp.
- [ ] Endpoint de webhook do MP com verificação de assinatura e idempotência (usar `id` do evento).
- [ ] Ao receber confirmação → marcar pedido como pago → bot envia confirmação.
- [ ] Critério de aceite: cliente paga em sandbox, bot confirma automaticamente.

### [ ] Etapa 5 — Pagamento com cartão
- [ ] Mesma integração MP, método diferente (link/checkout de cartão).
- [ ] Mesmo fluxo de webhook para confirmação.

### [ ] Etapa 6 — Painel admin web
- [ ] Next.js + shadcn/ui consumindo a mesma API do backend.
- [ ] Auth simples (NextAuth).
- [ ] CRUD de produtos/cardápio, lista de pedidos, atualização de status.

## Pontos de atenção (vale para todas as etapas)

- **Idempotência em webhooks**: Meta e Mercado Pago reenviam eventos. Usar `event.id` como chave única.
- **Nunca confiar no cliente para confirmar pagamento** — só o webhook do gateway é fonte de verdade.
- **Ambiente de sandbox existe e é grátis**: Meta tem número de teste, MP tem cartões/Pix fake. Dá pra desenvolver tudo sem custo.
- **Evitar libs não oficiais de WhatsApp** (Baileys, venom-bot, whatsapp-web.js): número da loja pode ser banido sem aviso.

## Custo da Meta Cloud API

API é grátis — cobra-se por **conversa**, não por acesso:
- Conversa iniciada pelo usuário → categoria mais barata (principal caso deste projeto).
- Conversa de utilidade (confirmação, status) → centavos por conversa.
- Marketing/disparo ativo → mais cara.

Tabela oficial: `developers.facebook.com/docs/whatsapp/pricing` (muda com frequência).

## Estado atual

Etapas 1 e 2 concluídas. Etapa 3 em andamento: entidades e DataSource prontos, falta `WhatsAppService`, `ConversationService`, handler do fluxo de conversa e seed. Próximo passo: implementar os serviços e o handler do webhook.
