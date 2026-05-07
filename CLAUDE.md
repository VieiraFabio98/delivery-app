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
- **Admin**: React + Vite + shadcn/ui (pasta `frontend/`, já inicializada)
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
- [X] `WhatsAppService` criado com `sendText()`, `sendButtons()`, `sendList()`.
- [X] `ConversationStateService` criado com `getState()`, `setStep()`.
- [ ] Handler do webhook implementa fluxo completo: categorias → produtos → carrinho → confirmar.
- [ ] Seed inicial de categorias e produtos para teste.
- [ ] Critério de aceite: cliente consegue montar um pedido completo e receber resumo, sem pagar.

### [ ] Etapa 4 — Pagamento Pix
- [ ] Integrar Mercado Pago: criar cobrança Pix, enviar QR/copia-e-cola pelo WhatsApp.
- [ ] Endpoint de webhook do MP com verificação de assinatura e idempotência (usar `id` do evento).
- [ ] Ao receber confirmação → marcar pedido como pago → bot envia confirmação.
- [ ] Critério de aceite: cliente paga em sandbox, bot confirma automaticamente.

### [ ] Etapa 5 — Pagamento com cartão
- [ ] Mesma integração MP, método diferente (link/checkout de cartão).
- [ ] Mesmo fluxo de webhook para confirmação.

### [ ] Etapa 6 — Painel admin web ← em andamento
- [X] React + Vite + shadcn/ui em `frontend/` inicializado e consumindo a API do backend.
- [X] CRUD completo de produtos (com upload de foto para S3) e categorias.
- [X] Página `/cardapio` (admin) com cards visuais, toggle ativo/inativo com debounce, upload de foto direto no card.
- [ ] Auth via JWT (login com usuário/senha): entidade `Usuario`, endpoint `POST /admin/login`, middleware de verificação, proteção de rotas no frontend.
- [ ] Página `/pedidos`: lista de pedidos com status, filtros.
- [ ] Página `/pedidos/:id`: detalhe do pedido e atualização de status.
- [ ] Página pública `/cardapio` acessível sem login (exibe categorias e produtos ativos ao cliente).
- [ ] Bot envia link do cardápio público durante a conversa.

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

Etapas 1 e 2 concluídas. Etapa 3 em andamento: `WhatsAppService` e `ConversationStateService` prontos, falta o handler completo do fluxo de conversa (categorias → produtos → carrinho → pagamento) e seed de dados.

Etapa 6 em andamento: CRUD de produtos (com upload S3) e categorias funcionais no admin. Faltam autenticação JWT, páginas de pedidos e cardápio público.

**Próximos passos prioritários:**
1. Implementar handler de mensagens do WhatsApp (fluxo completo da Etapa 3)
2. Autenticação JWT no backend + proteção de rotas no frontend
3. Páginas de pedidos no admin
