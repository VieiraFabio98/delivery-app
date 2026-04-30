# Roadmap Técnico — Tozetto

Detalhamento das etapas de implementação.

**Legenda:** [X] concluído · [ ] pendente

---

## Etapa 3 — Fluxo de menu (sem pagamento)

### Banco de dados

**Entidades:**

| Entidade | Campos principais |
|---|---|
| `Cliente` | id, phone (único), nome, createdAt |
| `Categoria` | id, nome, ordem |
| `Produto` | id, nome, descricao, preco, ativo, categoria |
| `Pedido` | id, cliente, status, total, createdAt |
| `ItemPedido` | id, pedido, produto, quantidade, precoUnitario |
| `ConversationState` | id, phone (único), etapa, carrinho (JSON), updatedAt |

**Status do pedido:** `aguardando_pagamento` → `pago` → `em_preparo` → `pronto` → `entregue` → `cancelado`

**Etapas da conversa (`ConversationState.etapa`):**
- `inicio` — cliente mandou a primeira mensagem
- `menu_categoria` — bot exibiu categorias, aguardando escolha
- `menu_produto` — bot exibiu produtos da categoria, aguardando escolha
- `carrinho` — cliente está revisando o carrinho
- `aguardando_pagamento` — cobrança gerada, aguardando confirmação
- `concluido` — pedido confirmado

### Fluxo de mensagens

```
Cliente: "oi"
Bot: "Olá! Bem-vindo à [loja]. O que você deseja?"
     [botão] Ver cardápio
     [botão] Meus pedidos

Cliente: clica em "Ver cardápio"
Bot: lista interativa com as categorias (ex: Lanches, Bebidas, Sobremesas)

Cliente: escolhe "Lanches"
Bot: lista interativa com os produtos da categoria
     cada item mostra nome + preço

Cliente: escolhe "X-Burguer R$ 25,00"
Bot: "X-Burguer adicionado! Deseja mais alguma coisa?"
     [botão] Adicionar mais itens
     [botão] Ver carrinho
     [botão] Finalizar pedido

Cliente: clica em "Ver carrinho"
Bot: resumo dos itens + total
     [botão] Confirmar e pagar
     [botão] Remover item
     [botão] Continuar comprando

Cliente: clica em "Confirmar e pagar"
Bot: "Como prefere pagar?"
     [botão] Pix
     [botão] Cartão
→ segue para Etapa 4 ou 5
```

### Integração WhatsApp (Meta Cloud API)

Tipos de mensagem a usar:
- **Texto simples** — saudação, confirmações
- **Lista interativa** (`type: list`) — cardápio de categorias e produtos
- **Botões de resposta rápida** (`type: button`) — até 3 opções (adicionar mais, ver carrinho, finalizar)

Função auxiliar a criar: `sendWhatsAppMessage(to: string, body: object)` que chama `POST https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages` com o token.

### Tarefas técnicas

- [X] Instalar `typeorm`, `pg`, `reflect-metadata`
- [X] Configurar `DataSource` do TypeORM (conexão com Postgres)
- [X] Criar entidades com decorators do TypeORM (`Cliente`, `Categoria`, `Produto`, `Pedido`, `ItemPedido`, `ConversationState`)
- [?] Registrar plugin TypeORM no Fastify
- [X] Criar serviço `WhatsAppService` com método `sendMessage`
- [ ] Criar serviço `ConversationService` que lê/salva estado por `phone`
- [ ] Implementar handler de mensagens no webhook POST
- [ ] Seed inicial de categorias e produtos para teste
- [ ] Testar fluxo completo: oi → cardápio → produto → carrinho → confirmar

---

## Etapa 4 — Pagamento Pix

### Fluxo

1. Cliente escolhe Pix → backend cria cobrança no Mercado Pago (`POST /v1/payments`)
2. MP retorna `qr_code` (copia-e-cola) e `qr_code_base64` (imagem)
3. Bot envia o código copia-e-cola em mensagem de texto + imagem do QR (se suportado)
4. MP notifica o backend via webhook quando pagamento é confirmado
5. Backend verifica assinatura do webhook (`x-signature` header)
6. Backend marca pedido como `pago` e dispara confirmação pelo WhatsApp

### Endpoint webhook Mercado Pago

```
POST /webhook/mercadopago
```

- Verificar assinatura HMAC-SHA256 com a chave secreta do MP
- Buscar pedido pelo `external_reference` (usar `pedido.id` como referência)
- Idempotência: salvar `mp_event_id` no pedido e ignorar duplicatas

