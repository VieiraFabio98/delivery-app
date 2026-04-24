import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/i-categoria-repository"
import { CategoriaRepository } from "@modules/restaurante/infra/repositories/categoria-repository"
import { container } from "tsyringe"
import { CreateCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/create-categoria-use-case"
import { GetCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/get-categoria-use-case"
import { ListCategoriasUseCase } from "@modules/restaurante/application/use-cases/categoria/list-categorias-use-case"
import { UpdateCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/update-categoria-use-case"
import { DeleteCategoriaUseCase } from "@modules/restaurante/application/use-cases/categoria/delete-categoria-use-case"

container.registerSingleton<ICategoriaRepository>('CategoriaRepository', CategoriaRepository)
container.registerSingleton(CreateCategoriaUseCase)
container.registerSingleton(GetCategoriaUseCase)
container.registerSingleton(ListCategoriasUseCase)
container.registerSingleton(UpdateCategoriaUseCase)
container.registerSingleton(DeleteCategoriaUseCase)