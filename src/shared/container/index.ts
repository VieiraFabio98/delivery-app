import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/categoria/i-categoria-repository"
import { IClienteRepository } from "@modules/restaurante/domain/repositories/cliente/i-cliente-repository"
import { CategoriaRepository } from "@modules/restaurante/infra/repositories/categoria-repository"
import { ClienteRepository } from "@modules/restaurante/infra/repositories/cliente-repository"
import { container } from "tsyringe"


container.registerSingleton<ICategoriaRepository>('CategoriaRepository', CategoriaRepository)
container.registerSingleton<IClienteRepository>('ClienteRepository', ClienteRepository)
