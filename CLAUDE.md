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
- **Storage de imagens**: AWS S3 (`@aws-sdk/client-s3` + `@fastify/multipart` no backend)
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
- [X] React + Vite + shadcn/ui em `frontend/` inicializado e consumindo a API do backend.
- [X] CRUD de categorias completo (listar, criar, editar, excluir com confirmação).
- [X] CRUD de produtos completo (listar, criar, editar com select de categoria, excluir).
- [ ] Auth simples via JWT (login com usuário/senha, sem NextAuth).
- [ ] Lista de pedidos com atualização de status.
- [ ] Página pública `/cardapio` acessível sem login (exibe cardápio da loja com categorias e produtos ativos).
- [ ] Bot envia link do cardápio público durante a conversa (ex: quando cliente digita "cardápio" ou no menu inicial).

### [ ] Etapa 7 — Upload de imagens de produtos
- [ ] Criar conta AWS e bucket S3 com as credenciais (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`).
- [ ] Instalar `@aws-sdk/client-s3` e `@fastify/multipart` no backend.
- [ ] Endpoint `POST /api/upload` que recebe o arquivo e retorna a URL pública do S3.
- [ ] Adicionar campo `imagemUrl` na entidade `Produto`.
- [ ] Adicionar input de upload no formulário de produto no frontend.

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

Etapas 1, 2 concluídas. Etapa 3 em andamento (entidades e DataSource prontos, falta fluxo de conversa). Etapa 6 em andamento: CRUD de categorias e produtos funcional no painel admin.

**Frontend** (`frontend/`):
- Painel admin com sidebar, dark mode, React Router.
- CRUD completo de **categorias** e **produtos** (ListPage genérico com tanstack/react-table, dialogs de criação/edição, confirmação de exclusão via DeleteDialog).
- `ListPage` reutilizável com checkbox de seleção, spinner de carregamento, botões Criar/Editar/Excluir.
- Serviços HTTP prontos: `categorias.service.ts`, `produtos.service.ts`.

**Backend** (`backend/`):
- CRUD completo de categorias e produtos (use cases, repositórios, controllers, rotas).
- Relacionamento `Produto → Categoria` com eager loading via `relations`.
- CORS configurado para dev com todos os métodos HTTP.
- Próximo passo no backend: fluxo de conversa WhatsApp + upload S3 para imagens de produtos.
