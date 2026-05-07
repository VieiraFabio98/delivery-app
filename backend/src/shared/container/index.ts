import { IUserRepository } from "@modules/auth/domain/repositories/i-user-repository"
import { UserRepository } from "@modules/auth/infra/repositories/user-repository"
import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/categoria/i-categoria-repository"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { IProdutoRepository } from "@modules/restaurante/domain/repositories/produto/i-produto-repository"
import { CategoriaRepository } from "@modules/restaurante/infra/repositories/categoria-repository"
import { ClienteRepository } from "@modules/restaurante/infra/repositories/cliente-repository"
import { ProdutoRepository } from "@modules/restaurante/infra/repositories/produto-repository"
import { ConversationStateService } from "@services/conversation-state.service"
import { WhatsAppService } from "@services/whats-app.service"
import { container } from "tsyringe"


container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<ICategoriaRepository>('CategoriaRepository', CategoriaRepository)
container.registerSingleton<IClienteRepository>('ClienteRepository', ClienteRepository)
container.registerSingleton<IProdutoRepository>('ProdutoRepository', ProdutoRepository)

container.registerSingleton('ConversationStateService', ConversationStateService)
container.registerSingleton('WhatsAppService', WhatsAppService)
