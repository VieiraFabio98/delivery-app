# deliveryhub — Pedidos via WhatsApp

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
- [X] Schema Postgres: `Produto`, `Categoria`, `Pedido`, `ItemPedido`, `Cliente`, `ConversationState` + `Endereco` (módulo `clientes`).
- [X] DataSource TypeORM configurado, `synchronize: true`.
- [X] `WhatsAppService` criado com `sendText()`, `sendButtons()`, `sendList()`.
- [X] `ConversationStateService` criado com `getState()`, `setStep()`.
- [X] **Fluxo de pedido via WEB** (não-WhatsApp): página `/menu` (cardápio público) + checkout `CartShop` (carrinho → telefone → endereço → pix). Cria `Pedido` + `Endereco` e gera cobrança Pix.
- [X] `CreatePedidoUseCase`: busca/cria cliente por telefone, busca preços no servidor (nunca confia no front), cria endereço vinculado, gera Pix.
- [X] CRUD de `Endereco` (módulo `clientes`) + `GET /enderecos/telefone/:telefone` (reusa endereço salvo no checkout). Autofill via ViaCEP no frontend.
- [ ] Handler do webhook do **WhatsApp** implementa fluxo completo: categorias → produtos → carrinho → confirmar (parcialmente esboçado, incompleto).
- [ ] Seed inicial de categorias e produtos para teste.
- [ ] Critério de aceite: cliente consegue montar um pedido completo e receber resumo, sem pagar.

### [ ] Etapa 4 — Pagamento Pix ← em andamento
- [X] Integrar Mercado Pago: `mercado-pago.service.ts` → `criarCobrancaPix()` usa a **Payment API** (`payment.create`, `payment_method_id: 'pix'`, `X-Idempotency-Key`). Retorna `qr_code` + `qr_code_base64`, exibidos no `PixStep` do checkout web.
- [X] Pedido salva `mpPaymentId`; entidade tem `mpEventId` reservado pra idempotência.
- [ ] Endpoint de webhook do MP (`POST /webhook/mercadopago`) com verificação de assinatura e idempotência (usar `id` do evento) — **não implementado**.
- [ ] Ao receber confirmação → marcar pedido como pago → enviar confirmação.
- [ ] ⚠️ **`MP_ACCESS_TOKEN` atual é de PRODUÇÃO (`APP_USR-`)** — trocar pelo de teste (`TEST-`) antes de testar, senão cobra de verdade.
- [ ] Critério de aceite: cliente paga em sandbox, confirma automaticamente.

### [ ] Etapa 5 — Pagamento com cartão
- [ ] Mesma integração MP, método diferente (link/checkout de cartão).
- [ ] Mesmo fluxo de webhook para confirmação.

### [ ] Etapa 6 — Painel admin web ← em andamento
- [X] React + Vite + shadcn/ui em `frontend/` inicializado e consumindo a API do backend.
- [X] CRUD completo de produtos (com upload de foto para S3) e categorias.
- [X] Página `/cardapio` (admin) com cards visuais, toggle ativo/inativo com debounce, upload de foto direto no card.
- [X] Página pública de cardápio + pedido: `/menu` (exibe produtos, monta carrinho, checkout com Pix).
- [~] Auth: módulo `auth` com entidade `User` (email/senha com hash bcrypt) + `CreateUserUseCase`/get/delete. **Faltam**: `POST /admin/login`, geração/verificação de JWT, middleware, proteção de rotas no frontend. Página `/login` existe mas só navega pra `/` (sem chamada à API).
- [ ] Página `/pedidos`: lista de pedidos com status, filtros (página é stub).
- [ ] Página `/pedidos/:id`: detalhe do pedido e atualização de status.
- [ ] Páginas `/clientes` e `/conversas`: stubs.
- [ ] Bot envia link do cardápio público durante a conversa (hoje só texto hardcoded no handler).

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

Etapas 1 e 2 concluídas.

**Arquitetura backend:** Clean Architecture (domain/application/infra) + DI com tsyringe. Módulos: `restaurante` (categoria, cliente, produto, pedido), `clientes` (endereco), `auth` (user). Padrão de repositório dividido em read/write/combined. `HttpResponse` helpers (`created`, `ok`, `found`, `notFound`, `serverError`, `noContent`).

**Etapa 3:** schema completo (+ `Endereco`). Fluxo de pedido funcional **via web** (página `/menu` + `CartShop`): cliente monta carrinho, informa telefone/endereço (autofill ViaCEP) e gera Pix. `CreatePedidoUseCase` busca preços no servidor e vincula endereço ao cliente/pedido. Handler do **WhatsApp** ainda incompleto.

**Etapa 4 (Pix):** geração de cobrança Pix funcional (`criarCobrancaPix`, Payment API do MP). Falta webhook do MP, confirmação de pagamento e idempotência. ⚠️ token MP em produção — trocar pelo de teste.

**Etapa 6 (admin):** CRUD de produtos (upload S3) e categorias OK. Cardápio público (`/menu`) OK. Auth parcial (entidade `User` + create com bcrypt; sem login/JWT/middleware). Páginas `/pedidos`, `/clientes`, `/conversas` são stubs.

**Componentização do checkout:** `frontend/src/components/cart-shop/` → `CartShop` (orquestrador) + `CartStep`, `PhoneStep`, `AddressStep`, `PixStep` + `types.ts`.

**Próximos passos prioritários:**
1. Trocar `MP_ACCESS_TOKEN` pelo de teste (`TEST-`) e construir webhook do MP + confirmação de pagamento (Etapa 4)
2. Completar auth: `POST /admin/login`, JWT + middleware no backend, proteção de rotas no frontend
3. Páginas `/pedidos` (lista + detalhe + status) no admin
4. Implementar handler de mensagens do WhatsApp (fluxo completo da Etapa 3)