### Tarefas técnicas

- [ ] Instalar SDK do Mercado Pago (`mercadopago`)
- [ ] Criar serviço `PagamentoService` com método `criarPixCobranca(pedido)`
- [ ] Salvar `mp_payment_id` e `mp_event_id` no pedido
- [ ] Implementar `POST /webhook/mercadopago` com verificação de assinatura
- [ ] Ao confirmar pagamento: atualizar status + enviar msg WhatsApp
- [ ] Testar com sandbox do MP (cartões e Pix fake disponíveis)

---

## Etapa 5 — Pagamento com cartão

### Fluxo

1. Cliente escolhe cartão → backend cria preferência de pagamento no MP (`POST /checkout/preferences`)
2. MP retorna `init_point` (link do checkout)
3. Bot envia o link pelo WhatsApp
4. Cliente paga no site do MP
5. Mesmo webhook da Etapa 4 já cobre a confirmação (mesmo endpoint, mesmo fluxo)

### Tarefas técnicas

- [ ] Criar método `criarCheckoutCartao(pedido)` no `PagamentoService`
- [ ] Reutilizar webhook já implementado na Etapa 4
- [ ] Testar com cartões de teste do sandbox MP

---

## Etapa 6 — Painel admin web + Cardápio público

### Stack

- React + Vite + shadcn/ui + Tailwind CSS (pasta `frontend/`, já inicializada)
- Autenticação via JWT (login com usuário/senha, sem NextAuth)
- Consome a API REST do backend (mesmo Fastify)

### Páginas

| Página | Acesso | Funcionalidade |
|---|---|---|
| `/login` | público | autenticação do operador |
| `/pedidos` | admin | lista de pedidos com status em tempo real |
| `/pedidos/:id` | admin | detalhe do pedido + botões de atualização de status |
| `/cardapio/admin` | admin | CRUD de categorias e produtos |
| `/cardapio` | **público** | cardápio da loja para o cliente acessar via link enviado pelo bot |

### Cardápio público

- Rota `/cardapio` não exige login — qualquer pessoa com o link pode acessar.
- Exibe categorias e produtos ativos com nome, descrição e preço.
- O bot envia o link durante a conversa (ex: ao iniciar atendimento ou quando cliente pede "ver cardápio").
- URL base configurada em variável de ambiente `FRONTEND_URL` no backend.

### Endpoints de API necessários (backend)

```
# Públicos (sem autenticação)
GET    /cardapio                    → categorias + produtos ativos

# Admin (requer JWT)
POST   /admin/login
GET    /admin/pedidos
GET    /admin/pedidos/:id
PATCH  /admin/pedidos/:id/status
GET    /admin/produtos
POST   /admin/produtos
PUT    /admin/produtos/:id
DELETE /admin/produtos/:id
GET    /admin/categorias
POST   /admin/categorias
PUT    /admin/categorias/:id
DELETE /admin/categorias/:id
```

### Fluxo de autenticação admin

1. Operador acessa `/login` → envia usuário/senha.
2. Backend valida e retorna JWT com expiração.
3. Frontend armazena token em `localStorage` e envia em todas as requisições admin (`Authorization: Bearer <token>`).
4. Rotas admin no Fastify protegidas com middleware de verificação JWT.

### Tarefas técnicas

- [ ] Implementar endpoints `/cardapio` (público) e `/admin/*` no Fastify com JWT
- [ ] Criar entidade `Usuario` (admin) e seed com usuário inicial
- [ ] Configurar React Router no frontend (`frontend/`)
- [ ] Criar página `/login` com formulário e lógica de autenticação
- [ ] Criar página `/cardapio` (pública) com listagem de categorias e produtos
- [ ] Criar página `/pedidos` com listagem e filtro por status
- [ ] Criar página `/pedidos/:id` com detalhe e atualização de status
- [ ] Criar página `/cardapio/admin` com CRUD completo
- [ ] Adicionar envio do link do cardápio no handler do WhatsApp (etapa 3)
- [ ] Deploy: Vercel para frontend, Railway/Render para backend

---

## Variáveis de ambiente necessárias (`.env` completo)

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco
DATABASE_URL=postgresql://tozetto_user:123456@localhost:5432/tozetto_db

# WhatsApp
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WEBHOOK_VERIFY_TOKEN=tozetto_webhook_secret

# Mercado Pago
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=
MP_WEBHOOK_SECRET=

# Admin
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
```
