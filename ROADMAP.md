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

## Etapa 6 — Painel admin web

### Stack

- Next.js 14 (App Router)
- shadcn/ui + Tailwind CSS
- NextAuth (autenticação simples com usuário/senha ou Google)
- Consome a API REST do backend (mesmo Fastify)

### Páginas

| Página | Funcionalidade |
|---|---|
| `/login` | autenticação do operador |
| `/pedidos` | lista de pedidos com status em tempo real |
| `/pedidos/[id]` | detalhe do pedido + botões de atualização de status |
| `/cardapio` | CRUD de categorias e produtos |
| `/cardapio/novo` | formulário para criar produto |

### Endpoints de API necessários (backend)

```
GET    /admin/pedidos
GET    /admin/pedidos/:id
PATCH  /admin/pedidos/:id/status
GET    /admin/produtos
POST   /admin/produtos
PUT    /admin/produtos/:id
DELETE /admin/produtos/:id
GET    /admin/categorias
POST   /admin/categorias
```

### Tarefas técnicas

- [ ] Criar projeto Next.js em `packages/admin` (monorepo) ou repo separado
- [ ] Configurar NextAuth
- [ ] Implementar endpoints `/admin/*` no Fastify com autenticação via JWT
- [ ] Criar páginas de listagem e detalhe de pedidos
- [ ] Criar CRUD de cardápio
- [ ] Deploy: Vercel para admin, Railway/Render para backend

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
```
