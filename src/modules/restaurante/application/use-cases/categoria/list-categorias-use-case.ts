import { inject, injectable } from "tsyringe"
import { ICategoriaRepository } from "@modules/restaurante/domain/repositories/i-categoria-repository"
import { ok, HttpResponse, serverError } from "shared/helpers"

@injectable()
class ListCategoriasUseCase {
  constructor(
    @inject('CategoriaRepository')
    private categoriaRepository: ICategoriaRepository
  ) {}

  async execute(): Promise<HttpResponse> {
    try {
      const categorias = await this.categoriaRepository.list()

      return ok(categorias)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export { ListCategoriasUseCase }
